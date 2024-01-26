const express = require("express");
const {
  fetchActiveUsers,
  fetchArchiveUsers,
  deleteUser,
  reStoreUser,
  resetPassword,
} = require("../controllers/userController");
const verifyIsAdmin = require("../middleware/verifyIsAdmin");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.get("/fetch-active-users", verifyJWT, fetchActiveUsers);
router.get("/fetch-archive-users", verifyJWT, fetchArchiveUsers);
router.delete("/delete-user/:id", verifyJWT, deleteUser);
router.put("/restore-user/:id", verifyJWT, reStoreUser);
router.put("/reset-password", verifyJWT, verifyIsAdmin, resetPassword);

module.exports = router;
