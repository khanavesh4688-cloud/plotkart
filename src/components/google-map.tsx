import { useEffect, useRef } from "react";

type MarkerInput = { lat: number; lng: number; label?: string; id?: string; onClick?: () => void };

type Props = {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: MarkerInput[];
  mapType?: "roadmap" | "satellite" | "hybrid" | "terrain";
  className?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
};

declare global {
  interface Window {
    google: any;
    __plotkartMapReady?: Promise<void>;
    __plotkartInitMap?: () => void;
  }
}

function loadMapsScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (window.__plotkartMapReady) return window.__plotkartMapReady;

  window.__plotkartMapReady = new Promise<void>((resolve, reject) => {
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    if (!key) {
      reject(new Error("Missing Google Maps browser key"));
      return;
    }
    window.__plotkartInitMap = () => resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__plotkartInitMap${channel ? `&channel=${channel}` : ""}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return window.__plotkartMapReady;
}

export function GoogleMapView({ center, zoom = 14, markers = [], mapType = "hybrid", className = "", style, interactive = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRefs = useRef<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadMapsScript()
      .then(() => {
        if (cancelled || !ref.current || !window.google?.maps) return;
        mapRef.current = new window.google.maps.Map(ref.current, {
          center,
          zoom,
          mapTypeId: mapType,
          disableDefaultUI: !interactive,
          gestureHandling: interactive ? "greedy" : "none",
          clickableIcons: false,
          zoomControl: interactive,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        });
        renderMarkers();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      markerRefs.current.forEach((m) => m.setMap?.(null));
      markerRefs.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(zoom);
    }
  }, [center.lat, center.lng, zoom]);

  useEffect(() => {
    renderMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  function renderMarkers() {
    if (!mapRef.current || !window.google?.maps) return;
    markerRefs.current.forEach((m) => m.setMap(null));
    markerRefs.current = [];
    markers.forEach((m) => {
      const marker = new window.google.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map: mapRef.current,
        label: m.label
          ? { text: m.label, color: "#ffffff", fontSize: "11px", fontWeight: "600" }
          : undefined,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: m.label ? 18 : 8,
          fillColor: "#2f7a3a",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
      if (m.onClick) marker.addListener("click", m.onClick);
      markerRefs.current.push(marker);
    });
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ width: "100%", height: "100%", background: "#e5e7eb", ...style }}
      aria-label="Map"
    />
  );
}
