const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// loading express
const app = express();

// import routes
const users = require("./routes/userRoutes");
// const trips = require("./routes/tripRoutes");
const groups = require("./routes/groupRoutes");
const expenses = require("./routes/expenseRoutes");


mongoose
  .connect("process.env.MONGODB_URL")
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
// app.use("/user", users);
// app.use("/group", groups);
// app.use("/expense", expenses);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
