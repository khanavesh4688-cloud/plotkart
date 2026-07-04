import { Link } from "@tanstack/react-router";
import { MapPin, TrendingUp, ShieldCheck, Landmark, Heart } from "lucide-react";
import type { Property } from "@/lib/data";
import { currency } from "@/lib/data";

export function PropertyCard({ p, className = "" }: { p: Property; className?: string }) {
  return (
    <Link
      to="/property/$id"
      params={{ id: p.id }}
      className={`group relative block rounded-3xl overflow-hidden bg-card shadow-soft hover:shadow-lift transition-all duration-500 hover:-translate-y-1 ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          width={1200}
          height={900}
          className="size-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex gap-2">
          <span className="glass text-[11px] font-medium px-2.5 py-1 rounded-full">{p.category}</span>
          {p.verified && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-verified/90 text-primary-foreground">
              <ShieldCheck className="size-3" /> Verified
            </span>
          )}
        </div>
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 size-9 rounded-full glass grid place-items-center hover:bg-white/90 transition"
          aria-label="Save"
        >
          <Heart className="size-4" />
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <div className="text-xs opacity-90 flex items-center gap-1">
              <MapPin className="size-3" /> {p.location.city}, {p.location.state}
            </div>
            <div className="font-display text-xl leading-tight mt-1 line-clamp-1">{p.title}</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-2xl font-semibold tracking-tight">{currency(p.price)}</div>
          <div className="text-xs text-muted-foreground">{p.area} {p.area < 1 ? "acre" : "acres"}</div>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{currency(p.pricePerAcre)}/acre</span>
          {p.negotiable && <span>· Negotiable</span>}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 text-xs">
            <div className="size-6 rounded-full bg-gradient-to-br from-primary to-earth grid place-items-center text-primary-foreground text-[10px]">
              <Landmark className="size-3" />
            </div>
            <span className="text-muted-foreground">AI Score</span>
            <span className="font-semibold">{p.aiScore}</span>
          </div>
          <div className="inline-flex items-center gap-1 text-xs text-verified">
            <TrendingUp className="size-3" /> {p.trend === "up" ? "Trending up" : p.trend === "flat" ? "Stable" : "Cooling"}
          </div>
        </div>
      </div>
    </Link>
  );
}
