import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Database, Server, Camera, Utensils, Cog, ShieldCheck } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";

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

const projects = [
  {
    icon: Server,
    title: "Tier-III Data Center",
    tag: "Infrastructure",
    description:
      "End-to-end implementation of a Tier-III data center supporting multi-plant operations with high availability and disaster recovery.",
    impact: "99.9% uptime",
  },
  {
    icon: Database,
    title: "ERP Implementation",
    tag: "Enterprise Software",
    description:
      "Full lifecycle ERP rollout across HR, Finance, Quality, Admin, and Security — establishing 100% operational visibility.",
    impact: "$4M+ revenue impact",
  },
  {
    icon: Cog,
    title: "MES System",
    tag: "Manufacturing",
    description:
      "Manufacturing Execution System integration, connecting production floor data with enterprise systems in real time.",
    impact: "Real-time visibility",
  },
  {
    icon: ShieldCheck,
    title: "Visitor Management System",
    tag: "Security",
    description:
      "Modern VMS replacing manual logs — accelerating onsite check-in and centralizing visitor compliance records.",
    impact: "100% compliance",
  },
  {
    icon: Camera,
    title: "CCTV / IP Surveillance",
    tag: "Security",
    description:
      "IP-based surveillance overhaul covering perimeter and production areas — integrated with central monitoring.",
    impact: "Enterprise coverage",
  },
  {
    icon: Utensils,
    title: "Smart Meal Tracking CMS",
    tag: "Automation",
    description:
      "Custom meal tracking platform automating canteen operations — eliminating paper-based workflows.",
    impact: "200+ hours saved / month",
  },
];

function ProjectsPage() {
  return (
    <div className="px-6">
      <section className="mx-auto max-w-6xl py-12">
        <SectionHeading
          eyebrow="Selected Projects"
          title="Systems that move the business forward"
          description="Each project is a story of careful planning, cross-team alignment, and measurable outcomes."
        />

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group relative h-full rounded-2xl border border-border bg-surface/40 backdrop-blur overflow-hidden hover:border-primary/40 transition-colors"
              >
                <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
                <div className="relative p-7">
                  <div className="flex items-start justify-between">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
                      <p.icon size={22} className="text-primary-foreground" />
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
          ))}
        </div>
      </section>
    </div>
  );
}
