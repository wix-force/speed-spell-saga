import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { defaultPlatformSettings, PlatformSettings } from '@/lib/admin-data';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(defaultPlatformSettings);

  const update = (key: keyof PlatformSettings, value: unknown) =>
    setSettings(s => ({ ...s, [key]: value }));

  const handleSave = () => toast.success('Settings saved!');

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform configuration</p>
      </div>

      {/* Platform */}
      <div className="glass-card p-6 space-y-5">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Platform</h2>

        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-sm font-medium">Maintenance Mode</div>
            <div className="text-xs text-muted-foreground">Disable access for all non-admin users</div>
          </div>
          <Switch checked={settings.maintenanceMode} onCheckedChange={v => update('maintenanceMode', v)} />
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-sm font-medium">Registration Enabled</div>
            <div className="text-xs text-muted-foreground">Allow new users to create accounts</div>
          </div>
          <Switch checked={settings.registrationEnabled} onCheckedChange={v => update('registrationEnabled', v)} />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Max Users Per Contest</label>
          <Input type="number" value={settings.maxUsersPerContest} onChange={e => update('maxUsersPerContest', +e.target.value)} className="max-w-xs" />
        </div>
      </div>

      {/* Default Contest Settings */}
      <div className="glass-card p-6 space-y-5">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Default Contest Settings</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Default Duration (seconds)</label>
            <Input type="number" value={settings.defaultDuration} onChange={e => update('defaultDuration', +e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Default Max Attempts</label>
            <Input type="number" value={settings.defaultMaxAttempts} onChange={e => update('defaultMaxAttempts', +e.target.value)} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Default Difficulty</label>
          <select
            value={settings.defaultDifficulty}
            onChange={e => update('defaultDifficulty', e.target.value)}
            className="w-full max-w-xs px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Default Ranking Method</label>
          <div className="flex gap-2">
            {(['best', 'last', 'average'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => update('defaultRankingMethod', m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  settings.defaultRankingMethod === m ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="glass-card p-6 space-y-5">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Appearance</h2>
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-sm font-medium">Dark Mode</div>
            <div className="text-xs text-muted-foreground">Use dark theme for the admin dashboard</div>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
