const alarm = ((req, res) => {
    try {
        console.log('알람설정페이지에 접속됨');
    
        res.render('alarm/alarm');
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
});

module.exports = {
    alarm
};