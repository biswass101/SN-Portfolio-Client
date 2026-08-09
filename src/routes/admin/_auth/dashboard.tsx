import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { FolderOpen, Briefcase, Zap, MessageSquare, Mail, Eye } from 'lucide-react';
import { api } from '@/lib/api';
import type { DashboardStats, ContactMessage } from '@/types';

export const Route = createFileRoute('/admin/_auth/dashboard')({
  component: DashboardPage,
});

const PIE_COLORS = ['#60a5fa', '#a78bfa', '#34d399'];

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 backdrop-blur p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">{label}</span>
        <div className="h-9 w-9 rounded-xl bg-primary/15 grid place-items-center text-primary">{icon}</div>
      </div>
      <p className="text-3xl font-display font-bold text-gradient">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

const statusColor: Record<string, string> = { new: 'text-blue-400 bg-blue-400/10', read: 'text-yellow-400 bg-yellow-400/10', replied: 'text-green-400 bg-green-400/10' };

function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/analytics/dashboard').then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-surface/40" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const { counts, charts, recentMessages } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Portfolio analytics overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FolderOpen size={18} />} label="Projects" value={counts.totalProjects} sub={`${counts.visibleProjects} visible`} />
        <StatCard icon={<Briefcase size={18} />} label="Experience" value={counts.totalExperiences} />
        <StatCard icon={<Zap size={18} />} label="Skills" value={counts.totalSkills} />
        <StatCard icon={<MessageSquare size={18} />} label="Messages" value={counts.totalMessages} sub={`${counts.newMessages} new`} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Messages over time */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-surface/60 backdrop-blur p-5">
          <h3 className="font-display font-semibold mb-4">Messages (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={charts.messagesChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.04 250 / 30%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'oklch(0.70 0.03 250)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'oklch(0.70 0.03 250)' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: 'oklch(0.20 0.035 250)', border: '1px solid oklch(0.30 0.04 250 / 60%)', borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: 'oklch(0.97 0.01 250)' }}
              />
              <Line type="monotone" dataKey="count" stroke="oklch(0.72 0.18 230)" strokeWidth={2} dot={{ r: 4, fill: 'oklch(0.72 0.18 230)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status distribution */}
        <div className="rounded-2xl border border-border bg-surface/60 backdrop-blur p-5">
          <h3 className="font-display font-semibold mb-4">Message Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={charts.statusDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {charts.statusDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'oklch(0.20 0.035 250)', border: '1px solid oklch(0.30 0.04 250 / 60%)', borderRadius: 12, fontSize: 12 }}
              />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projects by tag */}
      <div className="rounded-2xl border border-border bg-surface/60 backdrop-blur p-5">
        <h3 className="font-display font-semibold mb-4">Projects by Category</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={charts.projectsByTag} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.04 250 / 30%)" />
            <XAxis type="number" tick={{ fontSize: 11, fill: 'oklch(0.70 0.03 250)' }} allowDecimals={false} />
            <YAxis type="category" dataKey="tag" tick={{ fontSize: 11, fill: 'oklch(0.70 0.03 250)' }} width={120} />
            <Tooltip
              contentStyle={{ background: 'oklch(0.20 0.035 250)', border: '1px solid oklch(0.30 0.04 250 / 60%)', borderRadius: 12, fontSize: 12 }}
            />
            <Bar dataKey="count" fill="oklch(0.78 0.18 195)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent messages */}
      <div className="rounded-2xl border border-border bg-surface/60 backdrop-blur p-5">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Mail size={16} className="text-primary" />
          Recent Messages
        </h3>
        <div className="space-y-3">
          {recentMessages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No messages yet</p>
          )}
          {recentMessages.map((msg: ContactMessage) => (
            <div key={msg._id} className="flex items-start gap-3 p-3 rounded-xl bg-surface/40 border border-border/50">
              <div className="h-9 w-9 rounded-full bg-primary/15 grid place-items-center text-xs font-bold text-primary shrink-0">
                {msg.name[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{msg.name}</span>
                  <span className="text-xs text-muted-foreground">{msg.email}</span>
                  <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-mono uppercase ${statusColor[msg.status]}`}>
                    {msg.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{msg.subject}</p>
              </div>
              <Eye size={14} className="text-muted-foreground mt-1 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
