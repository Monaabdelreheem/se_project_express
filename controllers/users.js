const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require("../utils/errors");

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

// Get a user by ID
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail();
    res.status(200).send(user);
  } catch (err) {
    console.error(err.name);

    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid user ID" });
    }

    if (err.name === "DocumentNotFoundError") {
      return res
        .status(NOT_FOUND)
        .send({ message: "User not found" });
    }

    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const newUser = await User.create({ name, avatar });
    res.status(201).send(newUser);
  } catch (err) {
    console.error(err.name);

    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid data passed when creating a user" });
    }

    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
