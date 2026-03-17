import { useAuth } from '@/contexts/AuthContext';
import StatsCard from '@/components/StatsCard';
import { Gauge, Target, Trophy, Calendar, Loader2 } from 'lucide-react';
import { useApiQuery } from '@/hooks/useApi';
import { mockAchievements } from '@/lib/mock-data';
import { Navigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();

  // Fetch user's recent attempts
  const { data: recentAttempts } = useApiQuery<any[]>(
    ['my-attempts'],
    '/attempt/user/recent',
    { enabled: isAuthenticated },
  );

  if (loading) return <div className="page-container flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const attempts = recentAttempts || [];

  return (
    <div className="page-container max-w-4xl">
      {/* Header */}
      <div className="glass-card p-6 mb-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
          {user!.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user!.username}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize">{user!.role}</span>
            <span className="text-sm text-muted-foreground">Rating: <span className="font-mono font-bold text-foreground">{user!.rating}</span></span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={<Gauge className="w-5 h-5" />} label="Avg WPM" value={user!.avgWPM || 0} />
        <StatsCard icon={<Target className="w-5 h-5" />} label="Total Tests" value={user!.totalTests || 0} />
        <StatsCard icon={<Trophy className="w-5 h-5" />} label="Rating" value={user!.rating} />
        <StatsCard icon={<Calendar className="w-5 h-5" />} label="Role" value={user!.role} />
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
        {attempts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No attempts yet. Join a contest!</div>
        )}
        {attempts.map((a: any) => (
          <div key={a._id || a.id} className="glass-card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Attempt #{a.attemptNumber}</div>
              <div className="text-xs text-muted-foreground">Contest: {a.contestId}</div>
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
