import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const services = [
  ["01", "Architecture", "Purposeful residential and commercial design, concept development, visualization and space planning."],
  ["02", "Construction", "Professional residential, commercial and renovation delivery built around quality materials and precise execution."],
  ["03", "Real estate", "Property development, residential opportunities and sales focused on functionality and lasting value."],
  ["04", "Project delivery", "Management and consultancy that connect design intent, technical coordination and clear client communication."],
  ["05", "KSD Paint", "Premium interior, exterior and surface-preparation finishes shaped by first-hand building expertise."],
];

const ServicesPreview = () => (
  <section className="section-padding bg-slate-dark text-primary-foreground md:mx-4 md:my-4 md:overflow-hidden md:rounded-[2.5rem]">
    <div className="container-custom">
      <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:items-end">
        <ScrollReveal width="100%">
          <p className="eyebrow mb-7 text-accent">One integrated practice</p>
          <h2 className="section-title max-w-3xl">From possibility to <em className="text-accent">place.</em></h2>
        </ScrollReveal>
        <ScrollReveal direction="right" width="100%">
          <div className="flex items-end justify-between gap-6 lg:justify-end">
            <p className="max-w-sm text-sm leading-7 text-white/60">Connected expertise across the full project lifecycle, from first idea to final delivery.</p>
            <Link to="/services" aria-label="View all services" className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/30 transition-all duration-300 hover:rotate-45 hover:border-accent hover:bg-accent hover:text-slate-dark"><ArrowRight className="h-4 w-4" /></Link>
          </div>
        </ScrollReveal>
      </div>

      <div className="border-t border-white/20">
        {services.map(([number, title, description], index) => (
          <ScrollReveal key={title} width="100%" delay={index * .04}>
            <Link to={title === "KSD Paint" ? "/ksd-paint" : "/services"} className="group grid grid-cols-[38px_1fr_auto] gap-x-4 gap-y-5 border-b border-white/20 py-7 transition-all duration-300 hover:bg-white/[0.035] md:grid-cols-[70px_1fr_1.2fr_auto] md:items-center md:rounded-[1.5rem] md:px-5 lg:py-9">
              <span className="font-mono text-[9px] tracking-[0.18em] text-white/35">{number}</span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl">{title}</h3>
              <p className="col-span-2 col-start-2 max-w-xl text-sm leading-6 text-white/55 md:col-auto">{description}</p>
              <ArrowUpRight className="col-start-3 row-start-1 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:col-auto md:row-auto" />
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesPreview;
