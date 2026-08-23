import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, GraduationCap, Languages } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { Skeleton, SkeletonText, SkeletonParagraph } from "../components/Skeleton";
import { useProfile, useSkills, useEducations, useCertifications } from "../hooks/usePortfolioData";
import nayeem from "@/assets/nayeem.jpeg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Syed Nayeem Hossain" },
      {
        name: "description",
        content: "Senior IT leader with 12+ years of experience. PMP, RedHat, Cisco, Azure certified. Skills, certifications, education, and languages.",
      },
      { property: "og:title", content: "About Syed Nayeem Hossain" },
      { property: "og:description", content: "Skills, certifications, education and the journey behind the work." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const profileQuery = useProfile();
  const skillsQuery = useSkills();
  const educationsQuery = useEducations();
  const certificationsQuery = useCertifications();

  const profile = profileQuery.data;
  const skills = skillsQuery.data || [];
  const educations = educationsQuery.data || [];
  const certifications = certificationsQuery.data || [];

  return (
    <div className="px-4 sm:px-6">
      <section className="mx-auto max-w-6xl py-12">
        <SectionHeading
          eyebrow="About Me"
          title="12+ years engineering enterprise IT"
          description="Senior IT leader directing enterprise technology, ERP/MES transformation, infrastructure, cybersecurity, and IT operations across a five-plant manufacturing network."
        />

        {/* Summary */}
        <div className="mt-12 md:mt-16 grid lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-12 items-start">
          <Reveal>
            <div className="relative max-w-xs mx-auto lg:mx-0">
              {profile ? (
                <>
                  <div className="absolute -inset-4 bg-gradient-primary rounded-3xl blur-2xl opacity-30" />
                  <div className="relative rounded-3xl overflow-hidden border border-primary/30 shadow-elegant">
                    <img src={profile.photo || nayeem} alt={profile.name} className="w-full" />
                  </div>
                </>
              ) : (
                <Skeleton className="h-96 rounded-3xl" />
              )}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            {profile ? (
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                {profile.bio.map((paragraph: string, i: number) => (
                  <p key={i}>
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                <SkeletonParagraph />
                <SkeletonParagraph />
                <SkeletonParagraph />
              </div>
            )}
          </Reveal>
        </div>

        {/* Skills + Certifications */}
        <div className="mt-16 md:mt-24 grid sm:grid-cols-2 gap-4 sm:gap-6">
          <Reveal>
            <Card icon={<Award size={20} />} title="Key Skills">
              {skillsQuery.isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonText key={i} />
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {skills.map((s: any, i: number) => (
                    <motion.li
                      key={s._id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>{s.title}</span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card icon={<Award size={20} />} title="Certifications">
              {certificationsQuery.isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonText key={i} />
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {certifications.map((cert: any, i: number) => (
                    <motion.li
                      key={cert._id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      <span>{cert.title}{cert.issuer ? ` — ${cert.issuer}` : ''}</span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </Card>
          </Reveal>

          <Reveal>
            <Card icon={<GraduationCap size={20} />} title="Education">
              {educationsQuery.isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i}>
                      <SkeletonText />
                      <Skeleton className="h-3 w-24 mt-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-4">
                  {educations.map((edu: any) => (
                    <li key={edu._id}>
                      <p className="font-semibold text-foreground text-sm">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {edu.institution}{edu.location ? `, ${edu.location}` : ''}{edu.year ? ` — ${edu.year}` : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card icon={<Languages size={20} />} title="Languages">
              {profileQuery.isLoading ? (
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-32 rounded-full" />
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {(profile?.languages || []).map((lang: any, i: number) => (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-full text-sm ${i === 0 ? 'bg-primary/15 border border-primary/30' : 'bg-accent/15 border border-accent/30'}`}
                    >
                      {lang.language} — {lang.proficiency}
                    </span>
                  ))}
                </div>
              )}
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
        <h3 className="font-display text-lg sm:text-xl font-semibold">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
