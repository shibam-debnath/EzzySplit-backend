const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// loading express
const app = express();
app.use(express.json());

// import routes
const users = require("./routes/userRoutes");
const groups = require("./routes/groupRoutes");
const expenses = require("./routes/expenseRoutes");

// mongodb connection
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (req, res) => {
  res.send("<h1>Hello Team and aniket</h1>");
});

//routes
app.use("/user", users);
app.use("/group", groups);
<<<<<<< HEAD
// app.use("/expense", expenses);
=======
app.use("/expense", expenses);
>>>>>>> dfa1a6272f7f0516b371d6be18dae55aefc0fde9

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
