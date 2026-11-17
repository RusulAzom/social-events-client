"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  User,
  Plus,
  Calendar,
  Users,
  Menu as MenuIcon,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const { data: session } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const isAuthenticated = !!session?.user;

  const handleLogout = async () => {
    await signOut();
    setDropdownOpen(false);
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-blur]:bg-background/80">
      <div className="flex flex-shrink-0 items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
            SE
          </div>
          <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
            SocialEvents
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/upcoming-events"
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            Upcoming Events
          </Link>
          {isAuthenticated && (
            <Link
              href="/create-event"
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Create Event
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="relative" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="flex items-center gap-2 cursor-pointer">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="User avatar"
                    className="h-8 w-8 rounded-full object-cover border border-border"
                    title={session.user.name || "User"}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium text-foreground">
                  {session?.user?.name || "User"}
                </span>
                <LogOut className="h-4 w-4 hidden md:block" />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-lg py-2 z-50">
                  <div
                    className="px-4 py-2 text-sm text-foreground hover:bg-accent cursor-pointer rounded-lg"
                    onClick={() => { setDropdownOpen(false); router.push("/profile"); }}
                  >
                    <User className="h-4 w-4 mr-2" /> Profile
                  </div>
                  <div
                    className="px-4 py-2 text-sm text-foreground hover:bg-accent cursor-pointer rounded-lg"
                    onClick={() => { setDropdownOpen(false); router.push("/create-event"); }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Create Event
                  </div>
                  <div
                    className="px-4 py-2 text-sm text-foreground hover:bg-accent cursor-pointer rounded-lg"
                    onClick={() => { setDropdownOpen(false); router.push("/manage-events"); }}
                  >
                    <Calendar className="h-4 w-4 mr-2" /> Manage Events
                  </div>
                  <div
                    className="px-4 py-2 text-sm text-foreground hover:bg-accent cursor-pointer rounded-lg"
                    onClick={() => { setDropdownOpen(false); router.push("/my-events"); }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> My Events
                  </div>
                  <div
                    className="px-4 py-2 text-sm text-foreground hover:bg-accent cursor-pointer rounded-lg"
                    onClick={() => { setDropdownOpen(false); router.push("/joined-events"); }}
                  >
                    <Users className="h-4 w-4 mr-2" /> Joined Events
                  </div>
                  <div
                    className="px-4 py-2 text-sm text-destructive hover:bg-accent cursor-pointer rounded-lg"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
        </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/upcoming-events"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg"
            >
              Upcoming Events
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/create-event"
                  className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Create Event
                </Link>
                <Link
                  href="/manage-events"
                  className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" /> Manage Events
                </Link>
                <Link
                  href="/my-events"
                  className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> My Events
                </Link>
                <Link
                  href="/joined-events"
                  className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg flex items-center gap-2"
                >
                  <Users className="h-4 w-4" /> Joined Events
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg flex items-center gap-2"
                >
                  <User className="h-4 w-4" /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-destructive hover:bg-accent rounded-lg"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <Link
                href="/login"
                className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}