import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { 
  AnimeItem, 
  WeekType, 
  AnimeScheduleResponse,
  getCurrentWeekDay 
} from '../types/anime';
import { LoadingIndicator } from './LoadingIndicator';
import { AnimeCard } from './AnimeCard';
import { WeekNavigation } from './WeekNavigation';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { searchAnime, getPopularGenres } from '../utils/search';
import { useSubscriptionStatus } from '../hooks/useSubscriptionUpdater';
import { SubscriptionStats } from './SubscribeButton';
import { ErrorBoundary } from './ErrorBoundary';

interface AnimeScheduleProps {
  className?: string;
}

export function AnimeSchedule({ className }: AnimeScheduleProps) {
  const [currentWeek, setCurrentWeek] = useState<WeekType>(getCurrentWeekDay());
  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 구독 상태 관리
  useSubscriptionStatus();

  // 애니메이션 데이터 fetch
  const fetchAnimeData = async (week: WeekType) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('API 호출 시작:', week);
      const response = await fetch(`https://api.anissia.net/anime/schedule/${week}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('API 응답 상태:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: 데이터를 불러오는데 실패했습니다.`);
      }
      
      const animeData: AnimeScheduleResponse = await response.json();
      
      // API 응답이 올바른 구조인지 확인
      console.log('API Response:', animeData);
      if (animeData.code === 'ok' && Array.isArray(animeData.data)) {
        console.log('애니메이션 데이터:', animeData.data.length, '개');
        setAnimeList(animeData.data);
      } else {
        throw new Error('API 응답 형식이 올바르지 않습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      console.error('API 호출 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  // 검색 필터링된 결과
  const filteredAnimeList = useMemo(() => {
    if (!searchQuery.trim()) {
      return animeList;
    }
    
    return searchAnime(animeList, { query: searchQuery });
  }, [animeList, searchQuery]);

  // 인기 장르 (검색 도우미)
  const popularGenres = useMemo(() => {
    return getPopularGenres(animeList, 5);
  }, [animeList]);

  // 주간 변경 핸들러
  const handleWeekChange = (week: WeekType) => {
    setCurrentWeek(week);
    setSearchQuery(''); // 검색어 초기화
  };

  // 초기 데이터 로드 및 주간 변경 시 데이터 재로드
  useEffect(() => {
    fetchAnimeData(currentWeek);
  }, [currentWeek]);

  return (
    <div className={cn('w-full max-w-7xl mx-auto p-4', className)}>

      {/* 주간 네비게이션 */}
      <WeekNavigation
        currentWeek={currentWeek}
        onWeekChange={handleWeekChange}
        className="mb-6"
      />

      {/* 검색 입력 */}
      {!loading && !error && animeList.length > 0 && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`${animeList.length}개 작품에서 검색...`}
          />
          
          {/* 인기 장르 태그 */}
          {popularGenres.length > 0 && !searchQuery && (
            <motion.div
              className="mt-3 flex flex-wrap gap-2 items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-xs font-medium text-on-surface-variant">
                인기 장르:
              </span>
              {popularGenres.map((genre, index) => (
                <motion.button
                  key={genre}
                  onClick={() => setSearchQuery(genre)}
                  className={cn(
                    'text-xs px-2 py-1 rounded-md',
                    'bg-tertiary-container text-on-tertiary-container',
                    'hover:bg-tertiary hover:text-on-tertiary',
                    'transition-colors duration-200'
                  )}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {genre}
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 구독 통계 */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <ErrorBoundary fallback={null}>
          <AnimatePresence mode="wait">
            <SubscriptionStats />
          </AnimatePresence>
        </ErrorBoundary>
      </motion.div>

      {/* 컨텐츠 영역 */}
      <div className="min-h-[400px]">
        {/* 로딩 상태 */}
        {loading && (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingIndicator size="lg" variant="contained" className="mb-4" />
            <p className="text-on-surface-variant">데이터를 불러오는 중...</p>
          </motion.div>
        )}

        {/* 에러 상태 */}
        {error && (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-error-container text-on-error-container rounded-lg p-6 text-center max-w-md">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">오류 발생</h3>
              <p className="text-sm mb-4">{error}</p>
              <motion.button
                onClick={() => fetchAnimeData(currentWeek)}
                className={cn(
                  'px-4 py-2 bg-error text-on-error rounded-md',
                  'hover:bg-error/90 transition-colors duration-200'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                다시 시도
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* 검색 결과 */}
        {!loading && !error && (
          <SearchResults
            results={filteredAnimeList}
            originalList={animeList}
            searchQuery={searchQuery}
          />
        )}
      </div>

    </div>
  );
}