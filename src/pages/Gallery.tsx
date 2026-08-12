import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import heroSignature from "@/assets/hero-signature.webp";
import { useContent } from "@/lib/contentStore";

const layouts = [
  ["md:col-span-8", "aspect-[16/10]"], ["md:col-span-4 md:mt-28", "aspect-[4/5]"],
  ["md:col-span-5", "aspect-[4/5]"], ["md:col-span-7 md:mt-24", "aspect-[5/4]"],
  ["md:col-span-7", "aspect-[5/4]"], ["md:col-span-5 md:mt-32", "aspect-[4/5]"],
];

const Gallery = () => {
  const { gallery } = useContent();
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<number | null>(null);
  const published = useMemo(() => gallery.filter((image) => image.status === "Published"), [gallery]);
  const categories = useMemo(() => ["All", ...Array.from(new Set(published.map((image) => image.type)))], [published]);
  const visible = useMemo(() => category === "All" ? published : published.filter((image) => image.type === category), [category, published]);

  const move = useCallback((direction: number) => setActive((current) => current === null ? 0 : (current + direction + visible.length) % visible.length), [visible.length]);

  useEffect(() => {
    document.body.style.overflow = active === null ? "" : "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (active === null) return;
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKeyDown); };
  }, [active, move]);

  useEffect(() => setActive(null), [category]);

  return (
    <Layout>
      <PageHero eyebrow="Visual archive" title={<>Places, materials<br />and <em className="text-accent">moments.</em></>} description="A closer view of the architecture, infrastructure and details that define how KANSADCO builds." image={heroSignature} imageAlt="KANSADCO signature residence" index="K / 06" />

      <section className="bg-background">
        <div className="container-custom flex gap-7 overflow-x-auto border-b border-border py-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-3.5 py-2 font-mono text-[9px] font-medium uppercase tracking-[.17em] transition-all duration-300 ${category === item ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}>{item}</button>
          ))}
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="mb-16 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <h2 className="section-title">Selected <em className="text-muted-foreground">views.</em></h2>
            <p className="font-mono text-[9px] uppercase tracking-[.17em] text-muted-foreground">{String(visible.length).padStart(2, "0")} images · {category}</p>
          </div>

          <div className="grid gap-x-7 gap-y-20 md:grid-cols-12">
            {visible.map((image, index) => (
              <button key={image.id} onClick={() => setActive(index)} className={`group block text-left ${layouts[index % layouts.length][0]}`}>
                <div className={`image-reveal relative overflow-hidden bg-muted ${layouts[index % layouts.length][1]}`}>
                  <img src={image.src} alt={image.name} loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute right-4 top-4 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-background text-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:scale-105 group-hover:opacity-100"><Maximize2 className="h-4 w-4" /></span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-5 border-b border-border pb-5">
                  <div><h3 className="text-2xl md:text-3xl">{image.name}</h3><p className="mt-2 font-mono text-[9px] uppercase tracking-[.15em] text-muted-foreground">{image.location}</p></div>
                  <p className="pt-1 font-mono text-[9px] uppercase tracking-[.15em] text-muted-foreground">{image.type} · {image.year}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {active !== null && visible[active] && createPortal((
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-dark text-white" role="dialog" aria-modal="true" aria-label={visible[active].name}>
          <div className="flex h-20 items-center justify-between border-b border-white/15 px-5 sm:px-8">
            <div><p className="font-mono text-[9px] uppercase tracking-[.17em] text-white/45">{String(active + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}</p><p className="mt-1 text-lg">{visible[active].name}</p></div>
            <button onClick={() => setActive(null)} aria-label="Close gallery viewer" className="grid h-11 w-11 place-items-center rounded-full border border-white/25 hover:bg-white hover:text-slate-dark"><X className="h-5 w-5" /></button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center p-5 sm:p-10">
            <img src={visible[active].src} alt={visible[active].name} className="max-h-full max-w-full object-contain" />
            <button onClick={() => move(-1)} aria-label="Previous image" className="absolute bottom-5 left-5 grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-slate-dark/60 backdrop-blur hover:bg-white hover:text-slate-dark sm:left-8 sm:top-1/2 sm:-translate-y-1/2"><ArrowLeft className="h-4 w-4" /></button>
            <button onClick={() => move(1)} aria-label="Next image" className="absolute bottom-5 right-5 grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-slate-dark/60 backdrop-blur hover:bg-white hover:text-slate-dark sm:right-8 sm:top-1/2 sm:-translate-y-1/2"><ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="flex items-center justify-between border-t border-white/15 px-5 py-4 font-mono text-[9px] uppercase tracking-[.16em] text-white/45 sm:px-8"><span>{visible[active].location}</span><span>{visible[active].type} · {visible[active].year}</span></div>
        </div>
      ), document.body)}
    </Layout>
  );
};

export default Gallery;
