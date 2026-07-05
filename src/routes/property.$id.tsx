import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PROPERTIES, currency } from "@/lib/data";
import { PropertyCard } from "@/components/property-card";
import { useState } from "react";
import { MapPin, ShieldCheck, Phone, MessageCircle, Calendar, Heart, Share2, Droplets, Zap, Route as RoadIcon, FileCheck, Sparkles, TrendingUp, Calculator, Camera, Compass, Video, Play } from "lucide-react";

export const Route = createFileRoute("/property/$id")({
  loader: ({ params }) => {
    const p = PROPERTIES.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { property: p };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.property.title} — PlotKart` },
          { name: "description", content: loaderData.property.description },
          { property: "og:title", content: loaderData.property.title },
          { property: "og:description", content: loaderData.property.description },
          { property: "og:image", content: loaderData.property.image },
        ]
      : [{ title: "Property — PlotKart" }],
  }),
  component: PropertyPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="font-display text-5xl">Not found</div>
      <p className="text-muted-foreground mt-2">This listing may have been sold.</p>
      <Link to="/browse" className="mt-6 inline-block rounded-full bg-primary text-primary-foreground px-5 py-2.5">Browse listings</Link>
    </div>
  ),
  errorComponent: () => <div className="p-12 text-center">Failed to load property.</div>,
});

function PropertyPage() {
  const { property: p } = Route.useLoaderData();
  const similar = PROPERTIES.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 3);
  const monthlyEmi = Math.round((p.price * 100000 * 0.8 * 0.009 * Math.pow(1.009, 240)) / (Math.pow(1.009, 240) - 1));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      {/* gallery */}
      <div className="grid md:grid-cols-4 gap-2 rounded-3xl overflow-hidden">
        <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto">
          <img src={p.image} alt={p.title} className="size-full object-cover" width={1600} height={1200} />
        </div>
        {p.gallery.slice(0, 4).map((g: string, i: number) => (
          <div key={i} className="hidden md:block relative aspect-square">
            <img src={g} alt="" className="size-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4"/> {p.location.village}, {p.location.city}, {p.location.state}
          </div>
          <h1 className="font-display text-4xl md:text-5xl mt-2 leading-tight">{p.title}</h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {p.verified && <Badge className="bg-verified text-primary-foreground"><ShieldCheck className="size-3"/> Verified</Badge>}
            <Badge>{p.category}</Badge>
            <Badge>{p.ownership}</Badge>
            <Badge>Registry: {p.registryStatus}</Badge>
            {p.negotiable && <Badge>Negotiable</Badge>}
            {p.loanAvailable && <Badge>Loan available</Badge>}
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Total area" value={`${p.area} acres`} />
            <Stat label="Price" value={currency(p.price)} />
            <Stat label="Per acre" value={currency(p.pricePerAcre)} />
            <Stat label="AI Score" value={`${p.aiScore}/100`} />
          </div>

          {/* AI valuation */}
          <div className="mt-8 rounded-3xl p-6 md:p-8 text-primary-foreground relative overflow-hidden" style={{background:"var(--gradient-hero)"}}>
            <div className="absolute -top-16 -right-10 size-64 rounded-full bg-white/10 blur-3xl"/>
            <div className="relative flex items-start gap-4">
              <div className="size-11 rounded-2xl bg-white/15 grid place-items-center shrink-0"><Sparkles className="size-5"/></div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-widest opacity-80">PlotKart AI Valuation</div>
                <div className="font-display text-3xl mt-1">Fair price: {currency(Math.round(p.price * 0.98))} – {currency(Math.round(p.price * 1.08))}</div>
                <p className="text-sm opacity-90 mt-2">This listing is priced within fair range. Expected 12-month appreciation: <b>+{Math.round(p.aiScore/8)}%</b> based on infrastructure, comparables, and demand.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Fraud check passed</span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Docs verified</span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs inline-flex items-center gap-1"><TrendingUp className="size-3"/> Trending {p.trend}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities & specs */}
          <h2 className="font-display text-2xl mt-10 mb-3">About this land</h2>
          <p className="text-muted-foreground leading-relaxed">{p.description}</p>

          <h3 className="font-semibold mt-8 mb-3">Land features</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Spec icon={<RoadIcon className="size-4"/>} label="Road" value={p.road} />
            <Spec icon={<Droplets className="size-4"/>} label="Water" value={p.water ? "Available" : "No"} />
            <Spec icon={<Zap className="size-4"/>} label="Electricity" value={p.electricity ? "Available" : "No"} />
            <Spec icon={<FileCheck className="size-4"/>} label="Ownership" value={p.ownership} />
          </div>

          <h3 className="font-semibold mt-8 mb-3">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {p.amenities.map((a: string) => <Badge key={a}>{a}</Badge>)}
          </div>

          {/* Map placeholder */}
          <h3 className="font-semibold mt-10 mb-3">Location & surroundings</h3>
          <div className="relative rounded-3xl overflow-hidden aspect-[16/9] border border-border">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent to-earth/10" />
            <svg className="absolute inset-0 size-full opacity-40" viewBox="0 0 800 400">
              <path d="M0,200 Q200,100 400,220 T800,180" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary"/>
              <path d="M0,280 Q300,240 500,300 T800,260" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-earth"/>
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float">
              <div className="size-14 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-glow">
                <MapPin className="size-6"/>
              </div>
              <div className="mt-2 text-xs text-center font-medium">{p.location.village}</div>
            </div>
            <div className="absolute bottom-3 left-3 glass rounded-xl px-3 py-2 text-xs">
              GPS: {p.gps.lat.toFixed(4)}, {p.gps.lng.toFixed(4)}
            </div>
          </div>

          {/* EMI */}
          <div className="mt-8 rounded-2xl border border-border p-6 flex items-center gap-4">
            <div className="size-11 rounded-xl bg-primary/10 text-primary grid place-items-center"><Calculator className="size-5"/></div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Estimated EMI (80% loan, 20 yr, 10.8%)</div>
              <div className="font-display text-2xl">₹ {monthlyEmi.toLocaleString("en-IN")} / month</div>
            </div>
            <Link to="/ai" className="rounded-full border border-input px-4 py-2 text-sm hover:bg-accent">Check eligibility</Link>
          </div>

          {/* Similar */}
          <h2 className="font-display text-2xl mt-14 mb-4">Similar land nearby</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {similar.map((s) => <PropertyCard key={s.id} p={s} />)}
          </div>
        </div>

        {/* Sticky sidebar */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          <div className="glass rounded-3xl p-6 shadow-lift">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Asking price</div>
            <div className="font-display text-4xl mt-1">{currency(p.price)}</div>
            <div className="text-sm text-muted-foreground">{currency(p.pricePerAcre)} per acre</div>

            <div className="mt-5 space-y-2">
              <button className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 shadow-glow inline-flex items-center justify-center gap-2">
                <Calendar className="size-4"/> Schedule a visit
              </button>
              <button className="w-full h-12 rounded-full border border-border hover:bg-secondary font-medium inline-flex items-center justify-center gap-2">
                <MessageCircle className="size-4"/> Chat with seller
              </button>
              <div className="grid grid-cols-3 gap-2">
                <IconBtn><Phone className="size-4"/></IconBtn>
                <IconBtn><Heart className="size-4"/></IconBtn>
                <IconBtn><Share2 className="size-4"/></IconBtn>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-4 flex items-center gap-3">
              <div className="size-11 rounded-full bg-gradient-to-br from-primary to-earth grid place-items-center text-primary-foreground font-semibold">
                {p.seller.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium flex items-center gap-1 truncate">
                  {p.seller.name}
                  {p.seller.verified && <ShieldCheck className="size-3.5 text-verified"/>}
                </div>
                <div className="text-xs text-muted-foreground">★ {p.seller.rating} · {p.seller.deals} deals closed</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border p-5">
            <div className="text-sm font-semibold mb-2 flex items-center gap-2"><Sparkles className="size-4 text-primary"/> Make an offer</div>
            <p className="text-xs text-muted-foreground mb-3">Sellers respond within 24 hours on average.</p>
            <div className="flex gap-2">
              <input placeholder="Your offer (₹ L)" className="flex-1 h-10 rounded-full border border-border px-4 text-sm bg-background outline-none focus:ring-2 focus:ring-primary/40"/>
              <button className="h-10 px-4 rounded-full bg-earth text-primary-foreground text-sm font-medium hover:opacity-90">Send</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground px-2.5 py-1 text-xs font-medium ${className}`}>{children}</span>;
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-xl mt-1">{value}</div>
    </div>
  );
}
function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary/50 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon} {label}</div>
      <div className="text-sm font-medium mt-1">{value}</div>
    </div>
  );
}
function IconBtn({ children }: { children: React.ReactNode }) {
  return <button className="h-10 rounded-full border border-border hover:bg-secondary grid place-items-center">{children}</button>;
}
