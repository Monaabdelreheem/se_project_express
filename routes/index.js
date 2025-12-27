const router = require("express").Router();
// const { getUsers, getUser, createUser } = require("../controllers/users");
const usersRouter = require("./users");
const { NOT_FOUND } = require("../utils/errors");

router.use("/users", usersRouter);
router.use("/items", require("./clothingItems"));

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
