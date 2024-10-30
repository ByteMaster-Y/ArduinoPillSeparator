const db = require('../common/db');

const insertAlarm = async(id, alarmHour, alarmMinute, alarmName, alarmDays) => {
    try {
        const sql = "insert into alarm(fg_user, dt_id, name, pillA, pillB, pillC, pillD, time, day) values(1, ?, ?, 0, 0, 0, 1, ?, ?)";
        let time = `${alarmHour}:${alarmMinute}:00`; // 시간 형식
        // alarmDays를 문자열로 변환하여 저장 (예: '수요일, 목요일')
        const daysString = alarmDays.join(', ');
        const param = [id, alarmName, time, daysString];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result[0];
    } catch (error) {
        throw "SQL Query Error on insertUser";
    }
}

module.exports = {
    insertAlarm
};