const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Group</h1>");
});

module.exports = router;

// expenseController handles all the methods
// const groupController = require("../controllers/group.js");

// // Different Routes under groups

// // Retreive data of already stored groups (Login required)
// router.get("/fetch", groupController.fetchGroup);

// // Add new group (Login required)
// router.post("/create", groupController.createGroup);

// module.exports = router;
