import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { cn } from '../utils/cn';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 컴포넌트 마운트 상태 추적 (hydration 문제 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 다음 테마로 전환하는 함수
  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  // 현재 테마에 따른 아이콘과 텍스트
  const getThemeInfo = () => {
    if (!mounted) {
      return { icon: '💡', label: '테마 전환', isDark: false };
    }

    switch (theme) {
      case 'light':
        return { icon: '☀️', label: '라이트 모드', isDark: false };
      case 'dark':
        return { icon: '🌙', label: '다크 모드', isDark: true };
      case 'system':
      default:
        return { 
          icon: '💻', 
          label: '시스템 설정', 
          isDark: resolvedTheme === 'dark' 
        };
    }
  };

  const themeInfo = getThemeInfo();

  // SSR 호환성을 위해 마운트 전에는 기본 UI 표시
  if (!mounted) {
    return (
      <div className={cn(
        'relative w-12 h-6 rounded-full p-1 bg-surface-container-highest',
        className
      )}>
        <div className="w-4 h-4 rounded-full bg-on-surface text-surface flex items-center justify-center text-xs">
          💡
        </div>
      </div>
    );
  }

  return (
    <motion.button
      onClick={cycleTheme}
      className={cn(
        'relative w-12 h-6 rounded-full p-1 transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        themeInfo.isDark 
          ? 'bg-primary-container' 
          : 'bg-surface-container-highest',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`현재: ${themeInfo.label}, 클릭하여 다음 테마로 전환`}
      title={`현재: ${themeInfo.label}`}
    >
      {/* 슬라이더 */}
      <motion.div
        className={cn(
          'w-4 h-4 rounded-full flex items-center justify-center text-xs',
          themeInfo.isDark
            ? 'bg-on-primary-container text-primary-container'
            : 'bg-on-surface text-surface'
        )}
        animate={{
          x: theme === 'light' ? 0 : theme === 'dark' ? 24 : 12
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
        initial={{ scale: 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {themeInfo.icon}
      </motion.div>
      
      {/* 배경 표시 점들 */}
      <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
        {/* 라이트 모드 표시 */}
        <motion.div
          className={cn(
            'w-1 h-1 rounded-full transition-opacity',
            theme === 'light' 
              ? 'bg-primary opacity-100' 
              : 'bg-outline-variant opacity-40'
          )}
        />
        
        {/* 시스템 모드 표시 (중앙) */}
        <motion.div
          className={cn(
            'w-1 h-1 rounded-full transition-opacity',
            theme === 'system' 
              ? 'bg-primary opacity-100' 
              : 'bg-outline-variant opacity-40'
          )}
        />
        
        {/* 다크 모드 표시 */}
        <motion.div
          className={cn(
            'w-1 h-1 rounded-full transition-opacity',
            theme === 'dark' 
              ? 'bg-primary opacity-100' 
              : 'bg-outline-variant opacity-40'
          )}
        />
      </div>
    </motion.button>
  );
}

// 간단한 텍스트 기반 테마 토글
export function SimpleThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className={cn('px-3 py-1 text-sm rounded-md bg-surface-container', className)}>
        테마
      </button>
    );
  }

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeText = () => {
    switch (theme) {
      case 'light': return '☀️ 라이트';
      case 'dark': return '🌙 다크';
      case 'system': 
      default: return `💻 시스템${resolvedTheme ? ` (${resolvedTheme === 'dark' ? '다크' : '라이트'})` : ''}`;
    }
  };

  return (
    <motion.button
      onClick={cycleTheme}
      className={cn(
        'px-3 py-1 text-sm rounded-md transition-colors',
        'bg-surface-container-high hover:bg-surface-container-highest',
        'text-on-surface-variant hover:text-on-surface',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {getThemeText()}
    </motion.button>
  );
}