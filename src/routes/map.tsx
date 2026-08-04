import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PROPERTIES, CATEGORIES, currency, type Category } from "@/lib/data";
import { GoogleMapView } from "@/components/google-map";
import { PlaceSearch } from "@/components/place-search";
import { X, Layers, LocateFixed, SlidersHorizontal, ShieldCheck, MapPin } from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map View — PlotKart" },
      { name: "description", content: "Explore verified land plots on an interactive Google map with filters, place search and live pricing." },
      { property: "og:title", content: "Map View — PlotKart" },
      { property: "og:description", content: "Filter land by category, price, area and verification, then explore it on the map." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

const MAX_PRICE = 500;
const MAX_AREA = 20;

function MapPage() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [center, setCenter] = useState({ lat: 26.85, lng: 80.95 });
  const [zoom, setZoom] = useState(6);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mapType, setMapType] = useState<"hybrid" | "roadmap" | "satellite" | "terrain">("hybrid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [cats, setCats] = useState<Category[]>([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [minArea, setMinArea] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = useMemo(
    () =>
      PROPERTIES.filter(
        (p) =>
          (cats.length === 0 || cats.includes(p.category)) &&
          p.price <= maxPrice &&
          p.area >= minArea &&
          (!verifiedOnly || p.verified),
      ),
    [cats, maxPrice, minArea, verifiedOnly],
  );

  const markers = useMemo(
    () =>
      filtered.map((p) => ({
        id: p.id,
        lat: p.gps.lat,
        lng: p.gps.lng,
        label: `₹${p.price}L`,
        active: p.id === activeId,
        onClick: () => setActiveId(p.id),
      })),
    [filtered, activeId],
  );

  const active = filtered.find((p) => p.id === activeId) ?? null;
  const activeFilterCount =
    (cats.length ? 1 : 0) + (maxPrice < MAX_PRICE ? 1 : 0) + (minArea > 0 ? 1 : 0) + (verifiedOnly ? 1 : 0);

  function reset() {
    setCats([]);
    setMaxPrice(MAX_PRICE);
    setMinArea(0);
    setVerifiedOnly(false);
  }

  return (
    <div className="fixed inset-x-0 top-16 bottom-16 md:bottom-0 md:static md:h-[calc(100dvh-4rem)]">
      <div className="relative size-full overflow-hidden">
        <GoogleMapView
          center={center}
          zoom={zoom}
          markers={markers}
          mapType={mapType}
          className="size-full"
        />

        {/* Top bar: search + filter toggle */}
        <div className="absolute top-2 left-2 right-2 md:left-6 md:right-auto md:w-[26rem] z-10 flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <PlaceSearch
              value={q}
              onChange={setQ}
              onPick={(p) => {
                setCenter({ lat: p.lat, lng: p.lng });
                setZoom(12);
              }}
            />
          </div>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            aria-label="Filters"
            className="relative size-11 shrink-0 rounded-full glass shadow-lift grid place-items-center hover:bg-white/95 transition"
          >
            <SlidersHorizontal className="size-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 size-5 rounded-full bg-primary text-primary-foreground text-[10px] grid place-items-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Right controls — anchored under the search bar, never below the card */}
        <div className="absolute top-16 right-2 z-10 flex flex-col gap-2">
          <MapBtn onClick={() => setMapType(mapType === "hybrid" ? "roadmap" : "hybrid")} label="Layers">
            <Layers className="size-5" />
          </MapBtn>
          <MapBtn
            label="My location"
            onClick={() => {
              if (!navigator.geolocation) return;
              navigator.geolocation.getCurrentPosition((pos) => {
                setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setZoom(12);
              });
            }}
          >
            <LocateFixed className="size-5" />
          </MapBtn>
        </div>

        {/* Result count chip */}
        <div className="absolute top-16 left-2 md:left-6 z-10 rounded-full glass px-3 py-1.5 text-xs shadow-lift">
          {filtered.length} plot{filtered.length === 1 ? "" : "s"}
        </div>

        {/* Filters sheet */}
        {filtersOpen && (
          <div className="absolute inset-x-2 top-2 md:left-6 md:right-auto md:w-[26rem] z-20 glass rounded-3xl shadow-lift p-4 max-h-[calc(100%-1rem)] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">Filters</div>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>

            <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Category</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map((c) => {
                const on = cats.includes(c.key);
                return (
                  <button
                    key={c.key}
                    onClick={() => setCats(on ? cats.filter((k) => k !== c.key) : [...cats, c.key])}
                    className={`rounded-full px-3 py-1.5 text-xs border transition ${on ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}
                  >
                    {c.icon} {c.key}
                  </button>
                );
              })}
            </div>

            <SliderRow
              label="Max price"
              display={maxPrice >= MAX_PRICE ? "Any" : `₹${maxPrice} L`}
              value={maxPrice}
              min={5}
              max={MAX_PRICE}
              step={5}
              onChange={setMaxPrice}
            />
            <SliderRow
              label="Min area"
              display={minArea === 0 ? "Any" : `${minArea} acres`}
              value={minArea}
              min={0}
              max={MAX_AREA}
              step={0.25}
              onChange={setMinArea}
            />

            <label className="flex items-center justify-between py-2">
              <span className="text-sm inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-verified" /> Verified only
              </span>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="size-4 accent-[#22C55E]"
              />
            </label>

            <div className="flex gap-2 pt-3">
              <button onClick={reset} className="flex-1 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">
                Reset
              </button>
              <button
                onClick={() => setFiltersOpen(false)}
                className="flex-1 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
              >
                Show {filtered.length}
              </button>
            </div>
          </div>
        )}

        {/* Bottom preview card — sits inside the map area, above the bottom nav */}
        {active && !filtersOpen && (
          <div className="absolute bottom-2 left-2 right-2 md:left-6 md:right-auto md:w-[26rem] z-10">
            <div className="glass rounded-2xl p-2.5 shadow-lift relative">
              <button
                onClick={() => setActiveId(null)}
                aria-label="Close preview"
                className="absolute top-2 right-2 size-6 rounded-full bg-background/70 grid place-items-center"
              >
                <X className="size-3.5" />
              </button>
              <button
                onClick={() => nav({ to: "/property/$id", params: { id: active.id } })}
                className="flex gap-3 text-left w-full"
              >
                <img src={active.image} alt="" className="size-16 rounded-xl object-cover shrink-0" />
                <div className="min-w-0 flex-1 pr-6">
                  <div className="flex items-center gap-1.5">
                    <div className="font-medium truncate text-sm">{active.title}</div>
                    {active.verified && <ShieldCheck className="size-3.5 text-verified shrink-0" />}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="size-3" /> {active.location.village}, {active.location.city}
                  </div>
                  <div className="mt-0.5 text-sm font-semibold">
                    {currency(active.price)} <span className="text-xs font-normal text-muted-foreground">· {active.area} acres</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SliderRow({
  label, display, value, min, max, step, onChange,
}: { label: string; display: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="font-medium">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#22C55E]"
      />
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
