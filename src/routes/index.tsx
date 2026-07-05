import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, PROPERTIES, TRENDING_LOCATIONS, hero } from "@/lib/data";
import { PropertyCard } from "@/components/property-card";
import { Search, Sparkles, ShieldCheck, TrendingUp, MapPin, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const featured = PROPERTIES.slice(0, 3);
  const nearby = PROPERTIES.slice(2, 6);
  const recent = [...PROPERTIES].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo).slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="Aerial land" width={1920} height={1280} className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-32 md:pt-32 md:pb-48">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-white/95 mb-6">
              <Sparkles className="size-3.5" /> AI-verified listings across India
            </div>
            <h1 className="font-display text-white text-5xl md:text-7xl leading-[0.95]">
              The land you've been<br/><em className="not-italic text-gradient-hero bg-clip-text" style={{background:"linear-gradient(120deg, #f7d381, #ffb46b)", WebkitBackgroundClip:"text", color:"transparent"}}>looking for.</em>
            </h1>
            <p className="mt-5 text-white/85 text-lg max-w-xl">
              Verified plots, transparent pricing, and AI-guided decisions — from a 2-guntha residential plot to 100-acre farmlands.
            </p>
          </div>

          {/* Search card */}
          <div className="relative mt-10 md:mt-14 animate-fade-up" style={{animationDelay:"120ms"}}>
            <div className="glass rounded-3xl p-3 md:p-4 shadow-lift">
              <div className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-2">
                <SearchField icon={<MapPin className="size-4" />} label="Location" placeholder="City, village or district" />
                <SearchField label="Category" placeholder="Any land type" />
                <SearchField label="Budget" placeholder="₹10L – ₹5 Cr" />
                <Link to="/browse" className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition shadow-glow">
                  <Search className="size-4" /> Search
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl text-white">
            <Stat value="12,400+" label="Verified plots" />
            <Stat value="₹1,800 Cr" label="Transactions" />
            <Stat value="4.9★" label="Buyer rating" />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <Section title="Browse by category" subtitle="Every kind of land, one marketplace">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to="/browse"
              search={{ category: c.key }}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-soft hover:shadow-lift transition-all hover:-translate-y-1"
            >
              <img src={c.image} alt={c.label} loading="lazy" width={800} height={1000} className="size-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-2xl">{c.icon}</div>
                <div className="font-medium text-sm mt-1 leading-tight">{c.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* FEATURED */}
      <Section
        title="Featured properties"
        subtitle="Hand-picked and verified by our land experts"
        action={<Link to="/browse" className="text-sm inline-flex items-center gap-1 text-primary hover:gap-2 transition-all">View all <ArrowRight className="size-4" /></Link>}
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <PropertyCard key={p.id} p={p} />)}
        </div>
      </Section>

      {/* AI banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 my-20">
        <div className="relative overflow-hidden rounded-[2rem] p-8 md:p-14" style={{background:"var(--gradient-hero)"}}>
          <div className="absolute -top-20 -right-20 size-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 size-72 rounded-full bg-gold/30 blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center text-primary-foreground">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs mb-4">
                <Sparkles className="size-3.5" /> PlotKart AI
              </div>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">Know what your land is really worth.</h2>
              <p className="mt-4 opacity-90 max-w-lg">Our AI benchmarks against 50,000+ recent transactions, road connectivity, upcoming infrastructure, and soil data to give you a fair valuation in seconds.</p>
              <Link to="/ai" className="mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-full bg-white text-primary font-medium hover:bg-white/90 transition">
                <Sparkles className="size-4" /> Try AI Valuation
              </Link>
            </div>
            <div className="glass rounded-2xl p-5 text-foreground bg-white/95">
              <div className="text-xs text-muted-foreground">Estimated value</div>
              <div className="font-display text-4xl mt-1">₹ 84.2 L</div>
              <div className="mt-1 text-xs text-verified inline-flex items-center gap-1"><TrendingUp className="size-3"/> +12% expected in 12 months</div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[["Location","A+"],["Access","A"],["Docs","A+"]].map(([k,v]) => (
                  <div key={k} className="rounded-xl bg-secondary py-2">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{k}</div>
                    <div className="font-semibold">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEARBY */}
      <Section title="Nearby to you" subtitle="Based on your last known location">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {nearby.map((p) => <PropertyCard key={p.id} p={p} />)}
        </div>
      </Section>

      {/* TRENDING LOCATIONS */}
      <Section title="Trending locations" subtitle="Where investors are looking this month">
        <div className="flex flex-wrap gap-2">
          {TRENDING_LOCATIONS.map((loc) => (
            <Link key={loc} to="/browse" className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm hover:bg-secondary transition">
              <TrendingUp className="size-3.5 text-verified" /> {loc}
            </Link>
          ))}
        </div>
      </Section>

      {/* RECENT */}
      <Section title="Recently added" subtitle="Fresh listings from verified sellers">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {recent.map((p) => <PropertyCard key={p.id} p={p} />)}
        </div>
      </Section>

      {/* TRUST */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 my-24">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {icon:<ShieldCheck className="size-6" />, t:"Verified titles", d:"Every listing screened for ownership, encumbrance, and registry status."},
            {icon:<Sparkles className="size-6" />, t:"AI fraud detection", d:"Duplicate listings, price anomalies, and mismatched documents caught automatically."},
            {icon:<TrendingUp className="size-6" />, t:"Fair pricing", d:"Benchmark against 50k+ recent deals — no more overpaying for land."},
          ].map((f) => (
            <div key={f.t} className="glass rounded-2xl p-6 shadow-soft">
              <div className="size-11 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4">{f.icon}</div>
              <div className="font-semibold text-lg">{f.t}</div>
              <p className="text-sm text-muted-foreground mt-1">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Section({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 my-16">
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl md:text-4xl">{value}</div>
      <div className="text-xs uppercase tracking-widest opacity-80">{label}</div>
    </div>
  );
}

function SearchField({ icon, label, placeholder }: { icon?: React.ReactNode; label: string; placeholder: string }) {
  return (
    <label className="flex flex-col justify-center rounded-2xl bg-background/80 px-4 h-12 border border-border/50">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2 text-sm text-foreground/80">
        {icon}{placeholder}
      </span>
    </label>
  );
}
