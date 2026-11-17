"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

import { useToast } from "@/components/ui/use-toast";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { Button } from "@/components/ui-button";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
  createdBy: string;
  createdAt: string;
}

export default function EventDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col flex-1 items-center justify-center py-20">
          <div className="h-8 w-32 bg-secondary rounded animate-pulse" />
        </div>
      }
    >
      <EventDetails />
    </Suspense>
  );
}

function EventDetails() {
  const params = useParams();
  const { data: session } = authClient.useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          const raw = data.event || data;
          if (!cancelled) {
            setEvent({
              ...raw,
              id: raw.id ?? raw._id,
              thumbnailUrl: raw.thumbnailUrl ?? raw.thumbnail ?? "",
            });
          }
        }
      } catch {
        if (!cancelled) setEvent(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function joinEvent() {
    if (!event) return;
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join this event.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/api/joined-events`, {
        eventId: event.id,
      });

      if (res.ok) {
        toast({ title: "Joined!", description: "You have successfully joined this event." });
      } else {
        toast({ title: "Failed to join", description: "Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to join", description: "Please try again.", variant: "destructive" });
    }
  }

  if (loading) return (
    <div className="flex flex-col flex-1 items-center justify-center py-20">
      <div className="h-8 w-32 bg-secondary rounded animate-pulse" />
    </div>
  );

  if (!event) return (
    <div className="flex flex-col flex-1 items-center justify-center py-20">
      <p className="text-muted-foreground">Event not found</p>
    </div>
  );

  return (
    <div className="flex flex-col flex-1">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={event.thumbnailUrl}
          alt={event.title}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">{event.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground text-sm mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {format(new Date(event.eventDate), "MMMM d, yyyy 'at' h:mm a")}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {event.location}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {event.eventType}
              </span>
            </div>
            <div className="prose prose-lg text-muted-foreground mb-8">{event.description}</div>
          </div>
          <div className="bg-background rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Event Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Date & Time</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(event.eventDate), "MMMM d, yyyy 'at' h:mm a")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Event Type</p>
                  <p className="text-sm text-muted-foreground">{event.eventType}</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button onClick={joinEvent} className="w-full py-3">
                Join Event
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}