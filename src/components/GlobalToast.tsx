import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // 브라우저 환경이 아닌 경우 기본값 반환
    if (typeof window === 'undefined') {
      return {
        showToast: () => {}
      };
    }
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastMessage['type'] = 'info', duration: number = 3000) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // 자동 제거
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-secondary-container',
          text: 'text-on-secondary-container',
          border: 'border-secondary',
          icon: '✅'
        };
      case 'warning':
        return {
          bg: 'bg-tertiary-container',
          text: 'text-on-tertiary-container',
          border: 'border-tertiary',
          icon: '⚠️'
        };
      case 'error':
        return {
          bg: 'bg-error-container',
          text: 'text-on-error-container',
          border: 'border-error',
          icon: '❌'
        };
      default:
        return {
          bg: 'bg-primary-container',
          text: 'text-on-primary-container',
          border: 'border-primary',
          icon: 'ℹ️'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <motion.div
      className={cn(
        'rounded-lg p-4 shadow-lg border backdrop-blur-sm',
        'flex items-start gap-3 min-w-[280px] max-w-[400px]',
        styles.bg,
        styles.text,
        styles.border
      )}
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ 
        type: 'spring', 
        stiffness: 500, 
        damping: 30,
        duration: 0.3 
      }}
      layout
    >
      {/* 아이콘 */}
      <span className="text-lg flex-shrink-0 mt-0.5">
        {styles.icon}
      </span>
      
      {/* 메시지 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium break-words">
          {toast.message}
        </p>
      </div>
      
      {/* 닫기 버튼 */}
      <motion.button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="text-sm">✕</span>
      </motion.button>
    </motion.div>
  );
}

// 구독 전용 토스트 훅
export function useSubscriptionToast() {
  const { showToast } = useToast();
  
  // 브라우저 환경이 아닌 경우 기본값 반환
  if (typeof window === 'undefined') {
    return {
      showSubscribeSuccess: () => {},
      showUnsubscribeSuccess: () => {},
      showSubscribeError: () => {}
    };
  }

  const showSubscribeSuccess = (animeTitle: string) => {
    showToast(`${animeTitle} 구독이 완료되었습니다`, 'success');
  };

  const showUnsubscribeSuccess = (animeTitle: string) => {
    showToast(`${animeTitle} 구독이 취소되었습니다`, 'info');
  };

  const showSubscribeError = () => {
    showToast('구독 처리 중 오류가 발생했습니다', 'error');
  };

  return {
    showSubscribeSuccess,
    showUnsubscribeSuccess,
    showSubscribeError
  };
}