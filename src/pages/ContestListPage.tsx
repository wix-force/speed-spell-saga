import ContestCard from '@/components/ContestCard';
import { useState } from 'react';
import { useApiQuery } from '@/hooks/useApi';
import { Contest } from '@/lib/types';
import { mockContests } from '@/lib/mock-data';
import { Loader2 } from 'lucide-react';

const filters = ['all', 'live', 'upcoming', 'ended'] as const;

export default function ContestListPage() {
  const [filter, setFilter] = useState<string>('all');

  const { data: apiContests, isLoading, isError } = useApiQuery<any>(
    ['contests'],
    '/contests',
  );
  const contestItems = Array.isArray(apiContests) ? apiContests : apiContests?.contests ?? [];

  // Map API data or fall back to mock
  const contests: Contest[] = contestItems.length
    ? contestItems.map((c: any) => ({
        id: c._id || c.id,
        title: c.title,
        difficulty: c.difficulty,
        duration: c.duration,
        startTime: c.startTime,
        participants: c.participantsCount || 0,
        maxAttempts: c.maxAttempts,
        status: c.status === 'running' ? 'live' : c.status,
        rankingMethod: c.rankingMethod,
        passageCount: c.passagePool?.length || 0,
      }))
    : mockContests;

  const filtered = filter === 'all'
    ? contests
    : contests.filter(c => c.status === filter);

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

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(c => (
            <ContestCard key={c.id} contest={c} />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No contests found.</div>
      )}
    </div>
  );
}
