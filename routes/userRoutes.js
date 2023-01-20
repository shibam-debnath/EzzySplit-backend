const express = require("express");
const { getUser, adduser } = require("../controllers/userController");
const router = express.Router();

router.post("/adduser", adduser)
router.get("/profile/:emailId", getUser);

module.exports = router;
