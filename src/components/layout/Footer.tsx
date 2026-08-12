import { ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import logo from "@/assets/logo-transparent.png";
import { useContent } from "@/lib/contentStore";

const FooterReveal = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: .05, rootMargin: "0px 0px -24px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} style={{ transitionDelay: `${delay}s` }} className={`${className} transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>{children}</div>;
};

const Footer = () => {
  const { settings } = useContent();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-background pb-20 pt-3 text-white md:pb-0 md:pt-0">
      <div className="mx-3 overflow-hidden rounded-[2rem] bg-slate-dark md:mx-4 md:mb-4 md:rounded-[2.5rem]">
        <div className="container-custom pt-14 md:pt-24">
          <div className="grid gap-8 border-b border-white/15 pb-12 lg:grid-cols-[1.35fr_.65fr] lg:items-end lg:gap-16 lg:pb-16">
            <FooterReveal>
              <div>
                <div className="flex items-center justify-between gap-5">
                  <img src={logo} alt="KANSADCO" className="h-11 w-auto brightness-0 invert md:h-14" />
                  <p className="font-mono text-[8px] uppercase tracking-[.18em] text-white/35">Nigeria · Since 2007</p>
                </div>
                <h2 className="mt-8 max-w-4xl font-display text-[2.65rem] leading-[.94] tracking-[-.035em] text-white/95 sm:text-5xl lg:text-6xl">
                  Enduring value, built into <em className="text-white/45">every detail.</em>
                </h2>
              </div>
            </FooterReveal>

            <FooterReveal delay={.12}>
              <Link to="/contact" className="group flex min-h-36 flex-col justify-between rounded-[1.5rem] border border-white/15 bg-white/[.04] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/35 hover:bg-white/[.07]">
                <div className="flex items-start justify-between">
                  <p className="font-mono text-[8px] uppercase tracking-[.18em] text-white/40">Start a conversation</p>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-slate-dark"><ArrowUpRight className="h-3.5 w-3.5" /></span>
                </div>
                <p className="max-w-xs font-display text-2xl leading-tight">Have a site, brief or investment in mind?</p>
              </Link>
            </FooterReveal>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-10 sm:grid-cols-3 md:py-14 lg:grid-cols-[.8fr_.8fr_1.4fr]">
            <FooterReveal delay={.05}>
              <div>
                <p className="mb-5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">Explore</p>
                <div className="space-y-3 text-sm text-white/68">
                  <Link className="block w-fit transition-all duration-300 hover:translate-x-1 hover:text-white" to="/about">About</Link>
                  <Link className="block w-fit transition-all duration-300 hover:translate-x-1 hover:text-white" to="/services">Services</Link>
                  <Link className="block w-fit transition-all duration-300 hover:translate-x-1 hover:text-white" to="/projects">Projects</Link>
                  <Link className="block w-fit transition-all duration-300 hover:translate-x-1 hover:text-white" to="/gallery">Gallery</Link>
                </div>
              </div>
            </FooterReveal>

            <FooterReveal delay={.1}>
              <div>
                <p className="mb-5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">Company</p>
                <div className="space-y-3 text-sm text-white/68">
                  <Link className="block w-fit transition-all duration-300 hover:translate-x-1 hover:text-white" to="/team">People</Link>
                  <Link className="block w-fit transition-all duration-300 hover:translate-x-1 hover:text-white" to="/contact">Contact</Link>
                  <a className="group flex w-fit items-center gap-2 transition-all duration-300 hover:translate-x-1 hover:text-white" href="#">Instagram <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
                  <a className="group flex w-fit items-center gap-2 transition-all duration-300 hover:translate-x-1 hover:text-white" href="#">LinkedIn <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
                </div>
              </div>
            </FooterReveal>

            <FooterReveal delay={.15} className="col-span-2 sm:col-span-1">
              <div>
                <p className="mb-5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">Abuja office</p>
                <p className="max-w-sm text-sm leading-6 text-white/68">{settings.abujaAddress}</p>
                <div className="mt-5 flex flex-col gap-2 text-sm text-white/68">
                  <a href={`mailto:${settings.primaryEmail}`} className="w-fit transition-colors duration-300 hover:text-white">{settings.primaryEmail}</a>
                  <a href={`tel:${settings.telephone.replace(/\s/g, "")}`} className="w-fit transition-colors duration-300 hover:text-white">{settings.telephone}</a>
                </div>
              </div>
            </FooterReveal>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/15 py-6 font-mono text-[8px] uppercase tracking-[0.15em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} KANSADCO. All rights reserved.</p>
            <p>Abuja · Kano · Nigeria</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
