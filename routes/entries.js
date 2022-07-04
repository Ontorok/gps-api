const express = require("express");
const {
  create,
  fetchAllGrooming,
  fetchAllNonGrooming,
} = require("../controllers/entriesController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.post("/save-entries", create);
router.get("/fetch-all-grooming-entries", verifyJWT, fetchAllGrooming);
router.get("/fetch-all-non-grooming-entries", verifyJWT, fetchAllNonGrooming);

module.exports = router;
