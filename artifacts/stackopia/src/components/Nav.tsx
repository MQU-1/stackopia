import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@workspace/stackopia-ds/components/ui/button";
import { cn } from "@workspace/stackopia-ds/lib/utils";
import { Sun, Moon, TrendingUp, PiggyBank, LineChart, Search, Users, Home } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/spend", label: "Spend Rater", icon: TrendingUp },
  { href: "/savings", label: "Savings", icon: PiggyBank },
  { href: "/invest", label: "Invest", icon: LineChart },
  { href: "/prices", label: "Price Hunter", icon: Search },
  { href: "/tribe", label: "Tribe", icon: Users },
];

export function Nav() {
  const [location] = useLocation();
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("stackopia-theme");
    if (stored) return stored === "dark";
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("stackopia-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("stackopia-theme", "light");
    }
  }, [dark]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-lg tracking-tight text-primary">
            Stackopia
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              data-testid={`nav-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                location === href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDark((d) => !d)}
          data-testid="button-theme-toggle"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden flex items-center gap-0 border-t border-border overflow-x-auto" data-testid="nav-mobile">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            data-testid={`nav-mobile-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium transition-colors shrink-0",
              location === href
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="whitespace-nowrap">{label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
