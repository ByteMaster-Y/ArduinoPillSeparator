// const model = require('../model/memberModel');
// const common = require("../common/common");



const login = ((req, res) => { // async 필요 없는 경우: 단순히 화면만 렌더링할 때 (login) 
    try {
        res.render('member/login');
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
});

// loginUserInfo.user_name에 해당하는 값이 어디서 정의?
// 이 값은 loginProc 함수에서 정의된 세션 값에 포함
// const loginProc = (async(req,res) => {
//     try {
//         // post 방식의 데이터 받기
//         let {user_id, user_pw} = req.body;

//         // XSS 방지 ==> 엄격하게
//         user_id = common.reqeustFilter(user_id, 20, false);
//         user_pw = common.reqeustFilter(user_pw, 20, false);

//         const result = await model.loginCheck(user_id, user_pw);
        
//         if (result != null) {
//             //로그인 성공
//             req.session.user = {
//                 pkid: result.pkid,
//                 user_id: result.user_id,
//                 user_name: result.name
//             };
//             common.alertAndGo(res, "로그인 되었습니다.", "/");
//         } else {
//             common.alertAndGo(res, "아이디 또는 비밀번호가 틀립니다.", "/member/login");
//         }
//     } catch (error) {
//         res.status(500).send("<H1>500</H1> Error" + error);
//     }
// });


module.exports = {
    login
};