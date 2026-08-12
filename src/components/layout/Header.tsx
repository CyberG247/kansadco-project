import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Globe, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import logo from "@/assets/logo-transparent.png";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const atTop = !scrolled && !open;
  const overHero = location.pathname === "/" && !scrolled && !open;

  const links = [
    [t("nav.about"), "/about"], [t("nav.services"), "/services"],
    [t("nav.projects"), "/projects"], [t("nav.gallery"), "/gallery"], [t("nav.team"), "/team"],
    [t("nav.contact"), "/contact"],
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    document.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [location.pathname, i18n.language]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${overHero ? "text-white" : "text-foreground"} ${atTop ? "max-md:text-white" : ""}`}>
      <div className={`public-header-shell mobile-header-shell mx-auto flex w-full items-center justify-between transition-all duration-500 ease-out max-md:mt-3 max-md:h-[58px] max-md:max-w-[calc(100%_-_1.5rem)] max-md:rounded-[1.25rem] max-md:border max-md:px-3 max-md:shadow-[0_16px_44px_rgba(8,16,12,.14)] max-md:backdrop-blur-xl ${
        scrolled && !open
          ? "mt-3 h-[68px] max-w-[calc(100%_-_1.5rem)] rounded-[1.25rem] border border-border/70 bg-background/95 px-4 shadow-[0_18px_60px_rgba(8,16,12,0.12)] backdrop-blur-xl sm:max-w-[calc(100%_-_2rem)] sm:rounded-[1.5rem] sm:px-6 lg:h-[64px] lg:max-w-[1320px]"
          : `h-[88px] max-w-[1440px] px-5 sm:px-8 md:mt-4 md:h-[72px] md:max-w-[calc(100%_-_2rem)] md:rounded-[1.5rem] md:border md:px-6 md:shadow-[0_18px_60px_rgba(8,16,12,.1)] md:backdrop-blur-xl xl:px-8 ${overHero ? "md:border-white/15 md:bg-slate-dark/20" : "border-b border-border/60 bg-background/95 backdrop-blur-xl"}`
      } ${atTop ? "max-md:border-white/15 max-md:bg-slate-dark/20" : "max-md:border-border/70 max-md:bg-background/95 max-md:text-foreground"}`}>
        <Link to="/" aria-label="KANSADCO home" className="relative z-50 shrink-0">
          <img src={logo} alt="KANSADCO" className={`${scrolled && !open ? "h-10" : "h-12"} w-auto transition-all duration-500 max-md:h-9 ${overHero ? "brightness-0 invert" : "dark:brightness-0 dark:invert"} ${atTop ? "max-md:brightness-0 max-md:invert" : ""}`} />
        </Link>

        <nav className="hidden items-center gap-5 xl:gap-8 lg:flex" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link key={href} to={href} className={`link-underline font-mono text-[10px] font-medium uppercase tracking-[0.16em] ${location.pathname === href ? "text-accent" : ""}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <div className="relative hidden sm:block">
            <Globe className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
            <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)} aria-label="Language" className="h-9 appearance-none bg-transparent pl-8 pr-3 font-mono text-[10px] font-medium uppercase tracking-widest outline-none">
              <option value="en">EN</option><option value="ha">HA</option><option value="ar">AR</option><option value="zh">ZH</option><option value="yo">YO</option><option value="ig">IG</option>
            </select>
          </div>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="grid h-10 w-10 place-items-center rounded-full transition-all duration-300 hover:rotate-12 hover:bg-current/10 max-md:h-9 max-md:w-9" aria-label="Toggle color theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/book-tour" className={`hidden h-11 items-center gap-2 rounded-full px-5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] transition-all duration-300 hover:-translate-y-0.5 md:flex ${overHero ? "bg-white text-slate-dark hover:bg-accent" : "bg-foreground text-background hover:bg-accent hover:text-accent-foreground"}`}>
            {t("nav.quote")} <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <button onClick={() => setOpen(!open)} className="relative z-50 grid h-11 w-11 place-items-center transition-transform duration-300 lg:hidden max-md:h-9 max-md:w-9" aria-label="Toggle menu" aria-controls="mobile-menu" aria-expanded={open}>
            <span className={`absolute transition-all duration-300 ${open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"}`}><Menu className="h-5 w-5 max-md:h-[18px] max-md:w-[18px]" /></span>
            <span className={`absolute transition-all duration-300 ${open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"}`}><X className="h-5 w-5 max-md:h-[18px] max-md:w-[18px]" /></span>
          </button>
        </div>
      </div>

      <div className={`fixed inset-0 z-40 text-foreground transition-all duration-300 lg:hidden ${open ? "visible bg-slate-dark/25 opacity-100 backdrop-blur-[2px]" : "pointer-events-none invisible bg-transparent opacity-0"}`} aria-hidden={!open}>
        <button className="absolute inset-0" onClick={() => setOpen(false)} aria-label="Close menu" tabIndex={open ? 0 : -1} />
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation menu" className={`absolute inset-x-3 top-[76px] max-h-[calc(100svh-92px)] overflow-y-auto rounded-[1.75rem] border border-border/80 bg-background p-4 shadow-[0_28px_90px_rgba(8,16,12,.24)] transition-all duration-500 ease-out sm:left-auto sm:right-4 sm:top-[92px] sm:w-[430px] ${open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-3 scale-[.97] opacity-0"}`}>
          <div className="flex items-center justify-between px-2 pb-3">
            <p className="font-mono text-[8px] uppercase tracking-[.2em] text-muted-foreground">Navigate</p>
            <p className="font-mono text-[8px] uppercase tracking-[.16em] text-muted-foreground">K / Menu</p>
          </div>
          <nav className="grid grid-cols-2 gap-2">
            {links.map(([label, href], index) => (
              <Link key={href} to={href} tabIndex={open ? 0 : -1} style={{ transitionDelay: open ? `${80 + index * 35}ms` : "0ms" }} className={`group flex min-h-[72px] flex-col justify-between rounded-2xl border p-3.5 transition-all duration-500 ${location.pathname === href ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:border-foreground"} ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
                <span className={`font-mono text-[8px] ${location.pathname === href ? "text-background/55" : "text-muted-foreground"}`}>0{index + 1}</span>
                <span className="flex items-end justify-between gap-2 font-display text-[1.55rem] leading-none">{label}<ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-muted px-4 py-3 font-mono text-[8px] uppercase tracking-[.12em] text-muted-foreground">
            <a href="tel:+2348037380434" tabIndex={open ? 0 : -1} className="transition-colors hover:text-foreground">+234 (0) 803 738 0434</a>
            <select value={i18n.language} onChange={(event) => i18n.changeLanguage(event.target.value)} tabIndex={open ? 0 : -1} aria-label="Language" className="bg-transparent font-mono text-[10px] font-medium uppercase tracking-widest outline-none">
              <option value="en">EN</option><option value="ha">HA</option><option value="ar">AR</option><option value="zh">ZH</option><option value="yo">YO</option><option value="ig">IG</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
