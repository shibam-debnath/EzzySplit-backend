const express = require('express');
const { welcome} = require("../controllers/contact");
const router = express.Router();

router.post("/submit", welcome);

module.exports = router;