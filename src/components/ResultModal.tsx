import { TypingMetrics } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultModalProps {
  open: boolean;
  metrics: TypingMetrics;
  attemptNumber: number;
  maxAttempts: number;
  onNextAttempt: () => void;
  onClose: () => void;
}

export default function ResultModal({ open, metrics, attemptNumber, maxAttempts, onNextAttempt, onClose }: ResultModalProps) {
  const hasMore = attemptNumber < maxAttempts;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card glow-border p-8 max-w-md w-full text-center"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <Trophy className="w-12 h-12 mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-bold">Attempt #{attemptNumber} Complete!</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-card p-4">
                <div className="stat-value text-primary">{metrics.wpm}</div>
                <div className="text-xs text-muted-foreground">WPM</div>
              </div>
              <div className="glass-card p-4">
                <div className="stat-value text-success">{metrics.accuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div className="glass-card p-4">
                <div className="stat-value text-destructive">{metrics.errors}</div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
              <div className="glass-card p-4">
                <div className="stat-value text-accent">{metrics.elapsed}s</div>
                <div className="text-xs text-muted-foreground">Time</div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-4">
              Attempts: {attemptNumber} / {maxAttempts}
            </div>

            <div className="flex gap-3 justify-center">
              {hasMore && (
                <Button onClick={onNextAttempt} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Next Attempt
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                {hasMore ? 'Done' : 'Close'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
