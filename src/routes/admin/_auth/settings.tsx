import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export const Route = createFileRoute('/admin/_auth/settings')({
  component: SettingsPage,
});

const pwSchema = z
  .object({
    currentPassword: z.string().min(1, 'Required'),
    newPassword: z.string().min(6, 'Min 6 characters'),
    confirmPassword: z.string().min(1, 'Required'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type PwForm = z.infer<typeof pwSchema>;

function PasswordField({ label, name, register, error }: {
  label: string; name: string; register: ReturnType<typeof useForm<PwForm>>['register']; error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-muted-foreground">{label}</label>
      <div className="relative">
        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          {...register(name as keyof PwForm)}
          type={show ? 'text' : 'password'}
          className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
        <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function SettingsPage() {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PwForm>({ resolver: zodResolver(pwSchema) });

  const mutation = useMutation({
    mutationFn: (d: PwForm) => api.patch('/auth/change-password', { currentPassword: d.currentPassword, newPassword: d.newPassword }),
    onSuccess: () => { reset(); toast.success('Password changed successfully'); },
    onError: (e: unknown) => toast.error((e as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed'),
  });

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-display font-bold">Settings</h1>

      {/* Account info */}
      <div className="rounded-2xl border border-border bg-surface/60 p-6">
        <h3 className="font-semibold mb-4">Account</h3>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center text-xl font-bold text-primary-foreground shadow-glow">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-primary font-mono mt-0.5">Administrator</p>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="rounded-2xl border border-border bg-surface/60 p-6">
        <h3 className="font-semibold mb-4">Change Password</h3>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <PasswordField label="Current Password" name="currentPassword" register={register} error={errors.currentPassword?.message} />
          <PasswordField label="New Password" name="newPassword" register={register} error={errors.newPassword?.message} />
          <PasswordField label="Confirm New Password" name="confirmPassword" register={register} error={errors.confirmPassword?.message} />
          <button type="submit" disabled={mutation.isPending}
            className="w-full rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-60">
            {mutation.isPending ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* API info */}
      <div className="rounded-2xl border border-border bg-surface/60 p-6">
        <h3 className="font-semibold mb-3">API Info</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Base URL</span>
            <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
              {import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}
            </code>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Version</span>
            <code className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">v1</code>
          </div>
        </div>
      </div>
    </div>
  );
}
