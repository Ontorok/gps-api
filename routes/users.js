const express = require("express");
const { fetchActiveUsers } = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.get("/fetch-active-users", verifyJWT, fetchActiveUsers);

module.exports = router;
