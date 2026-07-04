import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PROPERTIES, CATEGORIES, type Category } from "@/lib/data";
import { PropertyCard } from "@/components/property-card";
import { SlidersHorizontal, ShieldCheck, Search, X } from "lucide-react";

type BrowseSearch = { category?: Category };

export const Route = createFileRoute("/browse")({
  validateSearch: (s: Record<string, unknown>): BrowseSearch => ({
    category: (s.category as Category) ?? undefined,
  }),
  head: () => ({
    meta: [
      { title: "Browse Land — Terra" },
      { name: "description", content: "Filter and browse verified land plots by category, location, budget, and amenities." },
    ],
  }),
  component: Browse,
});

function Browse() {
  const { category } = Route.useSearch();
  const [cat, setCat] = useState<Category | "All">(category ?? "All");
  const [q, setQ] = useState("");
  const [maxPrice, setMaxPrice] = useState(500);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [loanOnly, setLoanOnly] = useState(false);

  const results = useMemo(
    () => PROPERTIES.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (verifiedOnly && !p.verified) return false;
      if (loanOnly && !p.loanAvailable) return false;
      if (p.price > maxPrice) return false;
      if (q && !(p.title + p.location.city + p.location.state).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    }),
    [cat, q, maxPrice, verifiedOnly, loanOnly],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-4xl">Find your land</h1>
        <p className="text-muted-foreground text-sm mt-1">{results.length} verified listings match your filters</p>
      </div>

      {/* search + chips */}
      <div className="glass rounded-2xl p-3 mb-6 shadow-soft">
        <div className="flex items-center gap-2 h-11 px-4 rounded-xl bg-background border border-border">
          <Search className="size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search city, village, or state…" className="flex-1 bg-transparent outline-none text-sm" />
          {q && <button onClick={() => setQ("")}><X className="size-4 text-muted-foreground"/></button>}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <Chip active={cat === "All"} onClick={() => setCat("All")}>All</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.key} active={cat === c.key} onClick={() => setCat(c.key)}>
              <span className="mr-1">{c.icon}</span>{c.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* filters */}
        <aside className="glass rounded-2xl p-5 h-fit sticky top-24 shadow-soft">
          <div className="flex items-center gap-2 font-semibold mb-4"><SlidersHorizontal className="size-4"/> Filters</div>

          <div className="mb-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Max budget</div>
            <input type="range" min={10} max={500} step={5} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-primary" />
            <div className="text-sm mt-1">Up to ₹{maxPrice} L</div>
          </div>

          <Toggle label="Verified only" icon={<ShieldCheck className="size-4"/>} checked={verifiedOnly} onChange={setVerifiedOnly} />
          <Toggle label="Loan available" checked={loanOnly} onChange={setLoanOnly} />

          <div className="mt-6 text-xs text-muted-foreground">
            Additional filters — state, district, area, road connectivity, soil type, ownership, water, electricity — available on request.
          </div>
        </aside>

        {/* results */}
        <div className="grid gap-6 md:grid-cols-2">
          {results.map((p) => <PropertyCard key={p.id} p={p} />)}
          {results.length === 0 && (
            <div className="col-span-full glass rounded-2xl p-10 text-center">
              <div className="font-display text-2xl">No plots match</div>
              <p className="text-sm text-muted-foreground mt-1">Try widening your budget or clearing filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-1.5 text-sm border transition ${active ? "bg-primary text-primary-foreground border-primary shadow-glow" : "bg-background border-border hover:bg-secondary"}`}
    >
      {children}
    </button>
  );
}

function Toggle({ label, icon, checked, onChange }: { label: string; icon?: React.ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <span className="text-sm flex items-center gap-2">{icon}{label}</span>
      <span className={`relative w-10 h-6 rounded-full transition ${checked ? "bg-primary" : "bg-secondary"}`}>
        <span className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition ${checked ? "translate-x-4" : ""}`}></span>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      </span>
    </label>
  );
}
