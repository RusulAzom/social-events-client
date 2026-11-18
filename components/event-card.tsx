"use strict";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
  createdBy: string;
}

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#749DC8]/30 bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0A61C9]/35 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={event.thumbnailUrl}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          priority
        />
        <div className="absolute left-3 top-3 rounded-full border border-white/60 bg-background/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md">
          {event.eventType}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/events/${event.id}`} className="text-foreground hover:text-primary transition-colors">
          <h3 className="font-semibold text-lg leading-snug mb-2 line-clamp-2">{event.title}</h3>
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {format(new Date(event.eventDate), "MMM d, yyyy h:mm a")}
          </span>
        </div>
      </div>
    </article>
  );
}