"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/use-require-auth";
import AccessDenied from "@/components/access-denied";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui-button";
import Link from "next/link";

const EVENT_TYPES = ["Cleanup", "Plantation", "Donation", "Awareness", "Relief"];

interface MyEvent {
  id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
}

export default function MyEventsPage() {
  const { session, isPending, authenticated } = useRequireAuth();
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [fetched, setFetched] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<MyEvent | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", eventType: EVENT_TYPES[0], thumbnailUrl: "", location: "", eventDate: "" });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loading = isPending || (!!session?.user && !fetched);

  useEffect(() => {
    if (isPending || !session?.user) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-events`);
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
        if (!cancelled) toast({ title: "Failed to load your events", variant: "destructive" });
      } finally {
        if (!cancelled) setFetched(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isPending, session, toast]);

  if (!authenticated && !isPending) {
    return (
      <div className="flex flex-col flex-1">
        <div className="border-b border-border bg-background sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Events</h1>
            <p className="text-muted-foreground text-sm">Update or remove events you have created</p>
          </div>
        </div>
        <AccessDenied />
      </div>
    );
  }

  function openEdit(event: MyEvent) {
    setEditing(event);
    setEditForm({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      thumbnailUrl: event.thumbnailUrl,
      location: event.location,
      eventDate: event.eventDate ? event.eventDate.slice(0, 16) : "",
    });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const res = await api.put(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${editing.id}`, editForm);
      if (res.ok) {
        setEvents(events.map((ev) => (ev.id === editing.id ? { ...ev, ...editForm } : ev)));
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
        setEvents(events.filter((e) => e.id !== deleteId));
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Events</h1>
          <p className="text-muted-foreground text-sm">Update or remove events you have created</p>
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
          <h3 className="text-lg font-medium text-foreground mb-2">
            {session?.user ? "No events created yet" : "Please log in"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {session?.user
              ? "Create your first event to get started."
              : "Log in to see the events you have created."}
          </p>
          {session?.user ? (
            <Link href="/create-event" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
              Create Event
            </Link>
          ) : (
            <Link href="/login" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
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
                  <span className="self-start inline-block px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary mb-4">
                    {event.eventType}
                  </span>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => openEdit(event)}
                      className="flex-1 py-2 px-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(event.id)}
                      className="flex-1 py-2 px-3 bg-destructive text-white rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form onSubmit={handleUpdate} className="bg-background rounded-xl border border-border p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-foreground">Edit Event</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Event Type</label>
                <select
                  value={editForm.eventType}
                  onChange={(e) => setEditForm({ ...editForm, eventType: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date &amp; Time</label>
                <input
                  type="datetime-local"
                  value={editForm.eventDate}
                  onChange={(e) => setEditForm({ ...editForm, eventDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Thumbnail URL</label>
              <input
                type="url"
                value={editForm.thumbnailUrl}
                onChange={(e) => setEditForm({ ...editForm, thumbnailUrl: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              />
            </div>
            <div className="flex gap-3 pt-2">
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
