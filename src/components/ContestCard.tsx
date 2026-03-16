import { Contest } from '@/lib/types';
import { Clock, Users, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const difficultyColors = {
  easy: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  hard: 'bg-destructive/10 text-destructive border-destructive/20',
};

const statusStyles = {
  upcoming: 'bg-muted text-muted-foreground',
  live: 'bg-success/10 text-success animate-pulse-glow',
  ended: 'bg-muted text-muted-foreground',
};

export default function ContestCard({ contest }: { contest: Contest }) {
  return (
    <Link to={`/contest/${contest.id}`} className="block">
      <div className="glass-card-hover p-5 group">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={difficultyColors[contest.difficulty]}>
                {contest.difficulty}
              </Badge>
              <Badge variant="outline" className={statusStyles[contest.status]}>
                {contest.status === 'live' && <span className="w-1.5 h-1.5 bg-success rounded-full mr-1" />}
                {contest.status}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
              {contest.title}
            </h3>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{contest.duration}s</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{contest.participants}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            <span>{contest.maxAttempts} attempts</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
