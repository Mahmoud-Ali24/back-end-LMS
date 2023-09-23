const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");
const { validationResult } = require("express-validator");

// Get all users
const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find({}, { password: false, __v: false });
  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

// get user by id
const getUserById = asyncWrapper(async (req, res, next) => {
  const user = await User.findOne(
    { _id: req.params.id },
    { password: false, __v: false, token: false }
  );
  if (!user) {
    const error = appError.create("user not found", 404, httpStatusText.FAIL);
    return next(error);
  }
  return res.json({ status: httpStatusText.SUCCESS, data: { user } });
});

// Get user (current user by token)
const getCurrentUser = asyncWrapper(async (req, res) => {
  const user = await User.findOne(
    { _id: req.currentUser.id },
    { password: false, __v: false }
  );
  res.json({
    status: httpStatusText.SUCCESS,
    data: {
      name: user.firstName,
      email: user.email,
      role: user.role,
      id: user._id,
    },
  });
});

// Register new user
const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    const error = appError.create(
      "user already exists",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  // generate token
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });

  newUser.token = token;

  await newUser.save();

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

// Login user
const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    const error = appError.create(
      "please enter email and password",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    const error = appError.create(
      "email or password is incorrect",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    // generate token
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });

    const userData = {
      name: user.firstName + " " + user.lastName,
      email: user.email,
      role: user.role,
    };

    return res.json({
      status: httpStatusText.SUCCESS,
      data: { token, user: userData },
    });
  } else {
    const error = appError.create(
      "email or password is incorrect",
      500,
      httpStatusText.ERROR
    );
    return next(error);
  }
});

// Delete user
const deleteUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findOneAndDelete({ _id: req.params.id });
  if (!user) {
    const error = appError.create("user not found", 404, httpStatusText.FAIL);
    return next(error);
  }
  res.json({ status: httpStatusText.SUCCESS, data: null });
});

// Update user
const updateUser = asyncWrapper(async (req, res) => {
  const updateUser = await User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { ...req.body } }
  );
  res.json({ status: httpStatusText.SUCCESS, data: { updateUser } });
});

// logout user
const logout = asyncWrapper(async (req, res) => {
  const user = await User.findOne({ _id: req.currentUser.id });
  user.token = "";
  await user.save();
  res.json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getAllUsers,
  register,
  login,
  deleteUser,
  updateUser,
  logout,
  getCurrentUser,
  getUserById,
};
