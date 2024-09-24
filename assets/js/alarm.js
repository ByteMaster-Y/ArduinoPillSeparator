// 초기 참조 설정
let timerRef = document.querySelector(".timer-display"); // 타이머 디스플레이
const hourInput = document.getElementById("hourInput"); // 시간 입력 필드
const minuteInput = document.getElementById("minuteInput"); // 분 입력 필드
const activeAlarms = document.querySelector(".activeAlarms"); // 활성 알람 표시 구역
const setAlarm = document.getElementById("set"); // 알람 설정 버튼
let alarmsArray = []; // 알람 객체를 저장할 배열
// let alarmSound = new Audio("./alarm.mp3"); // 알람 소리

let initialHour = 0, // 초기 시간
  initialMinute = 0, // 초기 분
  alarmIndex = 0; // 알람 인덱스

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
      // alarmSound.play(); // 알람 소리 재생 (필요한 경우 주석 해제)
      // alarmSound.loop = true; // 알람 소리 반복 재생 (필요한 경우 주석 해제)
      alarm.isActive = false; // **알람 비활성화** (추가된 부분)
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
  const { id, alarmHour, alarmMinute } = alarmObj; // 알람 객체의 키
  let alarmDiv = document.createElement("div"); // 새로운 div 생성
  alarmDiv.classList.add("alarm"); // 클래스 추가
  alarmDiv.setAttribute("data-id", id); // 데이터 속성 설정
  alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMinute}</span>`; // 알람 시간 표시

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
  alarmDiv.appendChild(checkbox); // 체크박스 추가

  // 삭제 버튼 생성
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`; // 아이콘 추가
  deleteButton.classList.add("deleteButton"); // 클래스 추가
  deleteButton.addEventListener("click", (e) => deleteAlarm(e)); // 삭제 이벤트 리스너 추가
  alarmDiv.appendChild(deleteButton); // 삭제 버튼 추가
  activeAlarms.appendChild(alarmDiv); // 활성 알람 구역에 추가
};

// 알람 설정 함수
const setAlarmFunction = () => {
  // 알람의 최대 개수 제한
  if (alarmsArray.length >= 4) {
    alert("최대 4개의 알람만 설정할 수 있습니다."); // 경고 메시지
    return; // 추가 작업 중단
  }

  alarmIndex += 1; // 알람 인덱스 증가

  // 알람 객체 생성
  let alarmObj = {
    id: `${alarmIndex}_${hourInput.value}_${minuteInput.value}`, // 알람 ID
    alarmHour: hourInput.value, // 알람 시간
    alarmMinute: minuteInput.value, // 알람 분
    isActive: false, // 알람 활성화 상태
  };
  
  alarmsArray.push(alarmObj); // 알람 배열에 추가
  createAlarm(alarmObj); // 알람 생성

  // 입력 필드 초기화
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);

  // 알람 개수에 따라 버튼 상태 변경
  toggleAddButton();
};

// 알람 시작 함수
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id"); // 부모 요소의 ID 검색
  let [exists, obj, index] = searchObject("id", searchId); // 객체 검색
  if (exists) {
    alarmsArray[index].isActive = true; // 알람 활성화
  }
};

// 알람 중지 함수
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id"); // 부모 요소의 ID 검색
  let [exists, obj, index] = searchObject("id", searchId); // 객체 검색
  if (exists) {
    alarmsArray[index].isActive = false; // 알람 비활성화
    // alarmSound.pause(); // 알람 소리 정지 (필요한 경우 주석 해제)
  }
};

// 알람 삭제 함수
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id"); // ID 검색
  let [exists, obj, index] = searchObject("id", searchId); // 객체 검색
  if (exists) {
    e.target.parentElement.parentElement.remove(); // DOM에서 제거
    alarmsArray.splice(index, 1); // 배열에서 삭제
    toggleAddButton(); // 버튼 상태 업데이트
  }
};

// 알람 추가 버튼 상태 변경 함수
const toggleAddButton = () => {
  setAlarm.disabled = alarmsArray.length >= 4; // 버튼 상태 변경
};

// 페이지 로드 시 초기 상태 설정
window.onload = () => {
  setInterval(displayTimer); // 타이머 갱신
  hourInput.value = appendZero(initialHour); // 시간 필드 초기화
  minuteInput.value = appendZero(initialMinute); // 분 필드 초기화
  setAlarm.addEventListener("click", setAlarmFunction); // 알람 설정 이벤트 리스너 등록
  toggleAddButton(); // 초기 버튼 상태 설정
};
