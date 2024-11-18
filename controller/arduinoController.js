const model = require('../model/arduinoModel');

const test = async (req, res) => {
    try {
        const { id, pillA, pillB, pillC, pillD, LCD, alarmHour, alarmMinute } = req.body;  // ESP32에서 전송된 JSON 데이터
        await model.deleteAlarm();
        const result = await model.insertAlarm(id, pillA, pillB, pillC, pillD, LCD, alarmHour, alarmMinute);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error in test:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const test2 = async (req, res) => {
    try {
        const alarmData = await model.getAlarms();
        res.json(alarmData);  // JSON 형태로 데이터를 응답
        
        
    } catch (error) {
        console.error("Error in test2:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    test,
    test2
};