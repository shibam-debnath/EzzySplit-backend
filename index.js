const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// loading express
const app = express();
app.use(express.json());
app.use(cors);
// import routes
const users = require("./routes/userRoutes");
const groups = require("./routes/groupRoutes");
const expenses = require("./routes/expenseRoutes");
const sendmail = require("./routes/sendmailRoutes");

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

//routes
app.get("/", (req, res) => {
  res.send("<h1>API is working fine</h1>");
});

app.use("/user", users);
app.use("/group", groups);
app.use("/sendmail", sendmail);
app.use("/expense", expenses);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
