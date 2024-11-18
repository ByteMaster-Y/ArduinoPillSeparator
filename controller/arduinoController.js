const test = async (req, res) => {
    try {
        const { id, pillA, pillB, pillC, pillD, LCD, alarmHour, alarmMinute, espData } = req.body;  // ESP32에서 전송된 JSON 데이터
        req.session.alarm = {
            id: id,
            pillA: pillA,
            pillB: pillB,
            pillC: pillC,
            pillD: pillD,
            LCD: LCD,
            alarmHour: alarmHour,
            alarmMinute: alarmMinute,
        };
        req.session.save(function(){
        });
        // 콘솔에 데이터 출력
        console.log('ESP32에서 수신된 데이터:', espData);

        // 데이터에 따라 다른 처리를 추가할 수 있음
        // 예: 데이터베이스 저장, 알림 전송 등

        // ESP32에 응답 전송
        res.status(200).send('데이터 수신 완료');
    } catch (error) {
        console.error("Error in test:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const test2 = async (req, res) => {
    try {
        const { id, pillA, pillB, pillC, pillD, LCD, alarmHour, alarmMinute } = req.session.alarm;
        const alarmData = {
            id: id,
            A: pillA,
            B: pillB,
            C: pillC,
            D: pillD,
            LCD: LCD,
            alarmHour: alarmHour,
            alarmMinute: alarmMinute,
        };
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