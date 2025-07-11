import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { useSubscriptionNotifications } from '../hooks/useSubscriptionUpdater';
import { getSubscriptionStats } from '../utils/subscription';

interface NotificationManagerProps {
  className?: string;
}

export function NotificationManager({ className }: NotificationManagerProps) {
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const { requestNotificationPermission, sendNotification, checkForUpdates } = useSubscriptionNotifications();

  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
      
      // 구독이 있지만 알림 권한이 없는 경우 권한 요청 표시
      const stats = getSubscriptionStats();
      if (stats.totalSubscriptions > 0 && Notification.permission === 'default') {
        setShowPermissionRequest(true);
      }
    }
  }, []);

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
    setShowPermissionRequest(false);
    
    if (granted) {
      sendNotification('알림이 활성화되었습니다!', {
        body: '구독한 애니메이션의 새로운 업데이트를 실시간으로 받아보세요.',
        tag: 'notification-enabled'
      });
    }
  };

  const handleDismiss = () => {
    setShowPermissionRequest(false);
  };

  // 서버 사이드에서는 렌더링하지 않음
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPermissionRequest && (
        <motion.div
          className={cn(
            'fixed top-4 right-4 z-50 max-w-sm',
            'bg-surface-container border border-outline-variant rounded-lg p-4 shadow-lg',
            className
          )}
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">🔔</div>
            <div className="flex-1">
              <h4 className="font-semibold text-on-surface mb-1">
                알림 권한 요청
              </h4>
              <p className="text-sm text-on-surface-variant mb-3">
                구독한 애니메이션의 새로운 자막 업데이트를 알림으로 받아보시겠습니까?
              </p>
              <div className="flex gap-2">
                <motion.button
                  onClick={handleRequestPermission}
                  className="px-3 py-1.5 text-sm bg-primary text-on-primary rounded-md hover:bg-primary/90"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  허용
                </motion.button>
                <motion.button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 text-sm bg-surface-container-high text-on-surface rounded-md hover:bg-surface-container-highest"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  나중에
                </motion.button>
              </div>
            </div>
            <motion.button
              onClick={handleDismiss}
              className="text-on-surface-variant hover:text-on-surface"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 알림 상태 표시 컴포넌트
export function NotificationStatus({ className }: { className?: string }) {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const { requestNotificationPermission } = useSubscriptionNotifications();

  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const handleToggleNotification = async () => {
    if (permissionStatus === 'default') {
      const granted = await requestNotificationPermission();
      setPermissionStatus(granted ? 'granted' : 'denied');
    }
  };

  // 서버 사이드에서는 렌더링하지 않음
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  const getStatusInfo = () => {
    switch (permissionStatus) {
      case 'granted':
        return {
          icon: '🔔',
          text: '알림 활성화됨',
          color: 'text-secondary',
          bgColor: 'bg-secondary-container'
        };
      case 'denied':
        return {
          icon: '🔕',
          text: '알림 비활성화됨',
          color: 'text-error',
          bgColor: 'bg-error-container'
        };
      default:
        return {
          icon: '🔔',
          text: '알림 설정',
          color: 'text-on-surface-variant',
          bgColor: 'bg-surface-container'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <motion.button
      onClick={handleToggleNotification}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
        statusInfo.bgColor,
        statusInfo.color,
        'hover:opacity-80 transition-opacity',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={permissionStatus === 'denied'}
    >
      <span>{statusInfo.icon}</span>
      <span>{statusInfo.text}</span>
    </motion.button>
  );
}

// 인앱 알림 토스트
export function NotificationToast({
  message,
  type = 'info',
  duration = 5000,
  onDismiss
}: {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onDismiss?: () => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-secondary-container',
          text: 'text-on-secondary-container',
          icon: '✅'
        };
      case 'warning':
        return {
          bg: 'bg-tertiary-container',
          text: 'text-on-tertiary-container',
          icon: '⚠️'
        };
      case 'error':
        return {
          bg: 'bg-error-container',
          text: 'text-on-error-container',
          icon: '❌'
        };
      default:
        return {
          bg: 'bg-primary-container',
          text: 'text-on-primary-container',
          icon: 'ℹ️'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={cn(
            'fixed bottom-4 right-4 z-50 max-w-sm',
            'rounded-lg p-4 shadow-lg',
            styles.bg,
            styles.text
          )}
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg">{styles.icon}</span>
            <div className="flex-1">
              <p className="text-sm">{message}</p>
            </div>
            <motion.button
              onClick={() => setVisible(false)}
              className="opacity-70 hover:opacity-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}