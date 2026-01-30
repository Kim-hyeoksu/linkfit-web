# Linkfit Frontend Specification (SPEC.md)

## 1. 프로젝트 목표 (Vision)
- **Linkfit**은 사용자가 운동 기록(세트, 무게, 횟수)을 체계적으로 관리하는 **하이브리드 앱**입니다.
- **핵심 아키텍처:** - **Native Shell:** React Native (Webview 컨테이너 역할, 네이티브 기능 담당)
  - **Web Content:** Next.js (실제 UI 및 비즈니스 로직 담당)
- **목표:** 네이티브 앱과 같은 부드러운 사용자 경험(UX)을 제공하며, 웹뷰와 네이티브 간 통신이 매끄러워야 함.

## 2. 기술 스택 (Tech Stack)
### 📱 Mobile (App Shell)
- **Framework:** React Native (CLI or Expo)
- **Language:** TypeScript
- **Bridge:** `react-native-webview` (웹뷰 통신)

### 🌐 Web (WebView Content)
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS v4
- **State Management:** Recoil (향후 필요 시 Zustand 검토)
- **Data Fetching:** Axios (향후 필요 시 React Query 검토)
- **UI Components:** Headless UI / Radix UI

## 3. 프로젝트 구조 (Project Structure)
- 현재 단일 레포지토리 구조를 유지하며, `src` 폴더 내 FSD(Feature-Sliced Design) 아키텍처를 따른다.
- 별도의 모노레포 재편은 하지 않는다.

## 4. 명령어 (Commands)
- **Web Dev:** `npm run dev:server` (로컬 웹 서버 실행)
- **Web Build:** `npm run build`
- **Test:** `npm run test`

## 5. 코딩 스타일 및 규칙 (Code Style)
- **공통:**
  - 모든 코드는 **TypeScript**를 사용하며 `any` 타입 사용을 지양한다.
  - 변수/함수는 `camelCase`, 컴포넌트 파일명은 `PascalCase`를 사용한다.
- **Web (Next.js):**
  - **반응형 디자인:** 모바일 뷰포트(Mobile-first)를 최우선으로 스타일링한다.
  - **컴포넌트 분리:** UI 로직과 비즈니스 로직(Custom Hooks)을 분리한다.
  - **경로:** `@/components`, `@/hooks` 등 절대 경로 별칭(Alias)을 사용한다.
- **WebView Bridge:**
  - 웹과 앱 간의 통신(Message Sending)은 반드시 타입 안전성을 보장하는 래퍼 함수를 통해 수행한다.

## 6. 작업 경계 (Boundaries) - 3단계 규칙

### ✅ 항상 수행할 것 (Always Do)
- **모바일 뷰 확인:** 모든 UI는 모바일 화면 크기에서 깨지지 않는지 가장 먼저 확인한다.
- **유효성 검사:** 사용자 입력 폼(Input)에는 반드시 실시간 유효성 검사(Validation)를 포함한다.
- **에러 핸들링:** API 호출 실패 시 사용자에게 적절한 피드백(Toast, Alert)을 제공한다.

### ⚠️ 먼저 물어볼 것 (Ask First)
- **새로운 패키지 설치:** `npm install` 전에 반드시 패키지 필요성을 설명하고 승인을 받는다.
- **전역 상태 변경:** Recoil atom/selector 구조를 변경하거나 새로운 상태를 만들 때.
- **기술 스택 전환:** React Query나 Zustand 도입 등 주요 라이브러리 교체가 필요하다고 판단될 때.

### 🚫 절대 하지 말 것 (Never Do)
- **하드코딩:** API URL이나 비밀 키를 코드에 직접 적지 않는다. (`.env` 사용)
- **깨진 UI 방치:** 텍스트가 화면 밖으로 삐져나가거나 클릭 불가능한 버튼을 남겨두지 않는다.
- **무거운 라이브러리 남용:** 웹뷰 성능을 위해 불필요하게 무거운 라이브러리 사용을 금지한다.