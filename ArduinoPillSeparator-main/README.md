# ArduinoPillSorter

Arduino 기반의 알약 분리기로, 사용자가 모바일 앱을 통해 알약 배출 시간을 설정할 수 있습니다. 이 기기는 알약을 자동으로 분리하고 배출하여 복약 관리를 편리하게 도와줍니다.

## 시연영상

[시연영상 링크](https://example.com)  

## 개발

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" style="max-height: 40px;">
  <img src="https://img.shields.io/badge/Flutter-%2302569B.svg?style=for-the-badge&logo=Flutter&logoColor=white" alt="Flutter" style="max-height: 40px;">
  <img src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="Visual Studio Code" style="max-height: 40px;">
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript" style="max-height: 40px;">
  <img src="https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white" alt="C++" style="max-height: 40px;">
</div>

## 사용 기술

- **Arduino**: 하드웨어 제어를 위한 기본 플랫폼.
- **Servo 모터**: 알약을 분리하는 역할을 수행합니다.
- **Bluetooth 모듈**: 모바일 앱과 Arduino 간의 통신을 담당합니다.
- **모바일 앱**: 사용자 인터페이스 및 설정 관리.


## 프로젝트 목적

이 프로젝트의 목적은 복약 관리를 효율적으로 돕기 위해 자동 알약 분리기를 개발하는 것입니다. 사용자 맞춤형 복약 일정을 설정하고 관리할 수 있어, 복약을 보다 편리하게 할 수 있도록 지원합니다.


## 프로젝트 개발배경

현대인의 바쁜 생활 속에서 약 복용을 잊기 쉬운 경우가 많습니다. 이를 해결하기 위해, 사용자가 쉽게 알약 복용 시간을 설정하고 관리할 수 있는 자동화된 솔루션이 필요했습니다. 이 프로젝트는 이러한 필요를 충족하기 위해 시작되었습니다.


## 주요 기능

- **자동 알약 배출**: 사용자가 설정한 일정에 따라 알약을 분리하고 배출합니다.
- **모바일 앱 연동**: 모바일 앱을 통해 알약 배출 시간을 쉽게 설정하고 관리할 수 있습니다.
- **사용자 맞춤 설정**: 개별 복약 요구에 맞게 설정을 조정할 수 있습니다.
- **잔량 확인**: 알약이 비어있을시 LED로 점등할 수 있습니다.

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

## 라이선스

이 프로젝트는 MIT 라이선스에 따라 라이선스가 부여됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
