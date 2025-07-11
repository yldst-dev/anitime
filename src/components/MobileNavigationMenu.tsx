import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { ThemeToggle } from './ThemeToggle';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: '요일별 편성표',
    icon: '📅',
    description: '요일별로 애니메이션 확인'
  },
  {
    href: '/search',
    label: '전체 검색',
    icon: '🔍',
    description: '모든 요일 통합 검색'
  },
  {
    href: '/subscriptions',
    label: '구독 관리',
    icon: '💖',
    description: '구독 작품 상태 확인'
  }
];

interface MobileNavigationMenuProps {
  currentPath: string;
  className?: string;
}

export function MobileNavigationMenu({ currentPath, className }: MobileNavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className={cn('md:hidden', className)}>
      {/* 햄버거 버튼 */}
      <motion.button
        onClick={toggleMenu}
        className={cn(
          'relative p-2 rounded-lg',
          'bg-surface-container border border-outline-variant',
          'hover:bg-surface-container-high transition-colors duration-200'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="메뉴 열기"
      >
        <div className="w-6 h-6 flex flex-col justify-center">
          <motion.span
            className="w-full h-0.5 bg-on-surface block"
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 8 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="w-full h-0.5 bg-on-surface block mt-1.5"
            animate={{
              opacity: isOpen ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="w-full h-0.5 bg-on-surface block mt-1.5"
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? -8 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.button>

      {/* 오버레이 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      {/* 사이드 메뉴 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              'fixed top-0 right-0 h-full w-80 bg-surface',
              'border-l border-outline-variant z-50',
              'shadow-lg'
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* 헤더 */}
            <div className="p-4 border-b border-outline-variant">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-on-surface">
                  메뉴
                </h2>
                <motion.button
                  onClick={closeMenu}
                  className="p-2 rounded-lg hover:bg-surface-container-high"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-xl">✕</span>
                </motion.button>
              </div>
            </div>

            {/* 네비게이션 아이템들 */}
            <nav className="p-4">
              <div className="space-y-2">
                {navItems.map((item, index) => {
                  const isActive = currentPath === item.href;
                  
                  return (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-lg',
                        'transition-all duration-200 group relative',
                        isActive
                          ? 'bg-primary text-on-primary'
                          : 'text-on-surface hover:bg-surface-container-high'
                      )}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* 활성 상태 배경 */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-primary rounded-lg"
                          layoutId="activeMobileNav"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      {/* 아이콘 */}
                      <span className="relative z-10 text-2xl">
                        {item.icon}
                      </span>
                      
                      {/* 텍스트 */}
                      <div className="relative z-10 flex-1">
                        <div className="font-medium">
                          {item.label}
                        </div>
                        <div className={cn(
                          'text-sm opacity-75',
                          isActive ? 'text-on-primary/75' : 'text-on-surface-variant'
                        )}>
                          {item.description}
                        </div>
                      </div>

                      {/* 화살표 */}
                      <span className={cn(
                        'relative z-10 text-sm',
                        isActive ? 'text-on-primary/75' : 'text-on-surface-variant'
                      )}>
                        →
                      </span>
                    </motion.a>
                  );
                })}
              </div>
            </nav>

            {/* 푸터 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-outline-variant">
              {/* 다크모드 토글 */}
              <div className="flex justify-center mb-4">
                <ThemeToggle />
              </div>
              
              <div className="text-center text-sm text-on-surface-variant">
                <p>애니메이션 편성표</p>
                <p className="text-xs mt-1">
                  데이터 제공: <a href="https://anissia.net" target="_blank" rel="noopener noreferrer" 
                     className="text-primary hover:underline">Anissia.net</a>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 데스크톱용 네비게이션 (간소화)
export function DesktopNavigationMenu({ currentPath, className }: MobileNavigationMenuProps) {
  return (
    <div className={cn('hidden md:flex items-center gap-4', className)}>
      <nav className="flex gap-1">
        {navItems.map((item, index) => {
        const isActive = currentPath === item.href;
        
        return (
          <motion.a
            key={item.href}
            href={item.href}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 rounded-lg',
              'transition-all duration-200 group text-sm font-medium',
              isActive
                ? 'bg-primary text-on-primary'
                : 'text-on-surface hover:bg-surface-container-high'
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* 활성 상태 배경 */}
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-primary rounded-lg"
                layoutId="activeDesktopNav"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            
            {/* 아이콘 */}
            <span className="relative z-10">
              {item.icon}
            </span>
            
            {/* 텍스트 */}
            <span className="relative z-10">
              {item.label}
            </span>
          </motion.a>
        );
      })}
      </nav>
      
      {/* 다크모드 토글 */}
      <ThemeToggle />
    </div>
  );
}