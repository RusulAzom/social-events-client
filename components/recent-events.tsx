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
      <div className="grid md:grid-cols-3 gap-6">
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
    <div className="grid md:grid-cols-3 gap-6">
      {events.map((event) => (
        <div key={event._id} className="h-full flex flex-col border border-border rounded-xl overflow-hidden bg-secondary/30">
          <div className="h-48 overflow-hidden">
            <img
              src={event.thumbnail}
              alt={event.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold text-lg leading-snug mb-2 line-clamp-2 text-foreground">{event.title}</h3>
            <span className="self-start inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2">
              {event.eventType}
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {event.location}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(event.eventDate), "MMM d, yyyy h:mm a")}
              </span>
            </div>
            <Link
              href={`/events/${event._id}`}
              className="mt-auto w-full py-2 px-4 bg-primary text-white text-center rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              View Event
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
