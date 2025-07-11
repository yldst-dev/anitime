import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { cn } from '../utils/cn';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        'relative w-12 h-6 rounded-full p-1 transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        theme === 'dark' 
          ? 'bg-primary-container' 
          : 'bg-surface-container-highest',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`${theme === 'light' ? '다크' : '라이트'} 모드로 전환`}
    >
      {/* 슬라이더 */}
      <motion.div
        className={cn(
          'w-4 h-4 rounded-full flex items-center justify-center text-xs',
          theme === 'dark'
            ? 'bg-on-primary-container text-primary-container'
            : 'bg-on-surface text-surface'
        )}
        animate={{
          x: theme === 'dark' ? 24 : 0
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
        {theme === 'dark' ? '🌙' : '☀️'}
      </motion.div>
      
      {/* 배경 아이콘들 */}
      <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
        <motion.span
          className={cn(
            'text-xs transition-opacity',
            theme === 'light' ? 'opacity-60' : 'opacity-30'
          )}
          animate={{
            opacity: theme === 'light' ? 0.6 : 0.3
          }}
        >
          ☀️
        </motion.span>
        <motion.span
          className={cn(
            'text-xs transition-opacity',
            theme === 'dark' ? 'opacity-60' : 'opacity-30'
          )}
          animate={{
            opacity: theme === 'dark' ? 0.6 : 0.3
          }}
        >
          🌙
        </motion.span>
      </div>
    </motion.button>
  );
}