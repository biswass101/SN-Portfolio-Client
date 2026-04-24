import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, GraduationCap, Languages, Users } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import nayeem from "@/assets/nayeem.jpeg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Syed Nayeem Hossain" },
      {
        name: "description",
        content: "IT Manager with 10+ years of experience. PMP, RedHat, Cisco certified. Skills, certifications, education, and languages.",
      },
      { property: "og:title", content: "About Syed Nayeem Hossain" },
      { property: "og:description", content: "Skills, certifications, education and the journey behind the work." },
    ],
  }),
  component: AboutPage,
});

const skills = [
  "IT Strategy & Leadership",
  "Cloud & Data Centers",
  "ERP Systems (JDE, PeopleSoft)",
  "Cybersecurity & Compliance",
  "Project Management (PMP)",
  "Automation & Process Improvement",
];

const certifications = [
  "PMP — Project Management Professional",
  "RedHat RHCSA · RHCE · RHCVA",
  "Cisco CCNA",
  "Microsoft Azure Administrator",
  "CISSP (Training Completed)",
];

const education = [
  {
    degree: "B.Sc. in Computer Science & Engineering",
    school: "Daffodil International University, Dhaka",
  },
  { degree: "Higher Secondary Certificate", school: "CODA, Dhaka" },
  { degree: "Secondary School Certificate", school: "CODA, Dhaka" },
];

function AboutPage() {
  return (
    <div className="px-6">
      <section className="mx-auto max-w-6xl py-12">
        <SectionHeading
          eyebrow="About Me"
          title="A decade engineering enterprise IT"
          description="I'm an IT Manager with 10+ years' experience leading IT infrastructure, cloud adoption, and digital transformation projects across manufacturing and enterprise sectors."
        />

        {/* Summary */}
        <div className="mt-16 grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          <Reveal>
            <div className="relative max-w-xs mx-auto lg:mx-0">
              <div className="absolute -inset-4 bg-gradient-primary rounded-3xl blur-2xl opacity-30" />
              <div className="relative rounded-3xl overflow-hidden border border-primary/30 shadow-elegant">
                <img src={nayeem} alt="Syed Nayeem Hossain" className="w-full" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Proven expertise in <span className="text-foreground font-semibold">Tier-III Data Centers</span>,
                ERP Implementations, and IT Security — driving multimillion-dollar efficiencies and ensuring
                business continuity across global operations.
              </p>
              <p>
                Certified in <span className="text-foreground font-semibold">RedHat, Cisco, and PMP</span>,
                with a strong track record of delivering projects on time, on budget, and aligned with business growth.
              </p>
              <p>
                I believe great IT leadership combines deep technical fluency with the discipline of project
                management — and a relentless focus on outcomes that move the business forward.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Skills + Certifications */}
        <div className="mt-24 grid lg:grid-cols-2 gap-6">
          <Reveal>
            <Card icon={<Award size={20} />} title="Key Skills">
              <ul className="space-y-3">
                {skills.map((s, i) => (
                  <motion.li
                    key={s}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{s}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card icon={<Award size={20} />} title="Certifications">
              <ul className="space-y-3">
                {certifications.map((c, i) => (
                  <motion.li
                    key={c}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span>{c}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </Reveal>

          <Reveal>
            <Card icon={<GraduationCap size={20} />} title="Education">
              <ul className="space-y-4">
                {education.map((e) => (
                  <li key={e.degree}>
                    <p className="font-semibold text-foreground text-sm">{e.degree}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{e.school}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card icon={<Languages size={20} />} title="Languages & Activities">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono mb-2">Languages</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-sm">
                      Bengali — Native
                    </span>
                    <span className="px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-sm">
                      English — Fluent
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono mb-2">
                    Leadership
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Users size={14} className="text-primary mt-1 shrink-0" />
                      Former Secretary, DIU Computer Club
                    </li>
                    <li className="flex items-start gap-2">
                      <Users size={14} className="text-primary mt-1 shrink-0" />
                      Google Maps Contributor
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="h-full rounded-2xl border border-border bg-surface/40 backdrop-blur p-6 hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow text-primary-foreground">
          {icon}
        </div>
        <h3 className="font-display text-xl font-semibold">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
