# ArduinoPillSorter

Arduino 기반의 알약 분리기로, 사용자가 모바일 앱을 통해 알약 배출 시간을 설정할 수 있습니다. 이 기기는 알약을 자동으로 분리하고 배출하여 복약 관리를 편리하게 도와줍니다.

## 시연영상

[시연영상 링크](https://example.com)  

## 개발

이 프로젝트는 여러 명이이 협력하여 개발되었습니다. 개발 과정에서 사용된 기술 스택과 개발 방법론에 대한 정보는 아래에서 확인할 수 있습니다.

## 사용 기술

- **Arduino**: 하드웨어 제어를 위한 기본 플랫폼.
- **Servo 모터**: 알약을 분리하는 역할을 수행합니다.
- **RTC 모듈**: 실시간 시계를 통해 알약 배출 시간을 정확히 맞추는 데 사용됩니다.
- **Bluetooth 모듈**: 모바일 앱과 Arduino 간의 통신을 담당합니다.
- **모바일 앱**: 사용자 인터페이스 및 설정 관리.

## 프로젝트 목적

이 프로젝트의 목적은 복약 관리를 효율적으로 돕기 위해 자동 알약 분리기를 개발하는 것입니다. 사용자 맞춤형 복약 일정을 설정하고 관리할 수 있어, 복약을 보다 편리하게 할 수 있도록 지원합니다.

## 프로젝트 개발배경

현대인의 바쁜 생활 속에서 약 복용을 잊기 쉬운 경우가 많습니다. 이를 해결하기 위해, 사용자가 쉽게 알약 복용 시간을 설정하고 관리할 수 있는 자동화된 솔루션이 필요했습니다. 이 프로젝트는 이러한 필요를 충족하기 위해 시작되었습니다.

## Prototype

프로토타입은 기본적인 알약 분리 기능을 제공하며, 실시간 시계 모듈과 서보 모터를 사용하여 설정된 시간에 맞춰 알약을 배출합니다. 프로토타입 개발 과정에서 사용된 주요 부품과 회로도는 다음과 같습니다:

- **서보 모터**: 알약을 분리하는 메커니즘.
- **RTC 모듈**: 정확한 시간 유지 및 알약 배출 타이밍 설정.
- **Bluetooth 모듈**: 모바일 앱과의 연결 및 데이터 송수신.

## 주요 기능

- **자동 알약 분리**: 사용자가 설정한 일정에 따라 알약을 분리하고 배출합니다.
- **모바일 앱 연동**: 모바일 앱을 통해 알약 배출 시간을 쉽게 설정하고 관리할 수 있습니다.
- **사용자 맞춤 설정**: 개별 복약 요구에 맞게 설정을 조정할 수 있습니다.

## 설치 방법

1. **레포지토리 클론**:
    ```bash
    git clone https://github.com/your-username/ArduinoPillSorter.git
    ```
2. **필요한 라이브러리 설치**:
    - `Servo`, `RTC` 등 필요한 Arduino 라이브러리를 설치합니다.
3. **코드를 Arduino에 업로드**:
    - Arduino IDE를 엽니다.
    - 올바른 보드와 포트를 선택합니다.
    - 제공된 코드를 Arduino에 업로드합니다.

## 사용 방법

1. **하드웨어 설정**:
    - 제공된 회로도에 따라 알약 분리 기구를 조립합니다.
    - Arduino를 서보 모터, 센서, RTC 모듈 등 필요한 구성 요소에 연결합니다.
2. **모바일 앱 구성**:
    - 해당 모바일 앱을 설치합니다 (링크 제공 예정).
    - 앱을 Bluetooth를 통해 Arduino와 페어링합니다.
    - 알약 배출 일정을 설정합니다.

## 팀원 소개

우리 프로젝트를 함께하는 팀원들을 소개합니다:

**ByteMaster**

- **이메일**: [issacyese5566@gmail.com](mailto:issacyese5566@gmail.com)
- **역할**: 프로젝트 리더 & 모바일 앱 개발
- **소개**: 이 프로젝트의 전반적인 기술 설계를 담당하고 있습니다.

**latteroong**

- **이메일**: [iop0512@naver.com](mailto:iop0512@naver.com)
- **역할**: 모바일 앱 개발
- **소개**: 이 프로젝트의 모바일 프로그래밍을 담당하고 있습니다.

**KDH0908** 

- **이메일**: [fusel010203@gmail.com](mailto:fusel010203@gmail.com)
- **역할**: 아두이노 설계
- **소개**: 이 프로젝트의 하드웨어 설계를 담당하고 있습니다.

**ljhjane**

- **이메일**: [ljhjane@example.com](mailto:ljhjane@example.com) 
- **역할**: 아두이노 설계
- **소개**: 이 프로젝트의 하드웨어 설계를 담당하고 있습니다.

## 라이선스

이 프로젝트는 MIT 라이선스에 따라 라이선스가 부여됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
