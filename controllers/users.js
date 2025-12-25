const User = require("../models/user");

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

// Get a user by ID
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

// Create a new user
const createUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const newUser = await User.create({ name, avatar });
    res.status(201).send(newUser);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
