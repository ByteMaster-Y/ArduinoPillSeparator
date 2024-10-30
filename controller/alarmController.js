const model = require('../model/alarmModel');
const alarm = ((req, res) => {
    try {
        console.log('알람설정페이지에 접속됨');
    
        res.render('alarm/alarm');
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
});

const insertAlarm = async(req, res) => {
    try {
        const { id, alarmHour, alarmMinute, alarmName, alarmDays } = req.body;
        console.log(id, alarmHour, alarmMinute, alarmName, alarmDays);
        const result = await model.insertAlarm(id, alarmHour, alarmMinute, alarmName, alarmDays);
    
        res.json({ success: true, result });
    } catch (error) {
        console.error("Error in insertAlarm:", error);
        res.status(500).json({ success: false, message: error });
    }
};

module.exports = {
    alarm,
    insertAlarm
};