"use client";

import { useState } from "react";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui-button";
import { User, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const [userData, setUserData] = useState<{ name: string; image: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: session } = await authClient.useSession();
    if (session?.user) {
      setUserData({
        name: session.user.name || "",
        image: session.user.image || "",
      });
    }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        toast({ title: "Profile updated" });
      } else {
        toast({ title: "Failed to update profile", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to update profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex flex-col flex-1 items-center justify-center py-20">
      <div className="h-8 w-32 bg-secondary rounded animate-pulse" />
    </div>
  );

  return (
    <div className="flex flex-col flex-1">
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
          <p className="text-muted-foreground text-sm">Manage your account settings</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-background rounded-xl border border-border p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              {userData?.image ? (
                <Image
                  src={userData.image}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover border border-border"
                  width={96}
                  height={96}
                  priority
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white font-bold text-3xl">
                  {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <input
                    type="text"
                    value={userData?.name || ""}
                    onChange={(e) => setUserData({ ...userData!, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Profile Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={userData?.image || ""}
                    onChange={(e) => setUserData({ ...userData!, image: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  />
                </div>
                <Button type="submit" className="w-full py-3" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}