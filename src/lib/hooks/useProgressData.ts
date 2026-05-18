// frontend/src/lib/hooks/useProgressData.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { progressApi } from '../api/progress';

export interface SessionHistory {
  id: string;
  company: string;
  role: string;
  phase: string;
  score: number;
  date: string;
  logo: string;
  logoColor: string;
  areas: number[];
}

export interface SkillScores {
  structure: number;
  clarity: number;
  confidence: number;
  depth: number;
  engagement: number;
}

export interface SkillImprovement {
  before: SkillScores;
  after: SkillScores;
  delta: SkillScores;
}

export interface ConfidenceEntry {
  session_number: number;
  pre: number;
  post: number;
}

export interface ScoreTrendPoint {
  id: number;
  date: string;
  score: number;
  sessionId: string;
  company: string;
}

export interface UserStats {
  total_sessions: number;
  avg_score: number;
  best_score: number;
  best_session: {
    company: string;
    phase: string;
    score: number;
  } | null;
  confidence_gain: number;
  total_questions: number;
  skills_improved: number;
  badges_earned: number;
}

export interface DashboardProgressData {
  stats: UserStats;
  recent_sessions: SessionHistory[];
  skill_improvement: SkillImprovement | null;
  confidence_journey: {
    entries: ConfidenceEntry[];
    average_gain: number;
  };
  score_trend: {
    data: ScoreTrendPoint[];
    average: number;
  };
}

interface UseProgressDataReturn {
  data: DashboardProgressData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isLoadingMore: boolean;
  loadMoreSessions: () => Promise<void>;
  hasMore: boolean;
}

export function useProgressData(): UseProgressDataReturn {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionsOffset, setSessionsOffset] = useState(0);
  const [allSessions, setAllSessions] = useState<SessionHistory[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchDashboard = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await progressApi.getDashboard() as any
      
      if (response.success) {
        setData(response.data);
        // Also store recent sessions
        if (response.data.recent_sessions) {
          setAllSessions(response.data.recent_sessions);
          setSessionsOffset(response.data.recent_sessions.length);
          setHasMore(response.data.recent_sessions.length >= 5);
        }
      } else {
        setError(response.error || 'Failed to load progress data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching progress data:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadMoreSessions = async () => {
    if (!user?.id || isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    try {
      const response = await progressApi.getSessions(10, sessionsOffset) as any
      
      if (response.success && response.data.length > 0) {
        setAllSessions(prev => [...prev, ...response.data]);
        setSessionsOffset(prev => prev + response.data.length);
        setHasMore(response.data.length === 10);
        
        // Update the data object with combined sessions
        setData(prev => prev ? {
          ...prev,
          recent_sessions: [...prev.recent_sessions, ...response.data],
        } : null);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more sessions:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchDashboard();
    }
  }, [user?.id, fetchDashboard]);

  return {
    data,
    loading,
    error,
    refresh: fetchDashboard,
    isLoadingMore,
    loadMoreSessions,
    hasMore,
  };
}

// Individual hook for just stats (lighter weight)
export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await progressApi.getStats();
        if (response.success) {
          setStats(response.data as UserStats);
        } else {
          setError(response.error || 'Failed to load stats');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user?.id]);

  return { stats, loading, error };
}

// Individual hook for session history
export function useSessionHistory(limit: number = 20) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const loadMore = async () => {
    if (!user?.id || !hasMore) return;
    
    try {
      const response = await progressApi.getSessions(limit, offset) as any
      if (response.success && response?.data?.length > 0) {
        setSessions(prev => [...prev, ...response.data]);
        setOffset(prev => prev + response.data.length);
        setHasMore(response.data.length === limit);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading sessions:', err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadMore();
      setLoading(false);
    }
  }, [user?.id]);

  return { sessions, loading, hasMore, loadMore };
}

// Individual hook for score trend
export function useScoreTrend(range: '7d' | '30d' | 'all' = '30d') {
  const { user } = useAuth();
  const [trend, setTrend] = useState<{ data: ScoreTrendPoint[]; average: number }>({ data: [], average: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchTrend = async () => {
      setLoading(true);
      try {
        const response = await progressApi.getTrend(range);
        if (response.success) {
          setTrend({ data: response.data, average: response.average });
        }
      } catch (err) {
        console.error('Error fetching trend:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrend();
  }, [user?.id, range]);

  return { trend, loading };
}