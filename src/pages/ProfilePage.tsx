import { mockUser, mockAchievements, mockAttempts } from '@/lib/mock-data';
import StatsCard from '@/components/StatsCard';
import { Gauge, Target, Trophy, Calendar } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="page-container max-w-4xl">
      {/* Header */}
      <div className="glass-card p-6 mb-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
          {mockUser.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{mockUser.username}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-sm font-medium">{mockUser.rank}</span>
            <span className="text-sm text-muted-foreground">Rating: <span className="font-mono font-bold text-foreground">{mockUser.rating}</span></span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={<Gauge className="w-5 h-5" />} label="Best WPM" value={mockUser.bestWpm} />
        <StatsCard icon={<Target className="w-5 h-5" />} label="Avg Accuracy" value={`${mockUser.avgAccuracy}%`} />
        <StatsCard icon={<Trophy className="w-5 h-5" />} label="Contests" value={mockUser.contestsPlayed} />
        <StatsCard icon={<Calendar className="w-5 h-5" />} label="Joined" value={mockUser.joinedAt} />
      </div>

      {/* Achievements */}
      <h2 className="text-xl font-bold mb-4">Achievements</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {mockAchievements.map(a => (
          <div
            key={a.id}
            className={`glass-card p-4 text-center transition-opacity ${a.earned ? '' : 'opacity-40'}`}
          >
            <div className="text-3xl mb-2">{a.icon}</div>
            <div className="text-sm font-semibold">{a.title}</div>
            <div className="text-xs text-muted-foreground">{a.description}</div>
          </div>
        ))}
      </div>

      {/* Recent attempts */}
      <h2 className="text-xl font-bold mb-4">Recent Attempts</h2>
      <div className="space-y-3">
        {mockAttempts.map(a => (
          <div key={a.id} className="glass-card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Attempt #{a.attemptNumber}</div>
              <div className="text-xs text-muted-foreground">Contest #{a.contestId}</div>
            </div>
            <div className="flex gap-6 text-sm">
              <div><span className="text-muted-foreground">WPM: </span><span className="font-mono font-bold text-primary">{a.wpm}</span></div>
              <div><span className="text-muted-foreground">Acc: </span><span className="font-mono text-success">{a.accuracy}%</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
