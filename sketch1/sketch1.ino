#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>  // JSON 처리를 위한 라이브러리
#include <Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "esp_wpa2.h" // WPA2 Enterprise 연결에 필요한 라이브러리 (ESP32에서만 사용 가능)



int ledPin1 = A3;
int ledPin2 = A7;
int ledPin3 = D2;
int ledPin4 = A6;
int servoMotor = D9;
int posDegrees = 0;
int sensor = D3;
Servo servo;
LiquidCrystal_I2C lcd(0x27, 16, 2);

// const char* ssid = "eduroam";             // Wi-Fi 이름
// #define EAP_ID "iop0512"                  // ID (학번 또는 사용자 ID)
// #define EAP_USERNAME "iop0512"            // 사용자 이름 (ID와 같을 수도 있음)
// #define EAP_PASSWORD "!munasun0913"       // 비밀번호

// const char* ssid = "eduroam"; //와이파이 이름
// const char* password = ""; //와이파이 비번
const char* serverUrl = "http://192.168.5.103:80/ino/test";  // Node.js 서버의 IP와 포트를 정확히 설정
// "http://<node가 실행되는 컴퓨터 IP>:<node로 열린 포트(80)>/(주소)";
const char* serverUrl2 = "http://192.168.5.103:80/ino/test2";  // Node.js 서버의 IP와 포트를 정확히 설정


unsigned long previousMillis = 0;  // 타이머 변수
const long interval = 5000;  // 5초 간격

void setup() {
  pinMode(ledPin1, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(ledPin3, OUTPUT);
  pinMode(ledPin4, OUTPUT);
  Serial.begin(9600);
  servo.attach(servoMotor);
  pinMode(sensor, INPUT);
  servo.write(0);
  Wire.begin(21,22); /////
  lcd.begin(16, 2);
  lcd.backlight();

  lcd.setCursor(0,0);
  lcd.print("Hello");

  lcd.setCursor(0,1);
  lcd.print("!!!!");
  /////////////////////////////////
  // WPA2 Enterprise 설정
  WiFi.disconnect(true);                  // 이전 Wi-Fi 설정 초기화
  WiFi.mode(WIFI_STA);                    // Wi-Fi를 스테이션 모드로 설정
  
  // esp_wifi_sta_wpa2_ent_set_identity((uint8_t *)EAP_ID, strlen(EAP_ID));          // ID 설정
  // esp_wifi_sta_wpa2_ent_set_username((uint8_t *)EAP_USERNAME, strlen(EAP_USERNAME)); // 사용자 이름 설정
  // esp_wifi_sta_wpa2_ent_set_password((uint8_t *)EAP_PASSWORD, strlen(EAP_PASSWORD)); // 비밀번호 설정
  // esp_wifi_sta_wpa2_ent_enable();         // WPA2 엔터프라이즈 활성화

  // WiFi.begin(ssid);                       // Wi-Fi 시작


  // while (WiFi.status() != WL_CONNECTED) {
  //   delay(1000);
  //   Serial.println("WiFi 연결 중...");
  // }
  // Serial.println("WiFi 연결 완료!");
}

void loop() {
  digitalWrite(ledPin1, HIGH);
  digitalWrite(ledPin2, HIGH);
  digitalWrite(ledPin3, HIGH);
  digitalWrite(ledPin4, HIGH);
  int sensorVal = digitalRead(sensor);
  if (sensorVal == HIGH) {
    servo.write(90);
  } else {
    servo.write(0);
  }
  if (Serial.available() > 0){
    String inData = Serial.readString();
    lcd.setCursor(0,0);
    lcd.print(inData);
  }
  // 5초마다 POST 요청 전송
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      // JSON 형식으로 데이터 생성
      String jsonData = "{\"sensorVal\": " + String(sensorVal) + "}";

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
        
        float temperature = doc["temperature"];  // JSON에서 temperature 값 추출
        float humidity = doc["humidity"];  // JSON에서 humidity 값 추출

        // 값 출력
        Serial.print("Temperature: ");
        Serial.println(temperature);
        Serial.print("Humidity: ");
        Serial.println(humidity);
      } else {
        Serial.println("POST 요청 실패, 에러 코드: " + String(httpResponseCode));
      }

      http.end();  // HTTP 연결 종료
    }
  }
}