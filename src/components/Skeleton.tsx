export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-surface/40 rounded-xl ${className}`}
    />
  );
}

export function SkeletonText() {
  return <Skeleton className="h-4 w-full" />;
}

export function SkeletonHeading() {
  return <Skeleton className="h-8 w-3/4" />;
}

export function SkeletonParagraph() {
  return (
    <div className="space-y-2">
      <SkeletonText />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 backdrop-blur p-6 space-y-4">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <SkeletonHeading />
      <SkeletonParagraph />
      <Skeleton className="h-10 w-24" />
    </div>
  );
}
