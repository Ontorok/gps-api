const express = require("express");
const { create } = require("../controllers/entriesController");

const router = express.Router();

router.post("/save-entries", create);

module.exports = router;
