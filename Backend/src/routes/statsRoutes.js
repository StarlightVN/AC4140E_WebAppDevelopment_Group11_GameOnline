const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.post('/increment', statsController.incrementView);
router.get('/', statsController.getViewCount);

module.exports = router;