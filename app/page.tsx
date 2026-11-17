import Link from "next/link";
import { Star, Users, MapPin, Calendar, Shield, Heart } from "lucide-react";
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
      <section className="relative bg-primary text-white overflow-hidden py-20 lg:py-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Connect with Your Community Through Social Events
          </h1>
          <p className="text-lg md:text-xl text-primary-50 mb-8 max-w-2xl mx-auto">
            Discover, join, and create meaningful social events. From cleanups to plantations, find your next experience today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upcoming-events" className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5" /> Explore Events
            </Link>
            <Link href="/create-event" className="border border-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
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
          <div className="grid md:grid-cols-3 gap-6">
            <RecentEvents />
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Community Gallery</h2>
            <p className="text-muted-foreground">Moments from our recent events</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="relative aspect-square bg-secondary rounded-lg overflow-hidden">
                <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to our newsletter</h2>
          <p className="text-primary-50 mb-8 max-w-lg mx-auto">Stay updated with the latest events and community gatherings.</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-4 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-white" />
            <button type="submit" className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-primary/90 transition-colors">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
