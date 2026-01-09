const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, UNAUTHORIZED } = require("../utils/errors");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (err) {
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

// Get a user by ID
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail();
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

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword, });
    return res.status(201).send(newUser);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).send({ token });
  } catch (err) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Invalid email or password" });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
};
