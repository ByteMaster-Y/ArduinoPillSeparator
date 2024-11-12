const express = require('express');
const router = express.Router();
const controller =  require('../controller/settingController');

router.get('/', controller.setting);
// 알약 이름을 업데이트하는 POST 라우팅
router.post('/updatePillNames', controller.updatePillNames);


module.exports = router;