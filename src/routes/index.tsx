import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import nayeem from "@/assets/nayeem.jpeg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Syed Nayeem Hossain — IT Manager & Infrastructure Expert" },
      {
        name: "description",
        content:
          "IT Manager with 10+ years leading infrastructure, cloud adoption, ERP and digital transformation across enterprise sectors.",
      },
      { property: "og:title", content: "Syed Nayeem Hossain — IT Manager" },
      {
        property: "og:description",
        content: "10+ years of enterprise IT leadership. PMP, RedHat, Cisco certified.",
      },
    ],
  }),
  component: HomePage,
});

const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "$4M+", label: "Revenue Impact" },
  { value: "200+", label: "Hours Saved / Month" },
  { value: "99.9%", label: "Uptime Delivered" },
];

const skills = [
  { icon: Server, title: "Tier-III Data Centers", text: "Architecting resilient enterprise data centers" },
  { icon: Cloud, title: "Cloud & SDWAN", text: "Migration strategies with zero downtime" },
  { icon: Database, title: "ERP Systems", text: "JDE, PeopleSoft, full lifecycle delivery" },
  { icon: Shield, title: "Cybersecurity", text: "Compliance, governance, CISSP-trained" },
  { icon: Network, title: "Network Operations", text: "Mikrotik, Cisco, IP infrastructure" },
  { icon: Cpu, title: "Automation", text: "Process improvement saving 200+ hours/month" },
];

function HomePage() {
  return (
    <div className="px-6">
      {/* HERO */}
      <section className="mx-auto max-w-6xl pt-8 pb-24 md:pt-16 md:pb-32">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Available for IT leadership roles
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
            >
              Syed Nayeem
              <br />
              <span className="text-gradient">Hossain</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-5 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              IT Manager & Infrastructure Expert with{" "}
              <span className="text-foreground font-semibold">10+ years</span> driving
              cloud adoption, ERP transformation, and enterprise security across manufacturing
              and global operations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform"
              >
                Let's Connect
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/experience"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/50 backdrop-blur px-6 py-3.5 text-sm font-semibold hover:bg-surface transition-colors"
              >
                <Download size={16} />
                View Experience
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
            >
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-primary" /> Dhaka, Bangladesh
              </span>
              <a
                href="mailto:sdnayeem27@gmail.com"
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail size={14} className="text-primary" /> sdnayeem27@gmail.com
              </a>
            </motion.div>
          </div>

          {/* PROFILE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto max-w-md"
          >
            <div className="relative animate-float">
              <div className="absolute -inset-4 bg-gradient-primary rounded-3xl blur-2xl opacity-40" />
              <div className="relative rounded-3xl overflow-hidden border border-primary/30 shadow-elegant">
                <img
                  src={nayeem}
                  alt="Syed Nayeem Hossain"
                  className="w-full h-auto block"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>

              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -left-6 top-12 glass rounded-2xl p-3 shadow-card"
              >
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-primary/20 grid place-items-center">
                    <Shield size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Certified</p>
                    <p className="text-sm font-semibold">PMP · CISSP</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -right-4 bottom-16 glass rounded-2xl p-3 shadow-card"
              >
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-accent/20 grid place-items-center">
                    <Cloud size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cloud Migration</p>
                    <p className="text-sm font-semibold">Zero Downtime</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-border glass"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-surface/40 px-6 py-6 text-center hover:bg-surface/80 transition-colors"
            >
              <p className="text-3xl md:text-4xl font-bold text-gradient font-display">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground font-mono">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* SKILLS PREVIEW */}
      <section className="mx-auto max-w-6xl py-20">
        <SectionHeading
          eyebrow="Core Expertise"
          title="Engineering enterprise IT at scale"
          description="From data centers to cloud, ERP to cybersecurity — building infrastructure that businesses depend on."
        />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group relative h-full rounded-2xl border border-border bg-surface/40 backdrop-blur p-6 hover:border-primary/40 transition-colors overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors" />
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
                    <s.icon size={20} className="text-primary-foreground" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
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
