const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const {createUser, login} = require("./controllers/users");
const auth = require("./middlewares/auth");


const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());

app.post("/signup", createUser);
app.post("/signin", login);



app.use(auth);

app.use("/", mainRouter);

app.listen(PORT);


module.exports = app;
