const clothingItem = require("../models/clothingItem");

// Get all clothing items
const getItems = async (req, res, next) => {
  try {
    const items = await clothingItem.find({});
    res.status(200).send(items);
  } catch (err) {
    next(err);
  }
};

// Create a new clothing item
const createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl, owner } = req.body;
    const newItem = await clothingItem.create({
      name,
      weather,
      imageUrl,
      owner,
    });
    res.status(201).send(newItem);
  } catch (err) {
    next(err);
  }
};

// Delete a clothing item by ID
const deleteItem = async (req, res, next) => {
  try {
    const item = await clothingItem.findByIdAndDelete(req.params.itemId);
    if (!item) {
      return res.status(404).send({ message: "Item not found" });
    }
    res.status(200).send({ message: "Item deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
};
