import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import StatsCard from '@/components/StatsCard';
import { Users, Trophy, BarChart3, FileText, Plus, Trash2 } from 'lucide-react';
import { mockContests, mockPassages } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const [tab, setTab] = useState<'contests' | 'passages' | 'analytics'>('contests');

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {(['contests', 'passages', 'analytics'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'analytics' && (
        <div className="grid sm:grid-cols-3 gap-4">
          <StatsCard icon={<Users className="w-5 h-5" />} label="Total Users" value="2,847" />
          <StatsCard icon={<Trophy className="w-5 h-5" />} label="Active Contests" value="3" />
          <StatsCard icon={<BarChart3 className="w-5 h-5" />} label="Total Attempts" value="12,459" />
        </div>
      )}

      {tab === 'contests' && (
        <div className="space-y-6">
          {/* Create contest form */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> Create Contest
            </h2>
            <form className="grid sm:grid-cols-2 gap-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title</label>
                <Input placeholder="Speed Sprint #43" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Difficulty</label>
                <select className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                  <option>easy</option>
                  <option>medium</option>
                  <option>hard</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Duration (seconds)</label>
                <Input type="number" placeholder="60" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Max Attempts</label>
                <Input type="number" placeholder="3" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Ranking Method</label>
                <select className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                  <option>best</option>
                  <option>last</option>
                  <option>average</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Start Time</label>
                <Input type="datetime-local" />
              </div>
              <div className="sm:col-span-2">
                <Button>Create Contest</Button>
              </div>
            </form>
          </div>

          {/* Existing contests */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Existing Contests</h3>
            <div className="space-y-2">
              {mockContests.map(c => (
                <div key={c.id} className="glass-card p-4 flex items-center justify-between">
                  <div>
                    <span className="font-medium">{c.title}</span>
                    <Badge variant="outline" className="ml-2 capitalize">{c.status}</Badge>
                  </div>
                  <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'passages' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Add Passage
            </h2>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Passage Text</label>
                <Textarea placeholder="Enter the typing passage..." rows={4} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Difficulty</label>
                <select className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                  <option>easy</option>
                  <option>medium</option>
                  <option>hard</option>
                </select>
              </div>
              <Button>Add Passage</Button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Existing Passages</h3>
            <div className="space-y-2">
              {mockPassages.map(p => (
                <div key={p.id} className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="capitalize">{p.difficulty}</Badge>
                    <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
