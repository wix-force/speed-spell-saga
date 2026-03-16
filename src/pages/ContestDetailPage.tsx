import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockContests, mockPassages, mockLeaderboard } from '@/lib/mock-data';
import { TypingMetrics } from '@/lib/types';
import TypingBox from '@/components/TypingBox';
import MetricsPanel from '@/components/MetricsPanel';
import AttemptIndicator from '@/components/AttemptIndicator';
import ResultModal from '@/components/ResultModal';
import LeaderboardTable from '@/components/LeaderboardTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play } from 'lucide-react';

export default function ContestDetailPage() {
  const { id } = useParams();

  const [phase, setPhase] = useState<'info' | 'typing' | 'result'>('info');
  const [attemptNum, setAttemptNum] = useState(0);
  const [metrics, setMetrics] = useState<TypingMetrics>({ wpm: 0, accuracy: 100, errors: 0, elapsed: 0, progress: 0 });
  const [lastResult, setLastResult] = useState<TypingMetrics | null>(null);

  const contest = mockContests.find(c => c.id === id);

  if (!contest) {
    return (
      <div className="page-container text-center py-16">
        <p className="text-muted-foreground mb-4">Contest not found.</p>
        <Button asChild variant="outline"><Link to="/contest">Back to Contests</Link></Button>
      </div>
    );
  }

  const passage = mockPassages[attemptNum % mockPassages.length];

  const startAttempt = () => {
    setAttemptNum(n => n + 1);
    setMetrics({ wpm: 0, accuracy: 100, errors: 0, elapsed: 0, progress: 0 });
    setPhase('typing');
  };

  const handleComplete = (m: TypingMetrics) => {
    setLastResult(m);
    setPhase('result');
  };

  const handleNextAttempt = () => {
    startAttempt();
  };

  return (
    <div className="page-container max-w-4xl">
      <Link to="/contest" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Contests
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{contest.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="outline" className="capitalize">{contest.difficulty}</Badge>
            <span>{contest.duration}s per attempt</span>
            <Badge variant="outline" className={contest.status === 'live' ? 'bg-success/10 text-success' : ''}>
              {contest.status}
            </Badge>
          </div>
        </div>
      </div>

      <AttemptIndicator current={attemptNum} max={contest.maxAttempts} />

      {phase === 'info' && (
        <div className="mt-6 space-y-6">
          <div className="glass-card p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Ready to compete?</h2>
            <p className="text-muted-foreground mb-4">
              You have {contest.maxAttempts} attempts. Each attempt gives a new passage.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Ranking: <span className="font-medium text-foreground capitalize">{contest.rankingMethod}</span> attempt
            </p>
            {attemptNum < contest.maxAttempts ? (
              <Button onClick={startAttempt} size="lg" className="gap-2">
                <Play className="w-4 h-4" />
                {attemptNum === 0 ? 'Start Contest' : 'Start Next Attempt'}
              </Button>
            ) : (
              <p className="text-muted-foreground">All attempts used.</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Leaderboard</h3>
            <LeaderboardTable entries={mockLeaderboard} />
          </div>
        </div>
      )}

      {phase === 'typing' && (
        <div className="mt-6 space-y-4">
          <MetricsPanel metrics={metrics} />
          <TypingBox
            key={attemptNum}
            passage={passage.text}
            duration={contest.duration}
            onComplete={handleComplete}
            onMetricsUpdate={setMetrics}
          />
        </div>
      )}

      {lastResult && (
        <ResultModal
          open={phase === 'result'}
          metrics={lastResult}
          attemptNumber={attemptNum}
          maxAttempts={contest.maxAttempts}
          onNextAttempt={handleNextAttempt}
          onClose={() => setPhase('info')}
        />
      )}
    </div>
  );
}
