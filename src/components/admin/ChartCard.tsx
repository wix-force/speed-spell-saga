import { ReactNode } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: { date: string; value: number }[];
  color?: string;
  action?: ReactNode;
}

export default function ChartCard({ title, subtitle, data, color = 'hsl(175, 80%, 45%)', action }: ChartCardProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 16%)" vertical={false} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(215, 15%, 50%)' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(215, 15%, 50%)' }} width={40} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 25%, 9%)',
                border: '1px solid hsl(222, 20%, 16%)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'hsl(210, 20%, 92%)' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${title.replace(/\s/g, '')})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
