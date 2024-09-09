const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
const sendEmail = require("./emailsender");
const signtoken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createCookie = (token, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // if ((process.env.NODE_ENV = "production")) cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
};

const signup = async (req, res, next) => {
  const newperson = await User.create(req.body);

  const token = signtoken(newperson._id);
  createCookie(token, res);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newperson,
    },
  });
};

const hasloggedin = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new Error("You are not logged in");
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const isUser = await User.findById(decoded.id);
    if (!isUser) {
      throw new Error("The user belonging to this token does not exist");
    }

    if (isUser.changedPasswordAfter(decoded.iat)) {
      throw new Error("User has changed password");
    }
    req.user = isUser;
    next();
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

const login = async (req, res, next) => {
  const { email, password, did } = req.body;
  try {
    if (!email || !password) {
      throw new Error("Please provide correct email and password");
    }
    const user = await User.findOne({ email })
      .select("+password")
      .select("+did");
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("Please provide correct email and password 1");
    }
    if (!user || did != user.did) {
      throw new Error("Please use your own age proof");
    }
    const token = signtoken(user._id);
    createCookie(token, res);
    const id = user._id;
    res.status(200).json({
      status: "Success",
      id,
      token,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  try {
    if (!user) {
      throw new Error("Wrong Information provided");
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/users/resetpassword/${resetToken}`;
    const message = `Forgot your Password ? Reset Link: ${resetURL} \n If didn't forget , please ignore.`;

    await sendEmail({
      email: user.email,
      subject: "Your password reset link",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to your email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordRestExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const hashedtoken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedtoken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Token is invalid or expired");
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordRestExpires = undefined;
    await user.save();

    const token = signtoken(user._id);
    createCookie(token, res);

    res.status(200).json({
      status: "Success",
      token,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Error("You dont have access to do this task");
    }
    next();
  };
};

const updatepassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      throw new Error("Password is wrong");
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    const token = signtoken(user._id);
    createCookie(token, res);
    res.status(200).json({
      status: "Success",
      token,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
module.exports = {
  forgotPassword,
  resetPassword,
  updatepassword,
  signup,
  login,
  hasloggedin,
  restrictTo,
  updatepassword,
};
