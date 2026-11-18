"use client";

export default function EventSkeleton() {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#749DC8]/25 bg-background/70 shadow-sm animate-pulse">
    <div className="h-48 bg-secondary/70" />
      <div className="p-4 flex-1 flex flex-col space-y-3">
        <div className="h-4 bg-secondary rounded w-3/4" />
        <div className="h-4 bg-secondary rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-4 bg-secondary rounded w-1/3" />
          <div className="h-4 bg-secondary rounded w-1/3" />
        </div>
        <div className="h-4 bg-secondary rounded w-full mt-auto" />
      </div>
    </article>
  );
}