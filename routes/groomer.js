const express = require('express');
const { fetchAll, create } = require('../controllers/groomerController');

const router = express.Router();

router.get('/fetch-all', fetchAll);
router.post('/create', create);


module.exports = router