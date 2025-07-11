import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface LoadingIndicatorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'contained';
}

const shapeVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 360],
    borderRadius: ['12px', '50%', '20px', '8px', '16px', '28px', '4px', '12px'],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
    }
  }
};

export function LoadingIndicator({ 
  className, 
  size = 'md', 
  variant = 'default' 
}: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const baseClasses = cn(
    'bg-primary',
    sizeClasses[size],
    variant === 'contained' && 'bg-surface-container p-2 rounded-lg',
    className
  );

  const indicatorClasses = cn(
    'bg-primary',
    variant === 'contained' ? 'w-4 h-4' : sizeClasses[size]
  );

  return (
    <div className={baseClasses}>
      <motion.div
        className={indicatorClasses}
        variants={shapeVariants}
        animate="animate"
      />
    </div>
  );
}