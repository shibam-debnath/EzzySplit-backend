const express = require("express");
const { getUser, adduser, getUserUsingMail } = require("../controllers/user");
const router = express.Router();

router.post("/adduser", adduser);
router.get("/profile/:userId", getUser);
router.get("/profile/emailId/:emailId", getUserUsingMail);

module.exports = router;
