const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, UNAUTHORIZED, CONFLICT } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");


// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
    }

    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

// Update user
const updateUser = async (req, res) => {
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
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid data passed when updating the user" });
    }

    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!email || !password) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Email and password are required" });
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
      return res
        .status(CONFLICT)
        .send({ message: "User with this email already exists" });
    }
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid data passed when creating a user" });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
  return res
    .status(BAD_REQUEST)
    .send({ message: "Email and password are required" });
}

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).send({ token });
  } catch (err) {
    if (err.message === "Invalid email or password") {
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Invalid email or password" });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
