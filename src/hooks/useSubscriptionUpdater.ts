import { useEffect, useCallback } from 'react';
import { AnimeItem, AnimeScheduleResponse, WeekType } from '../types/anime';
import { 
  getSubscriptions, 
  updateSubscriptionStatus, 
  SubscribedAnime 
} from '../utils/subscription';

export function useSubscriptionUpdater(interval: number = 60000) { // 기본 1분마다
  const fetchAnimeData = useCallback(async (week: WeekType): Promise<AnimeItem[]> => {
    try {
      const response = await fetch(`https://api.anissia.net/anime/schedule/${week}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const apiResponse: AnimeScheduleResponse = await response.json();
      
      if (apiResponse.code === 'ok' && apiResponse.data) {
        return apiResponse.data;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error(`Failed to fetch week ${week} data:`, error);
      return [];
    }
  }, []);

  const updateSubscriptionData = useCallback(async () => {
    try {
      const subscriptions = getSubscriptions();
      
      if (subscriptions.length === 0) {
        return;
      }

      console.log(`Updating ${subscriptions.length} subscriptions...`);

      // 모든 요일 데이터를 가져오기
      const weeks: WeekType[] = [0, 1, 2, 3, 4, 5, 6];
      const allWeekData = await Promise.all(
        weeks.map(week => fetchAnimeData(week))
      );

      // 모든 애니메이션 데이터를 하나의 배열로 합치기
      const allAnimeData = allWeekData.flat();

      // 구독 작품들의 상태 업데이트
      let updatedCount = 0;
      subscriptions.forEach(subscription => {
        const currentAnime = allAnimeData.find(
          anime => anime.animeNo === subscription.animeNo
        );

        if (currentAnime) {
          // 자막 수나 상태가 변경되었는지 확인
          if (
            currentAnime.captionCount !== subscription.captionCount ||
            currentAnime.status !== subscription.status
          ) {
            updateSubscriptionStatus(subscription.animeNo, currentAnime);
            updatedCount++;
          }
        }
      });

      if (updatedCount > 0) {
        console.log(`Updated ${updatedCount} subscriptions with new data`);
        
        // 업데이트가 있었다면 storage 이벤트 발생 (브라우저에서만)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'anime-subscriptions',
            newValue: localStorage.getItem('anime-subscriptions')
          }));
        }
      }
    } catch (error) {
      console.error('Failed to update subscription data:', error);
    }
  }, [fetchAnimeData]);

  useEffect(() => {
    // 초기 실행
    updateSubscriptionData();

    // 주기적 업데이트 설정
    const intervalId = setInterval(updateSubscriptionData, interval);

    // 페이지 포커스 시 업데이트
    const handleFocus = () => {
      updateSubscriptionData();
    };

    // 브라우저 환경에서만 이벤트 리스너 등록
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleFocus);
    }

    return () => {
      clearInterval(intervalId);
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', handleFocus);
      }
    };
  }, [updateSubscriptionData, interval]);

  return { updateSubscriptionData };
}

// 구독 알림 관리 훅
export function useSubscriptionNotifications() {
  const checkForUpdates = useCallback(() => {
    const subscriptions = getSubscriptions();
    const hasUpdates = subscriptions.some(sub => sub.isNewEpisode);
    
    return {
      hasUpdates,
      updateCount: subscriptions.filter(sub => sub.isNewEpisode).length,
      totalSubscriptions: subscriptions.length
    };
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return Notification.permission === 'granted';
  }, []);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
  }, []);

  return {
    checkForUpdates,
    requestNotificationPermission,
    sendNotification
  };
}

// 구독 작품 실시간 상태 관리 훅
export function useSubscriptionStatus() {
  const { updateSubscriptionData } = useSubscriptionUpdater(30000); // 30초마다
  const { checkForUpdates, sendNotification } = useSubscriptionNotifications();

  useEffect(() => {
    let lastUpdateCount = 0;

    const checkAndNotify = () => {
      const { hasUpdates, updateCount } = checkForUpdates();
      
      if (updateCount > lastUpdateCount && lastUpdateCount > 0) {
        const newUpdates = updateCount - lastUpdateCount;
        sendNotification(
          `새로운 자막 업데이트 ${newUpdates}개`,
          {
            body: '구독한 애니메이션에 새로운 자막이 업로드되었습니다.',
            tag: 'subscription-update'
          }
        );
      }
      
      lastUpdateCount = updateCount;
    };

    // 스토리지 변경 감지
    // 브라우저 환경에서만 이벤트 리스너 등록
    let handleStorageChange: (() => void) | null = null;
    
    if (typeof window !== 'undefined') {
      handleStorageChange = () => {
        checkAndNotify();
      };
      window.addEventListener('storage', handleStorageChange);
    }
    
    // 주기적 확인
    const interval = setInterval(checkAndNotify, 60000); // 1분마다

    return () => {
      if (typeof window !== 'undefined' && handleStorageChange) {
        window.removeEventListener('storage', handleStorageChange);
      }
      clearInterval(interval);
    };
  }, [checkForUpdates, sendNotification]);

  return { updateSubscriptionData };
}