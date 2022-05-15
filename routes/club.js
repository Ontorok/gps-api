const express = require('express');
const { fetchAll, fetchAllArchive, create, update, deleteRecord, restore } = require('../controllers/clubController');
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.get('/fetch-all', verifyJWT, fetchAll);
router.get('/fetch-all-archive', verifyJWT, fetchAllArchive);
router.post('/create', verifyJWT, create);
router.put('/update', verifyJWT, update);
router.delete('/delete', verifyJWT, deleteRecord);
router.put('/re-store', verifyJWT, restore);

module.exports = router;
