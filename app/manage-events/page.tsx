"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/use-require-auth";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui-button";
import AccessDenied from "@/components/access-denied";
import Link from "next/link";

interface ManagedEvent {
  id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
}

const EVENT_TYPES = ["Cleanup", "Plantation", "Donation", "Awareness", "Relief"];

export default function ManageEventsPage() {
  const { session, isPending, authenticated } = useRequireAuth();
  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [fetched, setFetched] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ManagedEvent | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    eventType: EVENT_TYPES[0],
    thumbnailUrl: "",
    location: "",
    eventDate: "",
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loading = !fetched;

  useEffect(() => {
    if (isPending || !session?.user) return;
    let cancelled = false;
    (async () => {
      try {
        const query = new URLSearchParams({ email: session.user.email });
        const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-events?${query}`);
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
        if (!cancelled) toast({ title: "Failed to load events", variant: "destructive" });
      } finally {
        if (!cancelled) setFetched(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isPending, session, toast]);

  if (isPending) {
    return (
      <div className="flex flex-col flex-1">
        <div className="border-b border-border bg-background sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Events</h1>
            <p className="text-muted-foreground text-sm">Events you have created</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex flex-col flex-1">
        <div className="border-b border-border bg-background sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Events</h1>
            <p className="text-muted-foreground text-sm">Events you have created</p>
          </div>
        </div>
        <AccessDenied />
      </div>
    );
  }

  function openEdit(event: ManagedEvent) {
    const date = new Date(event.eventDate);
    const pad = (value: number) => String(value).padStart(2, "0");
    const eventDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

    setEditing(event);
    setEditForm({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      thumbnailUrl: event.thumbnailUrl,
      location: event.location,
      eventDate,
    });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;

    const eventDate = new Date(editForm.eventDate);
    if (Number.isNaN(eventDate.getTime()) || eventDate <= new Date()) {
      toast({
        title: "Invalid event date",
        description: "Choose a future date and time.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await api.put(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${editing.id}`, {
        ...editForm,
        eventDate: eventDate.toISOString(),
      });
      if (res.ok) {
        setEvents((currentEvents) =>
          currentEvents.map((event) =>
            event.id === editing.id ? { ...event, ...editForm, eventDate: eventDate.toISOString() } : event
          )
        );
        toast({ title: "Event updated" });
        setEditing(null);
      } else {
        toast({ title: "Failed to update event", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to update event", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await api.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${deleteId}`);
      if (res.ok) {
        setEvents((currentEvents) => currentEvents.filter((event) => event.id !== deleteId));
        toast({ title: "Event deleted" });
      } else {
        toast({ title: "Failed to delete", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Events</h1>
          <p className="text-muted-foreground text-sm">Events you have created</p>
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
            <div className="text-muted-foreground mx-auto mb-4">📭</div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {session?.user ? "No events created yet" : "Please log in"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {session?.user
              ? "Create your first event to get started."
              : "Log in to manage the events you have created."}
          </p>
          {session?.user ? (
            <Link href="/create-event" className="mt-4 inline-flex items-center gap-2 text-primary font-medium hover:underline">
              Create Event
            </Link>
          ) : (
            <Link href="/login" className="mt-4 inline-flex items-center gap-2 text-primary font-medium hover:underline">
              Log In
            </Link>
          )}
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
                    <span className="flex items-center gap-1">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">{new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => openEdit(event)}
                      className="flex-1 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-deep-navy"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => { setDeleteId(event.id); }}
                      className="flex-1 rounded-xl bg-destructive px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-destructive/90"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleUpdate} className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-foreground">Edit Event</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <input
                type="text"
                required
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                rows={4}
                required
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Event Type</label>
                <select
                  value={editForm.eventType}
                  onChange={(e) => setEditForm({ ...editForm, eventType: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {EVENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date &amp; Time</label>
                <input
                  type="datetime-local"
                  required
                  value={editForm.eventDate}
                  onChange={(e) => setEditForm({ ...editForm, eventDate: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Thumbnail URL</label>
              <input
                type="url"
                required
                value={editForm.thumbnailUrl}
                onChange={(e) => setEditForm({ ...editForm, thumbnailUrl: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <input
                type="text"
                required
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            </div>
          </form>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-xl border border-border p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-foreground mb-2">Delete Event</h3>
            <p className="text-muted-foreground text-sm mb-6">Are you sure you want to delete this event? This cannot be undone.</p>
            <div className="flex gap-3">
              <Button onClick={() => setDeleteId(null)} variant="outline">Cancel</Button>
              <Button onClick={handleDelete} variant="destructive">Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}