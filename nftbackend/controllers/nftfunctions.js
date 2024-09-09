const NFTS = require("../models/nftModel");

const aliasTopNFTS = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price, -ratingsAverage";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};
const getNFT = async (req, res) => {
  try {
    const queryObject = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObject[el]);

    //FILTERING QUERY
    let queryweget = JSON.stringify(queryObject);
    queryweget = queryweget.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    queryweget = JSON.parse(queryweget);
    let query = NFTS.find(queryweget);

    //SORTING QUERY
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }

    //FIELDS QUERY TO GET SPECIFIC VALUES
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const newNFTS = await NFTS.countDocuments();
      if (skip >= newNFTS) throw new Error("This page doesn't exist");
    }
    const nfts = await query;

    res.status(200).json({
      status: "Success",
      Count: nfts.length,
      data: {
        nfts,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Cant Load NFTS",
    });
  }
};

const findNFT = async (req, res) => {
  try {
    const found = await NFTS.findById(req.params.id);
    res.status(200).json({
      status: "Success",
      data: {
        item: found,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Cant Find NFT",
    });
  }
};

const createNFT = async (req, res) => {
  try {
    const newitem = await NFTS.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        nft: newitem,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid Format for Data",
    });
  }
};

const updateNFT = async (req, res) => {
  try {
    const item = await NFTS.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        item,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Cant Update NFTS",
    });
  }
};

const deleteNFT = async (req, res) => {
  try {
    await NFTS.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "Success",
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Cant Delete NFT",
    });
  }
};

//Aggregation Pipeline

const getNFTStats = async (req, res) => {
  try {
    const stats = await NFTS.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: "$difficulty",
          num: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);
    res.status(200).json({
      status: "Success",
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Cant Delete NFT",
    });
  }
};

//Calculating new nft created in month

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await NFTS.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numNFTStarts: { $sum: 1 },
          nfts: { $push: "$name" },
        },
      },
      {
        $addFields: {
          month: "$_id",
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numNFTStarts: -1,
        },
      },
    ]);
    res.status(200).json({
      status: "Success",
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Cant Delete NFT",
    });
  }
};

module.exports = {
  deleteNFT,
  updateNFT,
  createNFT,
  findNFT,
  getNFT,
  aliasTopNFTS,
  getNFTStats,
  getMonthlyPlan,
};
