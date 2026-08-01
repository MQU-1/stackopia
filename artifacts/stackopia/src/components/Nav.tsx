import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@workspace/stackopia-ds/lib/utils";
import { TrendingUp, PiggyBank, LineChart, Search, Users, Home } from "lucide-react";
import { useI18n } from "../lib/i18n";

const navItems = [
  { href: "/", labelKey: "navHome", icon: Home, testId: "home" },
  { href: "/spend", labelKey: "navSpend", icon: TrendingUp, testId: "spend-rater" },
  { href: "/savings", labelKey: "navSavings", icon: PiggyBank, testId: "savings" },
  { href: "/invest", labelKey: "navInvest", icon: LineChart, testId: "invest" },
  { href: "/prices", labelKey: "navPrices", icon: Search, testId: "price-hunter" },
  { href: "/tribe", labelKey: "navTribe", icon: Users, testId: "tribe" },
];

export function Nav() {
  const [location] = useLocation();
  const { t, lang, toggleLang } = useI18n();
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("stackopia-theme");
    if (stored) return stored === "dark";
    return true;
  });
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => setMenuOpen(false), [location]);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-[200] w-full border-b border-border/60",
        "bg-background/80 backdrop-blur-xl saturate-[1.4]"
      )}
    >
      <div className="max-w-[1180px] mx-auto px-4 md:px-10 flex items-center justify-between gap-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 no-underline" data-testid="nav-brand">
          <span
            className="w-[30px] h-[30px] rounded-[9px] flex items-end gap-[2px] p-[5px] flex-none bg-secondary"
            aria-hidden="true"
          >
            <span className="block w-[5px] rounded-[2px] h-[35%] bg-primary"></span>
            <span className="block w-[5px] rounded-[2px] h-[65%] bg-primary" style={{ filter: "brightness(1.2)" }}></span>
            <span className="block w-[5px] rounded-[2px] h-[95%] bg-accent"></span>
          </span>
          <span className="font-serif font-bold text-[1.2rem] tracking-tight text-foreground">
            Stackopia
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" data-testid="nav-desktop">
          {navItems.map(({ href, labelKey, icon: Icon, testId }) => (
            <Link
              key={href}
              href={href}
              data-testid={`nav-link-${testId}`}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors no-underline",
                isActive(href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {t(labelKey)}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLang}
            className={cn(
              "w-[38px] h-[38px] rounded-full border border-border bg-transparent",
              "flex items-center justify-center cursor-pointer transition-colors",
              "text-xs font-semibold font-mono hover:border-primary hover:text-primary"
            )}
            data-testid="button-lang-toggle"
            aria-label={t("switchLangAria")}
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className={cn(
              "w-[38px] h-[38px] rounded-full border border-border bg-transparent",
              "flex items-center justify-center cursor-pointer transition-colors",
              "text-sm hover:border-primary hover:text-primary"
            )}
            data-testid="button-theme-toggle"
            aria-label={t("toggleThemeAria")}
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <Link
            href="/#waitlist"
            className={cn(
              "hidden lg:inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[0.82rem] font-semibold",
              "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors no-underline"
            )}
            data-testid="nav-link-cta"
          >
            {t("navCta")}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={t("openMenuAria")}
            className={cn(
              "md:hidden w-[38px] h-[38px] rounded-full border border-border bg-transparent",
              "flex items-center justify-center cursor-pointer transition-colors hover:border-primary"
            )}
            data-testid="button-menu-toggle"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-4 px-6 py-5 border-t border-border" data-testid="nav-mobile">
          {navItems.map(({ href, labelKey, icon: Icon, testId }) => (
            <Link
              key={href}
              href={href}
              data-testid={`nav-mobile-link-${testId}`}
              className={cn(
                "flex items-center gap-2 text-sm font-medium no-underline",
                isActive(href) ? "text-primary" : "text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {t(labelKey)}
            </Link>
          ))}
          <Link
            href="/#waitlist"
            className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[0.82rem] font-semibold bg-primary text-primary-foreground no-underline self-start"
            data-testid="nav-mobile-link-cta"
          >
            {t("navCta")}
          </Link>
        </nav>
      )}
    </header>
  );
}
