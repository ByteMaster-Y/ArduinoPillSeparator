const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('첫페이지에 접속됨');
    
    res.render('home');
});
// 모듈 만들고 나서 반드시 exports해줘야 한다.
module.exports = router;