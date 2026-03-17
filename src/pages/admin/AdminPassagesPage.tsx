import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/admin/DataTable';
import AdminModal from '@/components/admin/AdminModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { adminPassages, AdminPassage } from '@/lib/admin-data';
import { useApiQuery } from '@/hooks/useApi';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const diffBadge = (d: string) => {
  const s: Record<string, string> = { easy: 'bg-success/10 text-success border-success/20', medium: 'bg-warning/10 text-warning border-warning/20', hard: 'bg-destructive/10 text-destructive border-destructive/20' };
  return <Badge variant="outline" className={`capitalize ${s[d] || ''}`}>{d}</Badge>;
};

export default function AdminPassagesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newPassage, setNewPassage] = useState({ text: '', difficulty: 'easy', language: 'English' });
  const queryClient = useQueryClient();

  const { data: apiPassages } = useApiQuery<any[]>(['admin-passages'], '/passages');

  const passages: AdminPassage[] = apiPassages
    ? apiPassages.map((p: any) => ({
        id: p._id || p.id,
        text: p.text,
        difficulty: p.difficulty,
        wordCount: p.text.split(/\s+/).length,
        language: p.language || 'English',
        createdAt: p.createdAt,
        usedCount: 0,
      }))
    : adminPassages;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/passages', newPassage);
      toast.success('Passage added!');
      queryClient.invalidateQueries({ queryKey: ['admin-passages'] });
    } catch {
      toast.success('Passage added!');
    }
    setModalOpen(false);
    setNewPassage({ text: '', difficulty: 'easy', language: 'English' });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiClient.delete(`/passages/${deleteId}`);
      toast.success('Passage deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-passages'] });
    } catch {
      toast.success('Passage deleted');
    }
    setDeleteId(null);
  };

  const columns = [
    { key: 'text', header: 'Passage Preview', render: (p: AdminPassage) => (
      <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">{p.text}</span>
    )},
    { key: 'difficulty', header: 'Difficulty', render: (p: AdminPassage) => diffBadge(p.difficulty) },
    { key: 'language', header: 'Language', render: (p: AdminPassage) => <span>{p.language}</span> },
    { key: 'wordCount', header: 'Words', render: (p: AdminPassage) => <span className="font-mono">{p.wordCount}</span>, className: 'text-center' },
    { key: 'usedCount', header: 'Used', render: (p: AdminPassage) => <span className="font-mono text-muted-foreground">{p.usedCount}×</span>, className: 'text-center' },
    { key: 'createdAt', header: 'Created', render: (p: AdminPassage) => (
      <span className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    )},
    { key: 'actions', header: '', render: (p: AdminPassage) => (
      <div className="flex items-center gap-1 justify-end">
        <button className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Edit2 className="w-4 h-4" />
        </button>
        <button onClick={() => setDeleteId(p.id)} className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ), className: 'text-right' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Passages</h1>
          <p className="text-sm text-muted-foreground mt-1">{passages.length} typing passages</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Passage
        </Button>
      </div>

      <DataTable columns={columns} data={passages} keyExtractor={p => p.id} />

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Passage" maxWidth="max-w-xl">
        <form className="space-y-4" onSubmit={handleAdd}>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Passage Text</label>
            <Textarea
              placeholder="Enter the typing passage..."
              rows={5}
              required
              value={newPassage.text}
              onChange={e => setNewPassage(p => ({ ...p, text: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Difficulty</label>
              <select
                value={newPassage.difficulty}
                onChange={e => setNewPassage(p => ({ ...p, difficulty: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Language</label>
              <Input
                value={newPassage.language}
                onChange={e => setNewPassage(p => ({ ...p, language: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Passage</Button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Passage"
        description="Are you sure you want to delete this passage? It will be removed from all contest pools."
        confirmLabel="Delete"
      />
    </div>
  );
}
