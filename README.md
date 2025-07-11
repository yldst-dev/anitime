# AniTime - 애니메이션 편성표 웹 애플리케이션

## 📋 프로젝트 개요

**AniTime**은 방영중인 애니메이션 편성표를 확인하고 관심 작품을 구독할 수 있는 현대적인 웹 애플리케이션입니다. Material 3 Expressive 디자인 시스템을 기반으로 제작되어 직관적이고 아름다운 사용자 경험을 제공합니다.

### ✨ 주요 기능

- 📺 **요일별 애니메이션 편성표** - 일~토요일 + 기타/신작 카테고리
- 🔍 **통합 검색 시스템** - 제목, 장르, 원제 기반 실시간 검색
- ⭐ **구독 관리** - 관심 애니메이션 찜하기 및 관리
- 📱 **반응형 디자인** - 모바일, 태블릿, 데스크톱 최적화
- 🌓 **다크/라이트 테마** - 사용자 선호도에 따른 테마 전환
- ♿ **접근성 준수** - WCAG 2.1 AA 기준 충족

### 🎨 디자인 시스템

- **Material 3 Expressive** - Google의 최신 디자인 시스템 적용
- **감정적 연결** - 46개 연구와 18,000명 참가자 피드백 반영
- **개인화 색상** - 사용자 취향에 맞는 동적 색상 테마
- **물리 기반 모션** - 자연스럽고 유동적인 애니메이션

## 🛠 기술 스택

### Frontend Framework
- **[Astro](https://astro.build/)** - 정적 사이트 생성 + 부분 하이드레이션
- **[React](https://react.dev/)** - 컴포넌트 기반 UI 라이브러리
- **[TypeScript](https://www.typescriptlang.org/)** - 타입 안전성 보장

### Styling & Design
- **[TailwindCSS](https://tailwindcss.com/)** - 유틸리티 퍼스트 CSS 프레임워크
- **[Framer Motion](https://framer.com/motion/)** - 물리 기반 애니메이션
- **Material 3 Design Tokens** - 일관된 디자인 시스템

### Data & API
- **[Anissia.net API](https://anissia.net/)** - 애니메이션 편성표 데이터 소스
- **localStorage** - 구독 정보 클라이언트 저장

## 🚀 시작하기

### 사전 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn 패키지 매니저

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/yldst-dev/anitime.git
cd anitime

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버가 `http://localhost:4321`에서 실행됩니다.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
anime-schedule-app/
├── public/                    # 정적 자원
│   ├── favicon.svg
│   └── debug-test.html
├── src/
│   ├── components/           # React 컴포넌트
│   │   ├── AnimeCard.tsx         # 애니메이션 카드
│   │   ├── AnimeSchedule.tsx     # 편성표 메인
│   │   ├── AppHeader.tsx         # 앱 헤더
│   │   ├── SearchInput.tsx       # 검색 입력
│   │   ├── WeekNavigation.tsx    # 요일 네비게이션
│   │   └── ...
│   ├── hooks/                # 커스텀 훅
│   │   └── useSubscriptionUpdater.ts
│   ├── layouts/              # Astro 레이아웃
│   │   ├── AppLayout.astro       # 기본 레이아웃
│   │   └── MaterialLayout.astro  # Material 레이아웃
│   ├── pages/                # Astro 페이지
│   │   ├── index.astro           # 메인 페이지
│   │   ├── search.astro          # 검색 페이지
│   │   └── subscriptions.astro   # 구독 관리
│   ├── styles/               # CSS 파일
│   │   └── material-tokens.css   # Material 3 토큰
│   ├── types/                # TypeScript 타입
│   │   └── anime.ts
│   └── utils/                # 유틸리티 함수
│       ├── cn.ts                 # 클래스네임 유틸
│       ├── search.ts             # 검색 로직
│       └── subscription.ts       # 구독 관리
├── docs/                     # 프로젝트 문서
│   ├── API_문제_해결_보고서.md
│   ├── Material3_Expressive_색상_시스템_가이드.md
│   ├── api_anime_schdule.md
│   └── material-3-expressive-web-guide.md
├── astro.config.mjs          # Astro 설정
├── tailwind.config.mjs       # TailwindCSS 설정
├── tsconfig.json             # TypeScript 설정
└── package.json
```

## 🎯 주요 컴포넌트

### 1. AnimeSchedule.tsx
- 요일별 애니메이션 편성표 표시
- Anissia.net API 연동
- 로딩 상태 및 에러 처리

### 2. AnimeCard.tsx
- 개별 애니메이션 정보 카드
- 장르 태그, 방송 시간, 구독 버튼
- Material 3 카드 디자인 적용

### 3. UnifiedSearch.tsx
- 통합 검색 인터페이스
- 실시간 검색 결과 표시
- 검색 히스토리 관리

### 4. WeekNavigation.tsx
- 요일별 탭 네비게이션
- 활성 상태 표시
- 모바일 최적화 스크롤

## 🌐 API 연동

### Anissia.net API
애니메이션 편성표 데이터는 [Anissia.net API](https://anissia.net/)를 사용합니다.

#### 주요 엔드포인트
```
GET https://api.anissia.net/anime/schedule/{week}
```

**week 파라미터:**
- `0` ~ `6`: 일요일 ~ 토요일
- `7`: 기타
- `8`: 신작

#### 응답 데이터 구조
```typescript
interface AnimeItem {
  animeNo: number;
  status: 'ON' | 'OFF';
  time: string;
  subject: string;
  originalSubject?: string;
  genres: string;
  startDate?: string;
  endDate?: string;
  website?: string;
  captionCount: number;
}
```

자세한 API 문서는 [`docs/api_anime_schdule.md`](docs/api_anime_schdule.md)를 참조하세요.

## 🎨 디자인 시스템

### Material 3 Expressive
이 프로젝트는 Google의 Material 3 Expressive 디자인 시스템을 기반으로 합니다.

#### 주요 특징
- **감정적 연결**: 더 다채롭고 개인적인 UI
- **동적 색상**: 사용자 선호도 기반 색상 테마
- **물리 기반 모션**: 자연스러운 애니메이션
- **형태 변형**: 부드러운 모양 전환

#### 색상 시스템
- **Primary**: 주요 브랜드 색상
- **Secondary**: 보조 액션
- **Tertiary**: 액센트 색상
- **Surface**: 배경 및 컨테이너
- **Outline**: 테두리 및 구분선

자세한 디자인 가이드는 다음 문서들을 참조하세요:
- [`docs/Material3_Expressive_색상_시스템_가이드.md`](docs/Material3_Expressive_색상_시스템_가이드.md)
- [`docs/material-3-expressive-web-guide.md`](docs/material-3-expressive-web-guide.md)

## 🔧 개발 가이드

### 코드 스타일
- **ESLint + Prettier** 사용
- **TypeScript strict 모드** 활성화
- **컴포넌트명 PascalCase** 규칙
- **파일명 kebab-case** 규칙

### 커밋 메시지 규칙
```
<type>(<scope>): <description>

예시:
feat(components): Add AnimeCard component
fix(api): Handle API response error
docs(readme): Update installation guide
```

### 브랜치 전략
- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치
- `hotfix/*`: 긴급 수정 브랜치

## 🐛 문제 해결

### 일반적인 문제들

#### 1. TypeScript 모듈 Import 오류
```bash
# tsconfig.json에서 verbatimModuleSyntax 비활성화
{
  "compilerOptions": {
    "verbatimModuleSyntax": false
  }
}
```

#### 2. API 응답 데이터 표시 안됨
- API 응답 구조 확인: `{code: "ok", data: AnimeItem[]}`
- 네트워크 탭에서 API 호출 상태 확인
- CORS 에러 여부 확인

#### 3. 빌드 에러
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 정리
npm run astro clean
```

자세한 문제 해결 가이드는 [`docs/API_문제_해결_보고서.md`](docs/API_문제_해결_보고서.md)를 참조하세요.

## 📝 라이선스

이 프로젝트는 [MIT License](LICENSE)를 따릅니다.

## 🤝 기여하기

1. 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📞 연락처

- **프로젝트 저장소**: [https://github.com/yldst-dev/anitime](https://github.com/yldst-dev/anitime)
- **이슈 리포트**: [GitHub Issues](https://github.com/yldst-dev/anitime/issues)

## 🙏 감사의 말

- **[Anissia.net](https://anissia.net/)** - 애니메이션 편성표 API 제공
- **[Google Material Design](https://m3.material.io/)** - 디자인 시스템 가이드라인
- **[Astro Team](https://astro.build/)** - 훌륭한 웹 프레임워크 제공

---

**AniTime**으로 더 즐거운 애니메이션 시청 경험을 만들어보세요! 🎬✨ 