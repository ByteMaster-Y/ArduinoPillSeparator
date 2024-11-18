#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>  // JSON 처리를 위한 라이브러리
#include <Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <TimeLib.h>
#include <TimeAlarms.h>

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

LiquidCrystal_I2C lcd(0x27, 16, 2);

//////////////////////////////////////////////////////////////////////////

const char* ssid = "Redmi"; //와이파이 이름
const char* password = "12345678"; //와이파이 비번
const char* serverUrl = "http://192.168.14.101:80/ino/test";  // Node.js 서버의 IP와 포트를 정확히 설정
// "http://<node가 실행되는 컴퓨터 IP>:<node로 열린 포트(80)>/(주소)";
const char* serverUrl2 = "http://192.168.14.101:80/ino/test2";  // Node.js 서버의 IP와 포트를 정확히 설정


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

void loop() {
  unsigned long readTime = millis()/1000;
  int min = (readTime/60)%60;
  int hour = (readTime/(60*60))%24;

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
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      // JSON 형식으로 데이터 생성
      String jsonData = "{\"sensorVal\": " + String(sensorVal1) + ", \"sensorVa2\": " + String(sensorVal2) + "}";

      // POST 요청 전송
      int httpResponseCode = http.POST(jsonData);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("서버 응답: " + response);
      } else {
        Serial.println("POST1 요청 실패, 에러 코드: " + String(httpResponseCode));
      }
      
      http.end();
    }

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
        int pillA = doc["A"];  // JSON에서 pillA 값 추출
        int pillB = doc["B"];  // JSON에서 pillB 값 추출
        String lcdPrint = doc["LCD"];  // JSON에서 pillB 값 추출
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
        if (alarmHour == hour && alarmMinute == min && pastId != id) {
          if (lcdPrint.length() > 0) {
            lcd.setCursor(0,0);
            lcd.print(lcdPrint);
          }

          for (int i = 0; pillA; i++) {
            servo1.write(90);
            delay(500);
            servo1.write(0);
          }
          for (int j = 0; pillB; j++) {
            servo2.write(90);
            delay(500);
            servo2.write(0);
          }
        }
      } else {
        Serial.println("POST2 요청 실패, 에러 코드: " + String(httpResponseCode));
      }
      http.end();  // HTTP 연결 종료
    }
  }
}