import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PROPERTIES, currency } from "@/lib/data";
import { GoogleMapView } from "@/components/google-map";
import { Search, X, Layers, LocateFixed, Navigation, ShieldCheck, MapPin } from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map View — PlotKart" },
      { name: "description", content: "Explore verified land plots on an interactive Google map with live pricing." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const nav = useNavigate();
  const [q, setQ] = useState("Lucknow, Uttar Pradesh");
  const [activeId, setActiveId] = useState<string | null>(PROPERTIES[0]?.id ?? null);
  const [mapType, setMapType] = useState<"hybrid" | "roadmap" | "satellite" | "terrain">("hybrid");

  const markers = useMemo(
    () => PROPERTIES.map((p) => ({
      id: p.id,
      lat: p.gps.lat,
      lng: p.gps.lng,
      label: `₹${p.price}L`,
      onClick: () => setActiveId(p.id),
    })),
    [],
  );

  const active = PROPERTIES.find((p) => p.id === activeId) ?? PROPERTIES[0];
  const center = active ? { lat: active.gps.lat, lng: active.gps.lng } : { lat: 26.85, lng: 80.95 };

  return (
    <div className="fixed inset-0 top-16 md:static md:h-[calc(100vh-4rem)] md:mt-0">
      <div className="relative size-full">
        <GoogleMapView center={center} zoom={11} markers={markers} mapType={mapType} className="size-full" />

        {/* Search overlay */}
        <div className="absolute top-3 left-3 right-3 md:left-6 md:right-auto md:w-96">
          <div className="glass rounded-full h-12 px-4 flex items-center gap-2 shadow-lift">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search city, village…"
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {q && <button onClick={() => setQ("")}><X className="size-4 text-muted-foreground"/></button>}
          </div>
        </div>

        {/* Right controls */}
        <div className="absolute top-20 right-3 flex flex-col gap-2">
          <MapBtn onClick={() => setMapType(mapType === "hybrid" ? "roadmap" : "hybrid")} label="Layers"><Layers className="size-5"/></MapBtn>
          <MapBtn onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((pos) => {
                const nearest = PROPERTIES.reduce((best, p) => {
                  const d = Math.hypot(p.gps.lat - pos.coords.latitude, p.gps.lng - pos.coords.longitude);
                  return d < best.d ? { d, id: p.id } : best;
                }, { d: Infinity, id: PROPERTIES[0]?.id });
                if (nearest.id) setActiveId(nearest.id);
              });
            }
          }} label="My location"><LocateFixed className="size-5"/></MapBtn>
          <MapBtn label="Navigate"><Navigation className="size-5"/></MapBtn>
        </div>

        {/* Bottom card */}
        {active && (
          <button
            onClick={() => nav({ to: "/property/$id", params: { id: active.id } })}
            className="absolute bottom-24 md:bottom-6 left-3 right-3 md:left-6 md:right-auto md:w-[420px] glass rounded-2xl p-3 shadow-lift text-left hover:bg-white/95 transition"
          >
            <div className="flex gap-3">
              <img src={active.image} alt="" className="size-20 rounded-xl object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="font-medium truncate">{active.title}</div>
                  {active.verified && <ShieldCheck className="size-3.5 text-verified shrink-0"/>}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="size-3"/> {active.location.village}, {active.location.city}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{active.area} acres</div>
                <div className="mt-1 font-semibold">{currency(active.price)}</div>
              </div>
            </div>
          </button>
        )}

        {/* Price chips overlay hint (mobile) */}
        <div className="hidden">{q}</div>
      </div>
    </div>
  );
}

function MapBtn({ children, onClick, label }: { children: React.ReactNode; onClick?: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="size-11 rounded-full glass shadow-lift grid place-items-center hover:bg-white/95 transition"
    >
      {children}
    </button>
  );
}
