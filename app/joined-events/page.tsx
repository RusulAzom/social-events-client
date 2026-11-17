"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui-button";
import Link from "next/link";
import { Calendar, Users, Clock } from "lucide-react";

interface JoinedEvent {
  id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
}

export default function JoinedEventsPage() {
  const [events, setEvents] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const { data: session } = await authClient.useSession();
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/joined-events`, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        const sorted = (data.events || data || []).sort(
          (a: JoinedEvent, b: JoinedEvent) =>
            new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
        );
        setEvents(sorted);
      }
    } catch {
      toast({ title: "Failed to load joined events", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Joined Events</h1>
          <p className="text-muted-foreground text-sm">Events you have joined</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-full flex flex-col border border-border rounded-xl overflow-hidden bg-secondary/30 animate-pulse">
                <div className="h-48 bg-secondary" />
                <div className="p-4 flex-1 flex flex-col space-y-3">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                  <div className="h-4 bg-secondary rounded w-full mt-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mx-auto mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No joined events yet</h3>
            <p className="text-muted-foreground">Start joining events from the upcoming events page.</p>
            <Link href="/upcoming-events" className="mt-4 inline-flex items-center gap-2 text-primary font-medium hover:underline">
              <Calendar className="h-4 w-4" /> Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="h-full flex flex-col border border-border rounded-xl overflow-hidden bg-background">
                <div className="h-48 overflow-hidden">
                  <img
                    src={event.thumbnailUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <Link href={`/events/${event.id}`} className="text-foreground hover:text-primary transition-colors">
                    <h3 className="font-semibold text-lg leading-snug mb-2 line-clamp-2">{event.title}</h3>
                  </Link>
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
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary mb-4">
                    {event.eventType}
                  </span>
                  <Link href={`/events/${event.id}`} className="w-full py-2 px-4 bg-primary text-white text-center rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors block text-decoration-none">
                    View Event
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}