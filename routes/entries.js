const express = require("express");
const {
  create,
  fetchAllNonFunded,
  createByUser,
  fetchGpsDataFromKnackApi,
  fetchAllFunded,
} = require("../controllers/entriesController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.get("/fetch-knack", fetchGpsDataFromKnackApi);
router.get("/fetch-all-funded-entries", verifyJWT, fetchAllFunded);
router.get("/fetch-all-non-funded-entries", verifyJWT, fetchAllNonFunded);
router.post("/save-entries", create);
router.post("/save-entries-by-user", verifyJWT, createByUser);

module.exports = router;
