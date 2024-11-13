// 확인 버튼 클릭 시 동작하는 코드 추가
document.getElementById('confirmButton').addEventListener('click', async function () {
    // 약통 이름을 입력받기
    const pillAName = document.getElementById('paramA').value;
    const pillBName = document.getElementById('paramB').value;
    const pillCName = document.getElementById('paramC').value;
    const pillDName = document.getElementById('paramD').value;

    try {
        const response = await fetch('/setting/updatePillNames', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pillAName, pillBName, pillCName, pillDName })
        });
        const result = await response.json();
        if (result.success) {
            console.log("알람 불러오기 성공:", result.result);
            alert('약통 이름이 설정되었습니다.');
        } else {
            console.error("알람 추가 실패:", result.message);
            alert('문제가 발생했습니다.');
        }
    } catch (error) {
        console.error("네트워크 오류:", error);
        alert('서버 응답 처리 중 오류가 발생했습니다.');
    }
});