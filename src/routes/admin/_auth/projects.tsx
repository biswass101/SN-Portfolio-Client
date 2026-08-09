import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Upload } from 'lucide-react';
import { api } from '@/lib/api';
import type { Project } from '@/types';

export const Route = createFileRoute('/admin/_auth/projects')({
  component: ProjectsAdmin,
});

const ICONS = ['Server', 'Database', 'Shield', 'Camera', 'Utensils', 'Cog', 'Cloud', 'Network', 'Cpu', 'Code'];

const schema = z.object({
  title: z.string().min(1, 'Title required'),
  tag: z.string().min(1, 'Tag required'),
  description: z.string().min(1, 'Description required'),
  impact: z.string().optional(),
  icon: z.string().optional(),
  techStack: z.string().optional(),
  order: z.string().optional(),
  isVisible: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-lg rounded-2xl border border-border shadow-elegant max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="font-display font-semibold">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ProjectForm({ initial, onSubmit, loading }: {
  initial?: Partial<Project>; onSubmit: (d: FormData, file?: File) => void; loading: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial?.image || null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title || '',
      tag: initial?.tag || '',
      description: initial?.description || '',
      impact: initial?.impact || '',
      icon: initial?.icon || 'Server',
      techStack: initial?.techStack?.join(', ') || '',
      order: String(initial?.order ?? 0),
      isVisible: initial?.isVisible ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d, file || undefined))} className="space-y-4">
      {/* Image upload */}
      <div>
        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Project Image</label>
        <div className="flex items-center gap-3">
          {preview && <img src={preview} alt="" className="h-14 w-20 object-cover rounded-lg border border-border" />}
          <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-xs cursor-pointer hover:bg-surface-elevated transition-colors">
            <Upload size={12} /> Upload Image
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
            }} />
          </label>
        </div>
      </div>

      {[['title', 'Title'], ['tag', 'Tag (e.g. Infrastructure)'], ['impact', 'Impact (e.g. 99.9% uptime)']].map(([f, l]) => (
        <div key={f}>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground">{l}</label>
          <input {...register(f as keyof FormData)} className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          {errors[f as keyof FormData] && <p className="text-xs text-destructive mt-1">{(errors[f as keyof FormData] as { message?: string })?.message}</p>}
        </div>
      ))}

      <div>
        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Description</label>
        <textarea {...register('description')} rows={3} className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
        {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Icon</label>
          <select {...register('icon')} className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
            {ICONS.map((i) => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Order</label>
          <input {...register('order')} type="number" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Tech Stack (comma-separated)</label>
        <input {...register('techStack')} placeholder="React, Node.js, MongoDB" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" {...register('isVisible')} className="rounded" />
        Visible on portfolio
      </label>

      <button type="submit" disabled={loading}
        className="w-full rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
        {loading ? 'Saving…' : 'Save Project'}
      </button>
    </form>
  );
}

function buildFormData(d: FormData, file?: File) {
  const fd = new globalThis.FormData();
  fd.append('title', d.title);
  fd.append('tag', d.tag);
  fd.append('description', d.description);
  if (d.impact) fd.append('impact', d.impact);
  if (d.icon) fd.append('icon', d.icon);
  fd.append('techStack', JSON.stringify(d.techStack?.split(',').map((s) => s.trim()).filter(Boolean) || []));
  fd.append('order', d.order || '0');
  fd.append('isVisible', String(d.isVisible ?? true));
  if (file) fd.append('image', file);
  return fd;
}

function ProjectsAdmin() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<'create' | { project: Project } | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['admin-projects'],
    queryFn: () => api.get('/projects').then((r) => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (fd: globalThis.FormData) => api.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); toast.success('Project created'); setModal(null); },
    onError: (e: unknown) => toast.error((e as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, fd }: { id: string; fd: globalThis.FormData }) =>
      api.put(`/projects/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); toast.success('Project updated'); setModal(null); },
    onError: (e: unknown) => toast.error((e as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); toast.success('Project deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const toggleVisibility = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const fd = new globalThis.FormData();
      fd.append('isVisible', String(!isVisible));
      return api.put(`/projects/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-projects'] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">{projects.length} total</p>
        </div>
        <button onClick={() => setModal('create')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 rounded-2xl bg-surface/40" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p._id} className="rounded-2xl border border-border bg-surface/60 p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold">{p.title}</span>
                    {!p.isVisible && <EyeOff size={12} className="text-muted-foreground" />}
                  </div>
                  <span className="text-xs text-accent font-mono">{p.tag}</span>
                </div>
                {p.image && <img src={p.image} alt="" className="h-10 w-14 object-cover rounded-lg border border-border shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.description}</p>
              {p.impact && <span className="text-xs font-mono text-primary">{p.impact}</span>}
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => setModal({ project: p })}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => toggleVisibility.mutate({ id: p._id, isVisible: p.isVisible })}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-elevated transition-colors">
                  {p.isVisible ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Show</>}
                </button>
                <button onClick={() => { if (confirm('Delete this project?')) deleteMutation.mutate(p._id); }}
                  className="ml-auto flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-colors">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal === 'create' && (
        <Modal title="Add Project" onClose={() => setModal(null)}>
          <ProjectForm loading={createMutation.isPending}
            onSubmit={(d, f) => createMutation.mutate(buildFormData(d, f))} />
        </Modal>
      )}
      {modal && modal !== 'create' && 'project' in modal && (
        <Modal title="Edit Project" onClose={() => setModal(null)}>
          <ProjectForm initial={modal.project} loading={updateMutation.isPending}
            onSubmit={(d, f) => updateMutation.mutate({ id: modal.project._id, fd: buildFormData(d, f) })} />
        </Modal>
      )}
    </div>
  );
}
