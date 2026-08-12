import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import heroSignature from "@/assets/hero-signature.webp";
import heroEstate from "@/assets/hero-estate.jpg";

const slides = [
  {
    image: heroSignature,
    kicker: "Integrated development · Nigeria",
    title: <>We turn land into <em className="font-normal text-accent">landmarks.</em></>,
    body: "Built environments shaped by intelligence, delivered with discipline, and designed to endure.",
    meta: "Signature residential development",
  },
  {
    image: heroEstate,
    kicker: "Real estate · Construction · Infrastructure",
    title: <>A legacy you can <em className="font-normal text-accent">live in.</em></>,
    body: "From first sketch to final handover, we create places of lasting commercial and human value.",
    meta: "Contemporary living, Abuja",
  },
];

const HeroSlider = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 7500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[760px] h-[100svh] overflow-hidden bg-slate-dark text-white md:mx-4 md:mt-4 md:h-[calc(100svh-2rem)] md:rounded-[2.5rem]">
      <AnimatePresence mode="sync">
        <motion.img
          key={active}
          src={slides[active].image}
          alt="KANSADCO signature development"
          initial={{ opacity: 0, scale: 1.035 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2 }, scale: { duration: 7.5, ease: "linear" } }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,16,12,.82)_0%,rgba(8,16,12,.56)_42%,rgba(8,16,12,.08)_78%),linear-gradient(0deg,rgba(8,16,12,.72)_0%,transparent_35%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:80px_80px]" />

      <div className="container-custom relative z-10 flex h-full flex-col justify-end pb-28 pt-32 md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .8, ease: [0.2, 0.7, 0.2, 1] }} className="mb-auto mt-auto max-w-[960px] pt-12">
            <p className="eyebrow mb-8 text-white/70">{slides[active].kicker}</p>
            <h1 className="display-title max-w-[900px] text-balance">{slides[active].title}</h1>
            <div className="mt-8 flex max-w-2xl flex-col gap-8 border-l border-white/30 pl-5 sm:flex-row sm:items-end sm:justify-between md:mt-10 md:pl-8">
              <p className="max-w-md text-sm leading-7 text-white/72 md:text-base">{slides[active].body}</p>
              <Link to="/projects" className="group flex shrink-0 items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]">
                Explore our work <span className="grid h-11 w-11 place-items-center rounded-full border border-white/40 transition-all group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-slate-dark"><ArrowRight className="h-4 w-4" /></span>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 grid items-end gap-6 border-t border-white/25 pt-5 md:grid-cols-[1fr_auto_auto]">
          <div className="hidden items-center gap-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white/60 md:flex"><ArrowDown className="h-4 w-4" /> Scroll to discover</div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">{slides[active].meta}</p>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button key={index} onClick={() => setActive(index)} aria-label={`Show slide ${index + 1}`} className={`relative h-8 w-14 overflow-hidden border-t transition-colors ${index === active ? "border-white" : "border-white/25"}`}>
                {index === active && <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 7.5, ease: "linear" }} className="absolute left-0 top-[-1px] h-px w-full origin-left bg-accent" />}
                <span className="font-mono text-[9px] text-white/70">0{index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
