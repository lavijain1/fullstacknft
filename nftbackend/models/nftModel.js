const mongoose = require("mongoose");
const slugify = require("slugify");

const nftschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A NFT must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "nft can have max 40 character"],
      minlength: [10, "nft must have 10 character"],
      // validate: [validator.isAlpha, "NFT name must only contain Characters"],
    },
    slug: String,
    duration: {
      type: String,
      required: [true, "must provide duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "must have difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium and difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "must have 1"],
      max: [5, "cant be more than 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A NFT must have price"],
    },
    priceDiscount: {
      //THIS CAN ONLY WORK AT THE TIME OF CREATE not update
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "must provide the summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "must provide the cover image"],
    },
    images: [String],

    startDates: [Date],
    secretNfts: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

nftschema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//MONGOOSE MIDDLEWARE

//DOCUMENT MIDDLEWARE: RUNS BEFORE .SAVE() OR .CREATE()
nftschema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// nftschema.post("save", function(doc,next){
//   next();
// });
//DOCUMENT MIDDLEWARE
nftschema.pre(/^find/, function (next) {
  this.find({ secretNfts: { $ne: true } }); //it will not include those nfts which are secret true. So it will only show nfts those whose secret is false when find is called
  next();
});
// nftschema.pre("findOne", function (next) {
//   this.find({ secretNfts: { $ne: true } }); //it will not include those nfts which are secret true. So it will only show nfts those whose secret is false when findOne is called
//   next();
// });

// nftschema.post(/^find/, function(doc,next){
//   console.log(doc);
//   next();
// })

//AGGREGATE MIDDLEWARE

const NFTS = mongoose.model("NFTS", nftschema);

module.exports = NFTS;
