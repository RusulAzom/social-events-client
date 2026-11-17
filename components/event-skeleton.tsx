"use client";

export default function EventSkeleton() {
  return (
    <article className="h-full flex flex-col border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="h-48 bg-secondary" />
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