import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, User } from 'lucide-react';
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
});
type FormData = z.infer<typeof schema>;

function ProfilePage() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { data, isLoading } = useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: () => api.get('/profile').then((r) => r.data.data).catch(() => null),
  });

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { bio: [], stats: [] },
  });

  const { fields: bioFields, append: addBio, remove: removeBio } = useFieldArray({ control, name: 'bio' });
  const { fields: statFields, append: addStat, remove: removeStat } = useFieldArray({ control, name: 'stats' });

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
        else if (v !== undefined) form.append(k, String(v));
      });
      if (file) form.append('photo', file);
      return api.put('/profile', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profile'] }); toast.success('Profile updated!'); },
    onError: (e: unknown) => toast.error((e as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update profile'),
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

        <button type="submit" disabled={mutation.isPending}
          className="w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-60">
          {mutation.isPending ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
