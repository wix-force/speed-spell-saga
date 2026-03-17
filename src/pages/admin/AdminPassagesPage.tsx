import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/admin/DataTable';
import AdminModal from '@/components/admin/AdminModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useApiQuery } from '@/hooks/useApi';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface PassageItem {
  id: string;
  text: string;
  difficulty: string;
  language: string;
  wordCount: number;
  createdAt: string;
}

const diffBadge = (d: string) => {
  const s: Record<string, string> = { easy: 'bg-success/10 text-success border-success/20', medium: 'bg-warning/10 text-warning border-warning/20', hard: 'bg-destructive/10 text-destructive border-destructive/20' };
  return <Badge variant="outline" className={`capitalize ${s[d] || ''}`}>{d}</Badge>;
};

export default function AdminPassagesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editPassage, setEditPassage] = useState<PassageItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ text: '', difficulty: 'easy', language: 'English' });
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const { data: apiPassages, isLoading } = useApiQuery<any>(['admin-passages'], '/passages');
  const passageItems = Array.isArray(apiPassages) ? apiPassages : apiPassages?.passages ?? [];

  const passages: PassageItem[] = passageItems.map((p: any) => ({
    id: p._id || p.id,
    text: p.text,
    difficulty: p.difficulty,
    language: p.language || 'English',
    wordCount: p.text?.split(/\s+/).length || 0,
    createdAt: p.createdAt,
  }));

  const openAdd = () => {
    setEditPassage(null);
    setForm({ text: '', difficulty: 'easy', language: 'English' });
    setModalOpen(true);
  };

  const openEdit = (p: PassageItem) => {
    setEditPassage(p);
    setForm({ text: p.text, difficulty: p.difficulty, language: p.language });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editPassage) {
        await apiClient.patch(`/passages/${editPassage.id}`, form);
        toast.success('Passage updated');
      } else {
        await apiClient.post('/passages', form);
        toast.success('Passage added');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-passages'] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save passage');
    } finally {
      setSaving(false);
      setModalOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiClient.delete(`/passages/${deleteId}`);
      toast.success('Passage deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-passages'] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
    setDeleteId(null);
  };

  const columns = [
    { key: 'text', header: 'Passage Preview', render: (p: PassageItem) => (
      <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">{p.text}</span>
    )},
    { key: 'difficulty', header: 'Difficulty', render: (p: PassageItem) => diffBadge(p.difficulty) },
    { key: 'language', header: 'Language', render: (p: PassageItem) => <span>{p.language}</span> },
    { key: 'wordCount', header: 'Words', render: (p: PassageItem) => <span className="font-mono">{p.wordCount}</span>, className: 'text-center' },
    { key: 'createdAt', header: 'Created', render: (p: PassageItem) => (
      <span className="text-xs text-muted-foreground">{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
    )},
    { key: 'actions', header: '', render: (p: PassageItem) => (
      <div className="flex items-center gap-1 justify-end">
        <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
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
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Add Passage
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <DataTable columns={columns} data={passages} keyExtractor={p => p.id} />
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editPassage ? 'Edit Passage' : 'Add Passage'} maxWidth="max-w-xl">
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Passage Text</label>
            <Textarea
              placeholder="Enter the typing passage..."
              rows={5}
              required
              value={form.text}
              onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
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
                value={form.language}
                onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editPassage ? 'Update' : 'Add'} Passage
            </Button>
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
