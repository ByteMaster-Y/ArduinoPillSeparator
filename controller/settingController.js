const setting = ((req, res) => {
    try {
        console.log('세팅화면에 접속됨');
    
        res.render('setting/setting');
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
});


module.exports = {
    setting
};
