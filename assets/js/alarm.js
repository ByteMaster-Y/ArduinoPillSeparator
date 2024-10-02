// 현재 시간을 표시하는 함수
function updateCurrentTime() {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById('currentTime').textContent = formattedTime;
}

// 매초 현재 시간 업데이트
setInterval(updateCurrentTime, 1000);
updateCurrentTime(); // 페이지 로드 시 한 번 호출

const modalElement = document.getElementById('exampleModal');
const modalInstance = new mdb.Modal(modalElement);  // 모달 인스턴스를 수동으로 초기화

// 확인 버튼 이벤트 핸들러 함수
function confirmSpanClickHandler(span, alarm) {
  alert('알람 수정이 완료되었습니다.'); // 추가 알림
  alarm.alarmName = alarmNameInput.value;
  alarm.alarmHour = hourInput.value;
  alarm.alarmMinute = minuteInput.value;
  modifyAlarm(span, alarm);
  modalInstance.hide();  // 모달 닫기
}

function confirmAddClickHandler() {
  setAlarmFunction(); // 알람 설정 함수 호출
  modalInstance.hide();  // 모달 닫기
}

let handleConfirmClick;

const addAlarmButton = document.getElementById("set");
addAlarmButton.addEventListener('click', () => {
  modalInstance.show(); // 모달 열기
  alarmNameInput.value = ''; // 입력 필드 초기화
  hourInput.value = ''; // 입력 필드 초기화
  minuteInput.value = ''; // 입력 필드 초기화

  // 기존의 확인 버튼 이벤트 리스너 제거
  const confirmButton = modalElement.querySelector('#confirm');
  confirmButton.removeEventListener('click', confirmAddClickHandler);
  confirmButton.removeEventListener('click', handleConfirmClick);

  // 새로운 확인 버튼 이벤트 추가
  confirmButton.addEventListener('click', confirmAddClickHandler);
});

// 요일 설정 로직 
document.getElementById('confirmDaysButton').addEventListener('click', function() {
  const selectedDays = Array.from(document.getElementById('alarmDays').selectedOptions)
                              .map(option => option.text); // 선택된 요일의 텍스트를 가져옴

  // 선택된 요일을 레이블에 표시
  const selectedDaysLabel = document.getElementById('selectedDaysLabel');
  if (selectedDays.length > 0) {
      selectedDaysLabel.textContent = `${selectedDays.join(', ')}`;
  } else {
      selectedDaysLabel.textContent = '선택된 요일이 없습니다.';
  }

  // 요일 선택 모달을 닫음
  const dayModal = document.getElementById('daySelectionModal');
  const dayModalInstance = mdb.Modal.getInstance(dayModal);
  dayModalInstance.hide(); // daySelectionModal만 닫음
  // exampleModal은 닫지 않음 (기존 상태 유지)
});

// 초기 참조 설정
let timerRef = document.querySelector(".timer-display"); // 타이머 디스플레이
const alarmNameInput = document.getElementById("alarmNameInput"); // 알람 이름 입력 필드
const hourInput = document.getElementById("hourInput"); // 시간 입력 필드
const minuteInput = document.getElementById("minuteInput"); // 분 입력 필드
const activeAlarms = document.querySelector(".activeAlarms"); // 활성 알람 표시 구역
const setAlarm = document.getElementById("set"); // 알람 설정 버튼
let alarmsArray = []; // 알람 객체를 저장할 배열
let alarmIndex = 0; // 알람 인덱스
// 요일 배열 (전체 요일)
const allDays = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];

// 한 자리 숫자 앞에 0 추가
const appendZero = (value) => (value < 10 ? "0" + value : value);

// 객체에서 값 검색
const searchObject = (parameter, value) => {
  let alarmObject, objIndex, exists = false; // 존재 여부 및 객체 초기화
  alarmsArray.forEach((alarm, index) => {
      if (alarm[parameter] == value) {
          exists = true;
          alarmObject = alarm;
          objIndex = index;
          return false; // 검색 중단
      }
  });
  return [exists, alarmObject, objIndex]; // 존재 여부, 객체, 인덱스 반환
};

// 타이머 표시 함수
function displayTimer() {
  let date = new Date(); // 현재 날짜 및 시간
  let [hours, minutes, seconds] = [
      appendZero(date.getHours()), // 시
      appendZero(date.getMinutes()), // 분
      appendZero(date.getSeconds()), // 초
  ];

  // 시간 표시
  timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;

  // 알람 확인 및 재생
  alarmsArray.forEach((alarm) => {
      if (alarm.isActive && `${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`) {
          // alert을 사용하여 알람 알림 표시
          alert(`알람: ${alarm.alarmHour}:${alarm.alarmMinute} 알약 복용시간입니다!`);
          alarm.isActive = false; // 알람 비활성화
      }
  });
}

// 입력값 체크 함수
const inputCheck = (inputValue) => {
  inputValue = parseInt(inputValue); // 입력값을 정수로 변환
  return appendZero(inputValue < 10 ? inputValue : inputValue); // 10보다 작으면 0 추가
};

hourInput.addEventListener("input", () => {
  hourInput.value = inputCheck(hourInput.value); // 시간 입력 시 체크
});

minuteInput.addEventListener("input", () => {
  minuteInput.value = inputCheck(minuteInput.value); // 분 입력 시 체크
});

// 알람 div 생성 함수
const createAlarm = (alarmObj) => {
  const { id, alarmHour, alarmMinute, alarmName, alarmDays } = alarmObj; // 알람 객체의 키

  let alarmDiv = document.createElement("div"); // 새로운 div 생성
  alarmDiv.classList.add("alarm"); // 클래스 추가
  alarmDiv.setAttribute("data-id", id); // 데이터 속성 설정

  // 모든 요일이 선택되면 "매일"로 표시, 그렇지 않으면 선택된 요일 표시
  let daysText;
  if (alarmDays.length === allDays.length && allDays.every(day => alarmDays.includes(day))) {
      daysText = '매일'; // 모든 요일이 선택된 경우
  } else if (alarmDays.length > 0) {
      daysText = `(<span style="font-size: 0.8em;">${alarmDays.join(', ')}</span>)`; // 선택된 요일만 표시
  } else {
      daysText = ''; // 요일이 선택되지 않은 경우
  }

  alarmDiv.innerHTML = `<span class="span">${alarmName}<br>${alarmHour}:${alarmMinute}<br>${daysText}</span>`; // 알람 시간과 요일 표시
  // 체크박스 생성
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox"); // 체크박스 타입 설정
  checkbox.addEventListener("click", (e) => {
      if (e.target.checked) {
          startAlarm(e); // 알람 시작
      } else {
          stopAlarm(e); // 알람 중지
      }
  });
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);

  alarmDiv.appendChild(checkbox); // div에 체크박스 추가
  activeAlarms.appendChild(alarmDiv); // 활성 알람에 추가

  const spans = document.querySelectorAll(".span");
  const closeButton = modalElement.querySelector('#dismiss');
  closeButton.addEventListener('click', () => {
    modalInstance.hide();
  });
  
  // 각 span 요소에 클릭 이벤트 추가
  spans.forEach((span) => {
    if (!span.dataset.clicked) {
      span.addEventListener("click", () => {
        const parentDiv = span.parentElement; 
        const dataId = parentDiv.dataset.id;
        const alarm = getAlarmById(dataId);
        console.log(alarm);
        alarmNameInput.value = alarm.alarmName;
        hourInput.value = alarm.alarmHour;
        minuteInput.value = alarm.alarmMinute;
        modalInstance.show(); // 모달 열기
        const confirmButton = modalElement.querySelector('#confirm');
        confirmButton.removeEventListener('click', confirmAddClickHandler);
        confirmButton.removeEventListener('click', handleConfirmClick);
        handleConfirmClick = () => {
          confirmSpanClickHandler(span, alarm);
        };
        // 새로운 이벤트 리스너 추가
        confirmButton.addEventListener('click', handleConfirmClick);

      });

      // 클릭 이벤트가 추가되었음을 표시
      span.dataset.clicked = "true";
    }
  });
  
};

function modifyAlarm(span, alarmObj) {
  let daysText;
  if (alarmObj.alarmDays.length === allDays.length && allDays.every(day => alarmObj.alarmDays.includes(day))) {
      daysText = '매일'; // 모든 요일이 선택된 경우
  } else if (alarmObj.alarmDays.length > 0) {
      daysText = `(<span style="font-size: 0.8em;">${alarmDays.join(', ')}</span>)`; // 선택된 요일만 표시
  } else {
      daysText = ''; // 요일이 선택되지 않은 경우
  }
  span.innerHTML = `${alarmObj.alarmName}<br>${alarmObj.alarmHour}:${alarmObj.alarmMinute}<br>${daysText}`; // 알람 시간과 요일 표시
  // 체크박스 생성
  console.log(span);
};

// 알람 설정 함수
const setAlarmFunction = () => {
  let hour = parseInt(hourInput.value); // 입력된 시간
  if (isNaN(hour)) {
    hour = 0;
  }
  let minute = parseInt(minuteInput.value); // 입력된 분
  if (isNaN(minute)) {
    minute = 0;
  }
  const alarmName = document.getElementById('alarmNameInput').value; // 알람 이름 입력값
  const selectedDays = Array.from(document.getElementById('alarmDays').selectedOptions)
                            .map(option => option.text); // 선택된 요일 가져오기

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || !alarmName) {
      alert("올바른 시간을 입력하세요."); // 유효성 검사
      return;
  }

  // 알람 객체 생성
  const alarmObj = {
      id: alarmIndex++,
      alarmHour: appendZero(hour),
      alarmMinute: appendZero(minute),
      alarmName: alarmName, // 알람 이름 추가
      alarmDays: selectedDays,  // 요일 정보 추가
      isActive: true,
  };

  alarmsArray.push(alarmObj); // 배열에 추가
  createAlarm(alarmObj); // 알람 표시 생성
  alarmNameInput.value = "";  // 입력 필드 초기화
  hourInput.value = ""; // 입력 필드 초기화
  minuteInput.value = ""; // 입력 필드 초기화
  modalInstance.hide(); // 모달 닫기
};

// 알람 찾기 함수
const getAlarmById = (id) => {
  const alarm = alarmsArray.find(alarm => alarm.id == id);
  if (alarm) {
      return {
          alarmName: alarm.alarmName,
          alarmHour: alarm.alarmHour,
          alarmMinute: alarm.alarmMinute,
          alarmDays: alarm.alarmDays, // 필요한 다른 속성도 추가
      };
  } else {
      return null; // 알람을 찾지 못한 경우
  }
};

// 알람 시작 함수
const startAlarm = (event) => {
  const alarmId = event.target.closest(".alarm").getAttribute("data-id"); // 알람 ID 가져오기
  const [exists, alarmObject] = searchObject("id", parseInt(alarmId)); // 객체 검색
  if (exists) {
      alarmObject.isActive = true; // 알람 활성화
      alert(`알람 ${alarmObject.alarmHour}:${alarmObject.alarmMinute} 설정되었습니다.`);
  }
};

// 알람 중지 함수
const stopAlarm = (event) => {
  const alarmId = event.target.closest(".alarm").getAttribute("data-id"); // 알람 ID 가져오기
  const [exists, alarmObject] = searchObject("id", parseInt(alarmId)); // 객체 검색
  if (exists) {
      alarmObject.isActive = false; // 알람 비활성화
      alert(`알람 ${alarmObject.alarmHour}:${alarmObject.alarmMinute} 해제되었습니다.`);
  }
};

// 매초마다 타이머 표시 및 알람 체크
setInterval(displayTimer, 1000); // 1초마다 호출


//delete alarm
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists] = searchObject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.remove();
    alarmsArray = alarmsArray.filter(alarm => alarm.id !== searchId);
  }
};
