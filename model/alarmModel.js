const db = require('../common/db');

const insertAlarm = async(userId, id, pillA, pillB, pillC, pillD, alarmHour, alarmMinute, alarmName, alarmDays) => {
    try {
        const sql = "insert into alarm(fk_user, pill_id, name, pillA, pillB, pillC, pillD, time, day) values(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let time = `${alarmHour}:${alarmMinute}:00`; // 시간 형식
        // alarmDays를 문자열로 변환하여 저장 (예: '수요일, 목요일')
        const daysString = alarmDays.join(', ');
        const param = [userId, id, alarmName, parseInt(pillA), parseInt(pillB), parseInt(pillC), parseInt(pillD), time, daysString];

        await db.runSql(sql, param);

        return true;
    } catch (error) {
        console.error("Error in insertAlarm:", error.message || error);
        throw "SQL Query Error on insertAlarm";
    }
}

const getMaxPillId = async(userId) => {
    try {
        const sql = "select MAX(pill_id) as pill_id from alarm where fk_user = ?";
        const param = [userId];

        const result = await db.runSql(sql, param);

        console.log(result[0]);

        return result[0];
    } catch (error) {
        console.error("Error in callMaxPillId:", error.message || error);
        throw "SQL Query Error on callMaxPillId";
    }
}

const getAlarms = async(userId) => {
    try {
        const sql = "select fk_user, pill_id, name, pillA, pillB, pillC, pillD, time, day from alarm where fk_user = ?;";
        const param = [userId];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result;
    } catch (error) {
        console.error("Error in callMaxPillId:", error.message || error);
        throw "SQL Query Error on callMaxPillId";
    }
}

module.exports = {
    insertAlarm,
    getMaxPillId,
    getAlarms
};