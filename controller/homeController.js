const home = ((req, res) => {
    try {
        console.log('첫페이지에 접속됨');
    
        res.render('home');
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
});

module.exports = {
    home
};
