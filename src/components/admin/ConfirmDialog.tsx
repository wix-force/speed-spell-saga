import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminModal from './AdminModal';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: 'destructive' | 'default';
}

export default function ConfirmDialog({
  open, onClose, onConfirm, title, description,
  confirmLabel = 'Confirm', variant = 'destructive',
}: ConfirmDialogProps) {
  return (
    <AdminModal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
          variant === 'destructive' ? 'bg-destructive/10' : 'bg-primary/10'
        }`}>
          <AlertTriangle className={`w-6 h-6 ${variant === 'destructive' ? 'text-destructive' : 'text-primary'}`} />
        </div>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </AdminModal>
  );
}
