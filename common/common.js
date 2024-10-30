const checkLogin = (req, res, isMust = true) => {
    let loginUserInfo = req.session.user;

    if (loginUserInfo == null) {
        if (isMust) {
            res.redirect("/member/login");
        }
        return null;
    }

    return loginUserInfo;
};

module.exports = {
    checkLogin,
};