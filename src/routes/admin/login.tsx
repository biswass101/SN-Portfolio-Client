import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export const Route = createFileRoute('/admin/login')({
  component: AdminLogin,
});

function AdminLogin() {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const loginRes = await api.post('/auth/login', data);
      const profileRes = await api.get('/profile').catch(() => null);
      return { loginRes, profileRes };
    },
    onSuccess: (res: any) => {
      const { token, name, email: resEmail } = res.loginRes.data.data;
      const profilePhoto = res.profileRes?.data?.data?.photo || undefined;
      useAuthStore.setState({ token, user: { name, email: resEmail, profilePhoto }, isAuthenticated: true });
      localStorage.setItem('admin_token', token);
      toast.success('Welcome back!');
      setTimeout(() => navigate({ to: '/admin/dashboard', replace: true }), 500);
    },
    onError: () => {
      toast.error('Invalid email or password');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }
    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow mb-4">
            <Shield size={28} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold">Admin Panel</h1>
          <p className="mt-2 text-muted-foreground text-sm">Sign in to manage your portfolio</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@portfolio.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  disabled={mutation.isPending}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  disabled={mutation.isPending}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:scale-100"
            >
              {mutation.isPending ? 'Signing in…' : 'Sign In'}
            </button>

            <div className="pt-4 border-t border-border/30 text-center">
              <p className="text-xs text-muted-foreground">Demo Credentials:</p>
              <p className="text-xs font-mono text-primary mt-1">admin@portfolio.com</p>
              <p className="text-xs font-mono text-primary">Admin@123</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
