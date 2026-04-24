import { Reveal } from "./Reveal";

interface Props {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div className="max-w-3xl">
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium font-mono uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
          <span className="text-gradient">{title}</span>
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.2}>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
