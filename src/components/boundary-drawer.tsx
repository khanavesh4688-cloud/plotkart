import { useState } from "react";
import { GoogleMapView, polygonAreaAcres } from "./google-map";
import { PlaceSearch } from "./place-search";
import { Undo2, Trash2, Check, Pencil } from "lucide-react";

type LatLng = { lat: number; lng: number };

export function BoundaryDrawer({
  path,
  onChange,
  onAreaChange,
}: {
  path: LatLng[];
  onChange: (p: LatLng[]) => void;
  onAreaChange?: (acres: number) => void;
}) {
  const [center, setCenter] = useState<LatLng>({ lat: 20.59, lng: 78.96 });
  const [zoom, setZoom] = useState(5);
  const [q, setQ] = useState("");
  const [drawing, setDrawing] = useState(true);

  const acres = polygonAreaAcres(path);

  function update(next: LatLng[]) {
    onChange(next);
    onAreaChange?.(polygonAreaAcres(next));
  }

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className="p-3 border-b border-border space-y-2">
        <PlaceSearch
          value={q}
          onChange={setQ}
          onPick={(p) => {
            setCenter({ lat: p.lat, lng: p.lng });
            setZoom(16);
          }}
          placeholder="Find your plot location…"
        />
        <p className="text-[11px] text-muted-foreground">
          Search the location, then tap the map to drop boundary corners. Close the shape by adding 3+ points.
        </p>
      </div>

      <div className="relative h-[280px] sm:h-[340px]">
        <GoogleMapView
          center={center}
          zoom={zoom}
          mapType="hybrid"
          drawing={drawing}
          polygon={path}
          markers={path.map((p, i) => ({ ...p, id: String(i) }))}
          onMapClick={(p) => drawing && update([...path, p])}
          className="size-full"
        />
        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawing((d) => !d)}
            className={`rounded-full px-3 py-1.5 text-xs shadow-lift inline-flex items-center gap-1.5 ${drawing ? "bg-primary text-primary-foreground" : "glass"}`}
          >
            {drawing ? <Check className="size-3.5" /> : <Pencil className="size-3.5" />}
            {drawing ? "Drawing" : "Draw boundary"}
          </button>
          <button
            type="button"
            onClick={() => update(path.slice(0, -1))}
            disabled={!path.length}
            className="rounded-full glass px-3 py-1.5 text-xs shadow-lift inline-flex items-center gap-1.5 disabled:opacity-40"
          >
            <Undo2 className="size-3.5" /> Undo
          </button>
          <button
            type="button"
            onClick={() => update([])}
            disabled={!path.length}
            className="rounded-full glass px-3 py-1.5 text-xs shadow-lift inline-flex items-center gap-1.5 disabled:opacity-40"
          >
            <Trash2 className="size-3.5" /> Clear
          </button>
          {path.length >= 3 && (
            <span className="ml-auto rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs shadow-lift">
              ≈ {acres.toFixed(2)} acres
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
