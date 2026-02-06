const clothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

// Get all clothing items
const getItems = async (req, res, next) => {
  try {
    const items = await clothingItem.find({});
    return res.status(200).send(items);
  } catch (err) {
    return next(err);
  }
};

// Create a new clothing item
const createItem = async (req, res, next) => {
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
      return next(
        new BadRequestError("Invalid data passed when creating a clothing item")
      );
    }
    return next(err);
  }
};

// Delete a clothing item by ID
const deleteItem = async (req, res, next) => {
  try {
    const item = await clothingItem.findById(req.params.itemId).orFail();
// Check if the current user is the owner of the item
    if (item.owner.toString() !== req.user._id) {
      return next(new ForbiddenError("Forbidden: You cannot delete this item"));
    }

    await item.deleteOne();
    return res.status(200).send({ message: "Item deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }

    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Item not found"));
    }
    return next(err);
  }
};

// Like an item
const likeItem = async (req, res, next) => {
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
      return next(new BadRequestError("Invalid item ID"));
    }

    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Item not found"));
    }
    return next(err);
  }
};

// Dislike (unlike) an item
const dislikeItem = async (req, res, next) => {
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
      return next(new BadRequestError("Invalid item ID"));
    }

    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Item not found"));
    }
    return next(err);
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
