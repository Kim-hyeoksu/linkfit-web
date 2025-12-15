# 링크핏 LinkFit

<div align="center">
<img width="200" alt="image" src="https://github.com/goldpension/front/assets/70899438/9de207d9-d563-4642-88fe-3c5a20431c38">
</div>

링크핏은 헬스장과 고객, 고객과 고객을 연결하여 피트니스 경험을 한층 더 풍부하게 만드는 웹/앱 서비스입니다. PT 운동 기록, 커뮤니티 활동, 헬스장 정보 조회 등 피트니스의 모든 것을 담은 디지털 공간입니다.

이 깃허브 주소는 LinkFit의 **프론트엔드** 부분 만을 내포하고 있습니다.

**현재 개발중인 프로젝트입니다!!**

## 멤버 소개

- 김혁수 : 프론트엔드
- 정은선 : 백엔드
- 김재연 : 기획 및 디자인

## 프로젝트 소개

> **PT 운동 기록, 커뮤니티 활동, 헬스장 정보 조회 등 피트니스의 모든 것을 담은 모바일 앱서비스** <br/> **개발기간: 2025.07 ~ 진행중**

링크핏은 헬스장과 고객, 그리고 고객 개개인 간의 활발한 소통과 연결을 목표로 하는 혁신적인 헬스케어 웹/앱 서비스입니다! 트레이너와 회원의 PT 운동 기록 관리부터 함께 운동하며 동기 부여를 얻는 커뮤니티 활동까지, 사용자들의 건강한 피트니스 라이프를 더욱 스마트하고 즐겁게 만들어 줄 모든 것을 제공합니다.

#### Oegaein is a mobile-exclusive web service designed specifically for students at the Hankuk University of Foreign Studies Global Campus.

## 설치 방법

### Requirements

For building and running the application you need:

- [Node.js 16.17.0](https://nodejs.org/ca/blog/release/v16.17.0/)
- [Npm 9.6.4](https://www.npmjs.com/package/npm/v/9.6.4)

### Installation

```bash
$ git clone https://github.com/oegaein/front.git
$ cd front
$ npm install
$ npm start
```

## 기술 스택

### Environment

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)

### Config

![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

### Development

![JavaScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Query](https://img.shields.io/badge/Reactquery-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-3578E5?style=for-the-badge&logo=Zustand&logoColor=white)
![tailwindcss](https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=mui&logoColor=61DAFB)
![styledcomponents](https://img.shields.io/badge/styledcomponents-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![vitest](https://img.shields.io/badge/vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

### Communication

![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white)
![GoogleMeet](https://img.shields.io/badge/GoogleMeet-00897B?style=for-the-badge&logo=Google%20Meet&logoColor=white)

---

## 주요 기능

- 맞춤형 PT 기록 관리 및 개인 운동 기록: 트레이너와 회원이 쉽고 효율적으로 PT 운동 기록을 관리하고, 나의 성장 과정을 한눈에 확인할 수 있습니다. 개인 운동 기록도 가능합니다.
- 스마트 식단 관리: 식단 기록 및 분석 기능으로, 매일 섭취하는 칼로리와 영양소를 간편하게 기록하고 관리할 수 있습니다. 개인 목표에 맞는 식단 추천과 건강한 레시피까지 제공하여 식단 관리를 더욱 쉽고 즐겁게 만들어 드립니다.
- 활발한 헬스장 커뮤니티: 헬스장 내에서 자유롭게 정보를 공유하고, 운동 꿀팁을 나누며 함께 성장할 수 있는 커뮤니티 공간을 제공합니다.
- 헬스장 정보 조회: 주변 헬스장의 상세 정보, 운영 시간, 시설 등을 편리하게 탐색하고 비교하여 나에게 딱 맞는 헬스장을 찾을 수 있습니다.
- 간편한 소셜 로그인: 구글, 카카오, 네이버 등 자주 사용하는 계정으로 손쉽게 로그인하여 서비스를 이용할 수 있어 접근성이 뛰어납니다.

---

## 아키텍쳐

### 디렉토리 구조

- 링크핏은 대규모 프론트엔드 프로젝트의 효율성과 유지보수성을 극대화하기 위해 FSD (Feature-Sliced Design) 아키텍처 방법론을 적용하여 개발되었습니다.
  그동안 페이지에 국한되어 개발되던 컴포넌트와 기능들의 한계를 넘어, 이제는 FSD의 핵심인 엔터티 기반 구성 원칙을 통해 프로젝트의 각 요소를 독립적인 의미 단위로 관리하고 재사용성을 극대화했습니다. 이로써 더욱 견고하고 확장 가능한 아키텍처를 구축하여 개발 생산성 향상 및 안정적인 서비스 제공을 목표로 합니다.

```bash
front
├── README.md
├── package-lock.json
├── package.json
├── public
└── src
    ├── app
    ├── entities
    ├── features
    ├── widgets
    ├── shared
    ├── assets
    ├── components
    ├── constants
    ├── mocks
    ├── store
    └── index.js
...
```
