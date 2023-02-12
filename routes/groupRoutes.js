const express = require("express");
const router = express.Router();
const { createGroup, addusers, inviteUserInGroup,deleteUserFromGroup,deleteGroup,editGroupName,getAllGroups,getAllUserOfCurrentGroup,getPreviousGroups,deletePreviouGroup} = require('../controllers/group');
const upload = require('../middleware/upload');
const { route } = require("./userRoutes");

// router.get("/", (req, res) => {
//   res.send("<h1>Group</h1>");
// });  

router.post("/creategroup", upload.single('groupIcon'), createGroup);  // create group
router.delete("/:groupid",deleteGroup);
router.patch("/:groupid",editGroupName);

router.post("/:groupid/inviteUser", inviteUserInGroup);
router.post("/:groupid/addusers", addusers);
router.delete("/:groupid/:userid",deleteUserFromGroup);

router.get("/:userid",getAllGroups);
router.get("/:groupid/users",getAllUserOfCurrentGroup);

router.get("/:userid/previousgroups",getPreviousGroups);
router.delete("/:userid/:groupid/previousgroup",deletePreviouGroup);

module.exports = router;

// expenseController handles all the methods
// const groupController = require("../controllers/group.js");

// // Different Routes under groups

// // Retreive data of already stored groups (Login required)
// router.get("/fetch", groupController.fetchGroup);

// // Add new group (Login required)
// router.post("/create", groupController.createGroup);

// module.exports = router;
