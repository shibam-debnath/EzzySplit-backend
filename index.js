const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// loading express
const app = express();

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
// import routes
const users = require("./routes/userRoutes");
const trips = require("./routes/tripRoutes");
const groups = require("./routes/groupRoutes");
const expenses = require("./routes/expenseRoutes");

let people = [
  {
    name: "Shibam Debnath",
    number: "06-51-99-56-83",
    id: 1,
  },
  {
    name: "Suraj Kumar",
    number: "10987654",
    id: 2,
  },
  {
    name: "Nikhil Vinay",
    number: "3691215",
    id: 3,
  },
];

//routes
// app.use("/user", users);
// app.use("/trip", trips);
// app.use("/group", groups);
// app.use("/expense", expenses);

app.get("/api/people", (req, res) => {
  res.json(people);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
