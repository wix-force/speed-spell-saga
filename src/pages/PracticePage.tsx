import { useState, useCallback } from 'react';
import TypingBox from '@/components/TypingBox';
import MetricsPanel from '@/components/MetricsPanel';
import { TypingMetrics } from '@/lib/types';
import { mockPassages } from '@/lib/mock-data';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const timeOptions = [30, 60, 120];
const diffOptions = ['easy', 'medium', 'hard'] as const;

export default function PracticePage() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [duration, setDuration] = useState(60);
  const [metrics, setMetrics] = useState<TypingMetrics>({ wpm: 0, accuracy: 100, errors: 0, elapsed: 0, progress: 0 });
  const [key, setKey] = useState(0);

  const passage = mockPassages.find(p => p.difficulty === difficulty) || mockPassages[0];

  const handleComplete = useCallback((m: TypingMetrics) => {
    setMetrics(m);
  }, []);

  const restart = () => {
    setKey(k => k + 1);
    setMetrics({ wpm: 0, accuracy: 100, errors: 0, elapsed: 0, progress: 0 });
  };

  return (
    <div className="page-container max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Practice</h1>
        <Button variant="outline" size="sm" onClick={restart} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Restart
        </Button>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Difficulty</label>
          <div className="flex gap-1">
            {diffOptions.map(d => (
              <button
                key={d}
                onClick={() => { setDifficulty(d); restart(); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                  difficulty === d ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Duration</label>
          <div className="flex gap-1">
            {timeOptions.map(t => (
              <button
                key={t}
                onClick={() => { setDuration(t); restart(); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium font-mono transition-colors ${
                  duration === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {t}s
              </button>
            ))}
          </div>
        </div>
      </div>

      <MetricsPanel metrics={metrics} />

      <div className="mt-6">
        <TypingBox
          key={key}
          passage={passage.text}
          duration={duration}
          onComplete={handleComplete}
          onMetricsUpdate={setMetrics}
        />
      </div>
    </div>
  );
}
