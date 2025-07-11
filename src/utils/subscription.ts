import { AnimeItem } from '../types/anime';

export interface SubscribedAnime extends AnimeItem {
  subscribedAt: string;
  lastChecked: string;
  lastUpdated: string;
  captionUpdates: CaptionUpdate[];
  isNewEpisode: boolean;
}

export interface CaptionUpdate {
  date: string;
  previousCount: number;
  currentCount: number;
  isNewUpdate: boolean;
}

export interface SubscriptionStorage {
  subscriptions: SubscribedAnime[];
  lastGlobalCheck: string;
}

const STORAGE_KEY = 'anime-subscriptions';

// 로컬 스토리지에서 구독 데이터 가져오기
export function getSubscriptions(): SubscribedAnime[] {
  // 브라우저 환경에서만 실행
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed: SubscriptionStorage = JSON.parse(data);
    return parsed.subscriptions || [];
  } catch (error) {
    console.error('구독 데이터를 불러오는데 실패했습니다:', error);
    return [];
  }
}

// 로컬 스토리지에 구독 데이터 저장
export function saveSubscriptions(subscriptions: SubscribedAnime[]): void {
  // 브라우저 환경에서만 실행
  if (typeof window === 'undefined') return;
  
  try {
    const data: SubscriptionStorage = {
      subscriptions,
      lastGlobalCheck: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('구독 데이터를 저장하는데 실패했습니다:', error);
  }
}

// 작품 구독 추가
export function subscribeToAnime(anime: AnimeItem): void {
  const subscriptions = getSubscriptions();
  
  // 이미 구독중인지 확인
  const existingIndex = subscriptions.findIndex(sub => sub.animeNo === anime.animeNo);
  
  if (existingIndex === -1) {
    const newSubscription: SubscribedAnime = {
      ...anime,
      subscribedAt: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      captionUpdates: [],
      isNewEpisode: false
    };
    
    subscriptions.push(newSubscription);
    saveSubscriptions(subscriptions);
  }
}

// 작품 구독 해제
export function unsubscribeFromAnime(animeNo: number): void {
  const subscriptions = getSubscriptions();
  const filtered = subscriptions.filter(sub => sub.animeNo !== animeNo);
  saveSubscriptions(filtered);
}

// 구독 상태 확인
export function isSubscribed(animeNo: number): boolean {
  const subscriptions = getSubscriptions();
  return subscriptions.some(sub => sub.animeNo === animeNo);
}

// 구독 작품 상태 업데이트
export function updateSubscriptionStatus(animeNo: number, currentAnime: AnimeItem): void {
  const subscriptions = getSubscriptions();
  const index = subscriptions.findIndex(sub => sub.animeNo === animeNo);
  
  if (index !== -1) {
    const subscription = subscriptions[index];
    const now = new Date().toISOString();
    
    // 자막 수 변경 확인
    const captionCountChanged = subscription.captionCount !== currentAnime.captionCount;
    
    if (captionCountChanged) {
      // 자막 업데이트 기록 추가
      subscription.captionUpdates.push({
        date: now,
        previousCount: subscription.captionCount,
        currentCount: currentAnime.captionCount,
        isNewUpdate: true
      });
      
      // 최근 10개 업데이트만 유지
      if (subscription.captionUpdates.length > 10) {
        subscription.captionUpdates = subscription.captionUpdates.slice(-10);
      }
      
      subscription.lastUpdated = now;
    }
    
    // 현재 데이터로 업데이트
    subscriptions[index] = {
      ...subscription,
      ...currentAnime,
      subscribedAt: subscription.subscribedAt,
      lastChecked: now,
      lastUpdated: captionCountChanged ? now : subscription.lastUpdated,
      captionUpdates: subscription.captionUpdates,
      isNewEpisode: captionCountChanged
    };
    
    saveSubscriptions(subscriptions);
  }
}

// 구독 작품 통계
export function getSubscriptionStats(): {
  totalSubscriptions: number;
  hasNewUpdates: number;
  onAirCount: number;
  totalCaptionUpdates: number;
} {
  const subscriptions = getSubscriptions();
  
  return {
    totalSubscriptions: subscriptions.length,
    hasNewUpdates: subscriptions.filter(sub => sub.isNewEpisode).length,
    onAirCount: subscriptions.filter(sub => sub.status === 'ON').length,
    totalCaptionUpdates: subscriptions.reduce((sum, sub) => sum + sub.captionUpdates.length, 0)
  };
}

// 새로운 업데이트 알림 읽음 처리
export function markUpdatesAsRead(animeNo: number): void {
  const subscriptions = getSubscriptions();
  const index = subscriptions.findIndex(sub => sub.animeNo === animeNo);
  
  if (index !== -1) {
    subscriptions[index].isNewEpisode = false;
    subscriptions[index].captionUpdates = subscriptions[index].captionUpdates.map(update => ({
      ...update,
      isNewUpdate: false
    }));
    
    saveSubscriptions(subscriptions);
  }
}

// 전체 업데이트 읽음 처리
export function markAllUpdatesAsRead(): void {
  const subscriptions = getSubscriptions();
  const updated = subscriptions.map(sub => ({
    ...sub,
    isNewEpisode: false,
    captionUpdates: sub.captionUpdates.map(update => ({
      ...update,
      isNewUpdate: false
    }))
  }));
  
  saveSubscriptions(updated);
}

// 오래된 업데이트 기록 정리 (30일 이상)
export function cleanupOldUpdates(): void {
  const subscriptions = getSubscriptions();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const cleaned = subscriptions.map(sub => ({
    ...sub,
    captionUpdates: sub.captionUpdates.filter(update => 
      new Date(update.date) > thirtyDaysAgo
    )
  }));
  
  saveSubscriptions(cleaned);
}

// 구독 데이터 내보내기
export function exportSubscriptions(): string {
  const subscriptions = getSubscriptions();
  return JSON.stringify(subscriptions, null, 2);
}

// 구독 데이터 가져오기
export function importSubscriptions(data: string): boolean {
  try {
    const parsed = JSON.parse(data) as SubscribedAnime[];
    
    // 데이터 유효성 검증
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid data format');
    }
    
    // 기존 구독과 병합
    const existing = getSubscriptions();
    const merged = [...existing];
    
    parsed.forEach(importedSub => {
      const existingIndex = merged.findIndex(sub => sub.animeNo === importedSub.animeNo);
      if (existingIndex === -1) {
        merged.push(importedSub);
      } else {
        // 더 최근 데이터로 업데이트
        if (new Date(importedSub.lastUpdated) > new Date(merged[existingIndex].lastUpdated)) {
          merged[existingIndex] = importedSub;
        }
      }
    });
    
    saveSubscriptions(merged);
    return true;
  } catch (error) {
    console.error('구독 데이터 가져오기 실패:', error);
    return false;
  }
}