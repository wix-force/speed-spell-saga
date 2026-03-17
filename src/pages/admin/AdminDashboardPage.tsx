import { Users, Trophy, BarChart3, Gauge } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import DataTable from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApiQuery } from '@/hooks/useApi';
import { Loader2 } from 'lucide-react';

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    upcoming: 'bg-muted text-muted-foreground',
    live: 'bg-success/10 text-success',
    running: 'bg-success/10 text-success',
    ended: 'bg-secondary text-muted-foreground',
  };
  const label = status === 'running' ? 'live' : status;
  return <Badge variant="outline" className={`capitalize ${styles[status] || ''}`}>{label}</Badge>;
};

export default function AdminDashboardPage() {
  const { data: analyticsData, isLoading: loadingAnalytics } = useApiQuery<any>(['admin-analytics'], '/admin/analytics');
  const { data: apiContests, isLoading: loadingContests } = useApiQuery<any>(['admin-dash-contests'], '/contests');

  const stats = analyticsData || { totalUsers: 0, totalContests: 0, totalAttempts: 0, activeContests: 0, averageWPM: 0 };

  const contestItems = Array.isArray(apiContests) ? apiContests : apiContests?.contests ?? [];
  const recentContests = contestItems.slice(0, 5).map((c: any) => ({
    id: c._id || c.id,
    title: c.title,
    status: c.status,
    participants: c.participantsCount || 0,
  }));

  const contestColumns = [
    { key: 'title', header: 'Contest', render: (c: any) => (
      <Link to={`/admin/contests/${c.id}`} className="font-medium hover:text-primary transition-colors">{c.title}</Link>
    )},
    { key: 'status', header: 'Status', render: (c: any) => statusBadge(c.status) },
    { key: 'participants', header: 'Players', render: (c: any) => <span className="font-mono">{c.participants}</span>, className: 'text-right' },
  ];

  if (loadingAnalytics && loadingContests) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

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

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Contests</h2>
          <Link to="/admin/contests" className="text-xs text-primary hover:underline">View all →</Link>
        </div>
        {recentContests.length > 0 ? (
          <DataTable columns={contestColumns} data={recentContests} keyExtractor={(c: any) => c.id} />
        ) : (
          <div className="glass-card p-6 text-center text-muted-foreground">No contests yet.</div>
        )}
      </div>
    </div>
  );
}
