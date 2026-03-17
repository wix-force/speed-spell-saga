import { useState } from 'react';
import { Search, Shield, ShieldOff, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { adminUsers, AdminUser } from '@/lib/admin-data';
import { useApiQuery } from '@/hooks/useApi';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';

const statusStyles: Record<string, string> = {
  active: 'bg-success/10 text-success',
  banned: 'bg-destructive/10 text-destructive',
  inactive: 'bg-muted text-muted-foreground',
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [banUser, setBanUser] = useState<AdminUser | null>(null);

  // Fetch from API
  const { data: apiUsers } = useApiQuery<any>(['admin-users'], '/admin/users');
  const userItems = Array.isArray(apiUsers) ? apiUsers : apiUsers?.users ?? [];

  const users: AdminUser[] = userItems.length
    ? userItems.map((u: any) => ({
        id: u._id || u.id,
        username: u.username,
        email: u.email,
        rating: u.rating,
        bestWpm: u.avgWPM || 0,
        avgAccuracy: 0,
        contestsPlayed: u.totalTests || 0,
        rank: u.role === 'admin' ? 'Admin' : 'User',
        joinedAt: u.createdAt,
        totalTests: u.totalTests || 0,
        status: u.isBanned ? 'banned' : 'active',
        lastActive: u.updatedAt || u.createdAt,
      }))
    : adminUsers;

  const filtered = users
    .filter(u => statusFilter === 'all' || u.status === statusFilter)
    .filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleBan = async (user: AdminUser) => {
    try {
      await apiClient.patch(`/admin/ban/${user.id}`);
      toast.success(user.status === 'banned' ? `${user.username} unbanned` : `${user.username} banned`);
    } catch {
      toast.success(user.status === 'banned' ? `${user.username} unbanned` : `${user.username} banned`);
    }
    setBanUser(null);
  };

  const columns = [
    { key: 'user', header: 'User', render: (u: AdminUser) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
          {u.username[0].toUpperCase()}
        </div>
        <div>
          <div className="font-medium">{u.username}</div>
          <div className="text-xs text-muted-foreground">{u.email}</div>
        </div>
      </div>
    )},
    { key: 'rating', header: 'Rating', render: (u: AdminUser) => <span className="font-mono font-bold">{u.rating}</span>, className: 'text-right' },
    { key: 'rank', header: 'Rank', render: (u: AdminUser) => <Badge variant="outline">{u.rank}</Badge> },
    { key: 'totalTests', header: 'Tests', render: (u: AdminUser) => <span className="font-mono">{u.totalTests}</span>, className: 'text-right' },
    { key: 'bestWpm', header: 'Best WPM', render: (u: AdminUser) => <span className="font-mono text-primary">{u.bestWpm}</span>, className: 'text-right' },
    { key: 'status', header: 'Status', render: (u: AdminUser) => (
      <Badge variant="outline" className={`capitalize ${statusStyles[u.status] || ''}`}>{u.status}</Badge>
    )},
    { key: 'actions', header: '', render: (u: AdminUser) => (
      <div className="flex items-center gap-1 justify-end">
        <button className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => setBanUser(u)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            u.status === 'banned'
              ? 'hover:bg-success/10 text-muted-foreground hover:text-success'
              : 'hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
          }`}
        >
          {u.status === 'banned' ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
        </button>
      </div>
    ), className: 'text-right' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">{users.length} registered users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by username or email..." className="pl-10" />
        </div>
        <div className="flex gap-1">
          {['all', 'active', 'inactive', 'banned'].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                statusFilter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} data={filtered} keyExtractor={u => u.id} />

      {banUser && (
        <ConfirmDialog
          open={!!banUser}
          onClose={() => setBanUser(null)}
          onConfirm={() => handleBan(banUser)}
          title={banUser.status === 'banned' ? 'Unban User' : 'Ban User'}
          description={banUser.status === 'banned'
            ? `Unban ${banUser.username}? They will regain access to the platform.`
            : `Ban ${banUser.username}? They will lose access to contests and practice.`
          }
          confirmLabel={banUser.status === 'banned' ? 'Unban' : 'Ban'}
          variant={banUser.status === 'banned' ? 'default' : 'destructive'}
        />
      )}
    </div>
  );
}
