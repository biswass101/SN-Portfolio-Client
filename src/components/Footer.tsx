import { Mail, Phone, Link as LinkIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Syed Nayeem Hossain. Crafted with care.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="mailto:sdnayeem27@gmail.com"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
          <a
            href="tel:+8801973629336"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Phone"
          >
            <Phone size={18} />
          </a>
          <a
            href="https://linkedin.com/in/syed-nayeem-hossain"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="LinkedIn"
          >
            <LinkIcon size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
