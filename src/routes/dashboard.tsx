import { createFileRoute, Link } from "@tanstack/react-router";
import { PROPERTIES, currency } from "@/lib/data";
import { Eye, Heart, MessageCircle, Plus, TrendingUp, Users, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Seller Dashboard — Terra" }] }),
  component: Dashboard,
});

function Dashboard() {
  const mine = PROPERTIES.slice(0, 3);
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl">Seller dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage listings, leads, and analytics — all in one place.</p>
        </div>
        <Link to="/post" className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 shadow-glow">
          <Plus className="size-4"/> Post new listing
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KPI icon={<Eye className="size-5"/>} label="Total views" value="12,438" delta="+18%" />
        <KPI icon={<Users className="size-5"/>} label="Leads" value="86" delta="+9" />
        <KPI icon={<Heart className="size-5"/>} label="Favorites" value="214" delta="+22" />
        <KPI icon={<TrendingUp className="size-5"/>} label="Est. portfolio" value="₹6.4 Cr" delta="+4.2%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 rounded-3xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">My listings</h2>
            <span className="text-xs text-muted-foreground">{mine.length} active</span>
          </div>
          <div className="divide-y divide-border">
            {mine.map((p) => (
              <Link key={p.id} to="/property/$id" params={{id:p.id}} className="flex items-center gap-4 py-4 hover:bg-secondary/40 rounded-xl px-2 -mx-2 transition">
                <img src={p.image} alt="" className="size-16 rounded-xl object-cover"/>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.location.city} · {p.area} acres</div>
                </div>
                <div className="hidden sm:block text-right">
                  <div className="font-semibold">{currency(p.price)}</div>
                  <div className="text-xs text-muted-foreground">{p.postedDaysAgo}d ago</div>
                </div>
                <div className="text-xs text-verified">Live</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl p-6 text-primary-foreground relative overflow-hidden" style={{background:"var(--gradient-hero)"}}>
          <div className="absolute -bottom-16 -right-10 size-52 rounded-full bg-white/10 blur-3xl"/>
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs mb-3"><Sparkles className="size-3.5"/> AI recommendation</div>
            <h3 className="font-display text-2xl leading-tight">Promote your Sarjapur plot to reach 3× more buyers this week.</h3>
            <p className="text-sm opacity-90 mt-2">Based on view velocity and search demand in your area.</p>
            <button className="mt-5 h-11 px-5 rounded-full bg-white text-primary font-medium hover:bg-white/90">Promote for ₹499</button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border p-6 mt-6">
        <h2 className="font-display text-2xl mb-4">Recent chat requests</h2>
        <div className="space-y-3">
          {["Rohan wants to visit your Devanahalli plot on Saturday","Sneha asked about loan eligibility for MIHAN commercial land","Karan made an offer of ₹78 L on your Wagholi plot"].map((m, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-secondary/40 p-4">
              <div className="size-9 rounded-full bg-primary/10 text-primary grid place-items-center"><MessageCircle className="size-4"/></div>
              <div className="text-sm flex-1">{m}</div>
              <button className="text-xs rounded-full border border-border px-3 py-1.5 hover:bg-background">Reply</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPI({ icon, label, value, delta }: { icon: React.ReactNode; label: string; value: string; delta: string }) {
  return (
    <div className="glass rounded-2xl p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center">{icon}</div>
        <span className="text-xs text-verified">{delta}</span>
      </div>
      <div className="font-display text-3xl mt-3">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
