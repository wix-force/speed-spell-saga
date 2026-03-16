export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  rating: number;
  bestWpm: number;
  avgAccuracy: number;
  contestsPlayed: number;
  rank: string;
  joinedAt: string;
}

export interface Contest {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // seconds
  startTime: string;
  participants: number;
  maxAttempts: number;
  status: 'upcoming' | 'live' | 'ended';
  rankingMethod: 'best' | 'last' | 'average';
  passageCount: number;
}

export interface Passage {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  wordCount: number;
}

export interface Attempt {
  id: string;
  contestId: string;
  userId: string;
  attemptNumber: number;
  passageId: string;
  wpm: number;
  accuracy: number;
  errors: number;
  duration: number;
  completedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  wpm: number;
  accuracy: number;
  attemptNumber: number;
  status: 'typing' | 'finished';
  avatar?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

export interface TypingMetrics {
  wpm: number;
  accuracy: number;
  errors: number;
  elapsed: number;
  progress: number;
}
