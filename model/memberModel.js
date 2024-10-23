const db = require('../common/db');

const loginCheck = (async(user_id, user_pw) => {
    try {
        const sql = "select pkid, user_id, user_pw, name from member where user_id = ? and user_pw = ?";
        const param = [user_id, user_pw];

        const reslut = await db.runSql(sql, param);

        console.log(reslut);

        return reslut[0];
    } catch (error) {
        throw "SQL Query Error on loginCheck";
    }
});

// const getList = async() => {
//     try {
//         const sql = "select pkid, user_id, name, regdate from member order by pkid desc";

//         const reslut = await db.runSql(sql);

//         console.log(reslut);

//         return reslut;
//     } catch (error) {
//         throw "SQL Query Error on getList";
//     }
// }

const getData = async(pkid) => {
    try {
        const sql = "select pkid, user_id, name, regdate from member where pkid = ?";
        const param = [pkid];

        const reslut = await db.runSql(sql, param);

        console.log(reslut);

        return reslut[0];
    } catch (error) {
        throw "SQL Query Error on getData";
    }
}
//
const getList = async(page) => {
    try {
        const sql = "select pkid, user_id, name, regdate from member order by pkid desc limit ?, 10";
        const param = [page];

        const reslut = await db.runSql(sql, param);

        console.log(reslut);

        return reslut;
    } catch (error) {
        throw "SQL Query Error on getList10";
    }
}

const getTotal = async() => {
    try {
        const sql = "select count(pkid) as cnt from member";

        const reslut = await db.runSql(sql);

        console.log(reslut[0]);

        return reslut[0];
    } catch (error) {
        throw "SQL Query Error on getList";
    }
}
//
module.exports = {
    loginCheck,
    getList,
    getData,
    getTotal
};
