const express = require('express');
const { fetchAll, create } = require('../controllers/clubController');
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.get('/fetch-all', verifyJWT, fetchAll);
router.post('/create', create);

module.exports = router;
