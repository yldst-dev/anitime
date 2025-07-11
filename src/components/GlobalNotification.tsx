import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

interface NotificationMessage {
  id: string;
  message: string;
  type: 'subscribe' | 'unsubscribe' | 'error';
  duration?: number;
}

interface NotificationContextType {
  showNotification: (message: string, type: NotificationMessage['type'], duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotification() {
  const context = useContext(NotificationContext);
  
  // SSR 환경에서는 기본값 반환
  if (typeof window === 'undefined') {
    return {
      showNotification: () => {}
    };
  }
  
  if (!context) {
    // Provider가 없을 때도 기본값 반환 (에러 대신)
    return {
      showNotification: () => {}
    };
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const showNotification = (message: string, type: NotificationMessage['type'], duration: number = 3000) => {
    const id = Date.now().toString();
    const newNotification: NotificationMessage = { id, message, type, duration };
    
    setNotifications(prev => [...prev, newNotification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, duration);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationStyles = (type: NotificationMessage['type']) => {
    switch (type) {
      case 'subscribe':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border-green-200 dark:border-green-700';
      case 'unsubscribe':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border-blue-200 dark:border-blue-700';
      case 'error':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border-red-200 dark:border-red-700';
      default:
        return 'bg-surface-container text-on-surface border-outline-variant';
    }
  };

  const getNotificationIcon = (type: NotificationMessage['type']) => {
    switch (type) {
      case 'subscribe':
        return '💖';
      case 'unsubscribe':
        return '🤍';
      case 'error':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* 글로벌 알림 컨테이너 */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col-reverse gap-2 pointer-events-none">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border pointer-events-auto',
                'min-w-80 max-w-96',
                getNotificationStyles(notification.type)
              )}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.8, rotateX: -10 }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 25,
                duration: 0.4
              }}
              onClick={() => removeNotification(notification.id)}
            >
              <span className="text-2xl flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </span>
              <div className="flex-1">
                <p className="font-medium text-sm leading-relaxed">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                className="ml-2 text-current opacity-70 hover:opacity-100 transition-opacity"
                aria-label="알림 닫기"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

// 구독 관련 알림을 위한 헬퍼 훅
export function useSubscriptionNotification() {
  const { showNotification } = useNotification();

  return {
    showSubscribeSuccess: (animeTitle: string) => {
      showNotification(`${animeTitle} 구독이 추가되었습니다!`, 'subscribe');
    },
    showUnsubscribeSuccess: (animeTitle: string) => {
      showNotification(`${animeTitle} 구독이 해제되었습니다.`, 'unsubscribe');
    },
    showSubscribeError: () => {
      showNotification('구독 처리 중 오류가 발생했습니다.', 'error');
    }
  };
}