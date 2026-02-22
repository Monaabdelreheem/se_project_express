const router = require("express").Router();
const usersRouter = require("./users");
const auth = require("../middlewares/auth");
const clothingItemsRouter = require("./clothingItems");
const { getItems } = require("../controllers/clothingItems");
const { createUser, login } = require("../controllers/users");
const {
  validateUserSignUp,
  validateUserSignIn,
} = require("../middlewares/validation");

router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// public routes
router.post("/signup", validateUserSignUp, createUser);
router.post("/signin", validateUserSignIn, login);
router.get("/items", getItems);


// protect everything below
router.use(auth);

// protected routes
router.use("/items", clothingItemsRouter);
router.use("/users", usersRouter);

const NotFoundError = require("../utils/errors/NotFoundError");

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
