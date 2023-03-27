const express = require('express');
const { contactMail } = require("../controllers/sendmail");
const router = express.Router();

router.post("/contactUs", contactMail);

module.exports = router;