const db = require('../common/db');

const deleteAlarm = async () => {
    try {
        const sql = "DELETE FROM arduinoAlarm";
        await db.runSql(sql);
        return true;
    } catch (error) {
        console.error("Error in deleteAlarm:", error.message || error);
        throw "SQL Query Error on deleteAlarm";
    }
}

const insertAlarm = async (id, pillA, pillB, pillC, pillD, LCD, alarmHour, alarmMinute) => {
    try {
        const sql = "insert into arduinoAlarm(id, pillA, pillB, pillC, pillD, LCD, alarmHour, alarmMinute) values(?, ?, ?, ?, ?, ?, ?, ?)";
        const param = [id, pillA, pillB, pillC, pillD, LCD, alarmHour, alarmMinute];
        await db.runSql(sql, param);

        return true;
    } catch (error) {
        console.error("Error in insertAlarm:", error.message || error);
        throw "SQL Query Error on insertAlarm";
    }
}

const getAlarms = async() => {
    try {
        const sql = "select id, pillA, pillB, pillC, pillD, LCD, alarmHour, alarmMinute from arduinoAlarm";

        const result = await db.runSql(sql);

        console.log(result);

        return result[0];
    } catch (error) {
        console.error("Error in getAlarms:", error.message || error);
        throw "SQL Query Error on getAlarms";
    }
}

module.exports = {
    deleteAlarm,
    insertAlarm,
    getAlarms
};