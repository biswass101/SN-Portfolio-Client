import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import type { Education } from '@/types';

export const Route = createFileRoute('/admin/_auth/education')({
  component: EducationAdmin,
});

const schema = z.object({
  degree: z.string().min(1, 'Required'),
  institution: z.string().min(1, 'Required'),
  location: z.string().optional(),
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

function EduForm({ initial, onSubmit, loading }: {
  initial?: Partial<Education>; onSubmit: (d: FormData) => void; loading: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      degree: initial?.degree || '',
      institution: initial?.institution || '',
      location: initial?.location || '',
      year: initial?.year || '',
      description: initial?.description || '',
      order: String(initial?.order ?? 0),
      isVisible: initial?.isVisible ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Degree / Program</label>
        <input {...register('degree')} className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        {errors.degree && <p className="text-xs text-destructive mt-1">{errors.degree.message}</p>}
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Institution</label>
        <input {...register('institution')} className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        {errors.institution && <p className="text-xs text-destructive mt-1">{errors.institution.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Location</label>
          <input {...register('location')} placeholder="e.g. Bangladesh" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Year</label>
          <input {...register('year')} placeholder="e.g. 2013" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
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
        {loading ? 'Saving…' : 'Save Education'}
      </button>
    </form>
  );
}

const toPayload = (d: FormData) => ({ ...d, order: Number(d.order), isVisible: Boolean(d.isVisible) });

function EducationAdmin() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<'create' | { edu: Education } | null>(null);

  const { data: educations = [], isLoading } = useQuery<Education[]>({
    queryKey: ['admin-educations'],
    queryFn: () => api.get('/educations').then((r) => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (d: FormData) => api.post('/educations', toPayload(d)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-educations'] }); toast.success('Education added'); setModal(null); },
    onError: () => toast.error('Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, d }: { id: string; d: FormData }) => api.put(`/educations/${id}`, toPayload(d)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-educations'] }); toast.success('Education updated'); setModal(null); },
    onError: () => toast.error('Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/educations/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-educations'] }); toast.success('Deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) => api.put(`/educations/${id}`, { isVisible: !isVisible }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-educations'] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Education</h1>
          <p className="text-muted-foreground text-sm mt-1">{educations.length} entries</p>
        </div>
        <button onClick={() => setModal('create')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform">
          <Plus size={16} /> Add Education
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-surface/40" />)}</div>
      ) : (
        <div className="space-y-3">
          {educations.map((edu) => (
            <div key={edu._id} className="rounded-xl border border-border bg-surface/60 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{edu.degree}</span>
                {!edu.isVisible && <EyeOff size={12} className="text-muted-foreground" />}
              </div>
              <p className="text-xs text-muted-foreground">{edu.institution}{edu.location ? `, ${edu.location}` : ''}{edu.year ? ` — ${edu.year}` : ''}</p>
              <div className="flex items-center gap-1.5 mt-3">
                <button onClick={() => setModal({ edu })} className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20"><Pencil size={10} /></button>
                <button onClick={() => toggleMutation.mutate({ id: edu._id, isVisible: edu.isVisible })} className="text-xs px-2.5 py-1 rounded-lg bg-surface border border-border hover:bg-surface-elevated">
                  {edu.isVisible ? <EyeOff size={10} /> : <Eye size={10} />}
                </button>
                <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(edu._id); }} className="ml-auto text-xs px-2.5 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20">
                  <Trash2 size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal === 'create' && (
        <Modal title="Add Education" onClose={() => setModal(null)}>
          <EduForm loading={createMutation.isPending} onSubmit={(d) => createMutation.mutate(d)} />
        </Modal>
      )}
      {modal && modal !== 'create' && 'edu' in modal && (
        <Modal title="Edit Education" onClose={() => setModal(null)}>
          <EduForm initial={modal.edu} loading={updateMutation.isPending} onSubmit={(d) => updateMutation.mutate({ id: modal.edu._id, d })} />
        </Modal>
      )}
    </div>
  );
}
