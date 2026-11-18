"use client";

import { useState, useEffect } from "react";
import EventSkeleton from "@/components/event-skeleton";
import { Search } from "lucide-react";
import { Button } from "@/components/ui-button";
import Link from "next/link";

const EVENT_TYPES = ["Cleanup", "Plantation", "Donation", "Awareness", "Relief"];

interface Event {
  id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
}

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          const raw = data.events || data || [];
          setEvents(
            raw.map((e: Record<string, string>) => ({
              ...e,
              id: e.id ?? e._id,
              thumbnailUrl: e.thumbnailUrl ?? e.thumbnail ?? "",
            }))
          );
        }
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) &&
    (!filter || e.eventType === filter)
  );

  return (
    <div className="flex flex-col flex-1">
      <div className="sticky top-0 z-10 border-b border-border/40 bg-background/90 shadow-sm backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Upcoming Events</h1>
              <p className="text-muted-foreground text-sm">Discover events happening near you</p>
            </div>
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            <Button variant={!filter ? "default" : "outline"} onClick={() => setFilter("")} className="whitespace-nowrap">
              All Types
            </Button>
            {EVENT_TYPES.map((type) => (
              <Button key={type} variant={filter === type ? "default" : "outline"} onClick={() => setFilter(type)} className="whitespace-nowrap">
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No events found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <article key={event.id} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#749DC8]/30 bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0A61C9]/35 hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.thumbnailUrl}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-white/60 bg-background/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md">{event.eventType}</span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">{event.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {event.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {new Date(event.eventDate).toLocaleDateString()}
                    </span>
                  </div>
                  <Link href={`/events/${event.id}`} className="mt-auto w-full rounded-xl bg-gradient-to-r from-[#0A61C9] to-[#064089] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:from-[#064089] hover:to-[#07326A] hover:shadow-md">View Event</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}