const model = require('../model/alarmModel');
const common =  require('../common/common');
const alarm = (async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res);
        if (loginUserInfo != null) {
            //로그인 성공
            const { pkid } = req.session.user;
            console.log('알람설정페이지에 접속됨',pkid);
            //db에서 알람들 가져오기(배열)
            const list = await model.getAlarms(pkid);
            res.render('alarm/alarm', {list});
        }
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
});

const insertAlarm = async(req, res) => {
    try {
        const { userId, id, pillA, pillB, pillC, pillD, alarmHour, alarmMinute, alarmName, alarmDays } = req.body;
        console.log(userId, id, pillA, pillB, pillC, pillD, alarmHour, alarmMinute, alarmName, alarmDays);
        const result = await model.insertAlarm(userId, id, pillA, pillB, pillC, pillD, alarmHour, alarmMinute, alarmName, alarmDays);
        res.json({ success: true, result });
    } catch (error) {
        console.error("Error in insertAlarm:", error);
        res.status(500).json({ success: false, message: error });
    }
};

const getMaxPillId = async(req, res) => {
    try {
        const { pkid } = req.session.user;
        console.log(pkid);
        const result = await model.getMaxPillId(pkid);
        let pill_id = result.pill_id;
        if (pill_id == null) {
            pill_id = 0;
        }
        res.json({ success: true, pill_id, pkid });
    } catch (error) {
        console.error("Error in getMaxPillId:", error);
        res.status(500).json({ success: false, message: error });
    }
};

const getAlarms = async(req, res) => {
    try {
        const { pkid } = req.session.user;
        console.log(pkid);
        const list = await model.getAlarms(pkid);
        res.json({ success: true, list });
    } catch (error) {
        console.error("Error in getAlarms:", error);
        res.status(500).json({ success: false, message: error });
    }
};


module.exports = {
    alarm,
    insertAlarm,
    getMaxPillId,
    getAlarms
};