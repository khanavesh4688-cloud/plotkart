import { Link } from "@tanstack/react-router";
import { Search, MapPin, Heart, User, Sparkles, PlusCircle, Menu } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="size-9 rounded-xl bg-primary grid place-items-center shadow-glow">
              <MapPin className="size-5 text-primary-foreground" />
            </div>
            <div className="leading-none">
              <div className="font-display text-xl">Terra</div>
              <div className="text-[10px] tracking-widest text-muted-foreground uppercase">Land Marketplace</div>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-auto">
            <Link to="/browse" className="w-full">
              <div className="flex items-center gap-2 h-11 px-4 rounded-full bg-secondary/70 border border-border hover:bg-secondary transition">
                <Search className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Search city, village, or category…</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link to="/browse" className="px-3 py-2 rounded-full hover:bg-secondary transition">Browse</Link>
            <Link to="/ai" className="px-3 py-2 rounded-full hover:bg-secondary transition flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> AI
            </Link>
            <Link to="/dashboard" className="px-3 py-2 rounded-full hover:bg-secondary transition">Dashboard</Link>
            <Link to="/wishlist" className="p-2 rounded-full hover:bg-secondary transition"><Heart className="size-4" /></Link>
            <Link to="/auth" className="p-2 rounded-full hover:bg-secondary transition"><User className="size-4" /></Link>
            <Link to="/post" className="ml-2 inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition shadow-glow">
              <PlusCircle className="size-4" /> Post Listing
            </Link>
          </nav>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-full hover:bg-secondary">
            <Menu className="size-5" />
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border px-4 py-3 flex flex-col gap-1 text-sm bg-background/95">
            <Link to="/browse" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-secondary">Browse</Link>
            <Link to="/ai" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-secondary">AI Assistant</Link>
            <Link to="/dashboard" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-secondary">Seller Dashboard</Link>
            <Link to="/wishlist" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-secondary">Wishlist</Link>
            <Link to="/auth" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-secondary">Sign in</Link>
            <Link to="/post" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-1.5 h-11 rounded-full bg-primary text-primary-foreground">
              <PlusCircle className="size-4" /> Post Listing
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <div className="font-display text-2xl mb-2">Terra</div>
          <p className="text-muted-foreground">The premium marketplace for land. Verified plots, transparent pricing, AI-guided decisions.</p>
        </div>
        <div>
          <div className="font-semibold mb-3">Explore</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/browse">All Listings</Link></li>
            <li><Link to="/ai">AI Valuation</Link></li>
            <li><Link to="/post">Sell Your Land</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>About</li><li>Careers</li><li>Press</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Legal</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>Privacy</li><li>Terms</li><li>Cookie Policy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Terra Land Marketplace. Crafted with care.
      </div>
    </footer>
  );
}
