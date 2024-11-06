const express = require('express');
const router = express.Router();
const controller =  require('../controller/arduinoController');
// '/ino'로 오는 데이터 수집
router.post('/test', controller.test);
router.post('/test2', controller.test2);

module.exports = router;