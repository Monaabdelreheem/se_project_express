const router = require("express").Router();
const usersRouter = require("./users");
const auth = require("../middlewares/auth");
const { NOT_FOUND } = require("../utils/errors");
const clothingItemsRouter = require("./clothingItems");
const { getItems } = require("../controllers/clothingItems");
const { createUser, login } = require("../controllers/users");

// public routes
router.post("/signup", createUser);
router.post("/signin", login);
router.get("/items", getItems);


// protect everything below
router.use(auth);

// protected routes
router.use("/items", clothingItemsRouter);
router.use("/users", usersRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
