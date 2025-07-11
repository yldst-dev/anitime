# Material 3 Expressive 웹 개발 가이드
### Astro + React + TailwindCSS 완벽 구현

## 📋 목차
1. [디자인 철학](#디자인-철학)
2. [핵심 디자인 방법론](#핵심-디자인-방법론)
3. [기술 스택 개요](#기술-스택-개요)
4. [프로젝트 설정](#프로젝트-설정)
5. [새로운 컴포넌트](#새로운-컴포넌트)
6. [업데이트된 컴포넌트](#업데이트된-컴포넌트)
7. [구현 가이드](#구현-가이드)
8. [실용적 팁](#실용적-팁)

---

## 🎨 디자인 철학

### 연구 기반 접근
- **46개 글로벌 연구** + **18,000명 이상 참가자** 피드백
- 구글 디자인 시스템 역사상 가장 연구 집약적 업데이트
- 데이터가 아닌 **연구-디자인-엔지니어링 협업** 탐구

### 핵심 목표
- ❌ "깔끔하지만 지루한" 웹 UI
- ✅ **감정적 연결**을 형성하는 웹 인터페이스
- ✅ 더 **다채롭고, 감성적이며, 개인화된** 웹 경험

### 측정 가능한 효과
- 🚀 **사용성 향상**: 핵심 UI 요소 인식 속도 **4배 증가**
- 📈 **브랜드 인식 개선**:
  - 관련성 **+32%**
  - 혁신성 **+34%** 
  - 반항성 **+30%**

---

## 🛠 핵심 디자인 방법론

### 1. Shape Morphing & Motion Physics (웹 구현)
```
기존: CSS transition + cubic-bezier
새로움: 물리 기반 모션 시스템 (Framer Motion)
```

**웹에서의 특징:**
- **35개 새로운 모양** + CSS clip-path 활용
- 정사각형 → 스쿼클 부드러운 변형 (Framer Motion)
- 자연스럽고 유동적인 상호작용

### 2. Enhanced Color System (CSS Design Tokens)
**동적 색상 테마:**
- CSS Custom Properties를 통한 개인화 지원
- 제품 정체성 유지하면서 개인 스타일 반영
- 시각적 계층 구조를 위한 강조 색상 활용

### 3. Size & Shape Variations (TailwindCSS)
**다양성을 통한 주의 집중:**
- 크기 범위: **XS ~ XL** (Tailwind 클래스 확장)
- 브랜딩과 시각적 리듬에서 모양의 강화된 역할
- 독특한 시각적 톤을 위한 border-radius 처리

---

## 🔧 기술 스택 개요

### Astro Framework
- **정적 사이트 생성** + **부분 하이드레이션**
- 최적화된 번들 크기와 성능
- React 컴포넌트 선택적 클라이언트 렌더링

### React 컴포넌트
- **컴포넌트 기반 아키텍처**
- Material 3 Expressive 컴포넌트 구현
- 상태 관리 및 인터랙션 처리

### TailwindCSS + Design Tokens
- **Utility-first** CSS 프레임워크
- Material 3 디자인 토큰 커스터마이징
- CSS Custom Properties 통합

### Framer Motion
- **물리 기반 애니메이션** 라이브러리
- Shape morphing 및 제스처 처리
- 성능 최적화된 애니메이션

---

## ⚙️ 프로젝트 설정

### 1. Astro 프로젝트 생성
```bash
# Astro 프로젝트 초기화
npm create astro@latest material3-expressive-app
cd material3-expressive-app

# React 통합 추가
npx astro add react
npx astro add tailwind
```

### 2. 필요한 의존성 설치
```bash
# 핵심 라이브러리
npm install framer-motion
npm install clsx
npm install class-variance-authority

# Material Design 관련
npm install @material/material-color-utilities
npm install material-symbols

# 개발 도구
npm install -D @types/react
npm install -D autoprefixer
```

### 3. TailwindCSS Material 3 설정
```javascript
// tailwind.config.mjs
import { materialColors } from './src/utils/material-colors.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: materialColors,
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '28px',
        'full-expressive': '50%',
      },
      animation: {
        'shape-morph': 'shape-morph 0.3s ease-out',
        'material-motion': 'material-motion 0.2s cubic-bezier(0.2, 0, 0, 1)',
      },
      fontFamily: {
        'roboto': ['Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 4. Design Tokens 설정
```css
/* src/styles/material-tokens.css */
:root {
  /* Primary Colors */
  --md-sys-color-primary: oklch(48% 0.22 266);
  --md-sys-color-on-primary: oklch(98% 0.02 266);
  --md-sys-color-primary-container: oklch(90% 0.12 266);
  --md-sys-color-on-primary-container: oklch(21% 0.18 266);

  /* Surface Colors */
  --md-sys-color-surface: oklch(98% 0.01 266);
  --md-sys-color-surface-dim: oklch(87% 0.01 266);
  --md-sys-color-surface-bright: oklch(98% 0.01 266);
  
  /* Shape Tokens */
  --md-sys-shape-corner-none: 0px;
  --md-sys-shape-corner-extra-small: 4px;
  --md-sys-shape-corner-small: 8px;
  --md-sys-shape-corner-medium: 12px;
  --md-sys-shape-corner-large: 16px;
  --md-sys-shape-corner-extra-large: 28px;
  --md-sys-shape-corner-full: 50%;

  /* Motion Tokens */
  --md-sys-motion-duration-short1: 50ms;
  --md-sys-motion-duration-short2: 100ms;
  --md-sys-motion-duration-medium1: 250ms;
  --md-sys-motion-duration-medium2: 300ms;
  --md-sys-motion-duration-long1: 400ms;
  --md-sys-motion-duration-long2: 500ms;

  /* Easing Functions */
  --md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
  --md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
}

/* Dark Theme */
@media (prefers-color-scheme: dark) {
  :root {
    --md-sys-color-primary: oklch(80% 0.12 266);
    --md-sys-color-on-primary: oklch(14% 0.18 266);
    --md-sys-color-surface: oklch(11% 0.01 266);
    --md-sys-color-surface-dim: oklch(7% 0.01 266);
    --md-sys-color-surface-bright: oklch(24% 0.01 266);
  }
}
``` 

---

## 🆕 새로운 컴포넌트

### 1. Loading Indicator (React + Framer Motion)
**개념:** 기존 circular progress 대체, 표현적 로딩 애니메이션

```tsx
// src/components/LoadingIndicator.tsx
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

interface LoadingIndicatorProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'contained'
}

const shapeVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
    borderRadius: ['12px', '50%', '12px'],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
    }
  }
}

export function LoadingIndicator({ 
  className, 
  size = 'md', 
  variant = 'default' 
}: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  const baseClasses = cn(
    'bg-primary',
    sizeClasses[size],
    variant === 'contained' && 'bg-surface-container p-2',
    className
  )

  return (
    <motion.div
      className={baseClasses}
      variants={shapeVariants}
      animate="animate"
    />
  )
}
```

**특징:**
- 7개 고유한 Material 3 모양으로 구성된 루핑 변형 시퀀스
- **5초 미만** 짧은 대기 시간용
- 시선 집중 효과가 뛰어남

### 2. Button Group (React 컴포넌트)
**개념:** 다양한 모양과 크기의 버튼을 담는 컨테이너

```tsx
// src/components/ButtonGroup.tsx
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '../utils/cn'

interface ButtonGroupProps {
  children: ReactNode
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'compact' | 'normal' | 'spacious'
  className?: string
}

export function ButtonGroup({ 
  children, 
  orientation = 'horizontal',
  spacing = 'normal',
  className 
}: ButtonGroupProps) {
  const spacingClasses = {
    compact: 'gap-1',
    normal: 'gap-2',
    spacious: 'gap-4'
  }

  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  }

  return (
    <motion.div
      className={cn(
        'flex',
        orientationClasses[orientation],
        spacingClasses[spacing],
        'p-2 bg-surface-container rounded-lg',
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

### 3. Split Button (주요 + 보조 액션)
**개념:** 주요 동작 + 관련 보조 동작을 결합

```tsx
// src/components/SplitButton.tsx
import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { cn } from '../utils/cn'

interface SplitButtonProps {
  primaryAction: ReactNode
  secondaryAction: ReactNode
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
  className?: string
}

export function SplitButton({ 
  primaryAction, 
  secondaryAction,
  onPrimaryClick,
  onSecondaryClick,
  className 
}: SplitButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={cn('flex bg-surface-container rounded-lg overflow-hidden', className)}>
      <motion.button
        className="flex-1 px-4 py-2 bg-primary text-on-primary hover:bg-primary/90"
        onClick={onPrimaryClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {primaryAction}
      </motion.button>
      
      <motion.button
        className="px-3 py-2 bg-primary-container text-on-primary-container border-l border-outline-variant"
        onClick={() => {
          setIsExpanded(!isExpanded)
          onSecondaryClick?.()
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          rotate: isExpanded ? 180 : 0,
          borderRadius: isExpanded ? '50%' : '0px'
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {secondaryAction}
      </motion.button>
    </div>
  )
}
```

### 4. Floating Toolbar
**특징:** 유동적 배치와 컨텍스트 기반 도구

```tsx
// src/components/FloatingToolbar.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface FloatingToolbarProps {
  isVisible: boolean
  position?: { x: number; y: number }
  children: ReactNode
}

export function FloatingToolbar({ 
  isVisible, 
  position = { x: 0, y: 0 }, 
  children 
}: FloatingToolbarProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-50 bg-surface-container shadow-lg rounded-lg p-2 flex gap-1"
          style={{ left: position.x, top: position.y }}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### 5. FAB Menu (확장형 플로팅 액션 버튼)
```tsx
// src/components/FABMenu.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useState } from 'react'

interface FABMenuProps {
  mainAction: ReactNode
  menuItems: Array<{
    icon: ReactNode
    label: string
    onClick: () => void
  }>
}

export function FABMenu({ mainAction, menuItems }: FABMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                className="flex items-center gap-3 bg-surface-container px-4 py-3 rounded-lg shadow-lg"
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: 1,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ opacity: 0, x: 50, scale: 0.8 }}
                onClick={item.onClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          rotate: isOpen ? 45 : 0,
          borderRadius: isOpen ? '12px' : '50%'
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {mainAction}
      </motion.button>
    </div>
  )
}
```

---

## 🔄 업데이트된 컴포넌트

### Navigation Bar (Flexible)
**변화:** 기존 고정 높이에서 유연한 네비게이션으로

```tsx
// src/components/FlexibleNavigationBar.tsx
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface NavigationItem {
  icon: ReactNode
  label: string
  isActive?: boolean
  onClick?: () => void
}

interface FlexibleNavigationBarProps {
  items: NavigationItem[]
  variant?: 'compact' | 'normal'
}

export function FlexibleNavigationBar({ 
  items, 
  variant = 'normal' 
}: FlexibleNavigationBarProps) {
  const isCompact = variant === 'compact'
  
  return (
    <motion.nav 
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-surface-container border-t border-outline-variant',
        isCompact ? 'h-12' : 'h-16'
      )}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex h-full">
        {items.map((item, index) => (
          <motion.button
            key={index}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1',
              item.isActive ? 'text-primary' : 'text-on-surface-variant'
            )}
            onClick={item.onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ 
                scale: item.isActive ? 1.1 : 1,
                color: item.isActive ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)'
              }}
            >
              {item.icon}
            </motion.div>
            {!isCompact && (
              <span className="text-xs font-medium">{item.label}</span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.nav>
  )
}
```

### Enhanced Carousel
**개선 사항:** 향상된 시각적 표시와 상호작용

```tsx
// src/components/EnhancedCarousel.tsx
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { ReactNode, useState } from 'react'

interface CarouselItem {
  content: ReactNode
  label?: string
}

interface EnhancedCarouselProps {
  items: CarouselItem[]
  autoplay?: boolean
  interval?: number
}

export function EnhancedCarousel({ 
  items, 
  autoplay = false, 
  interval = 3000 
}: EnhancedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg bg-surface-container">
      <motion.div
        className="flex h-full"
        animate={{ x: -currentIndex * 100 + '%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="w-full h-full flex-shrink-0 relative"
            style={{ opacity }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-full h-full flex items-center justify-center">
              {item.content}
            </div>
            {item.label && (
              <motion.div
                className="absolute bottom-4 left-4 bg-surface/80 px-3 py-1 rounded-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {items.map((_, index) => (
          <motion.button
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-colors',
              index === currentIndex ? 'bg-primary' : 'bg-outline-variant'
            )}
            onClick={() => setCurrentIndex(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>
    </div>
  )
}
``` 

---

## 💻 구현 가이드

### Astro 페이지에서 React 컴포넌트 사용

#### 1. 레이아웃 구성
```astro
---
// src/layouts/MaterialLayout.astro
import '../styles/material-tokens.css'
---

<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{Astro.props.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  </head>
  <body class="font-roboto bg-surface text-on-surface">
    <slot />
  </body>
</html>
```

#### 2. 기본 페이지 구성
```astro
---
// src/pages/index.astro
import MaterialLayout from '../layouts/MaterialLayout.astro'
import { LoadingIndicator } from '../components/LoadingIndicator'
import { ButtonGroup } from '../components/ButtonGroup'
import { FABMenu } from '../components/FABMenu'
---

<MaterialLayout title="Material 3 Expressive Demo">
  <main class="min-h-screen p-6">
    <h1 class="text-4xl font-bold mb-8 text-primary">Material 3 Expressive</h1>
    
    <!-- 로딩 인디케이터 -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Loading Indicators</h2>
      <div class="flex gap-4">
        <LoadingIndicator client:load size="sm" />
        <LoadingIndicator client:load size="md" />
        <LoadingIndicator client:load size="lg" variant="contained" />
      </div>
    </section>

    <!-- 버튼 그룹 -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Button Groups</h2>
      <ButtonGroup client:load>
        <button class="px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary/90">
          저장
        </button>
        <button class="px-4 py-2 bg-secondary text-on-secondary rounded-md hover:bg-secondary/90">
          취소
        </button>
        <button class="px-4 py-2 bg-tertiary text-on-tertiary rounded-md hover:bg-tertiary/90">
          더보기
        </button>
      </ButtonGroup>
    </section>

    <!-- FAB 메뉴 -->
    <FABMenu 
      client:load
      mainAction={<span class="text-2xl">+</span>}
      menuItems={[
        { icon: <span>📝</span>, label: "새 글쓰기", onClick: () => console.log("새 글쓰기") },
        { icon: <span>📷</span>, label: "사진 추가", onClick: () => console.log("사진 추가") },
        { icon: <span>🔗</span>, label: "링크 공유", onClick: () => console.log("링크 공유") }
      ]}
    />
  </main>
</MaterialLayout>
```

### 유틸리티 함수 구성

#### 1. CN 유틸리티 (클래스 네임 결합)
```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
```

#### 2. Material Colors 유틸리티
```javascript
// src/utils/material-colors.js
export const materialColors = {
  // Primary Colors
  'primary': 'oklch(48% 0.22 266)',
  'on-primary': 'oklch(98% 0.02 266)',
  'primary-container': 'oklch(90% 0.12 266)',
  'on-primary-container': 'oklch(21% 0.18 266)',

  // Secondary Colors  
  'secondary': 'oklch(60% 0.12 266)',
  'on-secondary': 'oklch(15% 0.12 266)',
  'secondary-container': 'oklch(85% 0.08 266)',
  'on-secondary-container': 'oklch(25% 0.12 266)',

  // Tertiary Colors
  'tertiary': 'oklch(65% 0.15 320)',
  'on-tertiary': 'oklch(20% 0.15 320)',
  'tertiary-container': 'oklch(88% 0.08 320)',
  'on-tertiary-container': 'oklch(28% 0.15 320)',

  // Surface Colors
  'surface': 'oklch(98% 0.01 266)',
  'surface-dim': 'oklch(87% 0.01 266)',
  'surface-bright': 'oklch(98% 0.01 266)',
  'surface-container': 'oklch(94% 0.01 266)',
  'surface-container-high': 'oklch(92% 0.01 266)',
  'surface-container-highest': 'oklch(90% 0.01 266)',
  'on-surface': 'oklch(20% 0.01 266)',
  'on-surface-variant': 'oklch(46% 0.01 266)',

  // Outline Colors
  'outline': 'oklch(76% 0.01 266)',
  'outline-variant': 'oklch(82% 0.01 266)',
}
```

### 고급 애니메이션 패턴

#### 1. Shape Morphing 컴포넌트
```tsx
// src/components/ShapeMorphing.tsx
import { motion } from 'framer-motion'
import { useState } from 'react'

const shapes = [
  'rounded-none',
  'rounded-md', 
  'rounded-lg',
  'rounded-xl',
  'rounded-full'
]

export function ShapeMorphingButton() {
  const [currentShape, setCurrentShape] = useState(0)

  const nextShape = () => {
    setCurrentShape((prev) => (prev + 1) % shapes.length)
  }

  return (
    <motion.button
      className={`px-6 py-3 bg-primary text-on-primary ${shapes[currentShape]}`}
      onClick={nextShape}
      layout
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      모양 변형 버튼
    </motion.button>
  )
}
```

#### 2. 물리 기반 애니메이션
```tsx
// src/components/PhysicsButton.tsx
import { motion } from 'framer-motion'

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 17,
  mass: 1
}

export function PhysicsButton({ children, onClick }: { 
  children: React.ReactNode
  onClick?: () => void 
}) {
  return (
    <motion.button
      className="px-6 py-3 bg-primary text-on-primary rounded-lg"
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
      }}
      whileTap={{ scale: 0.95 }}
      transition={springTransition}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.button>
  )
}
```

---

## 💡 실용적 팁

### Do's ✅

#### 1. 모양 변형 활용
```tsx
// 좋은 예: 부드러운 상태 전환
<motion.div
  animate={{
    borderRadius: isExpanded ? '12px' : '50%',
    scale: isExpanded ? 1.1 : 1
  }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
```

#### 2. 동적 색상 적용
```css
/* CSS Custom Properties로 개인화 */
.theme-purple {
  --md-sys-color-primary: oklch(48% 0.22 300);
}

.theme-green {
  --md-sys-color-primary: oklch(48% 0.22 120);
}
```

#### 3. 크기 변화 활용
```tsx
// 중요한 UI 요소에 주의 집중
<motion.button
  whileHover={{ scale: 1.1 }}
  className="w-16 h-16 bg-primary rounded-full"
>
  중요 버튼
</motion.button>
```

#### 4. 접근성 고려
```tsx
// 모션 감소 설정 존중
const prefersReducedMotion = useReducedMotion()

<motion.div
  animate={prefersReducedMotion ? {} : { rotate: 360 }}
  transition={{ duration: prefersReducedMotion ? 0 : 2 }}
>
```

### Don'ts ❌

#### 1. 과도한 애니메이션 지양
```tsx
// 나쁜 예: 기능성을 해치는 과도한 효과
<motion.button
  animate={{ 
    rotate: [0, 360, 720, 1080], // 너무 복잡
    scale: [1, 2, 0.5, 1.5, 1]   // 혼란스러움
  }}
  transition={{ duration: 5 }}   // 너무 긴 지속시간
>
```

#### 2. 성능 무시 금지
```tsx
// 좋은 예: 성능 최적화
<motion.div
  style={{ willChange: 'transform' }} // GPU 가속
  animate={{ x: 100 }}
  transition={{ type: "tween" }}      // 복잡한 spring 대신 tween
>
```

### 성능 최적화

#### 1. 애니메이션 최적화
```tsx
// transform 속성 사용 (리플로우 방지)
<motion.div
  animate={{ 
    x: 100,      // transform: translateX() 사용
    scale: 1.2   // transform: scale() 사용
  }}
  style={{ willChange: 'transform' }}
>
```

#### 2. 레이아웃 애니메이션 신중 사용
```tsx
// layout 애니메이션은 성능 비용이 높음
<motion.div
  layout // 꼭 필요한 경우에만 사용
  transition={{ type: "tween", duration: 0.2 }}
>
```

### 접근성 가이드라인

#### 1. 색상 대비 준수
```css
/* WCAG 2.1 AA 기준 준수 */
:root {
  --md-sys-color-primary: oklch(48% 0.22 266);    /* 4.5:1 대비율 */
  --md-sys-color-on-primary: oklch(98% 0.02 266); /* 높은 대비 */
}
```

#### 2. 터치 타겟 크기
```tsx
// 최소 44px (iOS) / 48dp (Android) 크기 유지
<button className="min-w-11 min-h-11 p-2">
  버튼
</button>
```

#### 3. 스크린 리더 지원
```tsx
<motion.button
  aria-label="메뉴 열기"
  aria-expanded={isOpen}
  onClick={toggleMenu}
>
  <motion.div
    animate={{ rotate: isOpen ? 180 : 0 }}
    aria-hidden="true" // 장식적 요소임을 명시
  >
    ▼
  </motion.div>
</motion.button>
```

---

## 📚 참고 자료

### 공식 문서
- [Material Design 3](https://m3.material.io/) - 최신 디자인 가이드라인
- [Material 3 Expressive 블로그](https://m3.material.io/blog/building-with-m3-expressive) - 공식 발표 자료

### 웹 개발 리소스
- [Astro 공식 문서](https://docs.astro.build/) - Astro 프레임워크 가이드
- [Framer Motion 문서](https://www.framer.com/motion/) - 애니메이션 라이브러리
- [TailwindCSS 문서](https://tailwindcss.com/) - 유틸리티 CSS 프레임워크

### 디자인 도구
- [Figma Material 3 Design Kit](https://www.figma.com/community/file/1035203688168086460) - 디자인 템플릿
- [Material Theme Builder](https://m3.material.io/theme-builder) - 색상 테마 생성기
- [Material Symbols](https://fonts.google.com/icons) - 아이콘 라이브러리

### 컴포넌트 라이브러리
- [Material Tailwind](https://material-tailwind.com/) - TailwindCSS 기반 Material 컴포넌트
- [react-material-web](https://github.com/AkashGutha/react-material-web) - Material Web Components React 래퍼

### 개발 도구
```bash
# VS Code 확장 프로그램
- Tailwind CSS IntelliSense
- Astro
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
```

### 샘플 프로젝트 구조
```
src/
├── components/           # React 컴포넌트
│   ├── LoadingIndicator.tsx
│   ├── ButtonGroup.tsx
│   ├── SplitButton.tsx
│   ├── FloatingToolbar.tsx
│   ├── FABMenu.tsx
│   ├── FlexibleNavigationBar.tsx
│   └── EnhancedCarousel.tsx
├── layouts/             # Astro 레이아웃
│   └── MaterialLayout.astro
├── pages/               # Astro 페이지
│   └── index.astro
├── styles/              # CSS 파일
│   └── material-tokens.css
└── utils/               # 유틸리티 함수
    ├── cn.ts
    └── material-colors.js
```

---

## 🎯 체크리스트

### 프로젝트 완성도 점검

#### 기본 설정 ✅
- [ ] Astro + React + TailwindCSS 환경 구성
- [ ] Framer Motion 설치 및 설정
- [ ] Material 3 디자인 토큰 적용
- [ ] 기본 레이아웃 및 폰트 설정

#### 컴포넌트 구현 ✅
- [ ] LoadingIndicator 구현
- [ ] ButtonGroup 구현  
- [ ] SplitButton 구현
- [ ] FloatingToolbar 구현
- [ ] FABMenu 구현
- [ ] FlexibleNavigationBar 구현
- [ ] EnhancedCarousel 구현

#### 품질 보증 ✅
- [ ] 접근성 가이드라인 준수
- [ ] 성능 최적화 적용
- [ ] 반응형 디자인 구현
- [ ] 브라우저 호환성 테스트

---

*이 가이드는 Material 3 Expressive의 핵심 개념을 웹 개발 환경에 맞게 재구성한 실용적 구현 방법을 담고 있습니다. Astro + React + TailwindCSS 스택을 활용하여 표현력 있고 성능 최적화된 웹 인터페이스를 구축할 수 있습니다.* 