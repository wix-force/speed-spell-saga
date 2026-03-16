import ChartCard from '@/components/admin/ChartCard';
import StatsCard from '@/components/StatsCard';
import { adminAnalytics } from '@/lib/admin-data';
import { Users, BarChart3, Gauge, TrendingUp } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function AdminAnalyticsPage() {
  const latestDAU = adminAnalytics.dailyActiveUsers[adminAnalytics.dailyActiveUsers.length - 1].value;
  const latestAttempts = adminAnalytics.attemptsPerDay[adminAnalytics.attemptsPerDay.length - 1].value;
  const latestWpm = adminAnalytics.avgWpmTrend[adminAnalytics.avgWpmTrend.length - 1].value;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform performance metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<Users className="w-5 h-5" />} label="DAU Today" value={latestDAU} subtitle="↑ 5.8% vs yesterday" />
        <StatsCard icon={<BarChart3 className="w-5 h-5" />} label="Attempts Today" value={latestAttempts.toLocaleString()} subtitle="↑ 8.3% vs yesterday" />
        <StatsCard icon={<Gauge className="w-5 h-5" />} label="Avg WPM" value={latestWpm} subtitle="↑ 2.1% this week" />
        <StatsCard icon={<TrendingUp className="w-5 h-5" />} label="Growth Rate" value="12.4%" subtitle="Monthly active users" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard
          title="Daily Active Users"
          subtitle="Last 7 days"
          data={adminAnalytics.dailyActiveUsers}
          color="hsl(175, 80%, 45%)"
        />
        <ChartCard
          title="Attempts Per Day"
          subtitle="Last 7 days"
          data={adminAnalytics.attemptsPerDay}
          color="hsl(265, 70%, 60%)"
        />
        <ChartCard
          title="Average WPM Trend"
          subtitle="Platform-wide"
          data={adminAnalytics.avgWpmTrend}
          color="hsl(150, 60%, 45%)"
        />

        {/* Contest Participation Bar */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-medium mb-1">Contest Participation</h3>
          <p className="text-xs text-muted-foreground mb-4">Players per contest</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adminAnalytics.contestParticipation}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 16%)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(215, 15%, 50%)' }} width={40} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 25%, 9%)',
                    border: '1px solid hsl(222, 20%, 16%)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" fill="hsl(175, 80%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
