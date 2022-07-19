const express = require("express");
const {
  fetchActiveUsers,
  fetchArchiveUsers,
  deleteUser,
  reStoreUser,
} = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.get("/fetch-active-users", verifyJWT, fetchActiveUsers);
router.get("/fetch-archive-users", verifyJWT, fetchArchiveUsers);
router.delete("/delete-user/:id", verifyJWT, deleteUser);
router.put("/restore-user/:id", verifyJWT, reStoreUser);

module.exports = router;
