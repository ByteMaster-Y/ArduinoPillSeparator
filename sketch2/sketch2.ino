#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>  // JSON 처리를 위한 라이브러리
#include <Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

unsigned long previousMillis = 0;  // 타이머 변수
const long interval = 5000;  // 5초 간격

int ledPin3 = D2;
int ledPin4 = A6;

Servo servo3;
Servo servo4;
int servoMotor3 = D9;
int servoMotor4 = D9;
int posDegrees3 = 0;
int posDegrees4 = 0;

int sensor3 = D3;
int sensor4 = D3;

int pastId = -1;

//////////////////////////////////////////////////////////////////////////

// const char* ssid = "eduroam"; //와이파이 이름
// const char* password = ""; //와이파이 비번
const char* serverUrl = "http://192.168.5.103:80/ino/test";  // Node.js 서버의 IP와 포트를 정확히 설정
// "http://<node가 실행되는 컴퓨터 IP>:<node로 열린 포트(80)>/(주소)";
const char* serverUrl2 = "http://192.168.5.103:80/ino/test2";  // Node.js 서버의 IP와 포트를 정확히 설정

void setup() {
  Serial.begin(9600);
  pinMode(ledPin1, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(sensor1, INPUT);
  pinMode(sensor2, INPUT);
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
}

void loop() {
  unsigned long readTime = millis()/1000;
  int min = (readTime/60)%60;
  int hour = (readTime/(60*60))%24;

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
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      // JSON 형식으로 데이터 생성
      String jsonData = "{\"sensorVa3\": " + String(sensorVal3) + ", \"sensorVa4\": " + String(sensorVal4) + "}";

      // POST 요청 전송
      int httpResponseCode = http.POST(jsonData);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("서버 응답: " + response);
      } else {
        Serial.println("POST 요청 실패, 에러 코드: " + String(httpResponseCode));
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
        int pillA = doc["C"];  // JSON에서 pillA 값 추출
        int pillB = doc["D"];  // JSON에서 pillB 값 추출
        int alarmTime = doc["alarmTime"];  // JSON에서 alarmTime 값 추출
        // 값 출력
        Serial.print("pillC: ");
        Serial.println(pillC);
        Serial.print("pillD: ");
        Serial.println(pillD);
        /// 
        if (alarmHour == hour && alarmMinute == min && pastId != id) {
          pastId = id
          for (int i = 0, pillC, i++) {
            servo3.write(90);
            delay(500);
            servo3.write(0);
          }
          for (int j = 0, pillD, j++) {
            servo4.write(90);
            delay(500);
            servo4.write(0);
          }
        }
      } else {
        Serial.println("POST 요청 실패, 에러 코드: " + String(httpResponseCode));
      }
      http.end();  // HTTP 연결 종료
    }
  }
}
