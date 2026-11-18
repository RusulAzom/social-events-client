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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A61C9] via-[#064089] to-[#07326A] py-20 pb-32 text-white lg:py-28 lg:pb-40">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#F1F7F9]/15 blur-3xl" />
          <div className="absolute -bottom-40 right-0 h-[30rem] w-[30rem] rounded-full bg-[#749DC8]/25 blur-3xl" />
          <div className="absolute top-1/3 left-2/3 h-72 w-72 rounded-full bg-[#0A61C9]/35 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium shadow-lg shadow-[#07326A]/10 backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            Building stronger communities together
          </span>
          <h1 className="mx-auto mb-6 max-w-4xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            Connect with Your Community Through Social Events
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#F1F7F9]/85 md:text-xl">
            Discover, join, and create meaningful social events. From cleanups to plantations, find your next experience today.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/upcoming-events"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F1F7F9] px-8 py-4 text-lg font-semibold text-[#064089] shadow-lg shadow-[#07326A]/25 transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
            >
              <Calendar className="h-5 w-5" /> Explore Events
            </Link>
            <Link
              href="/create-event"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:bg-white/20"
            >
              <Star className="h-5 w-5" /> Create Event
            </Link>
          </div>
        </div>
        <svg aria-hidden="true" className="absolute inset-x-0 bottom-0 z-0 h-16 w-full md:h-24" viewBox="0 0 1440 96" preserveAspectRatio="none">
          <path fill="var(--background)" d="M0 56C205 96 400 96 690 58C970 20 1190 16 1440 62V96H0V56Z" />
        </svg>
      </section>

      <section className="relative overflow-hidden bg-background px-4 pb-28 pt-10 sm:px-6 lg:px-8">
        <div aria-hidden="true" className="absolute -right-24 top-12 h-72 w-72 rounded-full bg-[#749DC8]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-[#0A61C9]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-foreground">Made for community</span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Good things happen together</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">Everything you need to discover and organize social events in one place.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="group rounded-2xl border border-[#749DC8]/30 bg-surface/85 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0A61C9]/35 hover:shadow-xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A61C9]/10 text-[#0A61C9] transition-colors group-hover:bg-[#0A61C9] group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
        <svg aria-hidden="true" className="absolute inset-x-0 bottom-0 h-12 w-full" viewBox="0 0 1440 64" preserveAspectRatio="none">
          <path fill="var(--surface)" d="M0 32C240 62 420 62 720 28C1010 -4 1200 2 1440 34V64H0V32Z" />
        </svg>
      </section>

      <section className="relative overflow-hidden bg-surface px-4 pb-28 pt-16 sm:px-6 lg:px-8">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0A61C9]">
                <span className="h-2 w-2 rounded-full bg-[#0A61C9]" />
                Find your next moment
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Recent upcoming events</h2>
            </div>
            <Link href="/upcoming-events" className="inline-flex w-fit items-center gap-2 rounded-full border border-[#749DC8]/40 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:border-[#0A61C9] hover:bg-[#0A61C9] hover:text-white">
              View all events <span aria-hidden="true">→</span>
            </Link>
          </div>
          <RecentEvents />
        </div>
        <svg aria-hidden="true" className="absolute inset-x-0 bottom-0 h-12 w-full" viewBox="0 0 1440 64" preserveAspectRatio="none">
          <path fill="var(--background)" d="M0 36C220 4 440 4 720 36C990 66 1210 66 1440 30V64H0V36Z" />
        </svg>
      </section>

      <section className="relative overflow-hidden bg-background px-4 pb-32 pt-16 sm:px-6 lg:px-8">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-[#749DC8]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-foreground">A little good goes a long way</span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Community in action</h2>
            <p className="text-muted-foreground">Moments made meaningful, side by side.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((img, idx) => (
              <div key={img} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#749DC8]/20 shadow-md ring-1 ring-[#749DC8]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <Image src={img} alt={`Community event gallery ${idx + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07326A]/75 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                <span className="absolute bottom-4 left-5 text-sm font-semibold text-white">Community moments</span>
                <span className="absolute right-4 top-4 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
        <svg aria-hidden="true" className="absolute inset-x-0 bottom-0 h-12 w-full" viewBox="0 0 1440 64" preserveAspectRatio="none">
          <path fill="#064089" d="M0 34C240 2 450 6 720 38C1000 68 1220 66 1440 26V64H0V34Z" />
        </svg>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#064089] to-[#07326A] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div aria-hidden="true" className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-[#0A61C9]/40 blur-3xl" />
        <div className="relative mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F1F7F9] backdrop-blur">Stay in the loop</span>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Good things are happening near you</h2>
          <p className="mx-auto mb-8 max-w-lg text-[#F1F7F9]/80">Get thoughtful updates on events and community gatherings.</p>
          <form className="mx-auto flex max-w-lg flex-col justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 shadow-xl shadow-[#07326A]/20 backdrop-blur-md sm:flex-row">
            <input type="email" placeholder="Enter your email" aria-label="Email address" className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/95 px-6 py-3.5 text-[#07326A] placeholder:text-[#506F91] focus:outline-none focus:ring-2 focus:ring-[#749DC8]" />
            <button type="submit" className="rounded-full bg-[#0A61C9] px-7 py-3.5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#749DC8] hover:text-[#07326A] hover:shadow-lg">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
