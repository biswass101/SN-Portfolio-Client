import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  Mail,
  MapPin,
  Server,
  Shield,
  Cloud,
  Database,
  Network,
  Cpu,
  ChevronDown,
  FileText,
  Globe,
} from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { Skeleton, SkeletonCard, SkeletonText, SkeletonParagraph } from "../components/Skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useProfile, useSkills } from "../hooks/usePortfolioData";
import { downloadWebsiteAsPdf } from "../lib/downloadWebsitePdf";
import nayeem from "@/assets/nayeem.jpeg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Syed Nayeem Hossain — Enterprise Technology & ERP Transformation" },
      {
        name: "description",
        content:
          "Senior IT leader with 12+ years directing enterprise technology, ERP/MES transformation, infrastructure, and cybersecurity across a five-plant manufacturing network.",
      },
      { property: "og:title", content: "Syed Nayeem Hossain — Multi-Site IT Leadership" },
      {
        property: "og:description",
        content: "12+ years of enterprise IT leadership. PMP, RHCSA, RHCE, CCNA, Azure certified.",
      },
    ],
  }),
  component: HomePage,
});

const iconMap: Record<string, any> = {
  Server, Cloud, Database, Shield, Network, Cpu,
};

function HomePage() {
  const router = useRouter();
  const profileQuery = useProfile();
  const skillsQuery = useSkills();

  const profile = profileQuery.data;
  const skills = skillsQuery.data || [];

  const handleDownloadWebsite = () => {
    const navigate = (to: string) => router.navigate({ to });
    downloadWebsiteAsPdf(navigate);
  };

  return (
    <div className="px-4 sm:px-6">
      {/* HERO */}
      <section className="mx-auto max-w-6xl pt-8 pb-16 md:pt-16 md:pb-32">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-center">
          <div>
            {profile ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-primary"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  {profile.availableForWork ? "Available for IT leadership roles" : "Currently unavailable"}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
                >
                  {profile.name.split(" ")[0]}
                  <br />
                  <span className="text-gradient">{profile.name.split(" ")[1]}</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="mt-5 text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
                >
                  {profile.bio[0]}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="mt-8 flex flex-wrap gap-3"
                >
                  <a
                    href={`mailto:${profile.email}`}
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform"
                  >
                    Email Me
                    <Mail size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/50 backdrop-blur px-6 py-3.5 text-sm font-semibold hover:bg-surface transition-colors">
                        <Download size={16} />
                        Download
                        <ChevronDown size={14} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem asChild>
                        <a
                          href={profile.resume || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`cursor-pointer flex items-start gap-3 py-3 ${!profile.resume ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          <FileText size={18} className="text-primary mt-0.5 shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-semibold">Resume (PDF)</span>
                            <span className="text-xs text-muted-foreground">{profile.resume ? 'My professional CV' : 'Not uploaded yet'}</span>
                          </div>
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <button onClick={handleDownloadWebsite} className="cursor-pointer flex items-start gap-3 py-3 w-full">
                          <Globe size={18} className="text-primary mt-0.5 shrink-0" />
                          <div className="flex flex-col text-left">
                            <span className="font-semibold">Website</span>
                            <span className="text-xs text-muted-foreground">Offline portfolio version</span>
                          </div>
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={14} className="text-primary" /> {profile.location}
                  </span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <Mail size={14} className="text-primary" /> {profile.email}
                  </a>
                </motion.div>
              </>
            ) : (
              <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="space-y-3">
                  <Skeleton className="h-12 w-72" />
                  <Skeleton className="h-12 w-64" />
                </div>
                <SkeletonParagraph />
                <div className="flex gap-3">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-40" />
                </div>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto max-w-md"
          >
            {profile ? (
              <div className="relative animate-float">
                <div className="absolute -inset-4 bg-gradient-primary rounded-3xl blur-2xl opacity-40" />
                <div className="relative rounded-3xl overflow-hidden border border-primary/30 shadow-elegant">
                  <img
                    src={profile.photo || nayeem}
                    alt={profile.name}
                    className="w-full h-auto block"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                </div>

                {/* Floating cards — dynamic from profile highlights */}
                {profile.highlights?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="hidden sm:block absolute -left-6 top-12 glass rounded-2xl p-3 shadow-card"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-xl bg-primary/20 grid place-items-center">
                        {(() => { const Icon = iconMap[profile.highlights[0].icon] || Shield; return <Icon size={16} className="text-primary" />; })()}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{profile.highlights[0].label}</p>
                        <p className="text-sm font-semibold">{profile.highlights[0].value}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {profile.highlights?.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="hidden sm:block absolute -right-4 bottom-16 glass rounded-2xl p-3 shadow-card"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-xl bg-accent/20 grid place-items-center">
                        {(() => { const Icon = iconMap[profile.highlights[1].icon] || Cloud; return <Icon size={16} className="text-accent" />; })()}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{profile.highlights[1].label}</p>
                        <p className="text-sm font-semibold">{profile.highlights[1].value}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <Skeleton className="h-96 rounded-3xl" />
            )}
          </motion.div>
        </div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-border glass"
        >
          {profile ? (
            profile.stats.map((s: { label: string; value: string }) => (
              <div
                key={s.label}
                className="bg-surface/40 px-6 py-6 text-center hover:bg-surface/80 transition-colors"
              >
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient font-display">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground font-mono">
                  {s.label}
                </p>
              </div>
            ))
          ) : (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-surface/40 px-6 py-6">
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
            ))
          )}
        </motion.div>
      </section>

      {/* SKILLS PREVIEW */}
      <section className="mx-auto max-w-6xl py-12 md:py-20">
        <SectionHeading
          eyebrow="Core Expertise"
          title="Engineering enterprise IT at scale"
          description="From data centers to cloud, ERP to cybersecurity — building infrastructure that businesses depend on."
        />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillsQuery.isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <SkeletonCard />
                </Reveal>
              ))
            : skills.map((s: any, i: number) => {
                const IconComponent = iconMap[s.icon] || Server;
                return (
                  <Reveal key={s._id} delay={i * 0.05}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      className="group relative h-full rounded-2xl border border-border bg-surface/40 backdrop-blur p-6 hover:border-primary/40 transition-colors overflow-hidden"
                    >
                      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors" />
                      <div className="relative">
                        <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
                          <IconComponent size={20} className="text-primary-foreground" />
                        </div>
                        <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                      </div>
                    </motion.div>
                  </Reveal>
                );
              })}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-12 text-center">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Discover the full story <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
