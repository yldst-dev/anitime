# Material 3 Expressive 색상 시스템 완전 가이드

## 📋 개요

Material 3 Expressive는 Google의 최신 디자인 시스템으로, 46개의 연구와 18,000명 이상의 참여자 피드백을 바탕으로 개발되었습니다. 이 시스템의 핵심은 **감정적 연결**과 **사용성 향상**을 동시에 제공하는 색상 체계입니다.

## 🎨 HCT 색상 모델 - Material 3의 핵심

### HCT란?
Material 3 Expressive는 기존 RGB/HSL 대신 **HCT (Hue, Chroma, Tone)** 색상 모델을 사용합니다:

- **Hue (색조)**: 0-360 범위의 색상 범주 ("빨강", "파랑" 등)
- **Chroma (채도)**: 0-120 범위의 색상 강도 (회색 → 최대 선명도)
- **Tone (톤)**: 0-100 범위의 밝기 (어두움 → 밝음)

### HCT의 장점
1. **지각적 정확성**: 인간의 색상 인식과 일치
2. **접근성 보장**: 톤 값을 통한 명확한 대비 제어
3. **다이나믹 색상**: 개인화된 색상 시스템 지원

## 🏗️ 색상 시스템 구조

### 1. 소스 색상 (Source Color)
모든 색상 팔레트의 기준점이 되는 단일 색상

### 2. 5가지 키 색상 (Key Colors)
소스 색상에서 파생된 핵심 색상들:

#### Primary (주요)
- **용도**: 핵심 브랜드 색상, 주요 액션
- **예시**: FAB, 주요 버튼, 로고
- **색상 역할**:
  - `primary`: 주요 액션 버튼
  - `on-primary`: primary 위의 텍스트/아이콘
  - `primary-container`: 덜 강조된 primary 영역
  - `on-primary-container`: primary-container 위의 콘텐츠

#### Secondary (보조)
- **용도**: 보완적 액션, 브랜드 확장
- **예시**: 토글 버튼, 보조 네비게이션
- **색상 역할**:
  - `secondary`: 보조 액션
  - `on-secondary`: secondary 위의 콘텐츠
  - `secondary-container`: 부드러운 강조
  - `on-secondary-container`: secondary-container 위의 콘텐츠

#### Tertiary (3차)
- **용도**: 액센트, 특별한 하이라이트
- **예시**: 필터 칩, 장식적 요소
- **색상 역할**:
  - `tertiary`: 액센트 요소
  - `on-tertiary`: tertiary 위의 콘텐츠
  - `tertiary-container`: 미세한 강조
  - `on-tertiary-container`: tertiary-container 위의 콘텐츠

#### Neutral (중성)
- **용도**: 배경, 서피스, 텍스트
- **예시**: 카드 배경, 기본 텍스트
- **색상 역할**:
  - `surface`: 기본 배경
  - `on-surface`: surface 위의 기본 텍스트
  - `surface-variant`: 변형된 서피스
  - `on-surface-variant`: surface-variant 위의 텍스트

#### Neutral Variant (중성 변형)
- **용도**: 아웃라인, 구분선
- **예시**: 테두리, 구분자
- **색상 역할**:
  - `outline`: 기본 아웃라인
  - `outline-variant`: 미세한 아웃라인

### 3. 톤 팔레트 (Tonal Palettes)
각 키 색상은 13개의 톤 레벨을 가집니다:
```
0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100
```

## 🌓 라이트/다크 테마 톤 매핑

### 라이트 테마
```scss
// Primary 그룹
primary: 톤 40
on-primary: 톤 100
primary-container: 톤 90
on-primary-container: 톤 10

// Surface 그룹  
surface: 톤 99
on-surface: 톤 10
surface-variant: 톤 90
on-surface-variant: 톤 30
```

### 다크 테마
```scss
// Primary 그룹
primary: 톤 80
on-primary: 톤 20
primary-container: 톤 30
on-primary-container: 톤 90

// Surface 그룹
surface: 톤 10
on-surface: 톤 90
surface-variant: 톤 30
on-surface-variant: 톤 80
```

## 🎯 색상 매칭 전략

### 1. 하모나이제이션 (Harmonization)
서로 다른 색상을 조화롭게 만드는 과정:

```javascript
// 예시: 브랜드 색상과 사용자 개인화 색상 조화
const brandHue = 210; // 파란색
const userHue = 350;  // 분홍색
const harmonizedHue = harmonize(userHue, brandHue);
// 결과: 두 색상 사이의 중간 조화 색상
```

### 2. 색상 제약 (Color Limitations)
특정 색조에서는 모든 채도/톤 조합이 불가능:

#### 노란색 (H: 105)
- **특징**: 낮은 톤에서 채도 제한
- **최적 사용**: 밝은 톤에서 높은 채도

#### 빨간색 (H: 25)  
- **특징**: 중간 톤에서 최고 채도
- **최적 사용**: 다양한 톤 레벨 활용 가능

#### 파란색 (H: 285)
- **특징**: 어두운 톤에서 최고 채도
- **최적 사용**: 어두운 배경과 대비

### 3. 접근성 기반 매칭
```scss
// WCAG AA 기준 (4.5:1 대비비)
.accessible-text {
  color: var(--md-sys-color-on-surface);     // 톤 10
  background: var(--md-sys-color-surface);   // 톤 99
  // 대비비: 12.63:1 (AA 통과)
}

// WCAG AAA 기준 (7:1 대비비)
.high-contrast-text {
  color: var(--md-sys-color-on-primary);     // 톤 100  
  background: var(--md-sys-color-primary);   // 톤 40
  // 대비비: 8.32:1 (AAA 통과)
}
```

## 🔧 구현 방법

### 1. Design Tokens 활용
```css
/* CSS 커스텀 프로퍼티 */
:root {
  --md-sys-color-primary: #6750A4;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #EADDFF;
  --md-sys-color-on-primary-container: #21005D;
}

/* 다크 테마 */
[data-theme="dark"] {
  --md-sys-color-primary: #D0BCFF;
  --md-sys-color-on-primary: #381E72;
  --md-sys-color-primary-container: #4F378B;
  --md-sys-color-on-primary-container: #EADDFF;
}
```

### 2. Material Theme Builder 사용
```javascript
// Material Color Utilities (MCU) 사용 예시
import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities';

const sourceColor = argbFromHex('#6750A4');
const theme = themeFromSourceColor(sourceColor);

// 라이트 테마 색상
const lightColors = theme.schemes.light;
console.log(lightColors.primary); // HCT(272, 36, 40)

// 다크 테마 색상  
const darkColors = theme.schemes.dark;
console.log(darkColors.primary); // HCT(272, 36, 80)
```

### 3. Jetpack Compose 구현
```kotlin
// Material 3 테마 정의
private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF6750A4),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFEADDFF),
    onPrimaryContainer = Color(0xFF21005D),
    // ... 기타 색상
)

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFFD0BCFF),
    onPrimary = Color(0xFF381E72),
    primaryContainer = Color(0xFF4F378B),
    onPrimaryContainer = Color(0xFFEADDFF),
    // ... 기타 색상
)

@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    
    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
```

## 🌈 다이나믹 색상 (Dynamic Color)

### 1. 시스템 기반 색상
Android 12+ 사용자 배경화면에서 색상 추출:

```kotlin
// 다이나믹 색상 적용
@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) 
            else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }
    
    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
```

### 2. 콘텐츠 기반 색상
```javascript
// 이미지에서 색상 추출
import { sourceColorFromImage } from '@material/material-color-utilities';

async function extractColorsFromImage(imageElement) {
    const sourceColor = await sourceColorFromImage(imageElement);
    const theme = themeFromSourceColor(sourceColor);
    return theme;
}
```

## 📊 색상 연구 결과

### 사용성 향상 데이터
- **시각적 요소 인식 속도**: 4배 개선
- **핵심 액션 탭 시간**: 수 초 단위 감소
- **연령별 차이 해소**: 45세 이상 사용자도 젊은 사용자와 동일한 성능

### 감정적 반응 개선
- **하위문화 인식**: 32% 증가
- **현대성**: 34% 증가  
- **반항성**: 30% 증가
- **전체 선호도**: 87% (18-24세 그룹)

## ⚠️ 주의사항 및 베스트 프랙티스

### 1. 색상 제한사항
```scss
// ❌ 잘못된 예: 물리적으로 불가능한 색상
.invalid-color {
    color: hct(240, 150, 95); /* 채도가 너무 높음 */
}

// ✅ 올바른 예: 제약 내의 색상
.valid-color {
    color: hct(240, 80, 95);  /* 실현 가능한 채도 */
}
```

### 2. 접근성 우선
```scss
// ❌ 불충분한 대비
.poor-contrast {
    color: var(--md-sys-color-primary);      /* 톤 40 */
    background: var(--md-sys-color-secondary); /* 톤 40 */
    /* 대비비: 1.2:1 (접근성 실패) */
}

// ✅ 충분한 대비
.good-contrast {
    color: var(--md-sys-color-on-primary);   /* 톤 100 */
    background: var(--md-sys-color-primary); /* 톤 40 */
    /* 대비비: 8.32:1 (AAA 통과) */
}
```

### 3. 의미 있는 색상 사용
```scss
// ✅ 의미적 색상 일관성
.error-state {
    color: var(--md-sys-color-error);
}

.success-state {
    color: var(--md-ref-palette-green60); /* 커스텀 시맨틱 색상 */
}

.warning-state {
    color: var(--md-ref-palette-yellow50);
}
```

### 4. 컨텍스트 고려
```scss
/* 금융 앱 - 보수적 색상 */
.banking-theme {
    --md-sys-color-primary: #1565C0;        /* 신뢰감 있는 파란색 */
    --md-sys-color-secondary: #37474F;      /* 안정감 있는 회색 */
}

/* 창작 앱 - 표현적 색상 */
.creative-theme {
    --md-sys-color-primary: #E91E63;        /* 활기찬 핑크 */
    --md-sys-color-secondary: #FF9800;      /* 창의적 오렌지 */
    --md-sys-color-tertiary: #9C27B0;       /* 독특한 보라 */
}
```

## 🛠️ 개발 도구

### 1. Material Theme Builder
- **웹 버전**: [Material Theme Builder](https://m3.material.io/theme-builder)
- **Figma 플러그인**: Material Theme Builder for Figma
- **기능**: 다이나믹 색상 미리보기, 토큰 export

### 2. Material Color Utilities (MCU)
```bash
# 설치
npm install @material/material-color-utilities

# 또는
yarn add @material/material-color-utilities
```

### 3. Figma Material 3 Design Kit
- **최신 버전**: V1.20
- **포함 사항**: 
  - 새로운 컴포넌트 (Button Groups, FAB Menu, Split Button)
  - 업데이트된 색상 토큰
  - XR 지원 컴포넌트

## 🎨 실제 적용 예시

### 애니메이션 편성표 앱 색상 시스템
```css
/* 현재 프로젝트 적용 예시 */
:root {
    /* Material 3 Base Colors */
    --md-sys-color-primary: #6750A4;
    --md-sys-color-on-primary: #FFFFFF;
    --md-sys-color-primary-container: #EADDFF;
    --md-sys-color-on-primary-container: #21005D;
    
    /* Semantic Colors */
    --anime-genre-action: #D32F2F;
    --anime-genre-romance: #E91E63; 
    --anime-genre-comedy: #FF9800;
    --anime-genre-scifi: #1976D2;
    
    /* Surface Colors */
    --md-sys-color-surface: #FFFBFE;
    --md-sys-color-surface-variant: #E7E0EC;
    --md-sys-color-on-surface: #1C1B1F;
    --md-sys-color-on-surface-variant: #49454F;
}

[data-theme="dark"] {
    --md-sys-color-primary: #D0BCFF;
    --md-sys-color-on-primary: #381E72;
    --md-sys-color-surface: #1C1B1F;
    --md-sys-color-on-surface: #E6E1E5;
}
```

## 📚 참고 자료

1. **공식 문서**
   - [Material Design 3 Color](https://m3.material.io/styles/color)
   - [Android Color Guidelines](https://developer.android.com/design/ui/mobile/guides/styles/color)

2. **연구 자료**
   - [The Science of Color & Design](https://design.google/library/science-of-color-design)
   - [Expressive Design Research](https://design.google/library/expressive-material-design-google-research)

3. **개발 도구**
   - [Material Color Utilities](https://github.com/material-foundation/material-color-utilities)
   - [Material Theme Builder](https://m3.material.io/theme-builder)

---

**작성일**: 2024년 12월 19일  
**버전**: Material 3 Expressive v1.20 기준  
**업데이트**: 최신 연구 결과 및 구현 방법 반영 