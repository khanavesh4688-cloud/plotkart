import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, MapPin, Heart, User } from "lucide-react";

type NavItem = { to: string; label: string; icon: typeof Home; primary?: boolean };
const items: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/browse", label: "Search", icon: Search },
  { to: "/map", label: "Explore", icon: MapPin, primary: true },
  { to: "/wishlist", label: "Saved", icon: Heart },
  { to: "/auth", label: "Profile", icon: User },
];

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border">
      <div className="grid grid-cols-5 h-16 pb-[env(safe-area-inset-bottom)]">
        {items.map(({ to, label, icon: Icon, primary }) => {
          const active = pathname === to;
          if (primary) {
            return (
              <Link key={to} to={to as any} className="relative grid place-items-center">
                <span className={`-mt-6 size-14 rounded-full grid place-items-center shadow-glow ${active ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground"}`}>
                  <Icon className="size-6"/>
                </span>
                <span className="absolute bottom-2 text-[10px] font-medium">{label}</span>
              </Link>
            );
          }
          return (
            <Link key={to} to={to as any} className={`grid place-items-center gap-0.5 text-[11px] ${active ? "text-primary" : "text-muted-foreground"}`}>
              <Icon className={`size-5 ${active ? "text-primary" : ""}`}/>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
