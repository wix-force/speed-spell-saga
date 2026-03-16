import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Square, Edit2, Users, BarChart3, Target, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatsCard from '@/components/StatsCard';
import DataTable from '@/components/admin/DataTable';
import { adminContests, adminUsers } from '@/lib/admin-data';
import { toast } from 'sonner';

export default function AdminContestDetailPage() {
  const { id } = useParams();
  const contest = adminContests.find(c => c.id === id);

  if (!contest) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Contest not found.</p>
        <Button asChild variant="outline"><Link to="/admin/contests">Back</Link></Button>
      </div>
    );
  }

  const participants = adminUsers.slice(0, Math.min(contest.participants, adminUsers.length));

  const participantCols = [
    { key: 'username', header: 'Player', render: (u: typeof participants[0]) => (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{u.username[0].toUpperCase()}</div>
        <span className="font-medium">{u.username}</span>
      </div>
    )},
    { key: 'bestWpm', header: 'Best WPM', render: (u: typeof participants[0]) => <span className="font-mono text-primary">{u.bestWpm}</span>, className: 'text-right' },
    { key: 'accuracy', header: 'Accuracy', render: (u: typeof participants[0]) => <span className="font-mono text-success">{u.avgAccuracy}%</span>, className: 'text-right' },
    { key: 'rating', header: 'Rating', render: (u: typeof participants[0]) => <span className="font-mono">{u.rating}</span>, className: 'text-right' },
  ];

  return (
    <div className="space-y-6">
      <Link to="/admin/contests" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Contests
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{contest.title}</h1>
            <Badge variant="outline" className={`capitalize ${contest.status === 'live' ? 'bg-success/10 text-success' : ''}`}>{contest.status}</Badge>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="outline" className="capitalize">{contest.difficulty}</Badge>
            <span>{contest.duration}s • {contest.maxAttempts} attempts • {contest.rankingMethod} ranking</span>
          </div>
        </div>
        <div className="flex gap-2">
          {contest.status === 'upcoming' && (
            <Button className="gap-2" onClick={() => toast.success('Contest started!')}><Play className="w-4 h-4" /> Start</Button>
          )}
          {contest.status === 'live' && (
            <Button variant="destructive" className="gap-2" onClick={() => toast.success('Contest ended!')}><Square className="w-4 h-4" /> End</Button>
          )}
          <Button variant="outline" className="gap-2" asChild>
            <Link to={`/admin/contests/create?edit=${contest.id}`}><Edit2 className="w-4 h-4" /> Edit</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<Users className="w-5 h-5" />} label="Participants" value={`${contest.participants}/${contest.maxParticipants}`} />
        <StatsCard icon={<BarChart3 className="w-5 h-5" />} label="Total Attempts" value={contest.totalAttempts} />
        <StatsCard icon={<Gauge className="w-5 h-5" />} label="Average WPM" value={contest.avgWpm || '—'} />
        <StatsCard icon={<Target className="w-5 h-5" />} label="Completion Rate" value={contest.completionRate ? `${contest.completionRate}%` : '—'} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Participants</h2>
        <DataTable columns={participantCols} data={participants} keyExtractor={u => u.id} />
      </div>
    </div>
  );
}
