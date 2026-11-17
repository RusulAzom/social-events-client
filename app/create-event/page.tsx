"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui-button";
import Link from "next/link";

const EVENT_TYPES = ["Cleanup", "Plantation", "Donation", "Awareness", "Relief"];

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: EVENT_TYPES[0],
    thumbnailUrl: "",
    location: "",
    eventDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.thumbnailUrl.trim()) newErrors.thumbnailUrl = "Thumbnail URL is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.eventDate) newErrors.eventDate = "Event date is required";
    else {
      const selectedDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.eventDate = "Event date must be in the future";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const { data: session } = await authClient.useSession();
    if (!session?.user) {
      toast({ title: "Authentication required", description: "Please log in to create events.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({ title: "Event created!", description: "Your event has been successfully created." });
        router.push("/upcoming-events");
      } else {
        toast({ title: "Failed to create event", description: "Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to create event", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col flex-1">
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Event</h1>
              <p className="text-muted-foreground text-sm">Organize your next social gathering</p>
            </div>
            <Link href="/upcoming-events" className="text-sm font-medium text-primary hover:underline">← Back to events</Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6 bg-background rounded-xl border border-border p-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Event Title</label>
              <input
                type="text"
                placeholder="e.g. Community Cleanup Drive"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errors.title ? "border-destructive" : ""}`}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Event Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              placeholder="Describe your event..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errors.description ? "border-destructive" : ""}`}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Thumbnail Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errors.thumbnailUrl ? "border-destructive" : ""}`}
            />
            {errors.thumbnailUrl && <p className="text-xs text-destructive">{errors.thumbnailUrl}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Location</label>
            <input
              type="text"
              placeholder="e.g. Central Park, New York"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errors.location ? "border-destructive" : ""}`}
            />
            {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Event Date & Time</label>
            <input
              type="datetime-local"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errors.eventDate ? "border-destructive" : ""}`}
            />
            {errors.eventDate && <p className="text-xs text-destructive">{errors.eventDate}</p>}
          </div>

          <Button type="submit" className="w-full py-3" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </div>
    </div>
  );
}