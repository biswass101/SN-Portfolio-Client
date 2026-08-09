import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import type { Experience } from '@/types';

export const Route = createFileRoute('/admin/_auth/experience')({
  component: ExperienceAdmin,
});

const schema = z.object({
  company: z.string().min(1, 'Required'),
  location: z.string().optional(),
  period: z.string().min(1, 'Required'),
  role: z.string().min(1, 'Required'),
  progression: z.string().optional(),
  order: z.string().optional(),
  isVisible: z.boolean().optional(),
  bullets: z.array(z.object({ value: z.string() })).optional(),
  projects: z.array(z.object({ value: z.string() })).optional(),
});
type FormData = z.infer<typeof schema>;

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-xl rounded-2xl border border-border shadow-elegant max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="font-display font-semibold">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ExpForm({ initial, onSubmit, loading }: {
  initial?: Partial<Experience>; onSubmit: (d: FormData) => void; loading: boolean;
}) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: initial?.company || '',
      location: initial?.location || '',
      period: initial?.period || '',
      role: initial?.role || '',
      progression: initial?.progression || '',
      order: String(initial?.order ?? 0),
      isVisible: initial?.isVisible ?? true,
      bullets: initial?.bullets?.map((v) => ({ value: v })) || [{ value: '' }],
      projects: initial?.projects?.map((v) => ({ value: v })) || [],
    },
  });

  const { fields: bulletFields, append: addBullet, remove: removeBullet } = useFieldArray({ control, name: 'bullets' });
  const { fields: projFields, append: addProj, remove: removeProj } = useFieldArray({ control, name: 'projects' });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        {([['company', 'Company Name'], ['location', 'Location'], ['period', 'Period (e.g. 2014 — Present)'], ['role', 'Role / Title'], ['progression', 'Progression (optional)']] as [keyof FormData, string][]).map(([f, l]) => (
          <div key={f}>
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground">{l}</label>
            <input {...register(f)} className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            {errors[f] && <p className="text-xs text-destructive mt-1">{(errors[f] as { message?: string })?.message}</p>}
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Order</label>
          <input {...register('order')} type="number" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
      </div>

      {/* Bullets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-muted-foreground">Achievements / Bullets</label>
          <button type="button" onClick={() => addBullet({ value: '' })} className="text-xs text-primary flex items-center gap-1"><Plus size={12} /> Add</button>
        </div>
        {bulletFields.map((field, i) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <input {...register(`bullets.${i}.value`)} placeholder="Bullet point..." className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <button type="button" onClick={() => removeBullet(i)} className="text-destructive hover:text-destructive/70"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-muted-foreground">Key Projects</label>
          <button type="button" onClick={() => addProj({ value: '' })} className="text-xs text-primary flex items-center gap-1"><Plus size={12} /> Add</button>
        </div>
        {projFields.map((field, i) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <input {...register(`projects.${i}.value`)} placeholder="Project name..." className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <button type="button" onClick={() => removeProj(i)} className="text-destructive hover:text-destructive/70"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" {...register('isVisible')} /> Visible on portfolio
      </label>

      <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
        {loading ? 'Saving…' : 'Save Experience'}
      </button>
    </form>
  );
}

const toPayload = (d: FormData) => ({
  ...d,
  order: Number(d.order),
  bullets: d.bullets?.map((b) => b.value).filter(Boolean) || [],
  projects: d.projects?.map((p) => p.value).filter(Boolean) || [],
});

function ExperienceAdmin() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<'create' | { exp: Experience } | null>(null);

  const { data: experiences = [], isLoading } = useQuery<Experience[]>({
    queryKey: ['admin-experiences'],
    queryFn: () => api.get('/experiences').then((r) => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (d: FormData) => api.post('/experiences', toPayload(d)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-experiences'] }); toast.success('Experience added'); setModal(null); },
    onError: () => toast.error('Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, d }: { id: string; d: FormData }) => api.put(`/experiences/${id}`, toPayload(d)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-experiences'] }); toast.success('Experience updated'); setModal(null); },
    onError: () => toast.error('Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/experiences/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-experiences'] }); toast.success('Deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) => api.put(`/experiences/${id}`, { isVisible: !isVisible }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-experiences'] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Experience</h1>
          <p className="text-muted-foreground text-sm mt-1">{experiences.length} entries</p>
        </div>
        <button onClick={() => setModal('create')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform">
          <Plus size={16} /> Add Entry
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-40 rounded-2xl bg-surface/40" />)}</div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp._id} className="rounded-2xl border border-border bg-surface/60 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-semibold">{exp.company}</h3>
                    {!exp.isVisible && <EyeOff size={12} className="text-muted-foreground" />}
                  </div>
                  <p className="text-sm text-primary mt-0.5">{exp.role}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{exp.period} · {exp.location}</p>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary shrink-0">{exp.period}</span>
              </div>
              {exp.bullets?.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {exp.bullets.slice(0, 2).map((b, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                      <span className="line-clamp-1">{b}</span>
                    </li>
                  ))}
                  {exp.bullets.length > 2 && <li className="text-xs text-muted-foreground pl-3">+{exp.bullets.length - 2} more</li>}
                </ul>
              )}
              <div className="mt-4 flex items-center gap-2">
                <button onClick={() => setModal({ exp })} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"><Pencil size={12} /> Edit</button>
                <button onClick={() => toggleMutation.mutate({ id: exp._id, isVisible: exp.isVisible })} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-elevated transition-colors">
                  {exp.isVisible ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Show</>}
                </button>
                <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(exp._id); }} className="ml-auto flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal === 'create' && (
        <Modal title="Add Experience" onClose={() => setModal(null)}>
          <ExpForm loading={createMutation.isPending} onSubmit={(d) => createMutation.mutate(d)} />
        </Modal>
      )}
      {modal && modal !== 'create' && 'exp' in modal && (
        <Modal title="Edit Experience" onClose={() => setModal(null)}>
          <ExpForm initial={modal.exp} loading={updateMutation.isPending} onSubmit={(d) => updateMutation.mutate({ id: modal.exp._id, d })} />
        </Modal>
      )}
    </div>
  );
}
