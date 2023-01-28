const express = require('express');
const { sendmail,contactMail } = require("../controllers/sendmail");
const router = express.Router();

router.post("/contactUs", contactMail);

module.exports = router;