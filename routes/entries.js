const express = require("express");
const {
  create,
  fetchAllGrooming,
  fetchAllNonGrooming,
  createByUser,
  fetchGpsDataFromKnackApi,
} = require("../controllers/entriesController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.get("/fetch-knack", fetchGpsDataFromKnackApi);
router.get("/fetch-all-grooming-entries", verifyJWT, fetchAllGrooming);
router.get("/fetch-all-non-grooming-entries", verifyJWT, fetchAllNonGrooming);
router.post("/save-entries", create);
router.post("/save-entries-by-user", verifyJWT, createByUser);

module.exports = router;
