import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { adminContests, AdminContest } from '@/lib/admin-data';
import { toast } from 'sonner';

const statusBadge = (status: string) => {
  const s: Record<string, string> = { upcoming: 'bg-muted text-muted-foreground', live: 'bg-success/10 text-success', ended: 'bg-secondary text-muted-foreground' };
  return <Badge variant="outline" className={`capitalize ${s[status] || ''}`}>{status === 'live' && <span className="w-1.5 h-1.5 bg-success rounded-full mr-1 inline-block animate-pulse" />}{status}</Badge>;
};

const diffBadge = (d: string) => {
  const s: Record<string, string> = { easy: 'bg-success/10 text-success border-success/20', medium: 'bg-warning/10 text-warning border-warning/20', hard: 'bg-destructive/10 text-destructive border-destructive/20' };
  return <Badge variant="outline" className={`capitalize ${s[d] || ''}`}>{d}</Badge>;
};

export default function AdminContestsPage() {
  const [filter, setFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = filter === 'all' ? adminContests : adminContests.filter(c => c.status === filter);

  const columns = [
    { key: 'title', header: 'Title', render: (c: AdminContest) => (
      <Link to={`/admin/contests/${c.id}`} className="font-medium hover:text-primary transition-colors">{c.title}</Link>
    )},
    { key: 'difficulty', header: 'Difficulty', render: (c: AdminContest) => diffBadge(c.difficulty) },
    { key: 'duration', header: 'Duration', render: (c: AdminContest) => <span className="font-mono text-muted-foreground">{c.duration}s</span> },
    { key: 'startTime', header: 'Start Time', render: (c: AdminContest) => (
      <span className="text-muted-foreground text-xs">{new Date(c.startTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
    )},
    { key: 'maxAttempts', header: 'Attempts', render: (c: AdminContest) => <span className="font-mono">{c.maxAttempts}</span>, className: 'text-center' },
    { key: 'status', header: 'Status', render: (c: AdminContest) => statusBadge(c.status) },
    { key: 'participants', header: 'Players', render: (c: AdminContest) => <span className="font-mono">{c.participants}/{c.maxParticipants}</span>, className: 'text-right' },
    { key: 'actions', header: '', render: (c: AdminContest) => (
      <div className="flex items-center gap-1 justify-end">
        <Link to={`/admin/contests/${c.id}`} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Eye className="w-4 h-4" />
        </Link>
        <Link to={`/admin/contests/create?edit=${c.id}`} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Edit2 className="w-4 h-4" />
        </Link>
        <button onClick={() => setDeleteId(c.id)} className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ), className: 'text-right' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contests</h1>
          <p className="text-sm text-muted-foreground mt-1">{adminContests.length} total contests</p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/admin/contests/create"><Plus className="w-4 h-4" /> Create Contest</Link>
        </Button>
      </div>

      <div className="flex gap-1">
        {['all', 'live', 'upcoming', 'ended'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} keyExtractor={c => c.id} />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { toast.success('Contest deleted'); setDeleteId(null); }}
        title="Delete Contest"
        description="Are you sure you want to delete this contest? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
