import { User, Contest, Passage, Attempt } from './types';

// Extended admin types
export interface AdminUser extends User {
  totalTests: number;
  status: 'active' | 'banned' | 'inactive';
  lastActive: string;
}

export interface AdminContest extends Contest {
  totalAttempts: number;
  avgWpm: number;
  completionRate: number;
  randomPassageMode: boolean;
  maxParticipants: number;
  createdAt: string;
}

export interface AdminPassage extends Passage {
  language: string;
  createdAt: string;
  usedCount: number;
}

export interface ActivityItem {
  id: string;
  type: 'contest_created' | 'user_joined' | 'contest_ended' | 'record_broken';
  message: string;
  timestamp: string;
  icon: string;
}

export interface AnalyticsData {
  dailyActiveUsers: { date: string; value: number }[];
  attemptsPerDay: { date: string; value: number }[];
  avgWpmTrend: { date: string; value: number }[];
  contestParticipation: { name: string; value: number }[];
}

export interface PlatformSettings {
  defaultDuration: number;
  defaultMaxAttempts: number;
  defaultDifficulty: 'easy' | 'medium' | 'hard';
  defaultRankingMethod: 'best' | 'last' | 'average';
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  maxUsersPerContest: number;
}

// Mock Admin Users
export const adminUsers: AdminUser[] = [
  { id: '1', username: 'speedtyper', email: 'speed@typer.com', rating: 1847, bestWpm: 142, avgAccuracy: 96.4, contestsPlayed: 34, rank: 'Expert', joinedAt: '2025-06-15', totalTests: 156, status: 'active', lastActive: '2026-03-16T08:30:00Z' },
  { id: '2', username: 'typelord', email: 'type@lord.io', rating: 2104, bestWpm: 158, avgAccuracy: 99.2, contestsPlayed: 52, rank: 'Master', joinedAt: '2025-04-10', totalTests: 234, status: 'active', lastActive: '2026-03-16T09:15:00Z' },
  { id: '3', username: 'keymaster', email: 'key@master.dev', rating: 1923, bestWpm: 145, avgAccuracy: 98.1, contestsPlayed: 41, rank: 'Expert', joinedAt: '2025-05-22', totalTests: 189, status: 'active', lastActive: '2026-03-15T22:00:00Z' },
  { id: '4', username: 'swiftkeys', email: 'swift@keys.com', rating: 1654, bestWpm: 138, avgAccuracy: 97.8, contestsPlayed: 28, rank: 'Advanced', joinedAt: '2025-07-01', totalTests: 112, status: 'inactive', lastActive: '2026-03-10T14:00:00Z' },
  { id: '5', username: 'turbofingers', email: 'turbo@fingers.net', rating: 1432, bestWpm: 135, avgAccuracy: 95.3, contestsPlayed: 19, rank: 'Intermediate', joinedAt: '2025-08-15', totalTests: 87, status: 'active', lastActive: '2026-03-16T07:45:00Z' },
  { id: '6', username: 'blazetype', email: 'blaze@type.co', rating: 1201, bestWpm: 131, avgAccuracy: 94.7, contestsPlayed: 15, rank: 'Intermediate', joinedAt: '2025-09-20', totalTests: 63, status: 'banned', lastActive: '2026-02-28T10:00:00Z' },
  { id: '7', username: 'rapidstroke', email: 'rapid@stroke.io', rating: 1567, bestWpm: 128, avgAccuracy: 96.1, contestsPlayed: 22, rank: 'Advanced', joinedAt: '2025-07-30', totalTests: 98, status: 'active', lastActive: '2026-03-16T06:00:00Z' },
  { id: '8', username: 'clickclack', email: 'click@clack.dev', rating: 1089, bestWpm: 125, avgAccuracy: 93.5, contestsPlayed: 12, rank: 'Beginner', joinedAt: '2025-10-05', totalTests: 45, status: 'active', lastActive: '2026-03-15T18:30:00Z' },
];

// Mock Admin Contests
export const adminContests: AdminContest[] = [
  { id: '1', title: 'Speed Sprint #42', difficulty: 'medium', duration: 60, startTime: new Date(Date.now() + 3600000).toISOString(), participants: 128, maxAttempts: 3, status: 'upcoming', rankingMethod: 'best', passageCount: 5, totalAttempts: 0, avgWpm: 0, completionRate: 0, randomPassageMode: true, maxParticipants: 200, createdAt: '2026-03-14T10:00:00Z' },
  { id: '2', title: 'Midnight Marathon', difficulty: 'hard', duration: 120, startTime: new Date(Date.now() - 1800000).toISOString(), participants: 256, maxAttempts: 2, status: 'live', rankingMethod: 'best', passageCount: 10, totalAttempts: 412, avgWpm: 98, completionRate: 78.5, randomPassageMode: true, maxParticipants: 500, createdAt: '2026-03-13T20:00:00Z' },
  { id: '3', title: 'Beginner Blitz', difficulty: 'easy', duration: 30, startTime: new Date(Date.now() + 7200000).toISOString(), participants: 64, maxAttempts: 5, status: 'upcoming', rankingMethod: 'average', passageCount: 3, totalAttempts: 0, avgWpm: 0, completionRate: 0, randomPassageMode: false, maxParticipants: 100, createdAt: '2026-03-14T14:00:00Z' },
  { id: '4', title: 'Code Warrior Challenge', difficulty: 'hard', duration: 90, startTime: new Date(Date.now() - 86400000).toISOString(), participants: 512, maxAttempts: 3, status: 'ended', rankingMethod: 'best', passageCount: 8, totalAttempts: 1247, avgWpm: 112, completionRate: 85.2, randomPassageMode: true, maxParticipants: 1000, createdAt: '2026-03-10T08:00:00Z' },
  { id: '5', title: 'Weekend Warmup', difficulty: 'easy', duration: 45, startTime: new Date(Date.now() - 172800000).toISOString(), participants: 89, maxAttempts: 4, status: 'ended', rankingMethod: 'best', passageCount: 4, totalAttempts: 298, avgWpm: 95, completionRate: 91.0, randomPassageMode: false, maxParticipants: 150, createdAt: '2026-03-08T12:00:00Z' },
  { id: '6', title: 'Pro League Round 7', difficulty: 'hard', duration: 120, startTime: new Date(Date.now() + 86400000).toISOString(), participants: 34, maxAttempts: 2, status: 'upcoming', rankingMethod: 'best', passageCount: 6, totalAttempts: 0, avgWpm: 0, completionRate: 0, randomPassageMode: true, maxParticipants: 64, createdAt: '2026-03-15T09:00:00Z' },
];

// Mock Admin Passages
export const adminPassages: AdminPassage[] = [
  { id: '1', text: 'The quick brown fox jumps over the lazy dog. A wizard\'s job is to vex chumps quickly in fog. How vexingly quick daft zebras jump! The five boxing wizards jump quickly at dawn.', difficulty: 'easy', wordCount: 32, language: 'English', createdAt: '2025-12-01T10:00:00Z', usedCount: 145 },
  { id: '2', text: 'Programming is the art of telling another human being what one wants the computer to do. Software is a great combination between artistry and engineering. The best error message is the one that never shows up.', difficulty: 'medium', wordCount: 35, language: 'English', createdAt: '2025-12-15T14:00:00Z', usedCount: 98 },
  { id: '3', text: 'In the realm of competitive programming, algorithmic efficiency determines the boundary between accepted and time-limit-exceeded submissions. Understanding asymptotic complexity enables practitioners to evaluate performance characteristics systematically.', difficulty: 'hard', wordCount: 28, language: 'English', createdAt: '2026-01-05T08:00:00Z', usedCount: 67 },
  { id: '4', text: 'React hooks let you use state and other features without writing a class. They embrace functions and avoid the complexity of classes, mixins, and inheritance patterns.', difficulty: 'medium', wordCount: 28, language: 'English', createdAt: '2026-01-20T11:00:00Z', usedCount: 82 },
  { id: '5', text: 'The sun set behind the mountains, casting long shadows across the valley. Birds sang their evening songs as the cool breeze rustled through the leaves of ancient oak trees.', difficulty: 'easy', wordCount: 30, language: 'English', createdAt: '2026-02-10T16:00:00Z', usedCount: 120 },
  { id: '6', text: 'Quantum entanglement represents one of the most counterintuitive phenomena in physics, whereby particles become interconnected such that measurements on one instantaneously influence the other regardless of spatial separation.', difficulty: 'hard', wordCount: 27, language: 'English', createdAt: '2026-02-28T09:00:00Z', usedCount: 43 },
];

// Mock Activity Feed
export const adminActivity: ActivityItem[] = [
  { id: '1', type: 'contest_created', message: 'Pro League Round 7 was created', timestamp: '2026-03-15T09:00:00Z', icon: '🏆' },
  { id: '2', type: 'user_joined', message: 'newracer42 joined the platform', timestamp: '2026-03-15T12:30:00Z', icon: '👤' },
  { id: '3', type: 'record_broken', message: 'typelord set new WPM record: 162', timestamp: '2026-03-15T14:00:00Z', icon: '⚡' },
  { id: '4', type: 'contest_ended', message: 'Code Warrior Challenge ended', timestamp: '2026-03-15T16:00:00Z', icon: '🏁' },
  { id: '5', type: 'user_joined', message: 'flashfingers joined the platform', timestamp: '2026-03-16T06:00:00Z', icon: '👤' },
  { id: '6', type: 'contest_created', message: 'Speed Sprint #42 was scheduled', timestamp: '2026-03-16T07:00:00Z', icon: '🏆' },
];

// Mock Analytics
export const adminAnalytics: AnalyticsData = {
  dailyActiveUsers: [
    { date: 'Mar 10', value: 234 }, { date: 'Mar 11', value: 289 }, { date: 'Mar 12', value: 312 },
    { date: 'Mar 13', value: 278 }, { date: 'Mar 14', value: 345 }, { date: 'Mar 15', value: 398 },
    { date: 'Mar 16', value: 421 },
  ],
  attemptsPerDay: [
    { date: 'Mar 10', value: 567 }, { date: 'Mar 11', value: 612 }, { date: 'Mar 12', value: 734 },
    { date: 'Mar 13', value: 689 }, { date: 'Mar 14', value: 812 }, { date: 'Mar 15', value: 945 },
    { date: 'Mar 16', value: 1023 },
  ],
  avgWpmTrend: [
    { date: 'Mar 10', value: 87 }, { date: 'Mar 11', value: 89 }, { date: 'Mar 12', value: 91 },
    { date: 'Mar 13', value: 88 }, { date: 'Mar 14', value: 93 }, { date: 'Mar 15', value: 95 },
    { date: 'Mar 16', value: 97 },
  ],
  contestParticipation: [
    { name: 'Speed Sprint #42', value: 128 }, { name: 'Midnight Marathon', value: 256 },
    { name: 'Beginner Blitz', value: 64 }, { name: 'Code Warrior', value: 512 },
  ],
};

// Mock Platform Settings
export const defaultPlatformSettings: PlatformSettings = {
  defaultDuration: 60,
  defaultMaxAttempts: 3,
  defaultDifficulty: 'medium',
  defaultRankingMethod: 'best',
  maintenanceMode: false,
  registrationEnabled: true,
  maxUsersPerContest: 500,
};
