import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes';

type Theme = 'light' | 'dark' | 'system';

// next-themes의 useTheme를 그대로 내보내기
export function useTheme() {
  const context = useNextTheme();
  
  // SSR 환경에서는 기본값 반환
  if (typeof window === 'undefined') {
    return {
      theme: 'system',
      setTheme: () => {},
      resolvedTheme: 'light',
      systemTheme: 'light'
    };
  }
  
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

// Material Design 3 CSS 변수 업데이트
const updateMaterialTokens = (isDark: boolean) => {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  
  if (isDark) {
    // 다크 테마 Material 3 토큰
    root.style.setProperty('--md-sys-color-primary', '#d0bcff');
    root.style.setProperty('--md-sys-color-on-primary', '#381e72');
    root.style.setProperty('--md-sys-color-primary-container', '#4f378b');
    root.style.setProperty('--md-sys-color-on-primary-container', '#eaddff');
    
    root.style.setProperty('--md-sys-color-secondary', '#ccc2dc');
    root.style.setProperty('--md-sys-color-on-secondary', '#332d41');
    root.style.setProperty('--md-sys-color-secondary-container', '#4a4458');
    root.style.setProperty('--md-sys-color-on-secondary-container', '#e8def8');
    
    root.style.setProperty('--md-sys-color-tertiary', '#efb8c8');
    root.style.setProperty('--md-sys-color-on-tertiary', '#492532');
    root.style.setProperty('--md-sys-color-tertiary-container', '#633b48');
    root.style.setProperty('--md-sys-color-on-tertiary-container', '#ffd8e4');
    
    root.style.setProperty('--md-sys-color-error', '#ffb4ab');
    root.style.setProperty('--md-sys-color-on-error', '#690005');
    root.style.setProperty('--md-sys-color-error-container', '#93000a');
    root.style.setProperty('--md-sys-color-on-error-container', '#ffdad6');
    
    root.style.setProperty('--md-sys-color-surface', '#10131c');
    root.style.setProperty('--md-sys-color-on-surface', '#e6e0e9');
    root.style.setProperty('--md-sys-color-surface-variant', '#49454f');
    root.style.setProperty('--md-sys-color-on-surface-variant', '#cac4d0');
    root.style.setProperty('--md-sys-color-surface-container', '#1d1b20');
    root.style.setProperty('--md-sys-color-surface-container-high', '#272529');
    root.style.setProperty('--md-sys-color-surface-container-highest', '#322f35');
    
    root.style.setProperty('--md-sys-color-outline', '#938f99');
    root.style.setProperty('--md-sys-color-outline-variant', '#49454f');
  } else {
    // 라이트 테마 Material 3 토큰 (기본값으로 복원)
    root.style.setProperty('--md-sys-color-primary', '#6750a4');
    root.style.setProperty('--md-sys-color-on-primary', '#ffffff');
    root.style.setProperty('--md-sys-color-primary-container', '#eaddff');
    root.style.setProperty('--md-sys-color-on-primary-container', '#21005d');
    
    root.style.setProperty('--md-sys-color-secondary', '#625b71');
    root.style.setProperty('--md-sys-color-on-secondary', '#ffffff');
    root.style.setProperty('--md-sys-color-secondary-container', '#e8def8');
    root.style.setProperty('--md-sys-color-on-secondary-container', '#1d192b');
    
    root.style.setProperty('--md-sys-color-tertiary', '#7d5260');
    root.style.setProperty('--md-sys-color-on-tertiary', '#ffffff');
    root.style.setProperty('--md-sys-color-tertiary-container', '#ffd8e4');
    root.style.setProperty('--md-sys-color-on-tertiary-container', '#31111d');
    
    root.style.setProperty('--md-sys-color-error', '#ba1a1a');
    root.style.setProperty('--md-sys-color-on-error', '#ffffff');
    root.style.setProperty('--md-sys-color-error-container', '#ffdad6');
    root.style.setProperty('--md-sys-color-on-error-container', '#410002');
    
    root.style.setProperty('--md-sys-color-surface', '#fffbfe');
    root.style.setProperty('--md-sys-color-on-surface', '#1c1b1f');
    root.style.setProperty('--md-sys-color-surface-variant', '#e7e0ec');
    root.style.setProperty('--md-sys-color-on-surface-variant', '#49454f');
    root.style.setProperty('--md-sys-color-surface-container', '#f3edf7');
    root.style.setProperty('--md-sys-color-surface-container-high', '#ece6f0');
    root.style.setProperty('--md-sys-color-surface-container-highest', '#e6e0e9');
    
    root.style.setProperty('--md-sys-color-outline', '#79747e');
    root.style.setProperty('--md-sys-color-outline-variant', '#cac4d0');
  }
};

// 테마 변경 감지 컴포넌트
function ThemeWatcher() {
  const { resolvedTheme } = useNextTheme();
  
  useEffect(() => {
    if (resolvedTheme) {
      updateMaterialTokens(resolvedTheme === 'dark');
    }
  }, [resolvedTheme]);
  
  return null;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      <ThemeWatcher />
      {children}
    </NextThemeProvider>
  );
}