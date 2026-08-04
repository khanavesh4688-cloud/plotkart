import { useEffect, useRef, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { loadMapsScript } from "./google-map";

type Result = { id: string; text: string };

export function PlaceSearch({
  value,
  onChange,
  onPick,
  placeholder = "Search city, district, village…",
}: {
  value: string;
  onChange: (v: string) => void;
  onPick: (p: { lat: number; lng: number; name: string }) => void;
  placeholder?: string;
}) {
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const tokenRef = useRef<any>(null);
  const predRef = useRef<Record<string, any>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    if (timer.current) clearTimeout(timer.current);
    const q = value.trim();
    if (q.length < 3) {
      setResults([]);
      return;
    }
    timer.current = setTimeout(async () => {
      try {
        setBusy(true);
        await loadMapsScript();
        const { AutocompleteSuggestion, AutocompleteSessionToken } =
          (await window.google.maps.importLibrary("places")) as any;
        if (!tokenRef.current) tokenRef.current = new AutocompleteSessionToken();
        const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: q,
          sessionToken: tokenRef.current,
          includedRegionCodes: ["in"],
        });
        predRef.current = {};
        const list: Result[] = (suggestions ?? []).slice(0, 6).map((s: any, i: number) => {
          const p = s.placePrediction;
          const id = p?.placeId ?? String(i);
          predRef.current[id] = p;
          return { id, text: p?.text?.text ?? "" };
        });
        setResults(list.filter((r) => r.text));
      } catch {
        setResults([]);
      } finally {
        setBusy(false);
      }
    }, 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, open]);

  async function pick(r: Result) {
    setOpen(false);
    onChange(r.text);
    try {
      const pred = predRef.current[r.id];
      if (!pred) return;
      const place = pred.toPlace();
      await place.fetchFields({ fields: ["location", "displayName"] });
      const loc = place.location;
      if (loc) onPick({ lat: loc.lat(), lng: loc.lng(), name: r.text });
      tokenRef.current = null;
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="relative">
      <div className="glass rounded-full h-11 px-4 flex items-center gap-2 shadow-lift">
        <Search className="size-4 text-muted-foreground shrink-0" />
        <input
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          className="flex-1 min-w-0 bg-transparent outline-none text-sm"
        />
        {busy && <Loader2 className="size-4 animate-spin text-muted-foreground shrink-0" />}
        {value && !busy && (
          <button aria-label="Clear" onClick={() => { onChange(""); setResults([]); }}>
            <X className="size-4 text-muted-foreground" />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full max-h-56 overflow-auto rounded-2xl glass shadow-lift p-1">
          {results.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => pick(r)}
                className="w-full text-left px-3 py-2 text-sm rounded-xl hover:bg-secondary truncate"
              >
                {r.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
