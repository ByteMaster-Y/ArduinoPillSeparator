#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>  // JSON 처리를 위한 라이브러리
#include <Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

unsigned long previousMillis = 0;  // 타이머 변수
const long interval = 5000;  // 5초 간격

int ledPin3 = D9;
int ledPin4 = D8;

Servo servo3;
Servo servo4;
int servoMotor3 = D6;
int servoMotor4 = D7;
int posDegrees3 = 0;
int posDegrees4 = 0;

int sensor3 = A6;
int sensor4 = A7;

int pastId = -1;
struct AlarmData {
  int pillA;
  int pillB;
  int pillC;
  int pillD;
  int alarmHour;
  int alarmMinute;
};
AlarmData pastAlarmData = {-1, -1, -1, -1, -1, -1};  // 과거 알람 데이터 초기화

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0, 3600);  // NTP 서버와 UTC +1 시간대 설정

//////////////////////////////////////////////////////////////////////////

const char* ssid = "Galaxy Z Flip5 1418"; //와이파이 이름
const char* password = "09170917"; //와이파이 비번
// "http://<node가 실행되는 컴퓨터 IP>:<node로 열린 포트(80)>/(주소)";
const char* serverUrl2 = "http://192.168.48.251:80/ino/test2";  // Node.js 서버의 IP와 포트를 정확히 설정

void setup() {
  Serial.begin(9600);
  pinMode(ledPin3, OUTPUT);
  pinMode(ledPin4, OUTPUT);
  pinMode(sensor3, INPUT);
  pinMode(sensor4, INPUT);
  servo3.attach(servoMotor3);
  servo3.write(0);
  servo4.attach(servoMotor4);
  servo4.write(0);
  /////////////////////////////////
  WiFi.disconnect(true);                  // 이전 Wi-Fi 설정 초기화
  WiFi.mode(WIFI_STA);                    // Wi-Fi를 스테이션 모드로 설정
  WiFi.begin(ssid, password);                       // Wi-Fi 시작

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("WiFi 연결 중...");
  }
  Serial.println("WiFi 연결 완료!");
}

// 서보 모터 동작 함수
void moveServo(Servo& servo, int pillCount) {
  for (int i = 0; i < pillCount; i++) {
    // servo.write(45);
    // delay(200);  // 서보 모터 동작 시간

    servo.write(70);
    delay(50);  // 서보 모터 동작 시간
    servo.write(0);
    delay(50);  // 서보 모터 대기 시간
  }
}

void loop() {
  timeClient.update();  // 시간 동기화

  // 현재 시간 가져오기
  unsigned long epochTime = timeClient.getEpochTime();
  int currentHour = (epochTime / 3600 + 9) % 24;
  int currentMinute = (epochTime / 60) % 60;  // 분
  
  // 센서
  int sensorVal3 = digitalRead(sensor3);
  int sensorVal4 = digitalRead(sensor4);
  if (sensorVal3 == HIGH) {
    digitalWrite(ledPin3, HIGH);
  } else {
    digitalWrite(ledPin3, LOW);
  }
  if (sensorVal4 == HIGH) {
    digitalWrite(ledPin4, HIGH);
  } else {
    digitalWrite(ledPin4, LOW);
  }

  ///////////////////////////////////////////////////////
  
  // 5초마다 POST 요청 전송
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    //////////////////////////////////////////////////////////////////

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl2);  // 서버 URL 설정
      http.addHeader("Content-Type", "application/json");

      // JSON 형식으로 데이터 생성 (서버에 보내는 데이터)
      String jsonData2 = "{\"requestData\": \"ESP32 요청 데이터\"}";

      // POST 요청 보내기
      int httpResponseCode = http.POST(jsonData2);

      if (httpResponseCode > 0) {
        String payload = http.getString();  // 응답 데이터 받기
        Serial.println("서버 응답: " + payload);

        // JSON 응답 파싱
        DynamicJsonDocument doc(1024);
        deserializeJson(doc, payload);

        int id = doc["id"];  // JSON에서 id 값 추출
        int pillA = doc["pillA"];  // JSON에서 pillA 값 추출
        int pillB = doc["pillB"];  // JSON에서 pillB 값 추출
        int pillC = doc["pillC"];  // JSON에서 pillC 값 추출
        int pillD = doc["pillD"];  // JSON에서 pillD 값 추출
        int alarmHour = doc["alarmHour"];  // JSON에서 alarmTime 값 추출
        int alarmMinute = doc["alarmMinute"];  // JSON에서 alarmTime 값 추출
        // 값 출력
        Serial.print("pillC: ");
        Serial.println(pillC);
        Serial.print("pillD: ");
        Serial.println(pillD);
         ///
        // ID가 동일하더라도 알람 내용이 다르면 작동
        if (id == pastId) {
          // 알람 내용이 달라졌다면, 동작을 새로 실행
          if (pillA != pastAlarmData.pillA || pillB != pastAlarmData.pillB || pillC != pastAlarmData.pillC || pillD != pastAlarmData.pillD || alarmHour != pastAlarmData.alarmHour || alarmMinute != pastAlarmData.alarmMinute) {
            if (alarmHour == currentHour && alarmMinute == currentMinute) {
              // 기존 알람 데이터를 새 데이터로 갱신
              pastAlarmData = {pillA, pillB, pillC, pillD, alarmHour, alarmMinute};

              moveServo(servo3, pillC);  // pillA에 해당하는 서보 모터 동작
              moveServo(servo4, pillD);  // pillB에 해당하는 서보 모터 동작
            }
          }
        }
        // ID가 다른 경우
        else {
          if (alarmHour == currentHour && alarmMinute == currentMinute) {
            // 새 알람이므로 기존 알람 데이터를 갱신하고, 동작을 시작
            pastId = id;
            pastAlarmData = {pillA, pillB, pillC, pillD, alarmHour, alarmMinute};

            moveServo(servo3, pillC);  // pillA에 해당하는 서보 모터 동작
            moveServo(servo4, pillD);  // pillB에 해당하는 서보 모터 동작
          }
        }
      } else {
        Serial.println("POST 요청 실패, 에러 코드: " + String(httpResponseCode));
      }
      http.end();  // HTTP 연결 종료
    }
  }
}
