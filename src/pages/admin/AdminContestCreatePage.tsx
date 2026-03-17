import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';

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
    randomPassage: true,
    maxParticipants: 200,
  });

  const update = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium">Random Passage Mode</div>
              <div className="text-xs text-muted-foreground">Each attempt gets a random passage from the pool</div>
            </div>
            <Switch checked={form.randomPassage} onCheckedChange={v => update('randomPassage', v)} />
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
