import { useState, useCallback, useEffect } from 'react';
import TypingBox from '@/components/TypingBox';
import MetricsPanel from '@/components/MetricsPanel';
import { TypingMetrics } from '@/lib/types';
import { mockPassages } from '@/lib/mock-data';
import { RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/apiClient';

const timeOptions = [30, 60, 120];
const diffOptions = ['easy', 'medium', 'hard'] as const;

export default function PracticePage() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [duration, setDuration] = useState(60);
  const [metrics, setMetrics] = useState<TypingMetrics>({ wpm: 0, accuracy: 100, errors: 0, elapsed: 0, progress: 0 });
  const [key, setKey] = useState(0);
  const [passageText, setPassageText] = useState('');
  const [loadingPassage, setLoadingPassage] = useState(false);

  const fetchPassage = async (diff: string) => {
    setLoadingPassage(true);
    try {
      const { data } = await apiClient.get(`/passages?difficulty=${diff}&limit=1`);
      const passages = data.data;
      if (passages && passages.length > 0) {
        setPassageText(passages[0].text);
      } else {
        // Fallback to mock
        const mock = mockPassages.find(p => p.difficulty === diff) || mockPassages[0];
        setPassageText(mock.text);
      }
    } catch {
      const mock = mockPassages.find(p => p.difficulty === diff) || mockPassages[0];
      setPassageText(mock.text);
    } finally {
      setLoadingPassage(false);
    }
  };

  useEffect(() => {
    fetchPassage(difficulty);
  }, [difficulty]);

  const handleComplete = useCallback((m: TypingMetrics) => {
    setMetrics(m);
  }, []);

  const restart = () => {
    setKey(k => k + 1);
    setMetrics({ wpm: 0, accuracy: 100, errors: 0, elapsed: 0, progress: 0 });
    fetchPassage(difficulty);
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
                onClick={() => { setDifficulty(d); setKey(k => k + 1); setMetrics({ wpm: 0, accuracy: 100, errors: 0, elapsed: 0, progress: 0 }); }}
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
        {loadingPassage ? (
          <div className="glass-card p-6 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <TypingBox
            key={key}
            passage={passageText}
            duration={duration}
            onComplete={handleComplete}
            onMetricsUpdate={setMetrics}
          />
        )}
      </div>
    </div>
  );
}
