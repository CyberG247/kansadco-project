import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useContent } from "@/lib/contentStore";

const placements = [
  { className: "lg:col-span-7", ratio: "aspect-[5/4]" },
  { className: "lg:col-span-5 lg:mt-32", ratio: "aspect-[4/5]" },
  { className: "lg:col-span-5 lg:ml-16", ratio: "aspect-[4/5]" },
  { className: "lg:col-span-7 lg:mt-24", ratio: "aspect-[5/4]" },
];

const ProjectsPreview = () => {
  const { projects } = useContent();
  const featured = projects.filter((project) => project.status === "Published").slice(0, 4);
  return (
  <section className="section-padding bg-background">
    <div className="container-custom">
      <div className="mb-16 grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <ScrollReveal width="100%">
          <p className="eyebrow mb-7 text-accent">Selected work</p>
          <h2 className="section-title max-w-4xl">Built for the life that happens <em className="text-accent">next.</em></h2>
        </ScrollReveal>
        <Link to="/projects" className="link-underline mb-2 flex w-fit items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.17em]">All projects <ArrowUpRight className="h-4 w-4" /></Link>
      </div>

      <div className="grid gap-x-7 gap-y-16 max-md:-mx-5 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:px-5 max-md:pb-4 [scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden lg:grid-cols-12 lg:gap-y-28">
        {featured.map((project, index) => (
          <ScrollReveal key={project.id} width="100%" delay={index % 2 ? .12 : 0} className={`max-md:min-w-[84vw] max-md:snap-center ${placements[index].className}`}>
            <Link to="/projects" className="group block">
              <div className={`image-reveal relative bg-muted ${placements[index].ratio}`}>
                <img src={project.image} alt={project.name} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-slate-dark/0 transition-colors duration-700 group-hover:bg-slate-dark/10" />
                <span className="absolute right-4 top-4 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-background text-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:rotate-45 group-hover:opacity-100"><ArrowUpRight className="h-4 w-4" /></span>
              </div>
              <div className="mt-5 grid grid-cols-[1fr_auto] gap-4 border-b border-border pb-5">
                <div><h3 className="text-2xl md:text-3xl">{project.name}</h3><p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{project.location}</p></div>
                <span className="pt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{project.type}</span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
  );
};

export default ProjectsPreview;
