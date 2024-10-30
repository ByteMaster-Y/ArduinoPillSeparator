const express = require('express');
const router = express.Router();
const controller =  require('../controller/alarmController');

router.get('/', controller.alarm);
router.post('/', controller.insertAlarm);

module.exports = router;