import { LeaderboardEntry } from '@/lib/types';
import { Crown, Circle } from 'lucide-react';

const rankStyles: Record<number, string> = {
  1: 'text-warning',
  2: 'text-muted-foreground',
  3: 'text-warning/60',
};

export default function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Rank</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Player</th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">WPM</th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Accuracy</th>
              <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Attempt</th>
              <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.rank} className="border-b border-border/30 hover:bg-secondary/50 transition-colors">
                <td className="px-4 py-3">
                  <span className={`font-bold font-mono ${rankStyles[entry.rank] || 'text-foreground'}`}>
                    {entry.rank <= 3 ? <Crown className={`w-4 h-4 inline mr-1 ${rankStyles[entry.rank]}`} /> : null}
                    #{entry.rank}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{entry.username}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-primary">{entry.wpm}</td>
                <td className="px-4 py-3 text-right font-mono text-success">{entry.accuracy}%</td>
                <td className="px-4 py-3 text-center font-mono text-muted-foreground">#{entry.attemptNumber}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                    entry.status === 'typing'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-success/10 text-success'
                  }`}>
                    <Circle className={`w-1.5 h-1.5 fill-current ${entry.status === 'typing' ? 'animate-pulse' : ''}`} />
                    {entry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
