import { Contest, Passage, LeaderboardEntry, Achievement, User, Attempt } from './types';

export const mockUser: User = {
  id: '1',
  username: 'speedtyper',
  email: 'speed@typer.com',
  rating: 1847,
  bestWpm: 142,
  avgAccuracy: 96.4,
  contestsPlayed: 34,
  rank: 'Expert',
  joinedAt: '2025-06-15',
};

export const mockContests: Contest[] = [
  {
    id: '1',
    title: 'Speed Sprint #42',
    difficulty: 'medium',
    duration: 60,
    startTime: new Date(Date.now() + 3600000).toISOString(),
    participants: 128,
    maxAttempts: 3,
    status: 'upcoming',
    rankingMethod: 'best',
    passageCount: 5,
  },
  {
    id: '2',
    title: 'Midnight Marathon',
    difficulty: 'hard',
    duration: 120,
    startTime: new Date(Date.now() - 1800000).toISOString(),
    participants: 256,
    maxAttempts: 2,
    status: 'live',
    rankingMethod: 'best',
    passageCount: 10,
  },
  {
    id: '3',
    title: 'Beginner Blitz',
    difficulty: 'easy',
    duration: 30,
    startTime: new Date(Date.now() + 7200000).toISOString(),
    participants: 64,
    maxAttempts: 5,
    status: 'upcoming',
    rankingMethod: 'average',
    passageCount: 3,
  },
  {
    id: '4',
    title: 'Code Warrior Challenge',
    difficulty: 'hard',
    duration: 90,
    startTime: new Date(Date.now() - 86400000).toISOString(),
    participants: 512,
    maxAttempts: 3,
    status: 'ended',
    rankingMethod: 'best',
    passageCount: 8,
  },
];

export const mockPassages: Passage[] = [
  {
    id: '1',
    text: 'The quick brown fox jumps over the lazy dog. A wizard\'s job is to vex chumps quickly in fog. How vexingly quick daft zebras jump! The five boxing wizards jump quickly at dawn.',
    difficulty: 'easy',
    wordCount: 32,
  },
  {
    id: '2',
    text: 'Programming is the art of telling another human being what one wants the computer to do. Software is a great combination between artistry and engineering. The best error message is the one that never shows up.',
    difficulty: 'medium',
    wordCount: 35,
  },
  {
    id: '3',
    text: 'In the realm of competitive programming, algorithmic efficiency determines the boundary between accepted and time-limit-exceeded submissions. Understanding asymptotic complexity enables practitioners to evaluate performance characteristics systematically.',
    difficulty: 'hard',
    wordCount: 28,
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'typelord', wpm: 158, accuracy: 99.2, attemptNumber: 2, status: 'finished', avatar: '' },
  { rank: 2, username: 'keymaster', wpm: 145, accuracy: 98.1, attemptNumber: 1, status: 'finished', avatar: '' },
  { rank: 3, username: 'speedtyper', wpm: 142, accuracy: 96.4, attemptNumber: 3, status: 'finished', avatar: '' },
  { rank: 4, username: 'swiftkeys', wpm: 138, accuracy: 97.8, attemptNumber: 1, status: 'typing', avatar: '' },
  { rank: 5, username: 'turbofingers', wpm: 135, accuracy: 95.3, attemptNumber: 2, status: 'finished', avatar: '' },
  { rank: 6, username: 'blazetype', wpm: 131, accuracy: 94.7, attemptNumber: 1, status: 'typing', avatar: '' },
  { rank: 7, username: 'rapidstroke', wpm: 128, accuracy: 96.1, attemptNumber: 3, status: 'finished', avatar: '' },
  { rank: 8, username: 'clickclack', wpm: 125, accuracy: 93.5, attemptNumber: 2, status: 'finished', avatar: '' },
];

export const mockAchievements: Achievement[] = [
  { id: '1', title: 'First Blood', description: 'Complete your first contest', icon: '🏁', earned: true, earnedAt: '2025-07-01' },
  { id: '2', title: 'Speed Demon', description: 'Reach 100+ WPM', icon: '⚡', earned: true, earnedAt: '2025-07-15' },
  { id: '3', title: 'Perfectionist', description: '100% accuracy in a contest', icon: '🎯', earned: true, earnedAt: '2025-08-01' },
  { id: '4', title: 'Marathon Runner', description: 'Complete 10 contests', icon: '🏃', earned: true, earnedAt: '2025-09-01' },
  { id: '5', title: 'Legend', description: 'Reach 150+ WPM', icon: '👑', earned: false },
  { id: '6', title: 'Unstoppable', description: 'Win 5 contests in a row', icon: '🔥', earned: false },
];

export const mockAttempts: Attempt[] = [
  { id: '1', contestId: '2', userId: '1', attemptNumber: 1, passageId: '1', wpm: 132, accuracy: 95.2, errors: 4, duration: 58, completedAt: '2025-12-01T10:00:00Z' },
  { id: '2', contestId: '2', userId: '1', attemptNumber: 2, passageId: '2', wpm: 142, accuracy: 96.4, errors: 2, duration: 55, completedAt: '2025-12-01T10:05:00Z' },
];
