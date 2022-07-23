const express = require("express");
const {
  fetchAll,
  create,
  update,
  deleteRecord,
  fetchAllArchive,
  restore,
  fetchAllActiveGroomers,
  fetchGroomerByClub,
} = require("../controllers/groomerController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.get("/fetch-all", verifyJWT, fetchAll);
router.get("/fetch-all-archive", verifyJWT, fetchAllArchive);
router.get("/fetch-all-active-groomers", verifyJWT, fetchAllActiveGroomers);
router.get("/fetch-groomer/:id", verifyJWT, fetchGroomerByClub);
router.post("/create", verifyJWT, create);
router.put("/update", verifyJWT, update);
router.delete("/delete", verifyJWT, deleteRecord);
router.put("/re-store", verifyJWT, restore);

module.exports = router;
