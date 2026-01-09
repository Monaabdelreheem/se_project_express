const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const {createUser, login} = require("./controllers/users");
// const { SERVER_ERROR } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "694db3d1c645b8e3b23441cf",
  };
  next();
});

app.use("/", mainRouter);

app.post("/signup", createUser);
app.post("/signin", login);

app.listen(PORT);


module.exports = app;
