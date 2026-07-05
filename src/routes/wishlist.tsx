import { createFileRoute } from "@tanstack/react-router";
import { PROPERTIES } from "@/lib/data";
import { PropertyCard } from "@/components/property-card";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — PlotKart" }] }),
  component: Wishlist,
});

function Wishlist() {
  const saved = PROPERTIES.slice(0, 3);
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-11 rounded-2xl bg-primary/10 text-primary grid place-items-center"><Heart className="size-5"/></div>
        <div>
          <h1 className="font-display text-4xl">Your wishlist</h1>
          <p className="text-muted-foreground text-sm">Compare, revisit, and get alerts when prices change.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {saved.map((p) => <PropertyCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
