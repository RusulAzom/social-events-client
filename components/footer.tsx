"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, X } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="px-4 py-8 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                SE
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                SocialEvents
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Connecting communities through social events. Discover, join, and
              create meaningful experiences together.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-foreground hover:bg-secondary transition-colors" aria-label="X (Twitter)">
                <X className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tighter uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/upcoming-events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Upcoming Events</Link></li>
              <li><Link href="/create-event" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Create Event</Link></li>
              <li><Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tighter uppercase mb-4">
              Community
            </h3>
            <ul className="space-y-3">
              <li><Link href="/joined-events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Joined Events</Link></li>
              <li><Link href="/manage-events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Manage Events</Link></li>
              <li><Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Profile</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Guidelines</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tighter uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <p className="text-sm text-muted-foreground max-w-xs">123 Community Center, Event City</p>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+1234567890" className="text-sm text-muted-foreground hover:text-foreground transition-colors">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:hello@socialevents.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">hello@socialevents.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p className="text-sm">© 2026 SocialEvents. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}