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

int ledPin1 = D2;
int ledPin2 = A7;

Servo servo1;
Servo servo2;
int servoMotor1 = D9;
int servoMotor2 = D5;
int posDegrees1 = 0;
int posDegrees2 = 0;

int sensor1 = D6;
int sensor2 = A3;

int pastId = -1;
struct AlarmData {
  int pillA;
  int pillB;
  int pillC;
  int pillD;
  String lcdPrint;
  int alarmHour;
  int alarmMinute;
};
AlarmData pastAlarmData = {-1, -1, -1, -1, "", -1, -1};  // 과거 알람 데이터 초기화

LiquidCrystal_I2C lcd(0x27, 16, 2);

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0, 3600);  // NTP 서버와 UTC +1 시간대 설정

//////////////////////////////////////////////////////////////////////////

const char* ssid = "skyiptimeFC05"; //와이파이 이름
const char* password = "skylifec05"; //와이파이 비번
const char* serverUrl = "http://192.168.0.21:80/ino/test";  // Node.js 서버의 IP와 포트를 정확히 설정
// "http://<node가 실행되는 컴퓨터 IP>:<node로 열린 포트(80)>/(주소)";
const char* serverUrl2 = "http://192.168.0.21:80/ino/test2";  // Node.js 서버의 IP와 포트를 정확히 설정


void setup() {
  Serial.begin(9600);
  pinMode(ledPin1, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(sensor1, INPUT);
  pinMode(sensor2, INPUT);
  servo1.attach(servoMotor1);
  servo1.write(0);
  servo2.attach(servoMotor2);
  servo2.write(0);

  Wire.begin(21,22); /////
  lcd.begin(16, 2);
  lcd.backlight();
  lcd.setCursor(0,0);
  lcd.print("Hello");

  lcd.setCursor(0,1);
  lcd.print("!!!!");
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

// LCD 출력 함수
void displayLCD(String lcdPrint) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(lcdPrint);
}

// 서보 모터 동작 함수
void moveServo(Servo& servo, int pillCount) {
  for (int i = 0; i < pillCount; i++) {
    servo.write(90);
    delay(500);  // 서보 모터 동작 시간
    servo.write(0);
    delay(500);  // 서보 모터 대기 시간
  }
}

void loop() {
  timeClient.update();  // 시간 동기화

  // 현재 시간 가져오기
  unsigned long epochTime = timeClient.getEpochTime();
  int currentHour = (epochTime / 3600 + 9) % 24;
  int currentMinute = (epochTime / 60) % 60;  // 분
  
  // 센서
  int sensorVal1 = digitalRead(sensor1);
  int sensorVal2 = digitalRead(sensor2);
  if (sensorVal1 == HIGH) {
    digitalWrite(ledPin1, HIGH);
  } else {
    digitalWrite(ledPin1, LOW);
  }
  if (sensorVal2 == HIGH) {
    digitalWrite(ledPin2, HIGH);
  } else {
    digitalWrite(ledPin2, LOW);
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
        String lcdPrint = doc["LCD"];  // JSON에서 LCD 값 추출
        int alarmHour = doc["alarmHour"];  // JSON에서 alarmTime 값 추출
        int alarmMinute = doc["alarmMinute"];  // JSON에서 alarmTime 값 추출
        // 값 출력
        Serial.print("pillA: ");
        Serial.println(pillA);
        Serial.print("pillB: ");
        Serial.println(pillB);
        Serial.print("lcdPrint: ");
        Serial.println(lcdPrint);

        ///
        // ID가 동일하더라도 알람 내용이 다르면 작동
        if (id == pastId) {
          // 알람 내용이 달라졌다면, 동작을 새로 실행
          if (pillA != pastAlarmData.pillA || pillB != pastAlarmData.pillB || pillC != pastAlarmData.pillC || pillD != pastAlarmData.pillD || alarmHour != pastAlarmData.alarmHour || alarmMinute != pastAlarmData.alarmMinute) {
            if (alarmHour == currentHour && alarmMinute == currentMinute) {
              // 기존 알람 데이터를 새 데이터로 갱신
              pastAlarmData = {pillA, pillB, pillC, pillD, lcdPrint, alarmHour, alarmMinute};

              // LCD 출력 및 서보 모터 동작
              displayLCD(lcdPrint);

              moveServo(servo1, pillA);  // pillA에 해당하는 서보 모터 동작
              moveServo(servo2, pillB);  // pillB에 해당하는 서보 모터 동작
            }
          }
        }
        // ID가 다른 경우
        else {
          if (alarmHour == currentHour && alarmMinute == currentMinute) {
            // 새 알람이므로 기존 알람 데이터를 갱신하고, 동작을 시작
            pastId = id;
            pastAlarmData = {pillA, pillB, pillC, pillD, lcdPrint, alarmHour, alarmMinute};

            // LCD 출력 및 서보 모터 동작
            displayLCD(lcdPrint);

            moveServo(servo1, pillA);  // pillA에 해당하는 서보 모터 동작
            moveServo(servo2, pillB);  // pillB에 해당하는 서보 모터 동작
          }
        }
      } else {
        Serial.println("POST2 요청 실패, 에러 코드: " + String(httpResponseCode));
      }
      http.end();  // HTTP 연결 종료
    }
  }
}