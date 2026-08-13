import { ArrowLeft, ArrowRight, ArrowUpRight, Check, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useContent } from "@/lib/contentStore";

const ProjectDetail = () => {
  const { slug } = useParams();
  const { projects, loading } = useContent();
  const published = projects.filter((item) => item.status !== "Draft");
  const project = published.find((item) => item.slug === slug || item.id === slug);

  if (!project) return (
    <section className="grid min-h-[70vh] place-items-center bg-background px-5 py-32 text-center">
      <div>
        <p className="eyebrow text-accent">{loading ? "Loading portfolio" : "Project not found"}</p>
        <h1 className="mt-6 font-display text-6xl leading-none md:text-8xl">{loading ? "One moment." : "This story is unavailable."}</h1>
        {!loading && <Link to="/projects" className="mx-auto mt-9 flex h-12 w-fit items-center gap-3 rounded-full bg-foreground px-5 font-mono text-[8px] uppercase tracking-[.16em] text-background"><ArrowLeft className="h-4 w-4" />Back to projects</Link>}
      </div>
    </section>
  );

  const currentIndex = published.findIndex((item) => item.id === project.id);
  const nextProject = published[(currentIndex + 1) % published.length];
  const gallery = (project.galleryImages.length ? project.galleryImages : [project.image]).filter(Boolean);
  const facts = [
    ["Client", project.client || "Private client"],
    ["Scope", project.scope || project.type],
    ["Scale", project.area || "—"],
    ["Duration", project.duration || project.year],
  ];

  return (
    <>
      <section data-no-route-reveal className="relative min-h-[780px] overflow-hidden bg-slate-dark text-white md:mx-4 md:rounded-[2.5rem]">
        <img src={project.image} alt={project.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,16,12,.9)_0%,rgba(8,16,12,.62)_45%,rgba(8,16,12,.16)_78%),linear-gradient(0deg,rgba(8,16,12,.82)_0%,transparent_55%)]" />
        <div className="container-custom relative flex min-h-[780px] flex-col justify-between pb-12 pt-32 md:pb-16">
          <Link to="/projects" className="flex w-fit items-center gap-2 rounded-full border border-white/25 bg-black/10 px-4 py-2.5 font-mono text-[8px] uppercase tracking-[.16em] text-white/75 backdrop-blur transition-colors hover:border-white hover:text-white"><ArrowLeft className="h-3.5 w-3.5" />All projects</Link>
          <div className="max-w-5xl">
            <p className="eyebrow mb-7 text-accent">{project.type} · {project.location}</p>
            <h1 className="font-display text-[clamp(4rem,10vw,9rem)] leading-[.82] tracking-[-.055em]">{project.name}</h1>
            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/20 pt-5 font-mono text-[8px] uppercase tracking-[.16em] text-white/55">
              <span>{project.year}</span><span className="h-1 w-1 rounded-full bg-accent" /><span>{project.status}</span><span className="h-1 w-1 rounded-full bg-accent" /><span>{project.progress}% complete</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-7 text-accent">Project overview</p>
            <h2 className="section-title">Purpose, translated into <em className="text-accent">place.</em></h2>
            <p className="mt-9 whitespace-pre-line text-base leading-8 text-muted-foreground md:text-lg md:leading-9">{project.overview || project.description}</p>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card">
              {facts.map(([label, value]) => <div key={label} className="grid grid-cols-[90px_1fr] gap-5 border-b border-border p-5 last:border-0"><span className="font-mono text-[7px] uppercase tracking-[.15em] text-muted-foreground">{label}</span><span className="text-sm leading-6">{value}</span></div>)}
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-slate-dark py-24 text-white md:mx-4 md:rounded-[2.5rem] md:py-32">
        <div className="container-custom grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-7 text-accent">The brief</p>
            <h2 className="section-title">A clear response to a real <em className="text-white/40">challenge.</em></h2>
            <p className="mt-8 text-sm leading-8 text-white/58">{project.challenge || project.description}</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="border-l border-white/15 pl-7 md:pl-10">
              <p className="eyebrow mb-7 text-accent">Our response</p>
              <p className="font-display text-3xl leading-[1.18] text-white/88 md:text-5xl">{project.solution || project.overview}</p>
            </div>
            {project.features.length > 0 && <div className="mt-14 grid gap-3 sm:grid-cols-2">{project.features.map((feature) => <div key={feature} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-slate-dark"><Check className="h-3.5 w-3.5" /></span><span className="text-xs leading-5 text-white/65">{feature}</span></div>)}</div>}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="mb-14 flex flex-col gap-7 border-b border-border pb-7 md:flex-row md:items-end md:justify-between">
            <div><p className="eyebrow mb-6 text-accent">Project gallery</p><h2 className="section-title">The project, <em className="text-accent">in view.</em></h2></div>
            <p className="font-mono text-[8px] uppercase tracking-[.16em] text-muted-foreground">{String(gallery.length).padStart(2, "0")} images · <MapPin className="ml-1 inline h-3 w-3" /> {project.location}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-12">{gallery.map((image, index) => <figure key={`${image}-${index}`} className={`image-reveal overflow-hidden rounded-[1.75rem] bg-muted ${index % 3 === 0 ? "md:col-span-7" : "md:col-span-5"}`}><img src={image} alt={`${project.name} — view ${index + 1}`} loading={index ? "lazy" : "eager"} className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]" /></figure>)}</div>
        </div>
      </section>

      {nextProject && nextProject.id !== project.id && <section className="px-4 pb-4"><Link to={`/projects/${nextProject.slug}`} className="group relative block min-h-[520px] overflow-hidden rounded-[2.5rem] bg-slate-dark text-white"><img src={nextProject.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45 transition-transform duration-1000 group-hover:scale-[1.025]" /><div className="absolute inset-0 bg-gradient-to-r from-slate-dark/90 via-slate-dark/55 to-transparent" /><div className="container-custom relative flex min-h-[520px] flex-col justify-center"><p className="eyebrow text-accent">Next project</p><h2 className="mt-7 max-w-4xl font-display text-5xl leading-[.9] md:text-8xl">{nextProject.name}</h2><span className="mt-10 flex w-fit items-center gap-3 border-b border-white/35 pb-3 font-mono text-[8px] uppercase tracking-[.16em]">View project <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" /></span></div></Link></section>}

      <section className="section-padding bg-background text-center"><div className="container-custom"><p className="eyebrow text-accent">Start a conversation</p><h2 className="mx-auto mt-7 max-w-4xl section-title">Have a project that deserves this level of <em className="text-accent">attention?</em></h2><Link to="/contact" className="mx-auto mt-9 flex h-12 w-fit items-center gap-3 rounded-full bg-foreground px-5 font-mono text-[8px] uppercase tracking-[.16em] text-background transition-transform hover:-translate-y-0.5">Discuss your project <ArrowUpRight className="h-4 w-4" /></Link></div></section>
    </>
  );
};

export default ProjectDetail;
