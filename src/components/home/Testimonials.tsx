import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/lib/contentStore";

const Testimonials = () => {
  const { testimonials } = useContent();
  const [index, setIndex] = useState(0);
  const published = useMemo(() => testimonials
    .filter((testimonial) => testimonial.status === "Published")
    .sort((a, b) => a.sortOrder - b.sortOrder), [testimonials]);
  useEffect(() => {
    if (index >= published.length) setIndex(0);
  }, [index, published.length]);
  if (!published.length) return null;
  const current = published[index] ?? published[0];
  const move = (by: number) => setIndex((currentIndex) => (currentIndex + by + published.length) % published.length);

  return (
    <section className="bg-platinum py-24 md:mx-4 md:my-4 md:rounded-[2.5rem] md:py-32">
      <div className="container-custom">
        <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
          <div>
            <p className="eyebrow text-accent">Client perspective</p>
            <p className="mt-8 text-xs leading-6 text-muted-foreground">Relationships measured in repeat partnerships, not transactions.</p>
          </div>
          <div>
            <AnimatePresence mode="wait">
              <motion.blockquote key={current.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .5 }}>
                <p className="max-w-5xl font-display text-[clamp(2.2rem,4.5vw,5rem)] leading-[1.02] tracking-[-0.03em]">“{current.quote}”</p>
                <footer className="mt-10 border-l border-accent pl-5">
                  <p className="text-sm font-medium">{current.name}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">{current.role}</p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
            <div className="mt-12 flex items-center justify-between border-t border-border pt-5">
              <span className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground">{String(index + 1).padStart(2, "0")} / {String(published.length).padStart(2, "0")}</span>
              {published.length > 1 && <div className="flex gap-2"><button onClick={() => move(-1)} aria-label="Previous testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-border transition-all duration-300 hover:-translate-x-0.5 hover:bg-foreground hover:text-background"><ArrowLeft className="h-4 w-4" /></button><button onClick={() => move(1)} aria-label="Next testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-border transition-all duration-300 hover:translate-x-0.5 hover:bg-foreground hover:text-background"><ArrowRight className="h-4 w-4" /></button></div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
