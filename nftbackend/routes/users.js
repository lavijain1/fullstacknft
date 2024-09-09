const express = require("express");
const {
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/userfunction");
const {
  signup,
  login,
  forgotPassword,
  hasloggedin,
  resetPassword,
  updatepassword,
} = require("./../controllers/authfunctions");
const {
  GetAuthRequest,
  Callback,
  hasAuthorization,
} = require("./../controllers/polygonfunctions");
const userRouter = express.Router();
userRouter.get("/", getUsers);

userRouter.get("/find/:id", hasloggedin, getSingleUser);
userRouter.patch("/update", hasloggedin, updateUser);
userRouter.delete("/delete", hasloggedin, deleteUser);
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.patch("/resetpassword/:token", resetPassword);
userRouter.patch("/updatepassword", hasloggedin, updatepassword);

module.exports = userRouter;
