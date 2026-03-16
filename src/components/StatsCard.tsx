import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export default function StatsCard({ icon, label, value, subtitle, className = '' }: StatsCardProps) {
  return (
    <div className={`glass-card p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="stat-value">{value}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  );
}
