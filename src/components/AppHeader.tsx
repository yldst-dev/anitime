import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { MobileNavigationMenu, DesktopNavigationMenu } from './MobileNavigationMenu';

interface AppHeaderProps {
  currentPath: string;
  className?: string;
}

export function AppHeader({ currentPath, className }: AppHeaderProps) {
  return (
    <header className={cn('bg-surface border-b border-outline-variant sticky top-0 z-40', className)}>
      {/* 메인 헤더 */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* 왼쪽: 메인 타이틀 */}
            <motion.div
              className="text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-2 tracking-tight">
                애니메이션 편성표
              </h1>
              <motion.div
                className="w-16 h-1 bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </motion.div>

            {/* 오른쪽: 네비게이션 */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* 데스크톱 네비게이션 */}
              <DesktopNavigationMenu currentPath={currentPath} />
              
              {/* 모바일 햄버거 메뉴 */}
              <MobileNavigationMenu currentPath={currentPath} />
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}

// 간단한 페이지 헤더 (서브페이지용)
export function PageHeader({ 
  title, 
  className 
}: { 
  title: string; 
  className?: string; 
}) {
  return (
    <motion.div
      className={cn('text-center py-8', className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-on-surface">
        {title}
      </h2>
    </motion.div>
  );
}