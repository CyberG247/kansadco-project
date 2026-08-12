import { useState } from "react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import { ArrowUpRight } from "lucide-react";
import project4 from "@/assets/project-4.jpg";
import { useContent } from "@/lib/contentStore";

const Projects = () => {
  const { projects } = useContent();
  const [active, setActive] = useState("All");
  const published = projects.filter((project) => project.status !== "Draft");
  const categories = ["All", ...Array.from(new Set(published.map((project) => project.type)))];
  const visible = active === "All" ? published : published.filter((project) => project.type === active);
  return (
    <Layout>
      <PageHero eyebrow="Selected portfolio" title={<>Work with weight.<br /><em className="text-accent">Places with purpose.</em></>} description="A selection of residential, commercial and civic work shaped by local intelligence and delivered for long-term value." image={project4} imageAlt="River Kaduna Bridge" index="K / 03" />

      <section className="bg-background">
        <div className="container-custom flex gap-7 overflow-x-auto border-b border-border py-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => <button key={category} onClick={() => setActive(category)} className={`shrink-0 rounded-full border px-3.5 py-2 font-mono text-[9px] font-medium uppercase tracking-[.17em] transition-all duration-300 ${active === category ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}>{category}</button>)}
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom mb-7 flex items-center justify-between md:hidden"><p className="font-mono text-[8px] uppercase tracking-[.16em] text-muted-foreground">Swipe through projects</p><p className="font-mono text-[8px] text-muted-foreground">{String(visible.length).padStart(2, "0")}</p></div>
        <div className="container-custom grid gap-x-8 gap-y-20 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:pb-4 [scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden md:grid-cols-2">
          {visible.map((project, index) => (
            <article key={project.id} className={`group max-md:min-w-[84vw] max-md:snap-center ${index % 2 ? "md:mt-28" : ""}`}>
              <div className={`image-reveal relative bg-muted ${index % 3 === 1 ? "aspect-[4/5]" : "aspect-[5/4]"}`}>
                <img src={project.image} alt={project.name} className="h-full w-full object-cover" />
                <span className="absolute right-4 top-4 grid h-12 w-12 translate-y-2 place-items-center rounded-full bg-background opacity-0 transition-all group-hover:translate-y-0 group-hover:rotate-45 group-hover:opacity-100"><ArrowUpRight className="h-4 w-4" /></span>
              </div>
              <div className="mt-5 grid gap-5 border-b border-border pb-6 sm:grid-cols-[1fr_auto]">
                <div><p className="mb-2 text-[9px] uppercase tracking-[.18em] text-accent">{project.type} · {project.year}</p><h2 className="text-3xl md:text-4xl">{project.name}</h2><p className="mt-2 text-xs text-muted-foreground">{project.location}</p></div>
                <p className="max-w-xs text-xs leading-6 text-muted-foreground sm:text-right">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
