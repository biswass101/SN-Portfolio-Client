import { createFileRoute, Link, Outlet, useNavigate, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import {
  LayoutDashboard, FolderOpen, Briefcase, Zap, MessageSquare, User, LogOut,
  Menu, X, ChevronRight, Settings, ExternalLink,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export const Route = createFileRoute('/admin/_auth')({
  component: AdminLayout,
});

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/profile', label: 'Profile', icon: User },
  { to: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/skills', label: 'Skills', icon: Zap },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function AdminLayout() {
  const { clearAuth, user } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentPath = router.state.location.pathname;

  const logoutMutation = useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSettled: () => {
      clearAuth();
      toast.success('Logged out');
      navigate({ to: '/admin/login' });
    },
  });

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface/80 backdrop-blur-xl border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
              <LayoutDashboard size={14} className="text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm">SN Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = currentPath === item.to || currentPath.startsWith(item.to + '/');
            return (
              <Link
                key={item.to}
                to={item.to as Parameters<typeof Link>[0]['to']}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-primary/15 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                <item.icon size={16} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4 space-y-2 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
          >
            <ExternalLink size={14} />
            View Portfolio
          </a>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-xs font-bold text-primary-foreground shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => logoutMutation.mutate()}
              className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-16 flex items-center px-4 md:px-6 bg-surface/80 backdrop-blur-xl border-b border-border gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <span className="text-xs text-muted-foreground hidden sm:block">
            {navItems.find((n) => currentPath.includes(n.label.toLowerCase()))?.label || 'Admin'}
          </span>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
