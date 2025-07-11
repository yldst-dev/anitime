import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { 
  getSubscriptions, 
  markAllUpdatesAsRead, 
  markUpdatesAsRead, 
  cleanupOldUpdates,
  exportSubscriptions,
  importSubscriptions,
  SubscribedAnime,
  getSubscriptionStats
} from '../utils/subscription';
import { SubscribeButton } from './SubscribeButton';
import { SearchInput } from './SearchInput';
import { LoadingIndicator } from './LoadingIndicator';
import { WeekDayBadge } from './AnimeCard';

interface SubscriptionsPageProps {
  className?: string;
}

export function SubscriptionsPage({ className }: SubscriptionsPageProps) {
  const [subscriptions, setSubscriptions] = useState<SubscribedAnime[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'updated' | 'alphabetical'>('recent');
  const [filterBy, setFilterBy] = useState<'all' | 'updated' | 'onair' | 'off'>('all');
  const [showStats, setShowStats] = useState(true);

  // 구독 데이터 로드
  useEffect(() => {
    const loadSubscriptions = () => {
      setLoading(true);
      try {
        const subs = getSubscriptions();
        setSubscriptions(subs);
      } catch (error) {
        console.error('구독 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();
    
    // 브라우저 환경에서만 이벤트 리스너 등록
    if (typeof window !== 'undefined') {
      // 스토리지 변경 감지
      const handleStorageChange = () => {
        loadSubscriptions();
      };

      window.addEventListener('storage', handleStorageChange);
      
      // 주기적으로 업데이트
      const interval = setInterval(loadSubscriptions, 10000);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, []);

  // 필터링 및 정렬된 구독 목록
  const filteredAndSortedSubscriptions = useMemo(() => {
    let filtered = subscriptions;

    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sub => 
        sub.subject.toLowerCase().includes(query) ||
        sub.originalSubject?.toLowerCase().includes(query) ||
        sub.genres.toLowerCase().includes(query)
      );
    }

    // 상태 필터
    if (filterBy === 'updated') {
      filtered = filtered.filter(sub => sub.isNewEpisode);
    } else if (filterBy === 'onair') {
      filtered = filtered.filter(sub => sub.status === 'ON');
    } else if (filterBy === 'off') {
      filtered = filtered.filter(sub => sub.status === 'OFF');
    }

    // 정렬
    filtered.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime();
      } else if (sortBy === 'updated') {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      } else {
        return a.subject.localeCompare(b.subject);
      }
    });

    return filtered;
  }, [subscriptions, searchQuery, sortBy, filterBy]);

  // 통계 정보
  const stats = useMemo(() => getSubscriptionStats(), [subscriptions]);

  const handleMarkAllAsRead = () => {
    markAllUpdatesAsRead();
    setSubscriptions(getSubscriptions());
  };

  const handleMarkAsRead = (animeNo: number) => {
    markUpdatesAsRead(animeNo);
    setSubscriptions(getSubscriptions());
  };

  const handleExport = () => {
    const data = exportSubscriptions();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anime-subscriptions-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (importSubscriptions(content)) {
          setSubscriptions(getSubscriptions());
          alert('구독 데이터를 성공적으로 가져왔습니다!');
        } else {
          alert('구독 데이터 가져오기에 실패했습니다.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCleanup = () => {
    cleanupOldUpdates();
    setSubscriptions(getSubscriptions());
  };

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center py-20', className)}>
        <LoadingIndicator size="lg" />
      </div>
    );
  }

  return (
    <div className={cn('w-full max-w-7xl mx-auto p-4', className)}>

      {/* 통계 */}
      {showStats && stats.totalSubscriptions > 0 && (
        <motion.div
          className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-primary-container text-on-primary-container rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{stats.totalSubscriptions}</div>
            <div className="text-sm opacity-75">총 구독 작품</div>
          </div>
          
          <div className="bg-secondary-container text-on-secondary-container rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{stats.onAirCount}</div>
            <div className="text-sm opacity-75">방영중</div>
          </div>
          
          <div className="bg-tertiary-container text-on-tertiary-container rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{stats.hasNewUpdates}</div>
            <div className="text-sm opacity-75">새 업데이트</div>
          </div>
          
          <div className="bg-surface-container text-on-surface rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{stats.totalCaptionUpdates}</div>
            <div className="text-sm opacity-75">총 업데이트</div>
          </div>
        </motion.div>
      )}

      {/* 컨트롤 */}
      {subscriptions.length > 0 && (
        <motion.div
          className="mb-6 space-y-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* 검색 */}
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`${subscriptions.length}개 구독 작품에서 검색...`}
          />

          {/* 필터 및 정렬 */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="px-3 py-2 rounded-lg bg-surface-container text-on-surface text-sm"
              >
                <option value="all">전체 보기</option>
                <option value="updated">새 업데이트</option>
                <option value="onair">방영중</option>
                <option value="off">결방</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-lg bg-surface-container text-on-surface text-sm"
              >
                <option value="recent">최근 구독순</option>
                <option value="updated">최근 업데이트순</option>
                <option value="alphabetical">가나다순</option>
              </select>
            </div>

            <div className="flex gap-2">
              {stats.hasNewUpdates > 0 && (
                <motion.button
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-2 text-sm rounded-lg bg-primary text-on-primary hover:bg-primary/90"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  모두 읽음
                </motion.button>
              )}
              
              <motion.button
                onClick={handleExport}
                className="px-3 py-2 text-sm rounded-lg bg-secondary-container text-on-secondary-container hover:bg-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                내보내기
              </motion.button>
              
              <motion.label
                className="px-3 py-2 text-sm rounded-lg bg-tertiary-container text-on-tertiary-container hover:bg-tertiary cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                가져오기
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </motion.label>
            </div>
          </div>
        </motion.div>
      )}

      {/* 구독 목록 */}
      <div className="min-h-[400px]">
        {subscriptions.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl mb-4">💖</div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">
              구독한 작품이 없습니다
            </h3>
            <p className="text-on-surface-variant text-center max-w-md">
              관심있는 애니메이션을 구독하면 자막 업데이트를 쉽게 확인할 수 있습니다
            </p>
          </motion.div>
        ) : filteredAndSortedSubscriptions.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-on-surface-variant text-center max-w-md">
              다른 검색어를 시도하거나 필터를 변경해보세요
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedSubscriptions.map((subscription, index) => (
                <SubscriptionCard
                  key={subscription.animeNo}
                  subscription={subscription}
                  onMarkAsRead={handleMarkAsRead}
                  delay={index * 0.1}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// 구독 카드 컴포넌트
function SubscriptionCard({ 
  subscription, 
  onMarkAsRead, 
  delay = 0 
}: { 
  subscription: SubscribedAnime; 
  onMarkAsRead: (animeNo: number) => void;
  delay?: number;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSince = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    return '방금 전';
  };

  return (
    <motion.div
      className={cn(
        'bg-surface-container rounded-lg p-4 border',
        'border-outline-variant relative overflow-hidden',
        subscription.isNewEpisode && 'border-primary bg-primary-container/10'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay, duration: 0.3 }}
      layout
    >
      {/* 새 업데이트 뱃지 */}
      {subscription.isNewEpisode && (
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}

      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-on-surface text-lg leading-tight mb-1">
            {subscription.subject}
          </h3>
          {subscription.originalSubject && (
            <p className="text-sm text-on-surface-variant">
              {subscription.originalSubject}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn(
            'text-xs px-2 py-1 rounded-full font-medium',
            subscription.status === 'ON' 
              ? 'bg-secondary-container text-on-secondary-container'
              : 'bg-error-container text-on-error-container'
          )}>
            {subscription.status === 'ON' ? '방영중' : '결방'}
          </span>
          
          <WeekDayBadge anime={subscription} showInSearch={true} />
          
          <SubscribeButton 
            anime={subscription} 
            variant="icon" 
            onSubscriptionChange={() => window.location.reload()}
          />
        </div>
      </div>

      {/* 정보 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-on-surface-variant">자막 참여자</span>
          <span className="font-medium text-on-surface">{subscription.captionCount}명</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-on-surface-variant">구독일</span>
          <span className="text-on-surface">{formatDate(subscription.subscribedAt)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-on-surface-variant">최근 확인</span>
          <span className="text-on-surface">{getTimeSince(subscription.lastChecked)}</span>
        </div>
      </div>

      {/* 업데이트 기록 */}
      {subscription.captionUpdates.length > 0 && (
        <div className="border-t border-outline-variant pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-on-surface">업데이트 기록</span>
            {subscription.isNewEpisode && (
              <motion.button
                onClick={() => onMarkAsRead(subscription.animeNo)}
                className="text-xs px-2 py-1 rounded-md bg-primary text-on-primary hover:bg-primary/90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                읽음
              </motion.button>
            )}
          </div>
          
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {subscription.captionUpdates.slice(-3).map((update, index) => (
              <div key={index} className="text-xs text-on-surface-variant flex items-center justify-between">
                <span>
                  {update.previousCount} → {update.currentCount}명
                </span>
                <span>{formatDate(update.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 웹사이트 링크 */}
      {subscription.website && (
        <div className="flex justify-end mt-3 pt-3 border-t border-outline-variant">
          <a
            href={subscription.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            🔗
          </a>
        </div>
      )}
    </motion.div>
  );
}