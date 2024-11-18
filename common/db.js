const mysql = require('mysql2');

const db = {
    host : '127.0.0.1',
    user : 'arduino',
    password : 'arduino',
    database : 'arduino',
    port: 3306
};

const pool = mysql.createPool(db);  // 그냥 커넥션 하는거 보다 성능이슈 적음. 미리 만들어둔 커넥션 빌려주는거.(금방반환받음)
const dbPool = pool.promise();

const runSql = (async(sql, params = null) => {
    let dbCon;
    let result;

    try {
        dbCon = await dbPool.getConnection();
        if(params == null) {
            result = await dbCon.query(sql);
        } else {
            result = await dbCon.query(sql, params);
        }

        return result[0];
    } catch(error) {
        throw new Error(error);
    } finally {
        if (dbCon) dbCon.release(); // 커넥션 반환받음
    }
});


module.exports = {
    runSql,
    db
}