import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { AnimeItem } from '../types/anime';
import { 
  subscribeToAnime, 
  unsubscribeFromAnime, 
  isSubscribed, 
  updateSubscriptionStatus 
} from '../utils/subscription';
import { useSubscriptionNotification } from './GlobalNotification';

interface SubscribeButtonProps {
  anime: AnimeItem;
  variant?: 'default' | 'icon' | 'compact';
  className?: string;
  onSubscriptionChange?: (isSubscribed: boolean) => void;
}

export function SubscribeButton({ 
  anime, 
  variant = 'default', 
  className,
  onSubscriptionChange 
}: SubscribeButtonProps) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { showSubscribeSuccess, showUnsubscribeSuccess, showSubscribeError } = useSubscriptionNotification();

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 구독 상태 확인 (클라이언트에서만)
  useEffect(() => {
    if (mounted) {
      setSubscribed(isSubscribed(anime.animeNo));
    }
  }, [anime.animeNo, mounted]);

  // 스토리지 변경 감지
  useEffect(() => {
    if (!mounted) return;

    const handleStorageChange = () => {
      setSubscribed(isSubscribed(anime.animeNo));
    };

    // localStorage 변경 감지
    window.addEventListener('storage', handleStorageChange);
    
    // 주기적으로 상태 확인 (다른 탭에서의 변경사항 반영)
    const interval = setInterval(() => {
      const currentState = isSubscribed(anime.animeNo);
      if (currentState !== subscribed) {
        setSubscribed(currentState);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [anime.animeNo, mounted, subscribed]);

  const handleSubscribe = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return; // 중복 클릭 방지
    
    console.log('하트 클릭됨:', anime.subject, subscribed ? '구독해제' : '구독');
    setLoading(true);
    
    try {
      if (subscribed) {
        unsubscribeFromAnime(anime.animeNo);
        setSubscribed(false);
        showUnsubscribeSuccess(anime.subject);
        console.log('구독 해제:', anime.subject);
        onSubscriptionChange?.(false);
        
        // 브라우저 환경에서 스토리지 이벤트 강제 발생
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'anime-subscriptions',
            newValue: localStorage.getItem('anime-subscriptions')
          }));
        }
      } else {
        subscribeToAnime(anime);
        setSubscribed(true);
        showSubscribeSuccess(anime.subject);
        console.log('구독 추가:', anime.subject);
        onSubscriptionChange?.(true);
        
        // 브라우저 환경에서 스토리지 이벤트 강제 발생
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'anime-subscriptions',
            newValue: localStorage.getItem('anime-subscriptions')
          }));
        }
      }
    } catch (error) {
      console.error('구독 처리 중 오류:', error);
      showSubscribeError();
      // 오류 발생 시 상태 되돌리기
      setSubscribed(isSubscribed(anime.animeNo));
    } finally {
      setLoading(false);
    }
  };

  // 구독 상태 업데이트
  useEffect(() => {
    if (subscribed) {
      updateSubscriptionStatus(anime.animeNo, anime);
    }
  }, [anime, subscribed]);

  const getButtonContent = () => {
    if (variant === 'icon') {
      return (
        <span className="text-lg">
          {subscribed ? '💖' : '🤍'}
        </span>
      );
    }
    
    if (variant === 'compact') {
      return (
        <div className="flex items-center gap-1">
          <span className="text-sm">
            {subscribed ? '💖' : '🤍'}
          </span>
          <span className="text-xs font-medium">
            {subscribed ? '구독중' : '구독'}
          </span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg">
          {subscribed ? '💖' : '🤍'}
        </span>
        <span className="font-medium">
          {subscribed ? '구독중' : '구독하기'}
        </span>
      </div>
    );
  };

  const getButtonStyles = () => {
    const baseStyles = cn(
      'relative transition-all duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      className
    );

    if (variant === 'icon') {
      return cn(
        baseStyles,
        'w-10 h-10 rounded-full flex items-center justify-center',
        subscribed
          ? 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary'
          : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
      );
    }

    if (variant === 'compact') {
      return cn(
        baseStyles,
        'px-3 py-1.5 rounded-md text-xs',
        subscribed
          ? 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary'
          : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
      );
    }

    return cn(
      baseStyles,
      'px-4 py-2 rounded-lg',
      subscribed
        ? 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary'
        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
    );
  };

  // 클라이언트에서만 렌더링
  if (!mounted) {
    return (
      <div className={cn(
        'p-2 rounded-full bg-surface-container-high',
        variant === 'icon' ? 'w-10 h-10' : 'px-4 py-2'
      )}>
        <span className="text-lg">🤍</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={handleSubscribe}
        disabled={loading}
        className={getButtonStyles()}
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        type="button"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {variant !== 'icon' && (
              <span className="text-sm">처리중...</span>
            )}
          </div>
        ) : (
          getButtonContent()
        )}
      </motion.button>
    </div>
  );
}

// 구독 상태 표시 배지
export function SubscriptionBadge({ 
  anime, 
  className 
}: { 
  anime: AnimeItem; 
  className?: string; 
}) {
  const [subscribed, setSubscribed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setSubscribed(isSubscribed(anime.animeNo));
    }
  }, [anime.animeNo, mounted]);

  // 스토리지 변경 감지
  useEffect(() => {
    if (!mounted) return;

    const handleStorageChange = () => {
      setSubscribed(isSubscribed(anime.animeNo));
    };

    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(() => {
      const currentState = isSubscribed(anime.animeNo);
      if (currentState !== subscribed) {
        setSubscribed(currentState);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [anime.animeNo, mounted, subscribed]);

  // 💖 이모지가 이미 구독 상태를 표시하므로 배지는 필요 없음
  return null;
}

// 구독 통계 표시
export function SubscriptionStats({ 
  className 
}: { 
  className?: string; 
}) {
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    hasNewUpdates: 0,
    onAirCount: 0,
    totalCaptionUpdates: 0
  });

  useEffect(() => {
    const updateStats = () => {
      const currentStats = {
        totalSubscriptions: 0,
        hasNewUpdates: 0,
        onAirCount: 0,
        totalCaptionUpdates: 0
      };
      
      // 브라우저 환경에서만 실행
      if (typeof window === 'undefined') {
        setStats(currentStats);
        return;
      }
      
      try {
        const subscriptions = JSON.parse(localStorage.getItem('anime-subscriptions') || '{"subscriptions": []}');
        if (subscriptions.subscriptions) {
          currentStats.totalSubscriptions = subscriptions.subscriptions.length;
          currentStats.hasNewUpdates = subscriptions.subscriptions.filter((sub: any) => sub.isNewEpisode).length;
          currentStats.onAirCount = subscriptions.subscriptions.filter((sub: any) => sub.status === 'ON').length;
          currentStats.totalCaptionUpdates = subscriptions.subscriptions.reduce((sum: number, sub: any) => sum + (sub.captionUpdates?.length || 0), 0);
        }
      } catch (error) {
        console.error('구독 통계 로드 실패:', error);
      }
      
      setStats(currentStats);
    };

    updateStats();
    
    // 브라우저 환경에서만 이벤트 리스너 등록
    if (typeof window !== 'undefined') {
      // 스토리지 변경 감지
      const handleStorageChange = () => {
        updateStats();
      };

      window.addEventListener('storage', handleStorageChange);
      
      // 주기적으로 업데이트 (다른 탭에서의 변경사항 반영)
      const interval = setInterval(updateStats, 5000);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, []);

  if (stats.totalSubscriptions === 0) return null;

  return (
    <motion.div
      key={`subscription-stats-${stats.totalSubscriptions}`}
      className={cn(
        'grid grid-cols-2 gap-2 p-3 bg-surface-container rounded-lg',
        'border border-outline-variant',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ 
        opacity: 0, 
        y: -15, 
        scale: 0.9,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 25,
          duration: 0.4
        }
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <div className="text-lg font-bold text-primary">{stats.totalSubscriptions}</div>
        <div className="text-xs text-on-surface-variant">구독중</div>
      </div>
      
      <div className="text-center">
        <div className="text-lg font-bold text-secondary">{stats.onAirCount}</div>
        <div className="text-xs text-on-surface-variant">방영중</div>
      </div>
      
      {stats.hasNewUpdates > 0 && (
        <div className="text-center col-span-2">
          <div className="text-lg font-bold text-tertiary">{stats.hasNewUpdates}</div>
          <div className="text-xs text-on-surface-variant">새 업데이트</div>
        </div>
      )}
    </motion.div>
  );
}