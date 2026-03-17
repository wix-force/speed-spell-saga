import { Users, Trophy, BarChart3, Gauge } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import DataTable from '@/components/admin/DataTable';
import { adminContests, adminActivity, adminUsers, AdminContest } from '@/lib/admin-data';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApiQuery } from '@/hooks/useApi';

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    upcoming: 'bg-muted text-muted-foreground',
    live: 'bg-success/10 text-success',
    running: 'bg-success/10 text-success',
    ended: 'bg-secondary text-muted-foreground',
  };
  return <Badge variant="outline" className={`capitalize ${styles[status] || ''}`}>{status === 'running' ? 'live' : status}</Badge>;
};

export default function AdminDashboardPage() {
  const { data: analyticsData } = useApiQuery<any>(['admin-analytics'], '/admin/analytics');

  const stats = analyticsData || {
    totalUsers: adminUsers.length,
    totalContests: adminContests.length,
    totalAttempts: adminContests.reduce((sum, c) => sum + c.totalAttempts, 0),
    activeContests: adminContests.filter(c => c.status === 'live').length,
    averageWPM: Math.round(adminContests.filter(c => c.avgWpm > 0).reduce((s, c) => s + c.avgWpm, 0) / (adminContests.filter(c => c.avgWpm > 0).length || 1)),
  };

  const contestColumns = [
    { key: 'title', header: 'Contest', render: (c: AdminContest) => (
      <Link to={`/admin/contests/${c.id}`} className="font-medium hover:text-primary transition-colors">{c.title}</Link>
    )},
    { key: 'status', header: 'Status', render: (c: AdminContest) => statusBadge(c.status) },
    { key: 'participants', header: 'Players', render: (c: AdminContest) => <span className="font-mono">{c.participants}</span>, className: 'text-right' },
    { key: 'avgWpm', header: 'Avg WPM', render: (c: AdminContest) => <span className="font-mono text-primary">{c.avgWpm || '—'}</span>, className: 'text-right' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your typing platform</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <StatsCard icon={<Users className="w-5 h-5" />} label="Total Users" value={stats.totalUsers?.toLocaleString()} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <StatsCard icon={<Trophy className="w-5 h-5" />} label="Active Contests" value={stats.activeContests} subtitle={`${stats.totalContests} total`} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatsCard icon={<BarChart3 className="w-5 h-5" />} label="Total Attempts" value={stats.totalAttempts?.toLocaleString()} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatsCard icon={<Gauge className="w-5 h-5" />} label="Average WPM" value={stats.averageWPM || 0} />
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recent Contests</h2>
            <Link to="/admin/contests" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <DataTable columns={contestColumns} data={adminContests.slice(0, 5)} keyExtractor={c => c.id} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
          <div className="glass-card divide-y divide-border/30">
            {adminActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3">
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{item.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Top Players</h2>
          <Link to="/leaderboard" className="text-xs text-primary hover:underline">Full leaderboard →</Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {adminUsers.sort((a, b) => b.rating - a.rating).slice(0, 3).map((user, i) => (
            <div key={user.id} className="glass-card p-4 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i === 0 ? 'bg-warning/20 text-warning' : i === 1 ? 'bg-muted text-muted-foreground' : 'bg-warning/10 text-warning/60'
              }`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.username}</div>
                <div className="text-xs text-muted-foreground">{user.bestWpm} WPM</div>
              </div>
              <div className="text-sm font-mono font-bold text-primary">{user.rating}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
