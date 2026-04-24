export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl animate-glow-pulse" />
      <div
        className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full bg-accent/15 blur-3xl animate-glow-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-primary-glow/15 blur-3xl animate-glow-pulse"
        style={{ animationDelay: "4s" }}
      />
    </div>
  );
}
