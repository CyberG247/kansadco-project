import PageHero from "@/components/layout/PageHero";
import { ArrowUpRight, Mail } from "lucide-react";
import { getTeamLeader, useContent } from "@/lib/contentStore";

const memberLayout = (index: number) => {
  if (index === 0) return { column: "md:col-span-7", image: "aspect-[5/4]", title: "text-3xl md:text-4xl" };
  if (index === 1) return { column: "md:col-span-5 md:mt-24", image: "aspect-[4/5]", title: "text-3xl" };
  return {
    column: `md:col-span-4 ${index % 3 === 0 ? "md:mt-16" : ""}`,
    image: "aspect-[4/5]",
    title: "text-2xl md:text-3xl",
  };
};

const Team = () => {
  const { team, settings } = useContent();
  const published = team.filter((member) => member.status === "Published").sort((a, b) => a.sortOrder - b.sortOrder);
  const leader = getTeamLeader(team);
  const people = published.filter((member) => member.id !== leader?.id);

  return (
    <>
      <PageHero eyebrow="Our people" title={<>Expertise with<br /><em className="text-accent">shared intent.</em></>} description="Architects, engineers, property specialists and operators working as one team around the outcomes that matter." index="K / 04" />

      {leader && <section className="section-padding bg-background">
        <div className="container-custom grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {leader.image
              ? <div className="image-reveal aspect-[4/5] bg-muted"><img src={leader.image} alt={leader.name} className="h-full w-full object-cover object-top" /></div>
              : <div className="grid aspect-[4/5] place-items-center bg-muted font-display text-7xl text-muted-foreground/35" aria-hidden="true">{leader.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}</div>}
          </div>
          <div className="flex flex-col justify-between lg:col-span-6 lg:col-start-7 lg:py-8">
            <div><p className="eyebrow mb-8 text-accent">Leadership</p><h2 className="section-title">Vision, made <em className="text-accent">accountable.</em></h2></div>
            <div className="mt-12 border-t border-border pt-7">
              <h3 className="text-3xl">{leader.name}</h3><p className="mt-2 text-[10px] uppercase tracking-[.17em] text-accent">{leader.role}</p>
              {leader.bio && <p className="mt-7 max-w-2xl text-sm leading-7 text-muted-foreground">{leader.bio}</p>}
              {leader.email && <a href={`mailto:${leader.email}`} className="mt-7 inline-flex items-center gap-2 border-b border-border pb-2 font-mono text-[8px] uppercase tracking-[.15em] transition-colors hover:border-foreground"><Mail className="h-3.5 w-3.5" />Contact {leader.name}</a>}
            </div>
          </div>
        </div>
      </section>}

      <section className="border-t border-border bg-background py-20 md:py-28">
        <div className="container-custom">
          <div className="mb-10 flex items-end justify-between border-b border-border pb-6 md:mb-14">
            <p className="eyebrow text-accent">The wider team</p>
            <p className="font-mono text-[8px] uppercase tracking-[.16em] text-muted-foreground">{String(people.length).padStart(2, "0")} profiles</p>
          </div>
          <div className="grid gap-x-6 gap-y-16 md:grid-cols-12 md:gap-x-8 md:gap-y-20">
            {people.map((member, index) => {
              const layout = memberLayout(index);
              return <article data-reveal-item key={member.id} className={`group ${layout.column}`}>
                <div className={`image-reveal relative overflow-hidden rounded-[1.75rem] bg-slate-dark ${layout.image}`}>
                  {member.image
                    ? <img src={member.image} alt={member.name} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.035]" />
                    : <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.12),transparent_45%),linear-gradient(145deg,#1d2823,#09120e)] text-white"><span className="font-display text-7xl text-white/35">{member.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}</span></div>}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-dark/85 via-slate-dark/15 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-dark/45 px-3 py-2 font-mono text-[8px] tracking-[.18em] text-white backdrop-blur-md">{String(index + 2).padStart(2, "0")}</span>
                  {member.email && <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-slate-dark/35 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white hover:text-slate-dark"><Mail className="h-3.5 w-3.5" /></a>}
                  <p className="absolute bottom-5 left-5 right-5 font-mono text-[8px] uppercase tracking-[.16em] text-white/70">{member.discipline}</p>
                </div>
                <div className="mt-5 border-b border-border pb-5">
                  <h3 className={layout.title}>{member.name}</h3>
                  <p className="mt-2 text-[10px] font-medium uppercase tracking-[.16em] text-accent">{member.role}</p>
                  {member.bio && <p className="mt-4 max-w-xl text-xs leading-6 text-muted-foreground">{member.bio}</p>}
                </div>
              </article>;
            })}
            {people.length === 0 && <p className="py-12 text-sm text-muted-foreground md:col-span-12">More team profiles will be published here soon.</p>}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-dark py-20 text-white md:mx-4 md:my-4 md:rounded-[2.5rem]"><div className="container-custom flex flex-col gap-8 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow mb-6 text-white/55">Careers</p><h2 className="section-title">Do work that <em className="text-white/55">matters.</em></h2></div><a href={`mailto:${settings.primaryEmail}?subject=Career enquiry`} className="group flex items-center gap-3 border-b border-white/40 pb-3 font-mono text-[9px] font-semibold uppercase tracking-[.17em] transition-colors hover:border-white">Introduce yourself <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a></div></section>
    </>
  );
};

export default Team;
