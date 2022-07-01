const express = require("express");
const {
  fetchAll,
  create,
  update,
  deleteRecord,
} = require("../controllers/groomerController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.get("/fetch-all", verifyJWT, fetchAll);
router.post("/create", verifyJWT, create);
router.put("/update", verifyJWT, update);
router.delete("/delete", verifyJWT, deleteRecord);

module.exports = router;
