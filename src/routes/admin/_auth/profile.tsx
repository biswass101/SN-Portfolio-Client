import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, User, FileText, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { Profile } from '@/types';

export const Route = createFileRoute('/admin/_auth/profile')({
  component: ProfilePage,
});

const schema = z.object({
  name: z.string().min(1, 'Required'),
  title: z.string().min(1, 'Required'),
  subtitle: z.string().optional(),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  location: z.string().optional(),
  availableForWork: z.boolean().optional(),
  bio: z.array(z.object({ value: z.string() })).optional(),
  stats: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  languages: z.array(z.object({ language: z.string(), proficiency: z.string() })).optional(),
  highlights: z.array(z.object({ label: z.string(), value: z.string(), icon: z.string() })).optional(),
});
type FormData = z.infer<typeof schema>;

function ProfilePage() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const { data, isLoading } = useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: () => api.get('/profile').then((r) => r.data.data).catch(() => null),
  });

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { bio: [], stats: [], languages: [], highlights: [] },
  });

  const { fields: bioFields, append: addBio, remove: removeBio } = useFieldArray({ control, name: 'bio' });
  const { fields: statFields, append: addStat, remove: removeStat } = useFieldArray({ control, name: 'stats' });
  const { fields: langFields, append: addLang, remove: removeLang } = useFieldArray({ control, name: 'languages' });
  const { fields: highlightFields, append: addHighlight, remove: removeHighlight } = useFieldArray({ control, name: 'highlights' });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        title: data.title,
        subtitle: data.subtitle,
        email: data.email,
        phone: data.phone,
        linkedin: data.linkedin,
        location: data.location,
        availableForWork: data.availableForWork,
        bio: data.bio?.map((v) => ({ value: v })) || [],
        stats: data.stats || [],
        languages: data.languages || [],
        highlights: data.highlights || [],
      });
      if (data.photo) setPreview(data.photo);
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (fd: FormData) => {
      const form = new FormData();
      Object.entries(fd).forEach(([k, v]) => {
        if (k === 'bio') form.append('bio', JSON.stringify((v as { value: string }[]).map((b) => b.value)));
        else if (k === 'stats') form.append('stats', JSON.stringify(v));
        else if (k === 'languages') form.append('languages', JSON.stringify(v));
        else if (k === 'highlights') form.append('highlights', JSON.stringify(v));
        else if (v !== undefined) form.append(k, String(v));
      });
      if (file) form.append('photo', file);
      return api.put('/profile', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profile'] }); toast.success('Profile updated!'); },
    onError: (e: unknown) => toast.error((e as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update profile'),
  });

  const resumeMutation = useMutation({
    mutationFn: (resumeFile: File) => {
      const form = new FormData();
      form.append('resume', resumeFile);
      return api.put('/profile/resume', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profile'] }); setResumeFile(null); toast.success('Resume uploaded!'); },
    onError: (e: unknown) => toast.error((e as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to upload resume'),
  });

  const deleteResumeMutation = useMutation({
    mutationFn: () => api.delete('/profile/resume'),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profile'] }); toast.success('Resume deleted'); },
    onError: () => toast.error('Failed to delete resume'),
  });

  if (isLoading) return <div className="animate-pulse space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 rounded-xl bg-surface/40" />)}</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-display font-bold">Profile</h1>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
        {/* Photo upload */}
        <div className="rounded-2xl border border-border bg-surface/60 p-6">
          <label className="block text-sm font-medium mb-3">Profile Photo</label>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl border border-border overflow-hidden bg-surface grid place-items-center shrink-0">
              {preview ? <img src={preview} alt="Profile" className="w-full h-full object-cover" /> : <User size={28} className="text-muted-foreground" />}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
              }}
            />
            <button type="button" onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm hover:bg-surface-elevated transition-colors">
              <Upload size={14} /> Upload Photo
            </button>
          </div>
        </div>

        {/* Resume upload */}
        <div className="rounded-2xl border border-border bg-surface/60 p-6">
          <label className="block text-sm font-medium mb-3">Resume (PDF)</label>
          <div className="flex items-center gap-4 flex-wrap">
            {data?.resume ? (
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-border bg-surface">
                <FileText size={18} className="text-primary" />
                <a href={data.resume} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                  View current resume
                </a>
                <button type="button" onClick={() => deleteResumeMutation.mutate()}
                  disabled={deleteResumeMutation.isPending}
                  className="ml-2 text-destructive hover:text-destructive/70 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No resume uploaded</span>
            )}
            <input ref={resumeRef} type="file" accept=".pdf" className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { setResumeFile(f); resumeMutation.mutate(f); }
              }}
            />
            <button type="button" onClick={() => resumeRef.current?.click()}
              disabled={resumeMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm hover:bg-surface-elevated transition-colors disabled:opacity-60">
              <Upload size={14} /> {resumeMutation.isPending ? 'Uploading…' : 'Upload Resume'}
            </button>
          </div>
        </div>

        {/* Basic info */}
        <div className="rounded-2xl border border-border bg-surface/60 p-6 space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Basic Info</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {([['name', 'Full Name'], ['title', 'Job Title'], ['subtitle', 'Subtitle'], ['email', 'Email'], ['phone', 'Phone'], ['linkedin', 'LinkedIn URL'], ['location', 'Location']] as [keyof FormData, string][]).map(([field, label]) => (
              <div key={field}>
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">{label}</label>
                <input {...register(field)} className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
                {errors[field] && <p className="text-xs text-destructive mt-1">{(errors[field] as { message?: string })?.message}</p>}
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" {...register('availableForWork')} className="rounded" />
            Available for work
          </label>
        </div>

        {/* Bio */}
        <div className="rounded-2xl border border-border bg-surface/60 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Bio Paragraphs</h3>
            <button type="button" onClick={() => addBio({ value: '' })}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
              <Plus size={14} /> Add
            </button>
          </div>
          {bioFields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <textarea {...register(`bio.${i}.value`)} rows={2}
                className="flex-1 px-3 py-2 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              <button type="button" onClick={() => removeBio(i)} className="text-destructive hover:text-destructive/70 mt-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="rounded-2xl border border-border bg-surface/60 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Stats</h3>
            <button type="button" onClick={() => addStat({ label: '', value: '' })}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
              <Plus size={14} /> Add
            </button>
          </div>
          {statFields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-center">
              <input {...register(`stats.${i}.value`)} placeholder="Value (e.g. 10+)"
                className="w-28 px-3 py-2 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input {...register(`stats.${i}.label`)} placeholder="Label"
                className="flex-1 px-3 py-2 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <button type="button" onClick={() => removeStat(i)} className="text-destructive hover:text-destructive/70">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Languages */}
        <div className="rounded-2xl border border-border bg-surface/60 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Languages</h3>
            <button type="button" onClick={() => addLang({ language: '', proficiency: '' })}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
              <Plus size={14} /> Add
            </button>
          </div>
          {langFields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-center">
              <input {...register(`languages.${i}.language`)} placeholder="Language (e.g. Bengali)"
                className="flex-1 px-3 py-2 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input {...register(`languages.${i}.proficiency`)} placeholder="Proficiency (e.g. Native)"
                className="flex-1 px-3 py-2 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <button type="button" onClick={() => removeLang(i)} className="text-destructive hover:text-destructive/70">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Highlights (Hero floating cards) */}
        <div className="rounded-2xl border border-border bg-surface/60 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Hero Highlights</h3>
            <button type="button" onClick={() => addHighlight({ label: '', value: '', icon: 'Shield' })}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
              <Plus size={14} /> Add
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Floating cards shown on the home hero section (max 2 recommended)</p>
          {highlightFields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-center">
              <input {...register(`highlights.${i}.label`)} placeholder="Label (e.g. Certified)"
                className="w-28 px-3 py-2 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input {...register(`highlights.${i}.value`)} placeholder="Value (e.g. PMP · RHCE)"
                className="flex-1 px-3 py-2 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <select {...register(`highlights.${i}.icon`)}
                className="w-28 px-3 py-2 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                {['Shield', 'Cloud', 'Server', 'Database', 'Network', 'Cpu', 'Globe'].map((ic) => <option key={ic} value={ic}>{ic}</option>)}
              </select>
              <button type="button" onClick={() => removeHighlight(i)} className="text-destructive hover:text-destructive/70">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={mutation.isPending}
          className="w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-60">
          {mutation.isPending ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
