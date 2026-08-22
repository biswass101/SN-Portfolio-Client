import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Briefcase, TrendingUp } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { Skeleton, SkeletonText, SkeletonParagraph } from "../components/Skeleton";
import { useExperiences } from "../hooks/usePortfolioData";
import type { Experience } from "../types";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience — Syed Nayeem Hossain" },
      {
        name: "description",
        content: "Career timeline: IT Manager at Gildan, Network Operations at Getco. Achievements, projects, and impact.",
      },
      { property: "og:title", content: "Experience — Syed Nayeem Hossain" },
      { property: "og:description", content: "10+ years across enterprise IT leadership and network operations." },
    ],
  }),
  component: ExperiencePage,
});

function ExperiencePage() {
  const { data: experiences, isLoading } = useExperiences();

  return (
    <div className="px-4 sm:px-6">
      <section className="mx-auto max-w-5xl py-12">
        <SectionHeading
          eyebrow="Career"
          title="A decade of impact, by the numbers"
          description="From hands-on network operations to enterprise IT leadership — every step focused on measurable business outcomes."
        />

        <div className="mt-12 md:mt-20 relative">
          {/* Timeline line */}
          <div className="absolute left-5 sm:left-6 md:left-8 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent" />

          <div className="space-y-12">
            {isLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="relative pl-12 sm:pl-16 md:pl-20">
                      <div className="absolute left-0 sm:left-0 md:left-2 top-2">
                        <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl" />
                      </div>
                      <div className="rounded-2xl border border-border bg-surface/40 backdrop-blur p-4 sm:p-6 md:p-8 space-y-4">
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-px w-full" />
                        <SkeletonParagraph />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))
              : experiences?.map((exp: Experience, i: number) => (
                  <Reveal key={exp._id} delay={i * 0.1}>
                    <div className="relative pl-12 sm:pl-16 md:pl-20">
                      {/* Dot */}
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="absolute -left-1 sm:left-0 md:left-2 top-2"
                      >
                        <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
                          <Briefcase size={18} className="text-primary-foreground" />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-primary blur-md opacity-50 -z-10" />
                        </div>
                      </motion.div>

                      <div className="rounded-2xl border border-border bg-surface/40 backdrop-blur p-4 sm:p-6 md:p-8 hover:border-primary/40 transition-colors">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <div>
                            <h3 className="text-xl md:text-2xl font-display font-bold">{exp.company}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{exp.location}</p>
                          </div>
                          <span className="font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary">
                            {exp.period}
                          </span>
                        </div>

                        <div className="mt-4 pb-4 border-b border-border/50">
                          <p className="text-primary font-semibold">{exp.role}</p>
                          {exp.progression && (
                            <p className="text-xs text-muted-foreground italic mt-1">{exp.progression}</p>
                          )}
                        </div>

                        <ul className="mt-5 space-y-3">
                          {exp.bullets.map((b: string, idx: number) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex gap-3 text-sm text-muted-foreground leading-relaxed"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                              <span>{b}</span>
                            </motion.li>
                          ))}
                        </ul>

                        {exp.projects && exp.projects.length > 0 && (
                          <div className="mt-6 pt-5 border-t border-border/50">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono mb-3 flex items-center gap-2">
                              <TrendingUp size={12} className="text-primary" />
                              Key Projects & Achievements
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {exp.projects.map((p: string) => (
                                <span
                                  key={p}
                                  className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium"
                                >
                                  ✓ {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}
