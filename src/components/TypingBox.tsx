import { useState, useEffect, useCallback, useRef } from 'react';
import { TypingMetrics } from '@/lib/types';
import { motion } from 'framer-motion';

interface TypingBoxProps {
  passage: string;
  duration: number;
  onComplete: (metrics: TypingMetrics) => void;
  onMetricsUpdate?: (metrics: TypingMetrics) => void;
}

export default function TypingBox({ passage, duration, onComplete, onMetricsUpdate }: TypingBoxProps) {
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef<number>(0);
  const completedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Use wall-clock time for accurate WPM
  const getMetrics = useCallback((currentInput: string, secondsLeft: number): TypingMetrics => {
    const elapsedMs = startTimeRef.current > 0 ? Date.now() - startTimeRef.current : 0;
    const elapsedSec = Math.max(elapsedMs / 1000, 0.1);
    const minutes = elapsedSec / 60;

    let correctChars = 0;
    let errors = 0;
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === passage[i]) {
        correctChars++;
      } else {
        errors++;
      }
    }

    const wpm = currentInput.length > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    const accuracy = currentInput.length > 0
      ? Math.round((correctChars / currentInput.length) * 1000) / 10
      : 100;
    const progress = Math.min((currentInput.length / passage.length) * 100, 100);

    return { wpm, accuracy, errors, elapsed: Math.round(elapsedSec), progress };
  }, [passage]);

  // Single timer interval
  useEffect(() => {
    if (!started || finished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 0) {
          // Auto-submit on time end
          if (!completedRef.current) {
            completedRef.current = true;
            setFinished(true);
            // Use setTimeout to avoid setState during render
            setTimeout(() => {
              setInput(curr => {
                onComplete(getMetrics(curr, 0));
                return curr;
              });
            }, 0);
          }
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished, getMetrics, onComplete]);

  // Emit live metrics on every input change (truly live, not timer-dependent)
  useEffect(() => {
    if (started && !finished) {
      onMetricsUpdate?.(getMetrics(input, timeLeft));
    }
  }, [input, started, finished, getMetrics, onMetricsUpdate, timeLeft]);

  // Also update metrics every second via timer tick
  useEffect(() => {
    if (started && !finished && input.length > 0) {
      onMetricsUpdate?.(getMetrics(input, timeLeft));
    }
  }, [timeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-complete when full passage typed
  useEffect(() => {
    if (input.length >= passage.length && started && !finished && !completedRef.current) {
      completedRef.current = true;
      setFinished(true);
      onComplete(getMetrics(input, timeLeft));
    }
  }, [input, passage.length, started, finished, getMetrics, onComplete, timeLeft]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (finished) return;
    const val = e.target.value;

    if (!started) {
      setStarted(true);
      startTimeRef.current = Date.now();
    }

    if (val.length <= passage.length) {
      setInput(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') e.preventDefault();
  };

  // Prevent paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const currentMetrics = started ? getMetrics(input, timeLeft) : { wpm: 0, accuracy: 100, errors: 0, elapsed: 0, progress: 0 };

  return (
    <div
      className="glass-card p-6 cursor-text relative"
      onClick={() => inputRef.current?.focus()}
    >
      <textarea
        ref={inputRef}
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="absolute opacity-0 w-0 h-0"
        autoFocus
        disabled={finished}
      />

      {/* Progress bar */}
      <div className="h-1 bg-secondary rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${currentMetrics.progress}%` }}
          transition={{ duration: 0.15 }}
        />
      </div>

      {/* Timer */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-muted-foreground">
          {!started ? 'Start typing to begin...' : finished ? 'Complete!' : 'Typing...'}
        </span>
        <span className={`font-mono text-2xl font-bold ${timeLeft <= 10 && started ? 'text-destructive animate-pulse' : 'glow-text'}`}>
          {timeLeft}s
        </span>
      </div>

      {/* Passage display */}
      <div className="font-mono text-lg leading-relaxed select-none min-h-[120px]">
        {passage.split('').map((char, i) => {
          let className = 'text-muted-foreground/40';
          if (i < input.length) {
            className = input[i] === char
              ? 'text-primary'
              : 'text-destructive bg-destructive/10 rounded-sm';
          } else if (i === input.length) {
            className = 'text-foreground';
          }
          return (
            <span key={i} className={`${className} transition-colors duration-75`}>
              {i === input.length && started && !finished && (
                <span className="typing-caret" />
              )}
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}
