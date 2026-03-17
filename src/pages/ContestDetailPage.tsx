import { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TypingMetrics, LeaderboardEntry } from '@/lib/types';
import TypingBox from '@/components/TypingBox';
import MetricsPanel from '@/components/MetricsPanel';
import AttemptIndicator from '@/components/AttemptIndicator';
import ResultModal from '@/components/ResultModal';
import LeaderboardTable from '@/components/LeaderboardTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Loader2 } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { useApiQuery } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { getSocket } from '@/lib/socket';
import { toast } from 'sonner';
import { mockContests, mockPassages, mockLeaderboard } from '@/lib/mock-data';

export default function ContestDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [phase, setPhase] = useState<'info' | 'typing' | 'result'>('info');
  const [attemptNum, setAttemptNum] = useState(0);
  const [metrics, setMetrics] = useState<TypingMetrics>({ wpm: 0, accuracy: 100, errors: 0, elapsed: 0, progress: 0 });
  const [lastResult, setLastResult] = useState<TypingMetrics | null>(null);
  const [passage, setPassage] = useState<{ id: string; text: string } | null>(null);
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);
  const [startingAttempt, setStartingAttempt] = useState(false);

  // Fetch contest from API
  const { data: apiContest, isLoading } = useApiQuery<any>(['contest', id], `/contests/${id}`);

  // Fetch leaderboard
  const { data: apiLeaderboard, refetch: refetchLeaderboard } = useApiQuery<any[]>(
    ['leaderboard', id],
    `/leaderboard/${id}`,
  );

  // Fetch user attempts
  const { data: userAttempts, refetch: refetchAttempts } = useApiQuery<any[]>(
    ['attempts', id],
    `/attempt/user/${id}`,
    { enabled: isAuthenticated },
  );

  const contest = apiContest
    ? {
        id: apiContest._id || apiContest.id,
        title: apiContest.title,
        difficulty: apiContest.difficulty,
        duration: apiContest.duration,
        startTime: apiContest.startTime,
        participants: apiContest.participantsCount || 0,
        maxAttempts: apiContest.maxAttempts,
        status: apiContest.status === 'running' ? 'live' as const : apiContest.status,
        rankingMethod: apiContest.rankingMethod,
        passageCount: apiContest.passagePool?.length || 0,
      }
    : mockContests.find(c => c.id === id);

  const leaderboard: LeaderboardEntry[] = apiLeaderboard
    ? apiLeaderboard.map((e: any, i: number) => ({
        rank: e.rank || i + 1,
        username: e.username,
        wpm: e.wpm,
        accuracy: e.accuracy,
        attemptNumber: e.attemptUsed || 1,
        status: 'finished' as const,
      }))
    : mockLeaderboard;

  // Socket events for realtime leaderboard
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !id) return;
    socket.emit('join_contest', id);
    socket.on('leaderboard_update', () => refetchLeaderboard());
    return () => { socket.off('leaderboard_update'); };
  }, [id, refetchLeaderboard]);

  // Sync attempt count
  useEffect(() => {
    if (userAttempts) setAttemptNum(userAttempts.length);
  }, [userAttempts]);

  if (isLoading) {
    return <div className="page-container flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!contest) {
    return (
      <div className="page-container text-center py-16">
        <p className="text-muted-foreground mb-4">Contest not found.</p>
        <Button asChild variant="outline"><Link to="/contest">Back to Contests</Link></Button>
      </div>
    );
  }

  const startAttempt = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to participate');
      return;
    }
    setStartingAttempt(true);
    try {
      const { data } = await apiClient.post(`/attempt/start/${id}`);
      const result = data.data;
      setPassage({ id: result.passage.id, text: result.passage.text });
      setCurrentAttemptId(result.attempt._id || result.attempt.id);
      setAttemptNum(n => n + 1);
      setMetrics({ wpm: 0, accuracy: 100, errors: 0, elapsed: 0, progress: 0 });
      setPhase('typing');
      const socket = getSocket();
      if (socket) socket.emit('attempt_started', { contestId: id });
    } catch (err: any) {
      // Fallback to mock
      const mockP = mockPassages[attemptNum % mockPassages.length];
      setPassage({ id: mockP.id, text: mockP.text });
      setAttemptNum(n => n + 1);
      setMetrics({ wpm: 0, accuracy: 100, errors: 0, elapsed: 0, progress: 0 });
      setPhase('typing');
      if (err.response?.data?.message) toast.error(err.response.data.message);
    } finally {
      setStartingAttempt(false);
    }
  };

  const handleComplete = async (m: TypingMetrics) => {
    setLastResult(m);
    setPhase('result');

    // Submit to backend
    if (currentAttemptId) {
      try {
        const correctChars = Math.round((m.accuracy / 100) * passage!.text.length);
        await apiClient.post('/attempt/submit', {
          attemptId: currentAttemptId,
          correctChars,
          totalTyped: passage!.text.length,
          errors: m.errors,
        });
        refetchLeaderboard();
        refetchAttempts();
        const socket = getSocket();
        if (socket) socket.emit('attempt_finished', { contestId: id });
      } catch (err) {
        console.error('Submit failed:', err);
      }
    }
  };

  const passageText = passage?.text || mockPassages[attemptNum % mockPassages.length].text;

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
              <Button onClick={startAttempt} size="lg" className="gap-2" disabled={startingAttempt}>
                {startingAttempt ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {attemptNum === 0 ? 'Start Contest' : 'Start Next Attempt'}
              </Button>
            ) : (
              <p className="text-muted-foreground">All attempts used.</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Leaderboard</h3>
            <LeaderboardTable entries={leaderboard} />
          </div>
        </div>
      )}

      {phase === 'typing' && (
        <div className="mt-6 space-y-4">
          <MetricsPanel metrics={metrics} />
          <TypingBox
            key={attemptNum}
            passage={passageText}
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
          onNextAttempt={startAttempt}
          onClose={() => setPhase('info')}
        />
      )}
    </div>
  );
}
