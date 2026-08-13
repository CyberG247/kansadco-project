import PageHero from "@/components/layout/PageHero";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroConstruction from "@/assets/hero-construction.webp";
import paint from "@/assets/ksd-paint-hero.webp";
import project1 from "@/assets/project-1.jpg";

const services = [
  { title: "Architecture", statement: "Designing spaces with purpose.", description: "Architectural solutions that balance aesthetics, function and the distinct requirements of each brief—from the first idea through coordinated design development.", items: ["Architectural design", "Concept development", "3D visualization", "Space planning", "Residential & commercial"] },
  { title: "Construction", statement: "Built with precision.", description: "Professional delivery across residential, commercial and renovation projects, combining skilled workmanship, quality materials and disciplined project management.", items: ["Residential construction", "Commercial construction", "Renovation & remodeling", "Structural works", "Interior & exterior finishing"] },
  { title: "Real estate", statement: "Property with purpose.", description: "Property development and real estate opportunities shaped around modern living, functionality and lasting value for owners, residents and communities.", items: ["Property development", "Residential developments", "Property sales", "Real estate opportunities"] },
  { title: "Project delivery", statement: "Plan. Execute. Deliver.", description: "Clear project management and consultancy connecting design intent, technical decisions, site coordination, quality control and client communication.", items: ["Project management", "Construction consultancy", "Design coordination", "Quality oversight"] },
  { title: "KSD Paint", statement: "Timeless beauty. Dependable finish.", description: "Premium interior, exterior and surface-preparation paint systems informed by KANSADCO's direct experience designing, building and transforming spaces.", items: ["Silk", "Weather Shield", "Super Shield", "Screeding Paint"] },
];

const Services = () => (
  <>
    <PageHero eyebrow="Capabilities" title={<>From concept<br />to <em className="text-accent">creation.</em></>} description="Professional services across architecture, construction, real estate and project delivery—connected around one clear standard." image={heroConstruction} imageAlt="Contemporary KANSADCO development" index="K / 02" />

    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="mb-20 grid gap-8 lg:grid-cols-12"><p className="eyebrow text-accent lg:col-span-3">Our model</p><p className="section-title max-w-5xl lg:col-span-9">Separate expertise is useful. <em className="text-accent">Connected expertise</em> is transformative.</p></div>
        <div className="border-t border-border">
          {services.map((service, index) => (
            <article key={service.title} className="grid grid-cols-[34px_1fr] gap-x-4 gap-y-7 border-b border-border py-12 transition-colors duration-300 md:grid-cols-12 md:rounded-[1.75rem] md:px-5 md:py-16 md:hover:bg-muted/40">
              <span className="text-[10px] tracking-[.18em] text-muted-foreground md:col-span-1">0{index + 1}</span>
              <div className="col-start-2 md:col-span-4 md:col-start-auto"><h2 className="text-4xl md:text-5xl">{service.title}</h2><p className="mt-3 font-display text-xl italic text-accent">{service.statement}</p></div>
              <div className="col-start-2 md:col-span-4 md:col-start-auto"><p className="text-sm leading-7 text-muted-foreground">{service.description}</p></div>
              <ul className="col-start-2 space-y-2 md:col-span-3 md:col-start-auto md:pl-8">{service.items.map((item) => <li key={item} className="border-b border-border/70 pb-2 font-mono text-[9px] uppercase tracking-[.14em]">{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="grid bg-slate-dark text-white md:mx-4 md:my-4 md:overflow-hidden md:rounded-[2.5rem] lg:grid-cols-2">
      <div className="relative min-h-[480px]"><img src={paint} alt="KSD Paint products and curated colour samples" className="absolute inset-0 h-full w-full object-cover object-center" /></div>
      <div className="flex flex-col justify-between p-8 md:p-16 lg:p-20"><div><p className="eyebrow mb-8 text-accent">KSD Paint</p><h2 className="section-title">Colour backed by <em className="text-accent">performance.</em></h2><p className="mt-8 max-w-lg text-sm leading-7 text-white/60">Premium colour and quality finishes for spaces that matter, developed with a direct understanding of how interiors and exteriors are designed, built and used.</p></div><Link to="/ksd-paint" className="group mt-12 flex items-center justify-between border-b border-white/40 pb-4 text-[10px] font-semibold uppercase tracking-[.17em]">Explore KSD Paint <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link></div>
    </section>

    <section className="relative min-h-[620px] overflow-hidden text-white md:mx-4 md:my-4 md:rounded-[2.5rem]"><img src={project1} alt="Rahmaniyya Estate" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-slate-dark/65" /><div className="container-custom relative flex min-h-[620px] flex-col justify-end py-20"><p className="eyebrow mb-7 text-accent">A shared standard</p><h2 className="section-title max-w-5xl">However we enter a project, we leave it <em className="text-accent">stronger.</em></h2></div></section>
  </>
);

export default Services;
