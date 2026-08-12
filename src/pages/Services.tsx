import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import { ArrowUpRight } from "lucide-react";
import heroConstruction from "@/assets/hero-construction.webp";
import paint from "@/assets/paint-service.jpg";
import project1 from "@/assets/project-1.jpg";

const services = [
  { title: "Real estate", statement: "Places to live. Assets to hold.", description: "Premium residential and commercial opportunities in strategic Nigerian locations, supported by clear documentation, flexible acquisition pathways and informed investment guidance.", items: ["Residential sales", "Commercial property", "Valuation", "Investment advisory"] },
  { title: "Construction", statement: "Complexity, made buildable.", description: "End-to-end delivery for residential, commercial and civil projects, led by rigorous planning, technical coordination, transparent controls and uncompromising site standards.", items: ["Building construction", "Civil engineering", "Roads and bridges", "Project controls"] },
  { title: "Property development", statement: "From raw land to lasting value.", description: "An integrated development service connecting land strategy, surveying, design, approvals, infrastructure and market positioning through one accountable team.", items: ["Land acquisition", "Masterplanning", "Infrastructure", "Development management"] },
  { title: "Property stewardship", statement: "Performance beyond handover.", description: "Operational care that protects the quality, income and experience of an asset over time—from tenant relationships and inspections to planned maintenance and reporting.", items: ["Asset operations", "Tenant management", "Maintenance", "Performance reporting"] },
  { title: "Paints & coatings", statement: "Finish that works harder.", description: "Durable interior, exterior and industrial coating systems developed for reliable coverage, climatic performance and consistent colour across projects of every scale.", items: ["Interior and exterior", "Industrial coatings", "Colour matching", "Technical support"] },
  { title: "Distribution", statement: "Quality, within reach.", description: "A growing dealer and logistics network making KANSADCO coating systems accessible across Nigeria with dependable fulfilment and professional support.", items: ["Nationwide logistics", "Dealer partnerships", "Bulk supply", "Quality assurance"] },
];

const Services = () => (
  <Layout>
    <PageHero eyebrow="Capabilities" title={<>One partner.<br /><em className="text-accent">Every stage.</em></>} description="We connect the disciplines that make places commercially sound, technically resolved and rewarding to experience." image={heroConstruction} imageAlt="Contemporary KANSADCO development" index="K / 02" />

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
      <div className="relative min-h-[480px]"><img src={paint} alt="KANSADCO paint systems" className="absolute inset-0 h-full w-full object-cover" /></div>
      <div className="flex flex-col justify-between p-8 md:p-16 lg:p-20"><div><p className="eyebrow mb-8 text-accent">Materials division</p><h2 className="section-title">Colour backed by <em className="text-accent">performance.</em></h2><p className="mt-8 max-w-lg text-sm leading-7 text-white/60">Our coatings capability brings the same standard of thinking to the surfaces that complete and protect built work.</p></div><a href="/contact" className="group mt-12 flex items-center justify-between border-b border-white/40 pb-4 text-[10px] font-semibold uppercase tracking-[.17em]">Discuss supply or distribution <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a></div>
    </section>

    <section className="relative min-h-[620px] overflow-hidden text-white md:mx-4 md:my-4 md:rounded-[2.5rem]"><img src={project1} alt="Rahmaniyya Estate" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-slate-dark/65" /><div className="container-custom relative flex min-h-[620px] flex-col justify-end py-20"><p className="eyebrow mb-7 text-accent">A shared standard</p><h2 className="section-title max-w-5xl">However we enter a project, we leave it <em className="text-accent">stronger.</em></h2></div></section>
  </Layout>
);

export default Services;
