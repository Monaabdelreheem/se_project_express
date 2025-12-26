const clothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  SERVER_ERROR,
} = require("../utils/errors");

// Get all clothing items
const getItems = async (req, res) => {
  try {
    const items = await clothingItem.find({});
    return res.status(200).send(items);
  } catch (err) {
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

// Create a new clothing item
const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;

    const newItem = await clothingItem.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });

    return res.status(201).send(newItem);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid data passed when creating a clothing item" });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

// Delete a clothing item by ID
const deleteItem = async (req, res) => {
  try {
    const item = await clothingItem.findById(req.params.itemId).orFail();

    if (item.owner.toString() !== req.user._id) {
      return res
        .status(FORBIDDEN)
        .send({ message: "Forbidden: You cannot delete this item" });
    }

    await item.deleteOne();
    return res.status(200).send({ message: "Item deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    }

    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

// Like an item
const likeItem = async (req, res) => {
  try {
    const item = await clothingItem
      .findByIdAndUpdate(
        req.params.itemId,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      )
      .orFail();

    return res.status(200).send(item);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    }

    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

// Dislike (unlike) an item
const dislikeItem = async (req, res) => {
  try {
    const item = await clothingItem
      .findByIdAndUpdate(
        req.params.itemId,
        { $pull: { likes: req.user._id } },
        { new: true }
      )
      .orFail();

    return res.status(200).send(item);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    }

    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
