import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Square, Edit2, Users, BarChart3, Target, Gauge, Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatsCard from '@/components/StatsCard';
import DataTable from '@/components/admin/DataTable';
import LeaderboardTable from '@/components/LeaderboardTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import AdminModal from '@/components/admin/AdminModal';
import { useApiQuery } from '@/hooks/useApi';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { LeaderboardEntry } from '@/lib/types';

export default function AdminContestDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [statusAction, setStatusAction] = useState<'start' | 'end' | null>(null);
  const [passageModalOpen, setPassageModalOpen] = useState(false);

  const { data: contest, isLoading } = useApiQuery<any>(['admin-contest', id], `/contests/${id}`);
  const { data: apiLeaderboard } = useApiQuery<any>(['admin-leaderboard', id], `/leaderboard/${id}`);
  const { data: allPassages } = useApiQuery<any>(['admin-passages'], '/passages');

  const leaderboardData = Array.isArray(apiLeaderboard) ? apiLeaderboard : apiLeaderboard?.leaderboard ?? [];
  const leaderboard: LeaderboardEntry[] = Array.isArray(leaderboardData)
    ? leaderboardData.map((e: any, i: number) => ({
        rank: e.rank || i + 1,
        username: e.username,
        wpm: e.wpm,
        accuracy: e.accuracy,
        attemptNumber: e.attemptUsed || 1,
        status: 'finished' as const,
      }))
    : [];

  const passageList = Array.isArray(allPassages) ? allPassages : allPassages?.passages ?? [];
  const contestPassageIds = contest?.passagePool?.map((p: any) => p._id || p.id || p) || [];

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!contest) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Contest not found.</p>
        <Button asChild variant="outline"><Link to="/admin/contests">Back</Link></Button>
      </div>
    );
  }

  const handleStatusChange = async () => {
    if (!statusAction) return;
    const newStatus = statusAction === 'start' ? 'running' : 'ended';
    try {
      await apiClient.patch(`/contests/${id}`, { status: newStatus });
      queryClient.invalidateQueries({ queryKey: ['admin-contest', id] });
      toast.success(`Contest ${statusAction === 'start' ? 'started' : 'ended'}!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
    setStatusAction(null);
  };

  const handleAddPassage = async (passageId: string) => {
    try {
      const updatedPool = [...contestPassageIds, passageId];
      await apiClient.patch(`/contests/${id}`, { passagePool: updatedPool });
      queryClient.invalidateQueries({ queryKey: ['admin-contest', id] });
      toast.success('Passage added to contest');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add passage');
    }
  };

  const handleRemovePassage = async (passageId: string) => {
    try {
      const updatedPool = contestPassageIds.filter((pid: string) => pid !== passageId);
      await apiClient.patch(`/contests/${id}`, { passagePool: updatedPool });
      queryClient.invalidateQueries({ queryKey: ['admin-contest', id] });
      toast.success('Passage removed from contest');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove passage');
    }
  };

  const status = contest.status;
  const availablePassages = passageList.filter((p: any) => !contestPassageIds.includes(p._id || p.id));

  return (
    <div className="space-y-6">
      <Link to="/admin/contests" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Contests
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{contest.title}</h1>
            <Badge variant="outline" className={`capitalize ${status === 'running' ? 'bg-success/10 text-success' : ''}`}>
              {status === 'running' ? 'live' : status}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="outline" className="capitalize">{contest.difficulty}</Badge>
            <span>{contest.duration}s • {contest.maxAttempts} attempts • {contest.rankingMethod} ranking</span>
          </div>
        </div>
        <div className="flex gap-2">
          {status === 'upcoming' && (
            <Button className="gap-2" onClick={() => setStatusAction('start')}><Play className="w-4 h-4" /> Start</Button>
          )}
          {status === 'running' && (
            <Button variant="destructive" className="gap-2" onClick={() => setStatusAction('end')}><Square className="w-4 h-4" /> End</Button>
          )}
          <Button variant="outline" className="gap-2" asChild>
            <Link to={`/admin/contests/create?edit=${id}`}><Edit2 className="w-4 h-4" /> Edit</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<Users className="w-5 h-5" />} label="Participants" value={contest.participantsCount || 0} />
        <StatsCard icon={<BarChart3 className="w-5 h-5" />} label="Passages" value={contestPassageIds.length} />
        <StatsCard icon={<Gauge className="w-5 h-5" />} label="Max Attempts" value={contest.maxAttempts} />
        <StatsCard icon={<Target className="w-5 h-5" />} label="Status" value={status === 'running' ? 'Live' : status} />
      </div>

      {/* Passage Pool */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Passage Pool ({contestPassageIds.length})</h2>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => setPassageModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Passage
          </Button>
        </div>
        {contest.passagePool && contest.passagePool.length > 0 ? (
          <div className="space-y-2">
            {contest.passagePool.map((p: any) => {
              const pid = p._id || p.id || p;
              const text = p.text || 'Passage';
              const diff = p.difficulty || 'medium';
              return (
                <div key={pid} className="glass-card p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Badge variant="outline" className="capitalize text-xs">{diff}</Badge>
                    <span className="text-sm text-muted-foreground truncate">{text}</span>
                  </div>
                  <button
                    onClick={() => handleRemovePassage(pid)}
                    className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-6 text-center text-muted-foreground">No passages added yet.</div>
        )}
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Leaderboard</h2>
        {leaderboard.length > 0 ? (
          <LeaderboardTable entries={leaderboard} />
        ) : (
          <div className="glass-card p-6 text-center text-muted-foreground">No attempts yet.</div>
        )}
      </div>

      {/* Status change confirm */}
      <ConfirmDialog
        open={!!statusAction}
        onClose={() => setStatusAction(null)}
        onConfirm={handleStatusChange}
        title={statusAction === 'start' ? 'Start Contest' : 'End Contest'}
        description={statusAction === 'start' ? 'Start this contest? It will become live.' : 'End this contest? No more attempts will be allowed.'}
        confirmLabel={statusAction === 'start' ? 'Start' : 'End'}
        variant={statusAction === 'end' ? 'destructive' : 'default'}
      />

      {/* Add Passage Modal */}
      <AdminModal open={passageModalOpen} onClose={() => setPassageModalOpen(false)} title="Add Passage to Contest" maxWidth="max-w-lg">
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {availablePassages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No available passages. Create new ones first.</p>
          ) : (
            availablePassages.map((p: any) => (
              <div key={p._id || p.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Badge variant="outline" className="capitalize text-xs">{p.difficulty}</Badge>
                  <span className="text-sm text-muted-foreground truncate">{p.text}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => { handleAddPassage(p._id || p.id); setPassageModalOpen(false); }}>
                  Add
                </Button>
              </div>
            ))
          )}
        </div>
      </AdminModal>
    </div>
  );
}
