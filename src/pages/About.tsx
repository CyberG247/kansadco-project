import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import heroEstate from "@/assets/hero-estate.jpg";
import chairmanFallback from "@/assets/chairman.webp";
import project3 from "@/assets/project-3.jpg";
import { getTeamLeader, useContent } from "@/lib/contentStore";

const values = [
  ["01", "Innovation", "Bring modern ideas and thoughtful approaches to every part of the built environment."],
  ["02", "Excellence", "Hold design, workmanship and service to exceptional standards from brief to delivery."],
  ["03", "Reliability", "Build dependable relationships through professional planning, communication and execution."],
  ["04", "Integrity", "Work with honesty, accountability and transparency in every decision and commitment."],
  ["05", "Precision", "Give close attention to the details that define a resolved and enduring finished project."],
  ["06", "Value", "Create spaces and developments designed to remain useful, meaningful and valuable over time."],
];

const About = () => {
  const { team } = useContent();
  const leader = getTeamLeader(team);
  const leaderName = leader?.name ?? "Arch. Yunusa Ibrahim Hassan, MNIA";
  const leaderRole = leader?.role ?? "Founder & Chief Executive Officer";
  const leaderImage = leader?.image || chairmanFallback;
  const leaderBio = leader?.bio || "Arch. Yunusa Ibrahim Hassan, MNIA founded KANSADCO around a commitment to vision, responsibility, professionalism and excellence. His approach is to understand each client's aspirations, transform ideas into purposeful spaces and build lasting relationships through trust and professional execution.";

  return <>
    <PageHero eyebrow="About KANSADCO" title={<>Built on vision.<br /><em className="text-accent">Made to last.</em></>} description="Kansadco Services Nigerian Limited brings architecture, construction and real estate together to create purposeful spaces and lasting value." image={heroEstate} imageAlt="KANSADCO residential design" index="K / 01" />

    <section className="section-padding bg-background">
      <div className="container-custom grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4"><p className="eyebrow text-accent">Our story</p></div>
        <div className="lg:col-span-8"><h2 className="section-title">A journey built around one ambition: <em className="text-accent">design better, build better and create lasting value.</em></h2><div className="mt-12 grid gap-8 border-t border-border pt-8 md:grid-cols-2"><p className="text-sm leading-7 text-muted-foreground">Kansadco Services Nigerian Limited was established in 2018 with a vision to create meaningful value within Nigeria's built environment. Today, the company operates across architecture, construction and real estate.</p><p className="text-sm leading-7 text-muted-foreground">Bringing those disciplines together gives clients a more integrated way to create and develop spaces—from early concepts and visualization through construction, property opportunities and professional project delivery.</p></div></div>
      </div>
    </section>

    <section className="bg-platinum py-20 md:mx-4 md:my-4 md:rounded-[2.5rem] md:py-28"><div className="container-custom grid grid-cols-2 gap-8 md:grid-cols-4">{[["2018","Established in Nigeria"],["03","Core disciplines"],["06","Operating principles"],["02","Strategic offices"]].map(([value,label])=><div data-reveal-item key={label} className="border-t border-border pt-5"><p className="font-display text-5xl md:text-6xl">{value}</p><p className="mt-3 text-[9px] uppercase tracking-[.16em] text-muted-foreground">{label}</p></div>)}</div></section>

    <section className="grid bg-slate-dark text-white md:mx-4 md:my-4 md:overflow-hidden md:rounded-[2.5rem] lg:grid-cols-2">
      <div className="min-h-[560px]"><img src={project3} alt="Commercial architecture" className="h-full w-full object-cover" /></div>
      <div className="flex flex-col justify-center p-8 md:p-16 lg:p-20"><p className="eyebrow mb-8 text-accent">Our direction</p><div className="border-b border-white/20 pb-12"><p className="text-[9px] uppercase tracking-[.17em] text-white/45">Vision</p><h2 className="mt-5 text-4xl md:text-5xl">To become a leading and trusted name in architecture, construction and real estate, creating exceptional spaces and meaningful value for clients and communities.</h2></div><div className="pt-12"><p className="text-[9px] uppercase tracking-[.17em] text-white/45">Mission</p><h2 className="mt-5 text-4xl md:text-5xl">To deliver innovative, high-quality solutions through professionalism, integrity, creativity and excellence.</h2></div></div>
    </section>

    <section className="section-padding bg-background"><div className="container-custom grid gap-14 lg:grid-cols-12"><div className="lg:col-span-5"><div className="image-reveal aspect-[4/5]"><img src={leaderImage} alt={`${leaderName}, ${leaderRole}`} className="h-full w-full object-cover object-top" /></div></div><div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7"><p className="eyebrow mb-8 text-accent">Leadership</p><h2 className="section-title">Driving the vision <em className="text-accent">forward.</em></h2><p className="mt-9 max-w-xl text-sm leading-7 text-muted-foreground">{leaderBio}</p><div className="mt-9 border-l border-accent pl-5"><p className="text-sm font-medium">{leaderName}</p><p className="mt-1 text-[9px] uppercase tracking-[.16em] text-muted-foreground">{leaderRole}</p></div></div></div></section>

    <section className="bg-platinum py-24 md:mx-4 md:my-4 md:rounded-[2.5rem] md:py-32"><div className="container-custom"><p className="eyebrow mb-14 text-accent">What guides us</p><div className="border-t border-border">{values.map(([number,title,description])=><div data-reveal-item key={title} className="grid gap-5 border-b border-border py-8 transition-colors duration-300 md:grid-cols-[80px_1fr_1fr] md:rounded-[1.5rem] md:px-5 md:hover:bg-background/45"><span className="text-[9px] tracking-[.17em] text-muted-foreground">{number}</span><h3 className="text-4xl">{title}</h3><p className="max-w-lg text-sm leading-7 text-muted-foreground">{description}</p></div>)}</div><Link to="/contact" className="group mt-12 flex w-fit items-center gap-3 border-b border-foreground pb-3 text-[10px] font-semibold uppercase tracking-[.17em]">Work with us <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link></div></section>
  </>;
};

export default About;
