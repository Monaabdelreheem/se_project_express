const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");


// Get current user
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid user ID"));
    }

    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("User not found"));
    }
    return next(err);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).orFail();
    return res.status(200).send(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data passed when updating the user"));
    }

    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("User not found"));
    }
    return next(err);
  }
};

// Create a new user
const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!email || !password) {
      return next(new BadRequestError("Email and password are required"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword, });
      const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).send(userResponse);
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError("User with this email already exists"));
    }
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data passed when creating a user"));
    }
    return next(err);
  }
};

// User login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new BadRequestError("Email and password are required"));
    }

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).send({ token });
  } catch (err) {
    if (err.message === "Invalid email or password") {
      return next(new UnauthorizedError("Invalid email or password"));
    }
    return next(err);
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
