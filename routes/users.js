const express = require("express");
const {
  fetchActiveUsers,
  fetchArchiveUsers,
} = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.get("/fetch-active-users", verifyJWT, fetchActiveUsers);
router.get("/fetch-archive-users", verifyJWT, fetchArchiveUsers);

module.exports = router;
