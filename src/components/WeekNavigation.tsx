import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { WeekType, WEEK_SCHEDULE } from '../types/anime';

interface WeekNavigationProps {
  currentWeek: WeekType;
  onWeekChange: (week: WeekType) => void;
  className?: string;
}

export function WeekNavigation({ currentWeek, onWeekChange, className }: WeekNavigationProps) {
  return (
    <motion.nav
      className={cn(
        'flex bg-surface-container rounded-lg p-2 gap-1',
        'border border-outline-variant',
        'overflow-x-auto scrollbar-hide',
        'justify-center',
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {WEEK_SCHEDULE.map((week) => (
        <motion.button
          key={week.id}
          onClick={() => onWeekChange(week.id)}
          className={cn(
            'relative px-4 py-2 rounded-md text-sm font-medium',
            'min-w-0 flex-shrink-0 transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            'flex items-center justify-center text-center',
            currentWeek === week.id
              ? 'bg-primary text-on-primary'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* 활성 상태 배경 */}
          {currentWeek === week.id && (
            <motion.div
              className="absolute inset-0 bg-primary rounded-md"
              layoutId="activeWeek"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          
          {/* 텍스트 */}
          <span className="relative z-10 text-center">
            <span className="hidden sm:inline">{week.label}</span>
            <span className="sm:hidden">{week.shortLabel}</span>
          </span>
        </motion.button>
      ))}
    </motion.nav>
  );
}