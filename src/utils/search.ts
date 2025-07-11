import { AnimeItem, formatGenres } from '../types/anime';

export interface SearchFilters {
  query: string;
  genres?: string[];
  status?: 'ON' | 'OFF' | 'all';
}

/**
 * 애니메이션 검색 함수
 * @param animeList 검색할 애니메이션 목록
 * @param filters 검색 필터 조건
 * @returns 필터링된 애니메이션 목록
 */
export function searchAnime(animeList: AnimeItem[], filters: SearchFilters): AnimeItem[] {
  const { query, genres, status } = filters;

  return animeList.filter(anime => {
    // 텍스트 검색 (제목, 원제, 장르)
    if (query) {
      const searchText = query.toLowerCase().trim();
      const matchesTitle = anime.subject.toLowerCase().includes(searchText);
      const matchesOriginal = anime.originalSubject?.toLowerCase().includes(searchText);
      const matchesGenres = formatGenres(anime.genres).some(genre => 
        genre.toLowerCase().includes(searchText)
      );
      
      if (!matchesTitle && !matchesOriginal && !matchesGenres) {
        return false;
      }
    }

    // 장르 필터
    if (genres && genres.length > 0) {
      const animeGenres = formatGenres(anime.genres).map(g => g.toLowerCase());
      const hasMatchingGenre = genres.some(genre => 
        animeGenres.includes(genre.toLowerCase())
      );
      
      if (!hasMatchingGenre) {
        return false;
      }
    }

    // 상태 필터
    if (status && status !== 'all') {
      if (anime.status !== status) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 검색 결과 하이라이트를 위한 텍스트 분할
 * @param text 원본 텍스트
 * @param query 검색어
 * @returns 하이라이트 정보가 포함된 텍스트 조각들
 */
export function highlightText(text: string, query: string): Array<{text: string, highlighted: boolean}> {
  if (!query.trim()) {
    return [{ text, highlighted: false }];
  }

  const searchText = query.toLowerCase().trim();
  const lowerText = text.toLowerCase();
  const parts: Array<{text: string, highlighted: boolean}> = [];
  
  let currentIndex = 0;
  let matchIndex = lowerText.indexOf(searchText, currentIndex);

  while (matchIndex !== -1) {
    // 매치 이전 텍스트 추가
    if (matchIndex > currentIndex) {
      parts.push({
        text: text.slice(currentIndex, matchIndex),
        highlighted: false
      });
    }

    // 매치된 텍스트 추가
    parts.push({
      text: text.slice(matchIndex, matchIndex + searchText.length),
      highlighted: true
    });

    currentIndex = matchIndex + searchText.length;
    matchIndex = lowerText.indexOf(searchText, currentIndex);
  }

  // 남은 텍스트 추가
  if (currentIndex < text.length) {
    parts.push({
      text: text.slice(currentIndex),
      highlighted: false
    });
  }

  return parts;
}

/**
 * 검색 결과 통계 계산
 * @param original 원본 목록
 * @param filtered 필터링된 목록
 * @returns 검색 결과 통계
 */
export function getSearchStats(original: AnimeItem[], filtered: AnimeItem[]) {
  return {
    total: original.length,
    filtered: filtered.length,
    onAir: filtered.filter(anime => anime.status === 'ON').length,
    cancelled: filtered.filter(anime => anime.status === 'OFF').length,
  };
}

/**
 * 인기 장르 추출 (검색용)
 * @param animeList 애니메이션 목록
 * @param limit 반환할 장르 수
 * @returns 인기 장르 목록
 */
export function getPopularGenres(animeList: AnimeItem[], limit: number = 10): string[] {
  const genreCount = new Map<string, number>();
  
  animeList.forEach(anime => {
    const genres = formatGenres(anime.genres);
    genres.forEach(genre => {
      const normalizedGenre = genre.trim();
      if (normalizedGenre) {
        genreCount.set(normalizedGenre, (genreCount.get(normalizedGenre) || 0) + 1);
      }
    });
  });

  return Array.from(genreCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([genre]) => genre);
}

/**
 * 검색어 제안 생성
 * @param animeList 애니메이션 목록
 * @param query 현재 검색어
 * @returns 검색어 제안 목록
 */
export function getSuggestions(animeList: AnimeItem[], query: string): string[] {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  const searchText = query.toLowerCase().trim();
  const suggestions = new Set<string>();

  animeList.forEach(anime => {
    // 제목에서 제안
    if (anime.subject.toLowerCase().includes(searchText)) {
      suggestions.add(anime.subject);
    }

    // 원제에서 제안
    if (anime.originalSubject?.toLowerCase().includes(searchText)) {
      suggestions.add(anime.originalSubject);
    }

    // 장르에서 제안
    formatGenres(anime.genres).forEach(genre => {
      if (genre.toLowerCase().includes(searchText)) {
        suggestions.add(genre);
      }
    });
  });

  return Array.from(suggestions).slice(0, 5);
}

// 애니메이션이 방영되는 요일을 찾는 함수
export async function findAnimeWeekDay(animeNo: number): Promise<string | null> {
  const weekDays = [
    { id: 0, name: '일요일' },
    { id: 1, name: '월요일' },
    { id: 2, name: '화요일' },
    { id: 3, name: '수요일' },
    { id: 4, name: '목요일' },
    { id: 5, name: '금요일' },
    { id: 6, name: '토요일' },
    { id: 7, name: '기타' },
    { id: 8, name: '신작' }
  ];

  // 각 요일별로 API 호출해서 해당 애니메이션이 있는지 확인
  for (const weekDay of weekDays) {
    try {
      const response = await fetch(`https://api.anissia.net/anime/schedule/${weekDay.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.code === 'ok' && Array.isArray(data.data)) {
          const foundAnime = data.data.find((anime: AnimeItem) => anime.animeNo === animeNo);
          if (foundAnime) {
            return weekDay.name;
          }
        }
      }
    } catch (error) {
      console.error(`요일 ${weekDay.name} 확인 중 오류:`, error);
    }
  }
  
  return null;
}

// 캐시를 사용한 요일 정보 관리
const weekDayCache = new Map<number, string>();

export function getCachedWeekDay(animeNo: number): string | null {
  return weekDayCache.get(animeNo) || null;
}

export function setCachedWeekDay(animeNo: number, weekDay: string): void {
  weekDayCache.set(animeNo, weekDay);
}

export async function getAnimeWeekDay(animeNo: number): Promise<string | null> {
  // 캐시에서 먼저 확인
  const cached = getCachedWeekDay(animeNo);
  if (cached) {
    return cached;
  }

  // API로 요일 찾기
  const weekDay = await findAnimeWeekDay(animeNo);
  if (weekDay) {
    setCachedWeekDay(animeNo, weekDay);
  }
  
  return weekDay;
}