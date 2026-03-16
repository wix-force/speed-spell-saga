export default function AttemptIndicator({ current, max }: { current: number; max: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Attempts:</span>
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < current
                ? 'bg-primary'
                : 'bg-secondary border border-border'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-mono text-muted-foreground">{current}/{max}</span>
    </div>
  );
}
