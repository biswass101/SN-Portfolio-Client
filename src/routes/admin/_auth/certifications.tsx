import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import type { Certification } from '@/types';

export const Route = createFileRoute('/admin/_auth/certifications')({
  component: CertificationsAdmin,
});

const schema = z.object({
  title: z.string().min(1, 'Required'),
  issuer: z.string().optional(),
  year: z.string().optional(),
  description: z.string().optional(),
  order: z.string().optional(),
  isVisible: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-2xl border border-border shadow-elegant">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display font-semibold">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function CertForm({ initial, onSubmit, loading }: {
  initial?: Partial<Certification>; onSubmit: (d: FormData) => void; loading: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title || '',
      issuer: initial?.issuer || '',
      year: initial?.year || '',
      description: initial?.description || '',
      order: String(initial?.order ?? 0),
      isVisible: initial?.isVisible ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Certification Title</label>
        <input {...register('title')} placeholder="e.g. PMP, RHCSA, CCNA" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Issuer</label>
          <input {...register('issuer')} placeholder="e.g. PMI, Red Hat" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Year</label>
          <input {...register('year')} placeholder="e.g. 2020" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Description (optional)</label>
        <textarea {...register('description')} rows={2} className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Order</label>
        <input {...register('order')} type="number" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" {...register('isVisible')} /> Visible on portfolio
      </label>
      <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
        {loading ? 'Saving…' : 'Save Certification'}
      </button>
    </form>
  );
}

const toPayload = (d: FormData) => ({ ...d, order: Number(d.order), isVisible: Boolean(d.isVisible) });

function CertificationsAdmin() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<'create' | { cert: Certification } | null>(null);

  const { data: certifications = [], isLoading } = useQuery<Certification[]>({
    queryKey: ['admin-certifications'],
    queryFn: () => api.get('/certifications').then((r) => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (d: FormData) => api.post('/certifications', toPayload(d)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-certifications'] }); toast.success('Certification added'); setModal(null); },
    onError: () => toast.error('Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, d }: { id: string; d: FormData }) => api.put(`/certifications/${id}`, toPayload(d)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-certifications'] }); toast.success('Certification updated'); setModal(null); },
    onError: () => toast.error('Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/certifications/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-certifications'] }); toast.success('Deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) => api.put(`/certifications/${id}`, { isVisible: !isVisible }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-certifications'] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Certifications</h1>
          <p className="text-muted-foreground text-sm mt-1">{certifications.length} total</p>
        </div>
        <button onClick={() => setModal('create')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform">
          <Plus size={16} /> Add Certification
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-2xl bg-surface/40" />)}</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {certifications.map((cert) => (
            <div key={cert._id} className="rounded-xl border border-border bg-surface/60 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{cert.title}</span>
                {!cert.isVisible && <EyeOff size={12} className="text-muted-foreground" />}
              </div>
              {cert.issuer && <p className="text-xs text-muted-foreground">{cert.issuer}{cert.year ? ` — ${cert.year}` : ''}</p>}
              {cert.description && <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{cert.description}</p>}
              <div className="flex items-center gap-1.5 mt-3">
                <button onClick={() => setModal({ cert })} className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20"><Pencil size={10} /></button>
                <button onClick={() => toggleMutation.mutate({ id: cert._id, isVisible: cert.isVisible })} className="text-xs px-2.5 py-1 rounded-lg bg-surface border border-border hover:bg-surface-elevated">
                  {cert.isVisible ? <EyeOff size={10} /> : <Eye size={10} />}
                </button>
                <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(cert._id); }} className="ml-auto text-xs px-2.5 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20">
                  <Trash2 size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal === 'create' && (
        <Modal title="Add Certification" onClose={() => setModal(null)}>
          <CertForm loading={createMutation.isPending} onSubmit={(d) => createMutation.mutate(d)} />
        </Modal>
      )}
      {modal && modal !== 'create' && 'cert' in modal && (
        <Modal title="Edit Certification" onClose={() => setModal(null)}>
          <CertForm initial={modal.cert} loading={updateMutation.isPending} onSubmit={(d) => updateMutation.mutate({ id: modal.cert._id, d })} />
        </Modal>
      )}
    </div>
  );
}
