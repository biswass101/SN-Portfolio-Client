import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Link as LinkIcon, ArrowUpRight, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { api } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Syed Nayeem Hossain" },
      { name: "description", content: "Get in touch with Syed Nayeem Hossain. Email, phone and LinkedIn for IT leadership opportunities." },
      { property: "og:title", content: "Contact Syed Nayeem Hossain" },
      { property: "og:description", content: "Available for IT leadership and consulting opportunities." },
    ],
  }),
  component: ContactPage,
});

const channels = [
  { icon: Mail, label: "Email", value: "sdnayeem27@gmail.com", href: "mailto:sdnayeem27@gmail.com" },
  { icon: Phone, label: "Phone", value: "+880 1973 629336", href: "tel:+8801973629336" },
  { icon: LinkIcon, label: "LinkedIn", value: "linkedin.com/in/syed-nayeem-hossain", href: "https://linkedin.com/in/syed-nayeem-hossain" },
  { icon: MapPin, label: "Location", value: "Dhaka, Bangladesh", href: null },
];

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type FormData = z.infer<typeof schema>;

function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post("/contact", data),
    onSuccess: () => {
      reset();
      toast.success("Message sent! I'll get back to you soon.");
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to send message";
      toast.error(msg);
    },
  });

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wider">Name</label>
          <input {...register("name")} placeholder="Your name" className="w-full px-4 py-3 rounded-xl bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors backdrop-blur" />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wider">Email</label>
          <input {...register("email")} type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors backdrop-blur" />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wider">Subject</label>
        <input {...register("subject")} placeholder="What's this about?" className="w-full px-4 py-3 rounded-xl bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors backdrop-blur" />
        {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wider">Message</label>
        <textarea {...register("message")} rows={5} placeholder="Tell me about the opportunity or project..." className="w-full px-4 py-3 rounded-xl bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors backdrop-blur resize-none" />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <button type="submit" disabled={mutation.isPending}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:scale-100">
        {mutation.isPending ? "Sending…" : <><Send size={16} /> Send Message</>}
      </button>
    </form>
  );
}

function ContactPage() {
  return (
    <div className="px-4 sm:px-6">
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
                className={`group relative h-full rounded-2xl border border-border bg-surface/40 backdrop-blur p-6 transition-colors ${c.href ? "hover:border-primary/40" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center shadow-glow shrink-0">
                    <c.icon size={20} className="text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">{c.label}</p>
                    <p className="mt-1 font-semibold text-foreground break-all">{c.value}</p>
                  </div>
                  {c.href && <ArrowUpRight size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />}
                </div>
              </motion.div>
            );
            return (
              <Reveal key={c.label} delay={i * 0.05}>
                {c.href ? <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{content}</a> : content}
              </Reveal>
            );
          })}
        </div>

        {/* Contact Form */}
        <Reveal delay={0.2}>
          <div className="mt-12 rounded-2xl border border-border bg-surface/40 backdrop-blur p-6 md:p-8">
            <h3 className="text-xl font-display font-bold mb-6">Send a Message</h3>
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
