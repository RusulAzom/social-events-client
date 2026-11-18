"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import EventSkeleton from "@/components/event-skeleton";

interface RecentEvent {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
}

export function RecentEvents() {
  const [events, setEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecentEvents() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/recent`);
        if (res.ok) {
          const data = await res.json();
          setEvents(Array.isArray(data) ? data : data.events || []);
        }
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    loadRecentEvents();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <EventSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No upcoming events yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <article key={event._id} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#749DC8]/30 bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0A61C9]/35 hover:shadow-xl">
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={event.thumbnail}
              alt={event.title}
              className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <span className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/60 bg-background/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md">
              {event.eventType}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">{event.title}</h3>
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" />
                {event.location}
              </span>
            </div>
            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 shrink-0" />
                {format(new Date(event.eventDate), "MMM d, yyyy h:mm a")}
              </span>
            </div>
            <Link
              href={`/events/${event._id}`}
              className="mt-auto w-full rounded-xl bg-gradient-to-r from-[#0A61C9] to-[#064089] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:from-[#064089] hover:to-[#07326A] hover:shadow-md"
            >
              View Event
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
