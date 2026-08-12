import { Link, useLocation } from "react-router-dom";
import { Building2, Home, Images, MessageCircle } from "lucide-react";

const links = [
  { label: "Home", href: "/", icon: Home },
  { label: "Projects", href: "/projects", icon: Building2 },
  { label: "Gallery", href: "/gallery", icon: Images },
  { label: "Contact", href: "/contact", icon: MessageCircle },
];

const MobileDock = () => {
  const location = useLocation();
  return (
    <nav aria-label="Mobile navigation" className="mobile-dock-shell fixed bottom-[max(.75rem,env(safe-area-inset-bottom))] left-3 right-[4.5rem] z-30 grid h-[56px] grid-cols-4 rounded-[1.15rem] border border-white/10 bg-slate-dark/95 p-1 text-white shadow-[0_16px_48px_rgba(8,16,12,.28)] backdrop-blur-xl md:hidden">
      {links.map((link) => {
        const active = location.pathname === link.href;
        return <Link key={link.href} to={link.href} aria-current={active ? "page" : undefined} className={`relative flex flex-col items-center justify-center gap-1 rounded-[.85rem] transition-all duration-300 active:scale-95 ${active ? "bg-white/[.08] text-white" : "text-white/42 hover:text-white/75"}`}>
          {active && <span className="absolute left-1/2 top-0 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent" />}
          <link.icon className={`h-[15px] w-[15px] transition-transform duration-300 ${active ? "-translate-y-px" : ""}`} />
          <span className="font-mono text-[6.5px] uppercase tracking-[.12em]">{link.label}</span>
        </Link>;
      })}
    </nav>
  );
};

export default MobileDock;
