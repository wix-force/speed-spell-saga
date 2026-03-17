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
  const startTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const getMetrics = useCallback((currentInput: string, currentTimeLeft: number): TypingMetrics => {
    const elapsed = duration - currentTimeLeft;
    const minutes = Math.max(elapsed / 60, 0.01);
    let correctChars = 0;
    let errors = 0;
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === passage[i]) {
        correctChars++;
      } else {
        errors++;
      }
    }
    const wpm = elapsed > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    const accuracy = currentInput.length > 0
      ? Math.round(((correctChars) / currentInput.length) * 1000) / 10
      : 100;
    const progress = Math.min((currentInput.length / passage.length) * 100, 100);
    return { wpm, accuracy, errors, elapsed, progress };
  }, [duration, passage]);

  // Timer
  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0) {
      if (!completedRef.current) {
        completedRef.current = true;
        setFinished(true);
        onComplete(getMetrics(input, 0));
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(t => {
        const next = t - 1;
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft, finished, getMetrics, onComplete, input]);

  // Live metrics update on every change
  useEffect(() => {
    if (started && !finished) {
      const m = getMetrics(input, timeLeft);
      onMetricsUpdate?.(m);
    }
  }, [input, timeLeft, started, finished, getMetrics, onMetricsUpdate]);

  // Auto-complete when passage finished
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
    // Don't allow typing beyond passage length
    if (val.length <= passage.length) {
      setInput(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') e.preventDefault();
  };

  const currentMetrics = getMetrics(input, timeLeft);

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
        className="absolute opacity-0 w-0 h-0"
        autoFocus
        disabled={finished}
      />

      {/* Progress bar */}
      <div className="h-1 bg-secondary rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${currentMetrics.progress}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Timer */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-muted-foreground">
          {!started ? 'Start typing to begin...' : finished ? 'Complete!' : 'Typing...'}
        </span>
        <span className={`font-mono text-2xl font-bold ${timeLeft <= 10 && started ? 'text-destructive' : 'glow-text'}`}>
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
