import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { AnimeItem, getAnimeStatus, getStatusLabel, getStatusColor, formatTime, formatGenres } from '../types/anime';
import { useState, useEffect } from 'react';
import { SubscribeButton, SubscriptionBadge } from './SubscribeButton';
import { ErrorBoundary } from './ErrorBoundary';
import { getAnimeWeekDay } from '../utils/search';

interface AnimeCardProps {
  anime: AnimeItem;
  className?: string;
}

export function AnimeCard({ anime, className }: AnimeCardProps) {
  const status = getAnimeStatus(anime);
  const statusLabel = getStatusLabel(status);
  const statusColor = getStatusColor(status);
  const genres = formatGenres(anime.genres);
  const formattedTime = formatTime(anime.time);
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
        'hover:bg-surface-container-high transition-colors duration-200',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* 상태 표시 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-xs px-2 py-1 rounded-full font-medium',
            'bg-surface-container-highest text-on-surface'
          )}>
            {formattedTime}
          </span>
          {statusLabel && (
            <motion.span
              className={cn(
                'text-xs px-2 py-1 rounded-full font-medium',
                statusColor
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              {statusLabel}
            </motion.span>
          )}
        </div>
        
        {/* 자막 참여자 수 와 구독 버튼 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="text-xs">👥</span>
            <span className="text-xs">{anime.captionCount}</span>
          </div>
          <div className="relative">
            <ErrorBoundary>
              <SubscribeButton anime={anime} variant="icon" />
              <SubscriptionBadge anime={anime} />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* 제목 */}
      <motion.h3 
        className={cn(
          'font-semibold text-on-surface mb-1',
          'text-lg leading-tight cursor-pointer',
          'hover:text-primary transition-colors duration-200',
          'relative'
        )}
        onClick={() => handleTitleClick(anime.subject)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {anime.subject}
        {copySuccess && (
          <motion.span
            className="absolute -top-8 left-0 bg-primary text-on-primary text-xs px-2 py-1 rounded-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            복사완료!
          </motion.span>
        )}
      </motion.h3>

      {/* 원제 */}
      {anime.originalSubject && (
        <motion.p 
          className={cn(
            'text-sm text-on-surface-variant mb-2 cursor-pointer',
            'hover:text-secondary transition-colors duration-200'
          )}
          onClick={() => handleTitleClick(anime.originalSubject!)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {anime.originalSubject}
        </motion.p>
      )}

      {/* 장르 */}
      <div className="flex flex-wrap gap-1 mt-auto mb-3">
        {genres.slice(0, 3).map((genre, index) => (
          <motion.span
            key={index}
            className={cn(
              'text-xs px-2 py-1 rounded-md',
              'bg-primary-container text-on-primary-container'
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            {genre}
          </motion.span>
        ))}
        {genres.length > 3 && (
          <span className="text-xs px-2 py-1 rounded-md bg-outline-variant text-on-surface-variant">
            +{genres.length - 3}
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
        
        {/* 공식 웹사이트 링크 */}
        {anime.website && (
          <a
            href={anime.website}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'text-primary hover:text-primary-container',
              'transition-colors duration-200'
            )}
          >
            🔗
          </a>
        )}
      </div>
    </motion.div>
  );
}

// 요일 정보 표시 컴포넌트
export function WeekDayBadge({ 
  anime,
  showInSearch = false,
  className 
}: { 
  anime?: AnimeItem;
  showInSearch?: boolean;
  className?: string; 
}) {
  const [weekDay, setWeekDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showInSearch || !anime) return;

    // 이미 weekDayName이 있으면 그것을 사용
    if (anime.weekDayName) {
      setWeekDay(anime.weekDayName);
      return;
    }

    // 없으면 API로 요일 정보를 가져옴
    setLoading(true);
    getAnimeWeekDay(anime.animeNo)
      .then(day => {
        setWeekDay(day);
      })
      .catch(error => {
        console.error('요일 정보 로드 실패:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [anime, showInSearch]);

  if (!showInSearch || loading || !weekDay) {
    return null;
  }

  return (
    <motion.span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        'bg-tertiary-container text-on-tertiary-container',
        'border border-tertiary',
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      📅 {weekDay}
    </motion.span>
  );
}