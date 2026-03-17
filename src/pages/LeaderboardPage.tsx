import LeaderboardTable from '@/components/LeaderboardTable';
import { useApiQuery } from '@/hooks/useApi';
import { mockLeaderboard } from '@/lib/mock-data';
import { LeaderboardEntry } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function LeaderboardPage() {
  // For global leaderboard, we show top players from all contests
  // Since backend doesn't have a global endpoint, we use mock as fallback
  const { data, isLoading } = useApiQuery<any[]>(['global-leaderboard'], '/leaderboard/global');

  const entries: LeaderboardEntry[] = data
    ? data.map((e: any, i: number) => ({
        rank: i + 1,
        username: e.username,
        wpm: e.wpm,
        accuracy: e.accuracy,
        attemptNumber: e.attemptUsed || 1,
        status: 'finished' as const,
      }))
    : mockLeaderboard;

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-6">Global Leaderboard</h1>
      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <LeaderboardTable entries={entries} />
      )}
    </div>
  );
}
