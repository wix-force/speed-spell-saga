import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { useApiQuery } from '@/hooks/useApi';

export default function AdminContestCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    difficulty: 'medium',
    startTime: '',
    duration: 60,
    maxAttempts: 3,
    rankingMethod: 'best',
    passagePool: [] as string[],
    maxParticipants: 200,
  });
  const { data: apiPassages, isLoading: isPassagesLoading } = useApiQuery<any>(['admin-passages'], '/passages');
  const passageItems = Array.isArray(apiPassages) ? apiPassages : apiPassages?.passages ?? [];

  const update = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.passagePool.length === 0) {
      toast.error('Please select at least one passage');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/contests', {
        ...form,
        startTime: new Date(form.startTime).toISOString(),
      });
      toast.success('Contest created successfully!');
      navigate('/admin/contests');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create contest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Link to="/admin/contests" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Contests
      </Link>

      <h1 className="text-2xl font-bold mb-6">Create Contest</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Basic Info</h2>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Contest Title</label>
            <Input value={form.title} onChange={e => update('title', e.target.value)} placeholder="Speed Sprint #43" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={e => update('difficulty', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Start Time</label>
              <Input type="datetime-local" value={form.startTime} onChange={e => update('startTime', e.target.value)} required />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-5">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Contest Rules</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Duration (seconds)</label>
              <Input type="number" min={10} value={form.duration} onChange={e => update('duration', +e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Max Attempts</label>
              <Input type="number" min={1} max={10} value={form.maxAttempts} onChange={e => update('maxAttempts', +e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Max Participants</label>
              <Input type="number" min={2} value={form.maxParticipants} onChange={e => update('maxParticipants', +e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Ranking Method</label>
            <div className="flex gap-2">
              {['best', 'last', 'average'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => update('rankingMethod', m)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    form.rankingMethod === m ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {m} attempt
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Passage Pool</label>
            <div className="text-xs text-muted-foreground mb-3">Admin chooses which passages are included in this contest.</div>
            <div className="space-y-2 max-h-56 overflow-y-auto rounded-lg border border-border p-2">
              {isPassagesLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
              ) : passageItems.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2 px-1">No passages found. Add passages first.</p>
              ) : (
                passageItems.map((p: any) => {
                  const pid = p._id || p.id;
                  const checked = form.passagePool.includes(pid);
                  return (
                    <label key={pid} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-secondary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          update(
                            'passagePool',
                            e.target.checked
                              ? [...form.passagePool, pid]
                              : form.passagePool.filter((id) => id !== pid)
                          );
                        }}
                      />
                      <Badge variant="outline" className="capitalize text-xs">{p.difficulty}</Badge>
                      <span className="text-sm text-muted-foreground truncate">{p.text}</span>
                    </label>
                  );
                })
              )}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Selected: {form.passagePool.length}</div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/contests')}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Create Contest
          </Button>
        </div>
      </form>
    </div>
  );
}
