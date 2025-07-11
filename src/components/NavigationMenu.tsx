import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { ThemeToggle } from './ThemeToggle';

interface NavigationMenuProps {
  currentPath: string;
  className?: string;
}

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

export function NavigationMenu({ currentPath, className }: NavigationMenuProps) {
  return (
    <motion.nav
      className={cn(
        'flex gap-2 p-2 bg-surface-container rounded-lg',
        'border border-outline-variant max-w-2xl mx-auto',
        'justify-between items-center',
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 네비게이션 메뉴 */}
      <div className="flex gap-2 flex-1 justify-center">
      {navItems.map((item, index) => {
        const isActive = currentPath === item.href;
        
        return (
          <motion.a
            key={item.href}
            href={item.href}
            className={cn(
              'relative flex flex-col items-center gap-1 px-4 py-3 rounded-md',
              'transition-all duration-200 group min-w-[100px] text-center',
              isActive
                ? 'bg-primary text-on-primary'
                : 'text-on-surface hover:bg-surface-container-high'
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* 활성 상태 배경 */}
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-primary rounded-md"
                layoutId="activeNav"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            
            {/* 아이콘 */}
            <span className="relative z-10 text-xl">
              {item.icon}
            </span>
            
            {/* 텍스트 */}
            <div className="relative z-10">
              <div className="font-medium text-sm">
                {item.label}
              </div>
              <div className={cn(
                'text-xs opacity-75 mt-1',
                isActive ? 'text-on-primary/75' : 'text-on-surface-variant'
              )}>
                {item.description}
              </div>
            </div>
            
            {/* 호버 효과 */}
            {!isActive && (
              <motion.div
                className="absolute inset-0 bg-surface-container-high rounded-md opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.a>
        );
      })}
      </div>
      
      {/* 다크모드 토글 버튼 */}
      <div className="flex-shrink-0 ml-4">
        <ThemeToggle />
      </div>
    </motion.nav>
  );
}