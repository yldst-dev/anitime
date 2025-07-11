# 애니메이션 편성표 API 통신 문제 해결 보고서

## 📋 문제 요약

애니메이션 편성표 웹 애플리케이션에서 "아무것도 안뜨는 문제"가 발생했으며, Anissia.net API 호출은 성공하지만 데이터가 화면에 표시되지 않는 상황이었습니다.

## 🔍 발견된 문제들

### 1. TypeScript 모듈 Import 오류 (치명적)
**문제:**
- Astro의 strict TypeScript 설정에서 `verbatimModuleSyntax`가 활성화되어 있음
- 타입과 값을 혼합해서 import할 때 오류 발생
- React 컴포넌트 hydration 실패로 인해 인터랙티브 기능이 작동하지 않음

**오류 메시지:**
```
[astro-island] Error hydrating /src/components/AnimeSchedule.tsx 
SyntaxError: The requested module '/src/types/anime.ts' does not provide an export named 'AnimeItem'
```

**원인:**
```typescript
// 문제가 있던 import 방식
import type { AnimeItem, WeekType, AnimeScheduleResponse } from '../types/anime';
import { getCurrentWeekDay } from '../types/anime';
```

### 2. API 응답 구조 불일치 (로직 오류)
**문제:**
- 실제 API 응답: `{code: "ok", data: AnimeItem[]}`
- 코드에서 기대한 구조: `AnimeItem[]` (직접 배열)
- API 호출은 성공하지만 응답 파싱 실패로 데이터 표시 안됨

**실제 API 응답:**
```json
{
  "code": "ok",
  "data": [
    {
      "animeNo": 2986,
      "status": "ON",
      "time": "00:00",
      "subject": "환생했는데 제7왕자라...",
      "genres": "이세계,판타지",
      ...
    }
  ]
}
```

## 🛠️ 해결 방법

### 1. TypeScript 설정 수정
**파일:** `anime-schedule-app/tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "verbatimModuleSyntax": false  // 추가됨
  }
}
```

**변경 효과:**
- 타입과 값의 혼합 import 허용
- React 컴포넌트 정상 hydration
- 클라이언트 사이드 인터랙션 복구

### 2. Import 구문 통합
**파일:** `anime-schedule-app/src/components/AnimeSchedule.tsx`

```typescript
// 수정 후 - 모든 export를 하나의 import로 통합
import { 
  AnimeItem, 
  WeekType, 
  AnimeScheduleResponse,
  getCurrentWeekDay 
} from '../types/anime';
```

### 3. API 응답 타입 및 처리 로직 수정
**파일:** `anime-schedule-app/src/types/anime.ts`

```typescript
// 실제 API 응답 구조에 맞게 수정
export interface AnimeScheduleResponse {
  code: string;
  data: AnimeItem[];
}
```

**파일:** `anime-schedule-app/src/components/AnimeSchedule.tsx`

```typescript
// API 응답 처리 로직 수정
const animeData: AnimeScheduleResponse = await response.json();

if (animeData.code === 'ok' && Array.isArray(animeData.data)) {
  console.log('애니메이션 데이터:', animeData.data.length, '개');
  setAnimeList(animeData.data);  // data 필드에서 배열 추출
} else {
  throw new Error('API 응답 형식이 올바르지 않습니다.');
}
```

## 📊 검증 결과

### API 호출 성공률
- ✅ 일요일 (0): 24개 애니메이션
- ✅ 월요일 (1): 5개 애니메이션  
- ✅ 화요일 (2): 7개 애니메이션
- ✅ 수요일 (3): 데이터 확인
- ✅ 목요일 (4): 13개 애니메이션
- ✅ 금요일 (5): 데이터 확인
- ✅ 토요일 (6): 데이터 확인
- ✅ 기타 (7): 데이터 확인
- ✅ 신작 (8): 데이터 확인

### UI 동작 확인
- ✅ 요일 버튼 클릭 반응
- ✅ 로딩 인디케이터 표시
- ✅ 애니메이션 카드 렌더링
- ✅ 장르 태그 표시
- ✅ 외부 링크 작동
- ✅ 반응형 레이아웃

## 🔧 기술적 근본 원인

### Astro의 Islands Architecture 이해 부족
1. **Hydration 과정**: 서버 사이드에서 정적 HTML 생성 → 클라이언트에서 React 컴포넌트 활성화
2. **모듈 시스템**: TypeScript의 엄격한 모듈 구문 검사가 런타임 import에 영향
3. **Island 격리**: 각 컴포넌트가 독립적으로 hydrate되므로 import 오류가 전체 기능 중단을 야기

### API 문서와 실제 응답의 차이
- 문서화되지 않은 래퍼 객체 존재
- 실제 프로덕션 API 구조 확인 필요성

## 📝 교훈 및 개선사항

### 개발 프로세스 개선
1. **API 응답 구조 사전 검증**: `curl` 또는 브라우저 DevTools로 실제 응답 확인
2. **TypeScript 설정 이해**: 프레임워크별 설정 차이점 숙지
3. **Hydration 오류 모니터링**: 브라우저 콘솔 실시간 확인

### 디버깅 도구 활용
1. **Playwright MCP**: 실제 브라우저 환경에서 문제 재현 및 분석
2. **Network 탭**: API 호출 상태 및 응답 데이터 확인
3. **Console 로그**: 단계별 데이터 처리 과정 추적

### 코드 품질 향상
1. **타입 안정성**: 런타임과 컴파일타임 일관성 확보
2. **에러 핸들링**: API 응답 구조 검증 로직 강화
3. **개발자 경험**: 명확한 에러 메시지와 로깅

## 🚀 최종 결과

**해결 전:**
- API 호출 성공하지만 화면에 아무것도 표시되지 않음
- React 컴포넌트 hydration 실패
- 사용자 인터랙션 불가

**해결 후:**
- 모든 요일 데이터 정상 표시
- 실시간 요일 전환 기능 작동
- 완전한 Material 3 Expressive UI 경험 제공

---

**작성일:** 2024년 12월 19일  
**해결 소요시간:** 약 30분  
**주요 도구:** Playwright MCP, curl, 브라우저 DevTools 