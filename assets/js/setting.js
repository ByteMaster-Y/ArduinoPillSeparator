// 확인 버튼 클릭 시 동작하는 코드 추가
document.getElementById('confirmButton').addEventListener('click', function () {
    // 약통 이름을 입력받기
    const pillAName = document.getElementById('paramA').value;
    const pillBName = document.getElementById('paramB').value;
    const pillCName = document.getElementById('paramC').value;
    const pillDName = document.getElementById('paramD').value;

    // 서버에 데이터 보내기
    fetch('/setting/updatePillNames', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pillAName,
            pillBName,
            pillCName,
            pillDName,
        })
    })
    .then(response => response.text())  // 응답을 JSON이 아니라 텍스트로 처리하여 확인
    .then(data => {
        console.log('Server Response:', data); // 서버 응답 내용 확인
        try {
            const jsonData = JSON.parse(data);  // 응답을 JSON으로 파싱
            if (jsonData.success) {
                alert('약통 이름이 설정되었습니다.');
                window.location.reload();
            } else {
                alert('문제가 발생했습니다.');
            }
        } catch (error) {
            // console.error('JSON Parsing Error:', error);
            alert('서버 응답 처리 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});