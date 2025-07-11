import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { AnimeItem } from '../types/anime';
import { AnimeCard, WeekDayBadge } from './AnimeCard';
import { highlightText, getSearchStats } from '../utils/search';
import { useState } from 'react';
import { SubscribeButton, SubscriptionBadge } from './SubscribeButton';
import { ErrorBoundary } from './ErrorBoundary';

interface SearchResultsProps {
  results: AnimeItem[];
  originalList: AnimeItem[];
  searchQuery: string;
  className?: string;
}

interface HighlightedTextProps {
  text: string;
  query: string;
  className?: string;
}

function HighlightedText({ text, query, className }: HighlightedTextProps) {
  const parts = highlightText(text, query);
  
  return (
    <span className={className}>
      {parts.map((part, index) => (
        <span
          key={index}
          className={part.highlighted ? 'bg-primary-container text-on-primary-container px-1 rounded' : ''}
        >
          {part.text}
        </span>
      ))}
    </span>
  );
}

function SearchStats({ original, filtered, query }: { 
  original: AnimeItem[], 
  filtered: AnimeItem[], 
  query: string 
}) {
  const stats = getSearchStats(original, filtered);
  
  if (!query) return null;

  return (
    <motion.div
      className="flex items-center gap-4 mb-4 p-3 bg-surface-container-low rounded-lg"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-on-surface">검색 결과:</span>
        <span className="text-sm text-primary font-semibold">
          {stats.filtered}개 작품
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-on-surface-variant">
        <span>방영중: {stats.onAir}개</span>
        {stats.cancelled > 0 && <span>결방: {stats.cancelled}개</span>}
      </div>
    </motion.div>
  );
}

export function SearchResults({ 
  results, 
  originalList, 
  searchQuery, 
  className 
}: SearchResultsProps) {
  const hasQuery = searchQuery.trim().length > 0;
  const hasResults = results.length > 0;

  return (
    <div className={cn('w-full', className)}>
      {/* 검색 통계 */}
      <SearchStats 
        original={originalList} 
        filtered={results} 
        query={searchQuery} 
      />

      {/* 검색 결과 */}
      <AnimatePresence mode="wait">
        {!hasQuery ? (
          // 검색어가 없을 때
          <motion.div
            key="no-query"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {originalList.map((anime, index) => (
              <motion.div
                key={anime.animeNo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <AnimeCard anime={anime} />
              </motion.div>
            ))}
          </motion.div>
        ) : hasResults ? (
          // 검색 결과가 있을 때
          <motion.div
            key="has-results"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {results.map((anime, index) => (
              <motion.div
                key={`search-${anime.animeNo}`}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                transition={{ 
                  delay: index * 0.05, 
                  duration: 0.3,
                  type: 'spring',
                  stiffness: 300,
                  damping: 25
                }}
                layout
              >
                <EnhancedAnimeCard anime={anime} searchQuery={searchQuery} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // 검색 결과가 없을 때
          <motion.div
            key="no-results"
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-on-surface-variant text-center max-w-md">
              "<span className="font-medium">{searchQuery}</span>"에 대한 
              애니메이션을 찾을 수 없습니다. 다른 검색어를 시도해보세요.
            </p>
            
            <div className="mt-6 text-sm text-on-surface-variant">
              <p className="mb-2 font-medium">검색 팁:</p>
              <ul className="space-y-1 text-xs">
                <li>• 애니메이션 제목의 일부만 입력해보세요</li>
                <li>• 장르명으로 검색해보세요 (예: 액션, 로맨스)</li>
                <li>• 원제(일본어 제목)로도 검색 가능합니다</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 검색 하이라이트가 적용된 애니메이션 카드
function EnhancedAnimeCard({ anime, searchQuery }: { anime: AnimeItem, searchQuery: string }) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleTitleClick = async (title: string) => {
    try {
      await navigator.clipboard.writeText(title);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  return (
    <motion.div
      className={cn(
        'bg-surface-container rounded-lg p-4',
        'border border-outline-variant h-full flex flex-col',
        'hover:bg-surface-container-high transition-colors duration-200'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* 상태 표시 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn(
            'text-xs px-2 py-1 rounded-full font-medium',
            'bg-surface-container-highest text-on-surface'
          )}>
            {anime.time || 'N/A'}
          </span>
          <WeekDayBadge anime={anime} showInSearch={true} />
          {anime.status === 'OFF' && (
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-error text-on-error">
              결방
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="text-xs">👥</span>
            <span className="text-xs">{anime.captionCount}</span>
          </div>
          <div className="relative">
            <ErrorBoundary fallback={null}>
              <SubscribeButton anime={anime} variant="icon" />
              <SubscriptionBadge anime={anime} />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* 제목 (하이라이트 적용) */}
      <motion.h3 
        className={cn(
          'font-semibold text-on-surface mb-1 text-lg leading-tight',
          'cursor-pointer hover:text-primary transition-colors duration-200',
          'relative'
        )}
        style={{ transformOrigin: 'left center' }}
        onClick={() => handleTitleClick(anime.subject)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <HighlightedText text={anime.subject} query={searchQuery} />
        <AnimatePresence>
          {copySuccess && (
            <motion.span
              className="absolute -top-8 left-0 bg-primary text-on-primary text-xs px-2 py-1 rounded-md z-10"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 25,
                duration: 0.3
              }}
            >
              복사완료!
            </motion.span>
          )}
        </AnimatePresence>
      </motion.h3>

      {/* 원제 (하이라이트 적용) */}
      {anime.originalSubject && (
        <motion.p 
          className={cn(
            'text-sm text-on-surface-variant mb-2',
            'cursor-pointer hover:text-secondary transition-colors duration-200'
          )}
          style={{ transformOrigin: 'left center' }}
          onClick={() => handleTitleClick(anime.originalSubject!)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <HighlightedText text={anime.originalSubject} query={searchQuery} />
        </motion.p>
      )}

      {/* 공식 웹사이트 링크 */}
      {anime.website && (
        <div className="flex justify-end mb-3">
          <a
            href={anime.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-container transition-colors duration-200 text-xs"
          >
            🔗
          </a>
        </div>
      )}

      {/* 장르 (하이라이트 적용) */}
      <div className="flex flex-wrap gap-1 mt-auto mb-3">
        {anime.genres.split(',').slice(0, 3).map((genre, index) => (
          <span
            key={index}
            className="text-xs px-2 py-1 rounded-md bg-primary-container text-on-primary-container"
          >
            <HighlightedText text={genre.trim()} query={searchQuery} />
          </span>
        ))}
        {anime.genres.split(',').length > 3 && (
          <span className="text-xs px-2 py-1 rounded-md bg-outline-variant text-on-surface-variant">
            +{anime.genres.split(',').length - 3}
          </span>
        )}
      </div>

      {/* 방영 기간 */}
      <div className="flex items-center justify-between text-xs text-on-surface-variant">
        <div className="flex items-center gap-3">
          {anime.startDate && (
            <span>방영시작일: {anime.startDate}</span>
          )}
          {anime.endDate && (
            <span>종료: {anime.endDate}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}