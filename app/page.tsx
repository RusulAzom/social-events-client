import Link from "next/link";
import { Star, Users, MapPin, Calendar, Shield, Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import { RecentEvents } from "@/components/recent-events";

const features = [
  { icon: Star, title: "Discover Events", description: "Browse upcoming social events in your community." },
  { icon: Users, title: "Join Communities", description: "Connect with like-minded people who share your interests." },
  { icon: MapPin, title: "Local & Global", description: "Find events happening near you or around the world." },
  { icon: Calendar, title: "Plan Ahead", description: "Save events to your calendar and never miss a moment." },
  { icon: Shield, title: "Safe & Secure", description: "Verified events and secure authentication." },
  { icon: Heart, title: "Make Memories", description: "Create unforgettable experiences with friends." },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1618477385359-4b2ca8b5a1b3?w=800",
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800",
  "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800",
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
  "https://images.unsplash.com/photo-1523966211575-eb4a01e7df51?w=800",
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 py-20 text-white lg:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -bottom-40 right-0 h-[30rem] w-[30rem] rounded-full bg-teal-300/15 blur-3xl" />
          <div className="absolute top-1/3 left-2/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Building stronger communities together
          </span>
          <h1 className="mx-auto mb-6 max-w-3xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Connect with Your Community Through Social Events
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            Discover, join, and create meaningful social events. From cleanups to plantations, find your next experience today.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/upcoming-events"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-emerald-700 shadow-lg shadow-emerald-950/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Calendar className="h-5 w-5" /> Explore Events
            </Link>
            <Link
              href="/create-event"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur transition-colors duration-200 hover:bg-white/20"
            >
              <Star className="h-5 w-5" /> Create Event
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Platform Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to discover and organize social events in one place.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 bg-background rounded-xl border border-border hover:shadow-md transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Recent Upcoming Events</h2>
            <Link href="/upcoming-events" className="text-sm font-medium text-primary hover:underline">View all →</Link>
          </div>
          <RecentEvents />
        </div>
      </section>

      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Community Gallery</h2>
            <p className="text-muted-foreground">Moments from our recent events</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl bg-secondary">
                <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to our newsletter</h2>
          <p className="mb-8 max-w-lg mx-auto text-white/80">Stay updated with the latest events and community gatherings.</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-4 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-white" />
            <button type="submit" className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-primary/90 transition-colors">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
