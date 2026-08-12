import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import heroEstate from "@/assets/hero-estate.jpg";
import chairman from "@/assets/chairman.webp";
import project3 from "@/assets/project-3.jpg";

const values = [
  ["01", "Integrity", "Say what we mean. Deliver what we promise. Make every decision transparent."],
  ["02", "Excellence", "Treat quality as a system of a thousand considered details, not a finishing touch."],
  ["03", "Intelligence", "Combine technical judgement, market insight and local understanding before acting."],
  ["04", "Stewardship", "Build for the people who use a place today and those who inherit it tomorrow."],
];

const About = () => (
  <>
    <PageHero eyebrow="About KANSADCO" title={<>Built in Nigeria.<br /><em className="text-accent">Looking forward.</em></>} description="An integrated real estate, construction and materials company creating lasting value across Nigeria's built landscape." image={heroEstate} imageAlt="KANSADCO residential design" index="K / 01" />

    <section className="section-padding bg-background">
      <div className="container-custom grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4"><p className="eyebrow text-accent">Our story</p></div>
        <div className="lg:col-span-8"><h2 className="section-title">A business built around one belief: <em className="text-accent">better places create better futures.</em></h2><div className="mt-12 grid gap-8 border-t border-border pt-8 md:grid-cols-2"><p className="text-sm leading-7 text-muted-foreground">KANSADCO began with a clear ambition to raise the standard of Nigerian real estate and construction through quality, discipline and integrity. What started as a focused construction practice has become an integrated group spanning property, development, infrastructure and coatings.</p><p className="text-sm leading-7 text-muted-foreground">That breadth is not scale for its own sake. It allows us to see the whole life of a project, make stronger decisions earlier and stay accountable for the value we help create—from land and concept through delivery and long-term operation.</p></div></div>
      </div>
    </section>

    <section className="bg-platinum py-20 md:mx-4 md:my-4 md:rounded-[2.5rem] md:py-28"><div className="container-custom grid grid-cols-2 gap-8 md:grid-cols-4">{[["25+","Years of experience"],["500+","Projects delivered"],["10K+","Clients and residents"],["02","Strategic offices"]].map(([value,label])=><div data-reveal-item key={label} className="border-t border-border pt-5"><p className="font-display text-5xl md:text-6xl">{value}</p><p className="mt-3 text-[9px] uppercase tracking-[.16em] text-muted-foreground">{label}</p></div>)}</div></section>

    <section className="grid bg-slate-dark text-white md:mx-4 md:my-4 md:overflow-hidden md:rounded-[2.5rem] lg:grid-cols-2">
      <div className="min-h-[560px]"><img src={project3} alt="Commercial architecture" className="h-full w-full object-cover" /></div>
      <div className="flex flex-col justify-center p-8 md:p-16 lg:p-20"><p className="eyebrow mb-8 text-accent">Our direction</p><div className="border-b border-white/20 pb-12"><p className="text-[9px] uppercase tracking-[.17em] text-white/45">Mission</p><h2 className="mt-5 text-4xl md:text-5xl">To make world-class built outcomes locally relevant and consistently attainable.</h2></div><div className="pt-12"><p className="text-[9px] uppercase tracking-[.17em] text-white/45">Vision</p><h2 className="mt-5 text-4xl md:text-5xl">To be Nigeria's most trusted integrated development partner.</h2></div></div>
    </section>

    <section className="section-padding bg-background"><div className="container-custom grid gap-14 lg:grid-cols-12"><div className="lg:col-span-5"><div className="image-reveal aspect-[4/5]"><img src={chairman} alt="Arc. Yunusa Hassan Ibrahim" className="h-full w-full object-cover object-top" /></div></div><div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7"><p className="eyebrow mb-8 text-accent">Leadership</p><h2 className="section-title">Long-term thinking starts <em className="text-accent">at the top.</em></h2><p className="mt-9 max-w-xl text-sm leading-7 text-muted-foreground">Arc. Yunusa Hassan Ibrahim brings more than two decades of experience in architecture, real estate and construction to a simple leadership philosophy: create clarity, honour commitments and never allow growth to dilute standards.</p><div className="mt-9 border-l border-accent pl-5"><p className="text-sm font-medium">Arc. Yunusa Hassan Ibrahim</p><p className="mt-1 text-[9px] uppercase tracking-[.16em] text-muted-foreground">Chairman / Chief Executive</p></div></div></div></section>

    <section className="bg-platinum py-24 md:mx-4 md:my-4 md:rounded-[2.5rem] md:py-32"><div className="container-custom"><p className="eyebrow mb-14 text-accent">What guides us</p><div className="border-t border-border">{values.map(([number,title,description])=><div data-reveal-item key={title} className="grid gap-5 border-b border-border py-8 transition-colors duration-300 md:grid-cols-[80px_1fr_1fr] md:rounded-[1.5rem] md:px-5 md:hover:bg-background/45"><span className="text-[9px] tracking-[.17em] text-muted-foreground">{number}</span><h3 className="text-4xl">{title}</h3><p className="max-w-lg text-sm leading-7 text-muted-foreground">{description}</p></div>)}</div><Link to="/contact" className="group mt-12 flex w-fit items-center gap-3 border-b border-foreground pb-3 text-[10px] font-semibold uppercase tracking-[.17em]">Work with us <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link></div></section>
  </>
);

export default About;
