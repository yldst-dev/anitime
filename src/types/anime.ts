// Anissia.net API 타입 정의
export interface AnimeItem {
  animeNo: number;
  status: 'ON' | 'OFF';
  time: string;
  subject: string;
  originalSubject?: string;
  genres: string;
  startDate?: string;
  endDate?: string;
  website?: string;
  captionCount: number;
  // API 문서에는 없지만 실제 응답에 포함되는 필드들
  week?: string;
  twitter?: string;
  // 클라이언트에서 추가되는 필드들
  sourceWeek?: number;
  weekDayName?: string;
}

// 실제 API 응답 구조 (래퍼 객체 있음)
export interface AnimeScheduleResponse {
  code: string;
  data: AnimeItem[];
}

export interface CaptionItem {
  episode: string;
  updDt: string;
  website?: string;
  name: string;
}

export type WeekType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface WeekInfo {
  id: WeekType;
  label: string;
  shortLabel: string;
}

export const WEEK_SCHEDULE: WeekInfo[] = [
  { id: 0, label: '일요일', shortLabel: '일' },
  { id: 1, label: '월요일', shortLabel: '월' },
  { id: 2, label: '화요일', shortLabel: '화' },
  { id: 3, label: '수요일', shortLabel: '수' },
  { id: 4, label: '목요일', shortLabel: '목' },
  { id: 5, label: '금요일', shortLabel: '금' },
  { id: 6, label: '토요일', shortLabel: '토' },
  { id: 7, label: '기타', shortLabel: '기타' },
  { id: 8, label: '신작', shortLabel: '신작' },
];

export interface AnimeScheduleState {
  data: AnimeItem[];
  loading: boolean;
  error: string | null;
  currentWeek: WeekType;
}

// 유틸리티 함수들
export const formatTime = (time: string): string => {
  if (!time) return 'N/A';
  if (time.includes('99')) {
    if (time.includes('yyyy-MM-99')) {
      return time.replace('-99', '');
    }
    if (time.includes('yyyy-99-99')) {
      return time.split('-')[0];
    }
  }
  return time;
};

export const formatGenres = (genres: string): string[] => {
  return genres.split(',').map(genre => genre.trim());
};

export const isNewAnime = (startDate: string | undefined, week: WeekType): boolean => {
  if (!startDate || week >= 7) return false;
  
  const today = new Date();
  const start = new Date(startDate);
  
  return start >= today;
};

export const isCompletedAnime = (endDate: string | undefined, week: WeekType): boolean => {
  if (!endDate || week >= 7) return false;
  
  const today = new Date();
  const end = new Date(endDate);
  
  return end <= today;
};

export const getAnimeStatus = (anime: AnimeItem): 'normal' | 'new' | 'completed' | 'cancelled' => {
  if (anime.status === 'OFF') return 'cancelled';
  if (isNewAnime(anime.startDate, anime.time.includes(':') ? getCurrentWeekDay() : 7)) return 'new';
  if (isCompletedAnime(anime.endDate, anime.time.includes(':') ? getCurrentWeekDay() : 7)) return 'completed';
  return 'normal';
};

export const getCurrentWeekDay = (): WeekType => {
  return new Date().getDay() as WeekType;
};

export const getStatusLabel = (status: ReturnType<typeof getAnimeStatus>): string => {
  switch (status) {
    case 'cancelled': return '결방';
    case 'new': return '신작';
    case 'completed': return '완결';
    default: return '';
  }
};

export const getStatusColor = (status: ReturnType<typeof getAnimeStatus>): string => {
  switch (status) {
    case 'cancelled': return 'bg-anime-cancelled text-on-error';
    case 'new': return 'bg-anime-new text-on-tertiary';
    case 'completed': return 'bg-anime-completed text-on-secondary';
    default: return '';
  }
};