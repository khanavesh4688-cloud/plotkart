import { useEffect, useRef } from "react";

type MarkerInput = { lat: number; lng: number; label?: string; id?: string; active?: boolean; onClick?: () => void };

type LatLng = { lat: number; lng: number };

type Props = {
  center: LatLng;
  zoom?: number;
  markers?: MarkerInput[];
  mapType?: "roadmap" | "satellite" | "hybrid" | "terrain";
  className?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
  /** Draw mode: clicking the map appends a boundary vertex */
  drawing?: boolean;
  /** Boundary polygon path */
  polygon?: LatLng[];
  onMapClick?: (p: LatLng) => void;
  fitToMarkers?: boolean;
};

declare global {
  interface Window {
    google: any;
    __plotkartMapReady?: Promise<void>;
    __plotkartInitMap?: () => void;
  }
}

export function loadMapsScript(): Promise<void> {
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
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&libraries=geometry,places&callback=__plotkartInitMap${channel ? `&channel=${channel}` : ""}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return window.__plotkartMapReady;
}

export function polygonAreaAcres(path: LatLng[]): number {
  if (typeof window === "undefined" || !window.google?.maps?.geometry || path.length < 3) return 0;
  const sqm = window.google.maps.geometry.spherical.computeArea(
    path.map((p) => new window.google.maps.LatLng(p.lat, p.lng)),
  );
  return sqm / 4046.8564224;
}

export function GoogleMapView({
  center, zoom = 14, markers = [], mapType = "hybrid", className = "", style,
  interactive = true, drawing = false, polygon, onMapClick, fitToMarkers = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRefs = useRef<any[]>([]);
  const polyRef = useRef<any>(null);
  const clickRef = useRef<((p: LatLng) => void) | undefined>(onMapClick);
  const drawingRef = useRef(drawing);
  clickRef.current = onMapClick;
  drawingRef.current = drawing;

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
          zoomControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        });
        mapRef.current.addListener("click", (e: any) => {
          if (!e.latLng) return;
          clickRef.current?.({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        });
        renderMarkers();
        renderPolygon();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      markerRefs.current.forEach((m) => m.setMap?.(null));
      markerRefs.current = [];
      polyRef.current?.setMap?.(null);
      polyRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapRef.current) mapRef.current.setMapTypeId(mapType);
  }, [mapType]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(zoom);
    }
  }, [center.lat, center.lng, zoom]);

  useEffect(() => {
    renderMarkers();
    if (fitToMarkers && mapRef.current && markers.length > 1 && window.google?.maps) {
      const b = new window.google.maps.LatLngBounds();
      markers.forEach((m) => b.extend({ lat: m.lat, lng: m.lng }));
      mapRef.current.fitBounds(b, 64);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  useEffect(() => {
    renderPolygon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygon]);

  function renderMarkers() {
    if (!mapRef.current || !window.google?.maps) return;
    markerRefs.current.forEach((m) => m.setMap(null));
    markerRefs.current = [];
    markers.forEach((m) => {
      const marker = new window.google.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map: mapRef.current,
        zIndex: m.active ? 999 : 1,
        label: m.label
          ? { text: m.label, color: "#ffffff", fontSize: "11px", fontWeight: "600" }
          : undefined,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: m.label ? 18 : 8,
          fillColor: m.active ? "#166534" : "#2f7a3a",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: m.active ? 3 : 2,
        },
      });
      if (m.onClick) marker.addListener("click", m.onClick);
      markerRefs.current.push(marker);
    });
  }

  function renderPolygon() {
    if (!mapRef.current || !window.google?.maps) return;
    const path = polygon ?? [];
    if (path.length < 2) {
      polyRef.current?.setMap(null);
      polyRef.current = null;
      return;
    }
    if (!polyRef.current) {
      polyRef.current = new window.google.maps.Polygon({
        map: mapRef.current,
        strokeColor: "#22C55E",
        strokeWeight: 3,
        fillColor: "#22C55E",
        fillOpacity: 0.22,
      });
    }
    polyRef.current.setPath(path);
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ width: "100%", height: "100%", background: "#e5e7eb", cursor: drawing ? "crosshair" : undefined, ...style }}
      aria-label="Map"
    />
  );
}
