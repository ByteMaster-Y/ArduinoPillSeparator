const model = require('../model/memberModel');
// const common = require("../common/common");



const login = ((req, res) => { // async 필요 없는 경우: 단순히 화면만 렌더링할 때 (login) 
    try {
        let {name} = req.query;
        res.render('member/login', {name});
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
});

const signup = ((req, res) => { 
    try {
        res.render('member/signup');
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
});

// loginUserInfo.user_name에 해당하는 값이 어디서 정의?
// 이 값은 loginProc 함수에서 정의된 세션 값에 포함
const loginProc = (async(req,res) => {
    try {
        // post 방식의 데이터 받기
        let {user_id, user_pw} = req.body;
        console.log(user_id, user_pw);
        // XSS 방지 ==> 엄격하게
        // user_id = common.reqeustFilter(user_id, 20, false);
        // password = common.reqeustFilter(user_pw, 20, false);

        const result = await model.loginCheck(user_id, user_pw);
        
        if (result != null) {
            //로그인 성공
            console.log(
                "pkid: ", result.pkid,
                "user_id:", result.user_id,
                "user_name:", result.name);
            res.redirect("/alarm/");
        } else {
            res.render("member/login");
        }
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
});

const cheackUserId = async(req, res) => {
    try {
        // post 방식의 데이터 받기
        let {user_id} = req.body;

        // user_id = common.reqeustFilter(user_id, 20, false);
        let count = await model.getUserIdCount(user_id);

        if (count == 0) {
            res.send('true');
        } else {
            res.send('false');

        }
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
}

const postRegister = async(req, res) => {
    try {
        // post 방식의 데이터 받기
        let {user_id, user_pw, nickname} = req.body;
        // user_id = common.reqeustFilter(user_id, 20, false);
        // user_pw = common.reqeustFilter(user_pw, 20, false);
        // name = common.reqeustFilter(name, 50, false);

        let register = await model.insertUser(user_id, user_pw, nickname);
        // common.alertAndGo(res, "등록 되었습니다.", "/member/");
        res.redirect("/member/login?name="+nickname);
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
}

module.exports = {
    login,
    loginProc,
    signup,
    cheackUserId,
    postRegister
};