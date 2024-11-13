const db = require('../common/db');

const updatePillNames = async(pillAName, pillBName, pillCName, pillDName, userId) => {
    try {
        const sql = "UPDATE pill_container SET pillA_name = ?, pillB_name = ?, pillC_name = ?, pillD_name = ? WHERE fk_user = ?";
        const param = [pillAName, pillBName, pillCName, pillDName, userId];

        await db.runSql(sql, param);

        return true;
    } catch (error) {
        console.error("Error in updatePillNames:", error.message || error);
        throw "SQL Query Error on updatePillNames";
    }
}

module.exports = {
    updatePillNames
};


