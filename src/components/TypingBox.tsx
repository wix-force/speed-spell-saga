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
  const inputRef = useRef<HTMLInputElement>(null);

  const words = passage.split(' ');
  const typedChars = input.split('');

  const getMetrics = useCallback((): TypingMetrics => {
    const elapsed = duration - timeLeft;
    const typedWords = input.trim().split(/\s+/).filter(Boolean).length;
    const wpm = elapsed > 0 ? Math.round((typedWords / elapsed) * 60) : 0;
    let errors = 0;
    for (let i = 0; i < typedChars.length; i++) {
      if (typedChars[i] !== passage[i]) errors++;
    }
    const accuracy = typedChars.length > 0
      ? Math.round(((typedChars.length - errors) / typedChars.length) * 1000) / 10
      : 100;
    const progress = Math.min((input.length / passage.length) * 100, 100);
    return { wpm, accuracy, errors, elapsed, progress };
  }, [input, timeLeft, duration, passage, typedChars]);

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0) {
      setFinished(true);
      onComplete(getMetrics());
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft, finished, getMetrics, onComplete]);

  useEffect(() => {
    if (started && !finished) {
      onMetricsUpdate?.(getMetrics());
    }
  }, [input, timeLeft, started, finished, getMetrics, onMetricsUpdate]);

  useEffect(() => {
    if (input.length >= passage.length && started && !finished) {
      setFinished(true);
      onComplete(getMetrics());
    }
  }, [input, passage, started, finished, getMetrics, onComplete]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;
    if (!started) setStarted(true);
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') e.preventDefault();
  };

  return (
    <div
      className="glass-card p-6 cursor-text relative"
      onClick={() => inputRef.current?.focus()}
    >
      <input
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
          animate={{ width: `${getMetrics().progress}%` }}
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
