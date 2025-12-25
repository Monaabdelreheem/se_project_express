const router = require("express").Router();
// const { getUsers, getUser, createUser } = require("../controllers/users");
const usersRouter = require("./users");

router.use("/users", usersRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

module.exports = router;
