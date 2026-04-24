import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Link as LinkIcon, ArrowUpRight } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Syed Nayeem Hossain" },
      {
        name: "description",
        content: "Get in touch with Syed Nayeem Hossain. Email, phone and LinkedIn for IT leadership opportunities.",
      },
      { property: "og:title", content: "Contact Syed Nayeem Hossain" },
      { property: "og:description", content: "Available for IT leadership and consulting opportunities." },
    ],
  }),
  component: ContactPage,
});

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: "sdnayeem27@gmail.com",
    href: "mailto:sdnayeem27@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1973 629336",
    href: "tel:+8801973629336",
  },
  {
    icon: LinkIcon,
    label: "LinkedIn",
    value: "linkedin.com/in/syed-nayeem-hossain",
    href: "https://linkedin.com/in/syed-nayeem-hossain",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dhaka, Bangladesh",
    href: null,
  },
];

function ContactPage() {
  return (
    <div className="px-6">
      <section className="mx-auto max-w-5xl py-12">
        <SectionHeading
          eyebrow="Get in Touch"
          title="Let's build something exceptional"
          description="Whether you're scaling enterprise infrastructure, planning a cloud migration, or looking for an IT leader — I'd love to hear from you."
        />

        <div className="mt-16 grid md:grid-cols-2 gap-5">
          {channels.map((c, i) => {
            const content = (
              <motion.div
                whileHover={c.href ? { y: -4 } : {}}
                className={`group relative h-full rounded-2xl border border-border bg-surface/40 backdrop-blur p-6 transition-colors ${
                  c.href ? "hover:border-primary/40" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center shadow-glow shrink-0">
                    <c.icon size={20} className="text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                      {c.label}
                    </p>
                    <p className="mt-1 font-semibold text-foreground break-all">{c.value}</p>
                  </div>
                  {c.href && (
                    <ArrowUpRight
                      size={18}
                      className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                    />
                  )}
                </div>
              </motion.div>
            );
            return (
              <Reveal key={c.label} delay={i * 0.05}>
                {c.href ? (
                  <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {content}
                  </a>
                ) : (
                  content
                )}
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.3}>
          <div className="relative mt-16 rounded-3xl border border-primary/30 overflow-hidden p-10 md:p-14 text-center">
            <div className="absolute inset-0 bg-gradient-primary opacity-10" />
            <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-display font-bold">
                Ready to <span className="text-gradient">collaborate?</span>
              </h3>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Open to IT leadership roles, advisory engagements, and consulting on enterprise infrastructure.
              </p>
              <a
                href="mailto:sdnayeem27@gmail.com"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform"
              >
                <Mail size={16} />
                Send a message
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
