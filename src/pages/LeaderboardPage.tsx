import LeaderboardTable from '@/components/LeaderboardTable';
import { mockLeaderboard } from '@/lib/mock-data';

export default function LeaderboardPage() {
  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-6">Global Leaderboard</h1>
      <LeaderboardTable entries={mockLeaderboard} />
    </div>
  );
}
