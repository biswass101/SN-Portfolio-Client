import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Database, Server, Camera, Utensils, Cog, ShieldCheck } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { Skeleton, SkeletonCard } from "../components/Skeleton";
import { useProjects } from "../hooks/usePortfolioData";
import type { Project } from "../types";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Syed Nayeem Hossain" },
      {
        name: "description",
        content: "Key enterprise IT projects: Tier-III Data Center, ERP, MES, VMS, CCTV/IP Surveillance, Smart Meal Tracking CMS.",
      },
      { property: "og:title", content: "Projects — Syed Nayeem Hossain" },
      { property: "og:description", content: "Enterprise IT projects delivered with measurable impact." },
    ],
  }),
  component: ProjectsPage,
});

const iconMap: Record<string, any> = {
  Server, Database, Cog, ShieldCheck, Camera, Utensils,
};

function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();

  return (
    <div className="px-6">
      <section className="mx-auto max-w-6xl py-12">
        <SectionHeading
          eyebrow="Selected Projects"
          title="Systems that move the business forward"
          description="Each project is a story of careful planning, cross-team alignment, and measurable outcomes."
        />

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Reveal key={i} delay={(i % 2) * 0.1}>
                  <SkeletonCard />
                </Reveal>
              ))
            : projects?.map((p: Project, i: number) => {
                const IconComponent = iconMap[p.icon] || Server;
                return (
                  <Reveal key={p._id} delay={(i % 2) * 0.1}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      className="group relative h-full rounded-2xl border border-border bg-surface/40 backdrop-blur overflow-hidden hover:border-primary/40 transition-colors"
                    >
                      <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
                      <div className="relative p-7">
                        <div className="flex items-start justify-between">
                          <div className="h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
                            <IconComponent size={22} className="text-primary-foreground" />
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent">
                            {p.tag}
                          </span>
                        </div>

                        <h3 className="mt-5 text-xl font-display font-bold">{p.title}</h3>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                          {p.description}
                        </p>

                        <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                            Impact
                          </span>
                          <span className="font-display font-semibold text-gradient">{p.impact}</span>
                        </div>
                      </div>
                    </motion.div>
                  </Reveal>
                );
              })}
        </div>
      </section>
    </div>
  );
}
