import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Mail, X, CheckCheck, Eye } from 'lucide-react';
import { api } from '@/lib/api';
import type { ContactMessage } from '@/types';

export const Route = createFileRoute('/admin/_auth/messages')({
  component: MessagesAdmin,
});

const statusColor: Record<string, string> = {
  new: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  read: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  replied: 'text-green-400 bg-green-400/10 border-green-400/20',
};

const STATUS_OPTIONS: ContactMessage['status'][] = ['new', 'read', 'replied'];

function MessageModal({ msg, onClose }: { msg: ContactMessage; onClose: () => void }) {
  const qc = useQueryClient();
  const updateStatus = useMutation({
    mutationFn: (status: string) => api.patch(`/contact/${msg._id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-messages'] }); toast.success('Status updated'); },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-lg rounded-2xl border border-border shadow-elegant">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-primary" />
            <h2 className="font-display font-semibold">Message</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><p className="text-xs text-muted-foreground mb-1">From</p><p className="text-sm font-medium">{msg.name}</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">Email</p><a href={`mailto:${msg.email}`} className="text-sm text-primary hover:underline">{msg.email}</a></div>
          </div>
          <div><p className="text-xs text-muted-foreground mb-1">Subject</p><p className="text-sm font-medium">{msg.subject}</p></div>
          <div><p className="text-xs text-muted-foreground mb-1">Message</p><p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p></div>
          <div><p className="text-xs text-muted-foreground mb-1">Received</p><p className="text-xs font-mono">{new Date(msg.createdAt).toLocaleString()}</p></div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Status</p>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button key={s} onClick={() => updateStatus.mutate(s)} disabled={msg.status === s || updateStatus.isPending}
                  className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${msg.status === s ? statusColor[s] : 'text-muted-foreground bg-surface border-border hover:bg-surface-elevated'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
            <Mail size={14} /> Reply via Email
          </a>
        </div>
      </div>
    </div>
  );
}

function MessagesAdmin() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | ContactMessage['status']>('all');

  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ['admin-messages'],
    queryFn: () => api.get('/contact').then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/contact/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-messages'] }); toast.success('Deleted'); setSelected(null); },
    onError: () => toast.error('Failed to delete'),
  });

  const markRead = useMutation({
    mutationFn: ({ id }: { id: string }) => api.patch(`/contact/${id}/status`, { status: 'read' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-messages'] }),
  });

  const filtered = filter === 'all' ? messages : messages.filter((m) => m.status === filter);
  const newCount = messages.filter((m) => m.status === 'new').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            Messages {newCount > 0 && <span className="text-sm px-2 py-0.5 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-400 font-mono">{newCount} new</span>}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{messages.length} total</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'new', 'read', 'replied'] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${filter === s ? 'bg-primary/15 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:bg-surface-elevated'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 rounded-2xl bg-surface/40" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Mail size={40} className="mx-auto mb-4 opacity-30" />
          <p>No messages found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div key={msg._id}
              className={`rounded-2xl border bg-surface/60 p-4 transition-colors cursor-pointer ${msg.status === 'new' ? 'border-blue-400/30' : 'border-border'}`}
              onClick={() => { setSelected(msg); if (msg.status === 'new') markRead.mutate({ id: msg._id }); }}
            >
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/15 grid place-items-center text-xs font-bold text-primary shrink-0">
                  {msg.name[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{msg.name}</span>
                    <span className="text-xs text-muted-foreground">{msg.email}</span>
                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-mono uppercase border ${statusColor[msg.status]}`}>{msg.status}</span>
                  </div>
                  <p className="text-xs font-medium mt-0.5 text-foreground">{msg.subject}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{msg.message}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground font-mono">{new Date(msg.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setSelected(msg); }}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20">
                    <Eye size={10} /> View
                  </button>
                  <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-surface border border-border hover:bg-surface-elevated">
                    <CheckCheck size={10} /> Reply
                  </a>
                  <button onClick={(e) => { e.stopPropagation(); if (confirm('Delete?')) deleteMutation.mutate(msg._id); }}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20">
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <MessageModal msg={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
