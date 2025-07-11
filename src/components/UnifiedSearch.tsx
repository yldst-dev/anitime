import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { AnimeItem, WeekType, AnimeScheduleResponse, WEEK_SCHEDULE } from '../types/anime';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { LoadingIndicator } from './LoadingIndicator';
import { searchAnime, getPopularGenres } from '../utils/search';

interface UnifiedSearchProps {
  className?: string;
}

interface WeeklyData {
  week: WeekType;
  data: AnimeItem[];
  loading: boolean;
  error: string | null;
}

export function UnifiedSearch({ className }: UnifiedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [selectedWeeks, setSelectedWeeks] = useState<WeekType[]>([0, 1, 2, 3, 4, 5, 6]); // 기본: 일~토

  // 전체 애니메이션 데이터 (선택된 요일들만)
  const allAnimeData = useMemo(() => {
    const weekNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return weeklyData
      .filter(wd => selectedWeeks.includes(wd.week))
      .flatMap(wd => wd.data.map(anime => ({ 
        ...anime, 
        sourceWeek: wd.week,
        weekDayName: weekNames[wd.week] || '기타'
      })));
  }, [weeklyData, selectedWeeks]);

  // 검색 필터링된 결과
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return allAnimeData;
    }
    return searchAnime(allAnimeData, { query: searchQuery });
  }, [allAnimeData, searchQuery]);

  // 인기 장르
  const popularGenres = useMemo(() => {
    return getPopularGenres(allAnimeData, 8);
  }, [allAnimeData]);

  // 통계 정보
  const statistics = useMemo(() => {
    const totalByWeek = weeklyData.reduce((acc, wd) => {
      if (selectedWeeks.includes(wd.week)) {
        acc[wd.week] = wd.data.length;
      }
      return acc;
    }, {} as Record<WeekType, number>);

    return {
      totalAnime: allAnimeData.length,
      searchResults: filteredResults.length,
      onAir: filteredResults.filter(anime => anime.status === 'ON').length,
      cancelled: filteredResults.filter(anime => anime.status === 'OFF').length,
      byWeek: totalByWeek,
    };
  }, [allAnimeData, filteredResults, weeklyData, selectedWeeks]);

  // 단일 요일 데이터 fetch
  const fetchWeekData = async (week: WeekType): Promise<AnimeItem[]> => {
    try {
      const response = await fetch(`https://api.anissia.net/anime/schedule/${week}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: 데이터를 불러오는데 실패했습니다.`);
      }
      const apiResponse: AnimeScheduleResponse = await response.json();
      
      if (apiResponse.code === 'ok' && apiResponse.data) {
        return apiResponse.data;
      } else {
        throw new Error('API 응답 형식이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error(`Week ${week} fetch error:`, error);
      throw error;
    }
  };

  // 모든 요일 데이터 병렬 로드
  const fetchAllWeekData = async () => {
    setGlobalLoading(true);
    
    const weeks: WeekType[] = [0, 1, 2, 3, 4, 5, 6]; // 일~토만 (기타, 신작 제외)
    
    const initialData: WeeklyData[] = weeks.map(week => ({
      week,
      data: [],
      loading: true,
      error: null,
    }));
    
    setWeeklyData(initialData);

    // 모든 요일 데이터를 병렬로 가져오기
    const promises = weeks.map(async (week) => {
      try {
        const data = await fetchWeekData(week);
        return { week, data, loading: false, error: null };
      } catch (error) {
        return { 
          week, 
          data: [], 
          loading: false, 
          error: error instanceof Error ? error.message : '알 수 없는 오류'
        };
      }
    });

    try {
      const results = await Promise.all(promises);
      setWeeklyData(results);
    } catch (error) {
      console.error('Failed to fetch all week data:', error);
    } finally {
      setGlobalLoading(false);
    }
  };

  // 요일 선택/해제
  const toggleWeek = (week: WeekType) => {
    setSelectedWeeks(prev => 
      prev.includes(week) 
        ? prev.filter(w => w !== week)
        : [...prev, week].sort()
    );
  };

  // 전체 선택/해제
  const toggleAllWeeks = () => {
    const allWeeks: WeekType[] = [0, 1, 2, 3, 4, 5, 6];
    setSelectedWeeks(prev => 
      prev.length === allWeeks.length ? [] : allWeeks
    );
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchAllWeekData();
  }, []);

  const isAnyLoading = weeklyData.some(wd => wd.loading) || globalLoading;
  const hasErrors = weeklyData.some(wd => wd.error);

  return (
    <div className={cn('w-full max-w-7xl mx-auto p-4', className)}>

      {/* 요일 선택 필터 */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-surface-container rounded-lg p-4 border border-outline-variant">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-on-surface">검색할 요일 선택:</span>
            <motion.button
              onClick={toggleAllWeeks}
              className={cn(
                'text-xs px-3 py-1 rounded-md',
                'bg-secondary-container text-on-secondary-container',
                'hover:bg-secondary hover:text-on-secondary',
                'transition-colors duration-200'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {selectedWeeks.length === 7 ? '전체 해제' : '전체 선택'}
            </motion.button>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {WEEK_SCHEDULE.slice(0, 7).map((week, index) => {
              const weekData = weeklyData.find(wd => wd.week === week.id);
              const isSelected = selectedWeeks.includes(week.id);
              const animeCount = weekData?.data.length || 0;
              
              return (
                <motion.button
                  key={week.id}
                  onClick={() => toggleWeek(week.id)}
                  className={cn(
                    'flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200',
                    'text-center min-h-[80px]',
                    isSelected 
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-high text-on-surface border-outline-variant hover:bg-surface-container-highest'
                  )}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm font-medium text-center">{week.label}</span>
                  <span className="text-xs opacity-75 text-center mt-1">{animeCount}개</span>
                  {weekData?.loading && (
                    <div className="w-3 h-3 mt-1 mx-auto">
                      <LoadingIndicator size="sm" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* 통계 정보 */}
      {!isAnyLoading && selectedWeeks.length > 0 && (
        <motion.div
          className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-primary-container text-on-primary-container rounded-lg p-3 text-center">
            <div className="text-lg font-bold">{statistics.totalAnime}</div>
            <div className="text-xs opacity-75">총 작품 수</div>
          </div>
          <div className="bg-secondary-container text-on-secondary-container rounded-lg p-3 text-center">
            <div className="text-lg font-bold">{statistics.onAir}</div>
            <div className="text-xs opacity-75">방영중</div>
          </div>
          {statistics.cancelled > 0 && (
            <div className="bg-error-container text-on-error-container rounded-lg p-3 text-center">
              <div className="text-lg font-bold">{statistics.cancelled}</div>
              <div className="text-xs opacity-75">결방</div>
            </div>
          )}
          <div className="bg-tertiary-container text-on-tertiary-container rounded-lg p-3 text-center">
            <div className="text-lg font-bold">{selectedWeeks.length}</div>
            <div className="text-xs opacity-75">선택된 요일</div>
          </div>
        </motion.div>
      )}

      {/* 검색 입력 */}
      {!isAnyLoading && allAnimeData.length > 0 && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`${statistics.totalAnime}개 작품에서 검색...`}
          />
          
          {/* 인기 장르 태그 */}
          {popularGenres.length > 0 && !searchQuery && (
            <motion.div
              className="mt-3 flex flex-wrap gap-2 items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
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
                  transition={{ delay: 0.7 + index * 0.05 }}
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

      {/* 컨텐츠 영역 */}
      <div className="min-h-[400px]">
        {/* 로딩 상태 */}
        {isAnyLoading && (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingIndicator size="lg" variant="contained" className="mb-4" />
            <p className="text-on-surface-variant">
              전체 요일 데이터를 불러오는 중... ({weeklyData.filter(wd => !wd.loading).length}/7)
            </p>
          </motion.div>
        )}

        {/* 에러 상태 */}
        {hasErrors && !isAnyLoading && (
          <motion.div
            className="flex flex-col items-center justify-center py-12 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-error-container text-on-error-container rounded-lg p-6 text-center max-w-md">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">일부 데이터 로드 실패</h3>
              <p className="text-sm mb-4">
                일부 요일의 데이터를 불러오지 못했습니다. 
                사용 가능한 데이터로 검색을 계속할 수 있습니다.
              </p>
              <motion.button
                onClick={fetchAllWeekData}
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
        {!isAnyLoading && selectedWeeks.length > 0 && (
          <SearchResults
            results={filteredResults}
            originalList={allAnimeData}
            searchQuery={searchQuery}
          />
        )}

        {/* 요일 미선택 상태 */}
        {!isAnyLoading && selectedWeeks.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">
              검색할 요일을 선택해주세요
            </h3>
            <p className="text-on-surface-variant text-center">
              위의 요일 버튼을 클릭하여 검색할 요일을 선택하세요
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}