const express = require('express');
const router = express.Router();
const controller =  require('../controller/homeController');

router.get('/', controller.home);
// 모듈 만들고 나서 반드시 exports해줘야 한다.
module.exports = router;