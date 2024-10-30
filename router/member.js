const express = require('express');
const router = express.Router();
const controller = require('../controller/memberController');

router.get('/login', controller.login); // member/login.html
router.post('/login', controller.loginProc); // member.login.html
router.get('/signup', controller.signup); // member/login.html
router.post("/cheackUserId", controller.cheackUserId);
router.post("/register", controller.postRegister);

module.exports = router;