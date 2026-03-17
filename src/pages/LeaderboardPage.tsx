import { useState } from 'react';
import LeaderboardTable from '@/components/LeaderboardTable';
import { useApiQuery } from '@/hooks/useApi';
import { LeaderboardEntry, Contest } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function LeaderboardPage() {
  const [selectedContest, setSelectedContest] = useState<string | ''>('');

  // Fetch contests to build a selector
  const { data: apiContests } = useApiQuery<any>(['leaderboard-contests'], '/contests');
  const contestItems = Array.isArray(apiContests) ? apiContests : apiContests?.contests ?? [];
  const contests = contestItems.map((c: any) => ({ id: c._id || c.id, title: c.title, status: c.status }));

  // Fetch leaderboard for selected contest
  const contestId = selectedContest || (contests.length > 0 ? contests[0].id : '');
  const { data: apiLeaderboard, isLoading } = useApiQuery<any>(
    ['leaderboard', contestId],
    `/leaderboard/${contestId}`,
    { enabled: !!contestId },
  );

  const leaderboardData = Array.isArray(apiLeaderboard) ? apiLeaderboard : apiLeaderboard?.leaderboard ?? [];
  const entries: LeaderboardEntry[] = Array.isArray(leaderboardData)
    ? leaderboardData.map((e: any, i: number) => ({
        rank: e.rank || i + 1,
        username: e.username,
        wpm: e.wpm,
        accuracy: e.accuracy,
        attemptNumber: e.attemptUsed || 1,
        status: 'finished' as const,
      }))
    : [];

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

      {/* Contest selector */}
      {contests.length > 0 && (
        <div className="mb-6">
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Select Contest</label>
          <select
            value={contestId}
            onChange={e => setSelectedContest(e.target.value)}
            className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[200px]"
          >
            {contests.map((c: any) => (
              <option key={c.id} value={c.id}>{c.title} ({c.status})</option>
            ))}
          </select>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : entries.length > 0 ? (
        <LeaderboardTable entries={entries} />
      ) : (
        <div className="glass-card p-8 text-center text-muted-foreground">
          {contests.length === 0 ? 'No contests available yet.' : 'No leaderboard entries for this contest yet.'}
        </div>
      )}
    </div>
  );
}
