const express = require('express');
const { sendmail } = require("../controllers/sendmail");
const router = express.Router();

// router.post("/submit", sendmail);

module.exports = router;