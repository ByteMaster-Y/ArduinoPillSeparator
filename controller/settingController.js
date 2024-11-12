const common =  require('../common/common');
const { runSql } = require('../common/db');  // DB 연결 모듈 임포트
const setting = ((req, res) => {
    try {
        console.log('세팅화면에 접속됨');
    
        res.render('setting/setting');
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
});

// 알약 이름을 업데이트하는 함수
const updatePillNames = async (req, res) => {
    const { pillAName, pillBName, pillCName, pillDName } = req.body;
    const userId = 1; // 예시로 현재 로그인된 사용자 ID를 1로 설정

    // 업데이트 쿼리 준비
    const query = `
        UPDATE pill_container
        SET pillA_name = ?, pillB_name = ?, pillC_name = ?, pillD_name = ?
        WHERE fk_user = ?
    `;

    try {
        const result = await runSql(query, [pillAName, pillBName, pillCName, pillDName, userId]);
        
        if (result.affectedRows > 0) {
            return res.json({ success: true, message: '알약 이름이 성공적으로 업데이트되었습니다.' });
        } else {
            return res.json({ success: false, message: '업데이트된 데이터가 없습니다.' });
        }
    } catch (err) {
        console.error('DB 업데이트 오류:', err);
        return res.json({ success: false, message: 'DB 업데이트 중 오류가 발생했습니다.' });
    }
};



module.exports = {
    setting, updatePillNames
};
