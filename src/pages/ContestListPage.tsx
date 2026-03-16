import ContestCard from '@/components/ContestCard';
import { mockContests } from '@/lib/mock-data';
import { useState } from 'react';

const filters = ['all', 'live', 'upcoming', 'ended'] as const;

export default function ContestListPage() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? mockContests
    : mockContests.filter(c => c.status === filter);

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-6">Contests</h1>

      <div className="flex gap-1 mb-6">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(c => (
          <ContestCard key={c.id} contest={c} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No contests found.</div>
      )}
    </div>
  );
}
