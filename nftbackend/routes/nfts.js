const express = require("express");
const { hasloggedin, restrictTo } = require("../controllers/authfunctions");
const {
  deleteNFT,
  updateNFT,
  createNFT,
  findNFT,
  getNFT,
  aliasTopNFTS,
  getNFTStats,
  getMonthlyPlan,
} = require("../controllers/nftfunctions");

const nftsRouter = express.Router();

nftsRouter.get("/getmonthlyplan/:year", getMonthlyPlan);
nftsRouter.get("/getNFTStats", getNFTStats);
nftsRouter.get("/top-5-nfts", aliasTopNFTS, getNFT);
nftsRouter.get("/", getNFT);
nftsRouter.post("/create", createNFT);
nftsRouter.get("/find/:id", findNFT);
nftsRouter.patch("/update/:id", updateNFT);
nftsRouter.delete(
  "/delete/:id",
  hasloggedin,
  restrictTo("admin", "guide"),
  deleteNFT
);

module.exports = nftsRouter;
