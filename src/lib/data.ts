import agri from "@/assets/plot-agri.jpg";
import residential from "@/assets/plot-residential.jpg";
import commercial from "@/assets/plot-commercial.jpg";
import industrial from "@/assets/plot-industrial.jpg";
import farmhouse from "@/assets/plot-farmhouse.jpg";
import hero from "@/assets/hero-land.jpg";

export { hero };

export type Category =
  | "Agricultural"
  | "Residential"
  | "Commercial"
  | "Industrial"
  | "Farmhouse"
  | "Investment";

export type Property = {
  id: string;
  title: string;
  category: Category;
  price: number; // in INR lakhs
  pricePerAcre: number;
  area: number; // acres
  location: { village: string; city: string; district: string; state: string };
  image: string;
  gallery: string[];
  verified: boolean;
  loanAvailable: boolean;
  negotiable: boolean;
  amenities: string[];
  soil?: string;
  road: string;
  water: boolean;
  electricity: boolean;
  ownership: "Freehold" | "Leasehold";
  registryStatus: "Clear" | "Pending";
  gps: { lat: number; lng: number };
  aiScore: number; // 0-100 investment score
  trend: "up" | "flat" | "down";
  postedDaysAgo: number;
  seller: { name: string; rating: number; verified: boolean; deals: number };
  description: string;
};

const img = { agri, residential, commercial, industrial, farmhouse };

export const CATEGORIES: { key: Category; label: string; icon: string; image: string }[] = [
  { key: "Agricultural", label: "Agricultural Land", icon: "🌾", image: img.agri },
  { key: "Residential", label: "Residential Plot", icon: "🏘️", image: img.residential },
  { key: "Commercial", label: "Commercial Land", icon: "🏢", image: img.commercial },
  { key: "Industrial", label: "Industrial Land", icon: "🏭", image: img.industrial },
  { key: "Farmhouse", label: "Farmhouse", icon: "🏡", image: img.farmhouse },
  { key: "Investment", label: "Investment Land", icon: "📈", image: img.agri },
];

export const TRENDING_LOCATIONS = [
  "Bengaluru Rural", "Pune Ring Road", "Nagpur MIHAN", "Coimbatore", "Jaipur Ajmer Road",
  "Hyderabad ORR", "Chennai OMR", "Lucknow Sultanpur Road",
];

export const PROPERTIES: Property[] = [
  {
    id: "p001", title: "Fertile Farmland with Canal Access", category: "Agricultural",
    price: 42, pricePerAcre: 8.4, area: 5,
    location: { village: "Devanahalli", city: "Bengaluru", district: "Bengaluru Rural", state: "Karnataka" },
    image: img.agri, gallery: [img.agri, img.residential, img.farmhouse],
    verified: true, loanAvailable: true, negotiable: true,
    amenities: ["Bore well", "Fenced", "Canal", "Farmhouse ready"],
    soil: "Red loamy", road: "20 ft village road", water: true, electricity: true,
    ownership: "Freehold", registryStatus: "Clear",
    gps: { lat: 13.24, lng: 77.71 }, aiScore: 88, trend: "up", postedDaysAgo: 3,
    seller: { name: "Ravi Kumar", rating: 4.8, verified: true, deals: 24 },
    description: "Premium 5-acre agricultural land 40 mins from Bengaluru airport. Fully fenced with year-round water from canal irrigation. Ideal for farmhouse, orchard, or long-term investment.",
  },
  {
    id: "p002", title: "Corner Residential Plot near IT Park", category: "Residential",
    price: 85, pricePerAcre: 340, area: 0.25,
    location: { village: "Wagholi", city: "Pune", district: "Pune", state: "Maharashtra" },
    image: img.residential, gallery: [img.residential, img.commercial],
    verified: true, loanAvailable: true, negotiable: false,
    amenities: ["Gated layout", "Park facing", "Corner plot"],
    road: "40 ft tar road", water: true, electricity: true,
    ownership: "Freehold", registryStatus: "Clear",
    gps: { lat: 18.58, lng: 73.98 }, aiScore: 92, trend: "up", postedDaysAgo: 1,
    seller: { name: "Meera Properties", rating: 4.9, verified: true, deals: 156 },
    description: "10,890 sq ft corner plot in a gated residential layout. Ready-to-build with all approvals, 5 mins from EON IT Park.",
  },
  {
    id: "p003", title: "Highway-Facing Commercial Land", category: "Commercial",
    price: 320, pricePerAcre: 160, area: 2,
    location: { village: "MIHAN", city: "Nagpur", district: "Nagpur", state: "Maharashtra" },
    image: img.commercial, gallery: [img.commercial, img.industrial],
    verified: true, loanAvailable: true, negotiable: true,
    amenities: ["Highway frontage", "Corner", "Zoned commercial"],
    road: "NH-44 frontage", water: true, electricity: true,
    ownership: "Freehold", registryStatus: "Clear",
    gps: { lat: 21.09, lng: 79.05 }, aiScore: 84, trend: "up", postedDaysAgo: 7,
    seller: { name: "Anil Deshmukh", rating: 4.6, verified: true, deals: 12 },
    description: "2 acres of prime commercial land with 200ft frontage on NH-44. Perfect for retail, warehouse, or hospitality development.",
  },
  {
    id: "p004", title: "Industrial Plot in MIDC Zone", category: "Industrial",
    price: 210, pricePerAcre: 42, area: 5,
    location: { village: "Chakan", city: "Pune", district: "Pune", state: "Maharashtra" },
    image: img.industrial, gallery: [img.industrial, img.commercial],
    verified: true, loanAvailable: true, negotiable: false,
    amenities: ["MIDC approved", "Power sub-station", "Water grid"],
    road: "60 ft internal road", water: true, electricity: true,
    ownership: "Leasehold", registryStatus: "Clear",
    gps: { lat: 18.75, lng: 73.86 }, aiScore: 79, trend: "flat", postedDaysAgo: 12,
    seller: { name: "MIDC Direct", rating: 4.7, verified: true, deals: 88 },
    description: "5-acre industrial parcel inside Chakan MIDC Phase III. All approvals in place, ready for factory construction.",
  },
  {
    id: "p005", title: "Hilltop Farmhouse with Orchard", category: "Farmhouse",
    price: 175, pricePerAcre: 87.5, area: 2,
    location: { village: "Mulshi", city: "Pune", district: "Pune", state: "Maharashtra" },
    image: img.farmhouse, gallery: [img.farmhouse, img.agri],
    verified: true, loanAvailable: false, negotiable: true,
    amenities: ["Furnished cottage", "Orchard", "Well water", "Solar"],
    soil: "Black cotton", road: "Private access road", water: true, electricity: true,
    ownership: "Freehold", registryStatus: "Clear",
    gps: { lat: 18.51, lng: 73.51 }, aiScore: 90, trend: "up", postedDaysAgo: 5,
    seller: { name: "Anjali Nair", rating: 5.0, verified: true, deals: 9 },
    description: "2-acre hilltop retreat with a 3BHK farmhouse, mango & chikoo orchard, and stunning valley views 90 mins from Pune.",
  },
  {
    id: "p006", title: "Investment Plot near Upcoming Metro", category: "Investment",
    price: 55, pricePerAcre: 220, area: 0.25,
    location: { village: "Sarjapur", city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka" },
    image: img.residential, gallery: [img.residential, img.agri],
    verified: true, loanAvailable: true, negotiable: true,
    amenities: ["Near metro", "BMRDA approved"],
    road: "30 ft road", water: true, electricity: true,
    ownership: "Freehold", registryStatus: "Clear",
    gps: { lat: 12.85, lng: 77.78 }, aiScore: 94, trend: "up", postedDaysAgo: 2,
    seller: { name: "Karnataka Realty", rating: 4.8, verified: true, deals: 210 },
    description: "10,890 sq ft investment plot 800m from upcoming Sarjapur metro station. Expected appreciation 22% over 24 months.",
  },
];

export const currency = (lakh: number) =>
  lakh >= 100 ? `₹${(lakh / 100).toFixed(2)} Cr` : `₹${lakh.toFixed(1)} L`;
