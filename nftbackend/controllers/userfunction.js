const User = require("../models/userModel");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};
const getUsers = async (req, res) => {
  const users = await User.find();

  try {
    res.status(200).json({
      status: "Success",
      Count: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Cant Load Users",
    });
  }
};
const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  try {
    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Cant Get User Info",
    });
  }
};
const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
const updateUser = async (req, res, next) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      throw new Error("Please use correct route to update password");
    }

    const filterBody = filterObj(req.body, "name", "email", "did"); // only allows user to change name and email and did
    const updated = await User.findByIdAndUpdate(req.user.id, filterBody, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        user: updated,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getSingleUser,
  getUsers,
  updateUser,
  deleteUser,
};
