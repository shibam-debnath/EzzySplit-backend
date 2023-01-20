const express = require("express");
const router = express.Router();
const {createGroup,addusers} = require('../controllers/group');

// router.get("/", (req, res) => {
//   res.send("<h1>Group</h1>");
// });

router.post("/creategroup",createGroup);
router.post("/:groupid/addusers",addusers);
module.exports = router;

// expenseController handles all the methods
// const groupController = require("../controllers/group.js");

// // Different Routes under groups

// // Retreive data of already stored groups (Login required)
// router.get("/fetch", groupController.fetchGroup);

// // Add new group (Login required)
// router.post("/create", groupController.createGroup);

// module.exports = router;
