import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '../utils/cn';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ 
  value, 
  onChange, 
  placeholder = "애니메이션 제목, 장르로 검색...",
  className 
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
  };

  return (
    <motion.div
      className={cn(
        'relative flex items-center',
        'bg-surface-container rounded-lg border border-outline-variant',
        'transition-colors duration-200',
        isFocused && 'border-primary',
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 검색 아이콘 */}
      <div className="absolute left-3 flex items-center pointer-events-none">
        <svg 
          className="w-5 h-5 text-on-surface-variant" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>

      {/* 입력 필드 */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          'w-full px-10 py-3 bg-transparent',
          'text-on-surface placeholder-on-surface-variant',
          'focus:outline-none'
        )}
      />

      {/* 클리어 버튼 */}
      {value && (
        <motion.button
          onClick={handleClear}
          className={cn(
            'absolute right-3 p-1 rounded-full',
            'text-on-surface-variant hover:text-on-surface',
            'hover:bg-surface-container-high',
            'transition-colors duration-200'
          )}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      )}

      {/* 포커스 상태 표시 */}
      {isFocused && (
        <motion.div
          className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
}