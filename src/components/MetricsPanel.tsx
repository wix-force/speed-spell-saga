import { TypingMetrics } from '@/lib/types';
import { Gauge, Target, AlertCircle, Timer } from 'lucide-react';

export default function MetricsPanel({ metrics }: { metrics: TypingMetrics }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard icon={Gauge} label="WPM" value={metrics.wpm} color="text-primary" />
      <MetricCard icon={Target} label="Accuracy" value={`${metrics.accuracy}%`} color="text-success" />
      <MetricCard icon={AlertCircle} label="Errors" value={metrics.errors} color="text-destructive" />
      <MetricCard icon={Timer} label="Time" value={`${metrics.elapsed}s`} color="text-accent" />
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="glass-card p-4 text-center">
      <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
      <div className={`stat-value ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
