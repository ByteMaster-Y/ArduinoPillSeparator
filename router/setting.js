const express = require('express');
const router = express.Router();
const controller =  require('../controller/settingController');

router.get('/', controller.setting);


module.exports = router;