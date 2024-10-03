const express = require('express');
const router = express.Router();
const controller =  require('../controller/settingController');

router.get('/', controller.setting);
// 모듈 만들고 나서 반드시 exports해줘야 한다.
module.exports = router;