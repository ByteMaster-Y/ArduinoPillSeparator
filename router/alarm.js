const express = require('express');
const router = express.Router();
const controller =  require('../controller/alarmController');

router.get('/', controller.alarm);
router.post('/insertAlarm', controller.insertAlarm);
router.post('/getMaxPillId', controller.getMaxPillId);
router.post('/getAlarms', controller.getAlarms);
router.post('/deleteAlarm', controller.deleteAlarm);

module.exports = router;