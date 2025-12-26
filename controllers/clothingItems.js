const clothingItem = require("../models/clothingItem");

// ✅ UPDATE: import centralized error codes as required
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
    res.status(200).send(items);
  } catch (err) {
    console.error(err); // ✅ UPDATE: log error to terminal
    res
      .status(SERVER_ERROR) // ✅ UPDATE: use centralized error code
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
      owner: req.user._id, // already correct
    });

    res.status(201).send(newItem);
  } catch (err) {
    console.error(err.name); // ✅ UPDATE: log error name

    if (err.name === "ValidationError") {
      // ✅ UPDATE: handle invalid data (400)
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid data passed when creating a clothing item" });
    }

    // ✅ UPDATE: default 500 error
    res
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
    res.status(200).send({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err.name);

    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    }

    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }

    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

const likeItem = async (req, res) => {
  try {
    const item = await clothingItem
      .findByIdAndUpdate(
        req.params.itemId,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      )
      .orFail();

    res.status(200).send(item);
  } catch (err) {
    console.error(err.name);

    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    }

    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }

    res
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

    res.status(200).send(item);
  } catch (err) {
    console.error(err.name);

    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    }

    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }

    res
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
