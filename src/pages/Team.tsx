import PageHero from "@/components/layout/PageHero";
import { ArrowUpRight, Mail } from "lucide-react";
import chairman from "@/assets/chairman.webp";

const people = [
  ["Arc. Fatima Ibrahim", "Chief Architect", "Architecture · Design"],
  ["Engr. Chukwuma Okafor", "Director of Construction", "Delivery · Civil works"],
  ["Hajia Aisha Mohammed", "Director of Real Estate", "Investment · Property"],
  ["Engr. David Adeleke", "Chief Engineer", "Structures · Infrastructure"],
  ["Mrs. Grace Okonkwo", "Finance Director", "Finance · Governance"],
  ["Mallam Yusuf Garba", "Head of Operations", "Operations · Quality"],
  ["Engr. Amaka Nwosu", "Project Manager", "Projects · Coordination"],
];

const Team = () => (
  <>
    <PageHero eyebrow="Our people" title={<>Expertise with<br /><em className="text-accent">shared intent.</em></>} description="Architects, engineers, property specialists and operators working as one team around the outcomes that matter." index="K / 04" />

    <section className="section-padding bg-background">
      <div className="container-custom grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="image-reveal aspect-[4/5] bg-muted"><img src={chairman} alt="Arc. Yunusa Hassan Ibrahim" className="h-full w-full object-cover object-top" /></div>
        </div>
        <div className="flex flex-col justify-between lg:col-span-6 lg:col-start-7 lg:py-8">
          <div><p className="eyebrow mb-8 text-accent">Leadership</p><h2 className="section-title">Vision, made <em className="text-accent">accountable.</em></h2></div>
          <div className="mt-12 border-t border-border pt-7">
            <h3 className="text-3xl">Arc. Yunusa Hassan Ibrahim</h3><p className="mt-2 text-[10px] uppercase tracking-[.17em] text-accent">Chairman / Chief Executive</p>
            <p className="mt-7 max-w-2xl text-sm leading-7 text-muted-foreground">With more than two decades across architecture, construction and property, he has shaped KANSADCO into an integrated practice defined by clarity, integrity and a commitment to Nigeria's built future.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-platinum py-24 md:mx-4 md:my-4 md:rounded-[2.5rem] md:py-32">
      <div className="container-custom">
        <div className="mb-14 grid gap-7 md:grid-cols-2 md:items-end"><div><p className="eyebrow mb-7 text-accent">The wider team</p><h2 className="section-title">Different disciplines.<br />One standard.</h2></div><p className="max-w-sm text-sm leading-7 text-muted-foreground md:justify-self-end">The best projects are collaborative. Our leaders connect specialist knowledge to decisive, coordinated delivery.</p></div>
        <div className="border-t border-border">
          {people.map(([name, role, discipline], index) => (
            <div data-reveal-item key={name} className="group grid grid-cols-[32px_1fr_auto] gap-x-3 gap-y-3 border-b border-border py-7 transition-colors duration-300 md:grid-cols-[70px_1.2fr_1fr_auto] md:items-center md:rounded-[1.5rem] md:px-4 md:hover:bg-background/55">
              <span className="font-mono text-[9px] tracking-[.18em] text-muted-foreground">0{index + 2}</span><h3 className="text-2xl md:text-3xl">{name}</h3><div className="col-start-2 md:col-auto"><p className="text-xs font-medium">{role}</p><p className="mt-1 font-mono text-[8px] uppercase tracking-[.15em] text-muted-foreground">{discipline}</p></div><a href="mailto:kansadco@gmail.com" aria-label={`Email ${name}`} className="col-start-3 row-start-1 grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:bg-foreground hover:text-background md:col-auto md:row-auto"><Mail className="h-3.5 w-3.5" /></a>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="border-t border-white/10 bg-slate-dark py-20 text-white md:mx-4 md:my-4 md:rounded-[2.5rem]"><div className="container-custom flex flex-col gap-8 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow mb-6 text-white/55">Careers</p><h2 className="section-title">Do work that <em className="text-white/55">matters.</em></h2></div><a href="mailto:kansadco@gmail.com?subject=Career enquiry" className="group flex items-center gap-3 border-b border-white/40 pb-3 font-mono text-[9px] font-semibold uppercase tracking-[.17em] transition-colors hover:border-white">Introduce yourself <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a></div></section>
  </>
);

export default Team;
