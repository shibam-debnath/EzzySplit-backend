const express = require("express");
const router = express.Router();
const {
  createGroup,
  addusers,
  inviteUserInGroup,
} = require("../controllers/group");
const upload = require("../middleware/upload");


// routes 
router.get("/", (req, res) => {
  res.send("<h1>Group route is working</h1>");
});

router.post("/creategroup", upload.single("groupIcon"), createGroup);
router.post("/:groupid/inviteUser", inviteUserInGroup);
router.post("/:groupid/addusers", addusers);

module.exports = router;
