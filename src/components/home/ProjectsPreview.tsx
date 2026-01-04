import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const projects = [
  {
    image: project1,
    title: "Rahmaniyya Estate Phase 1",
    location: "Utako, Abuja",
    category: "Residential Estate",
  },
  {
    image: project2,
    title: "Kano-Zaria Expressway",
    location: "Kano State",
    category: "Infrastructure",
  },
  {
    image: project3,
    title: "KANSADCO Corporate Tower",
    location: "Central Business District, Abuja",
    category: "Commercial Building",
  },
  {
    image: project4,
    title: "River Kaduna Bridge",
    location: "Kaduna State",
    category: "Government Project",
  },
];

const ProjectsPreview = () => {
  return (
    <section className="section-padding bg-platinum">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <ScrollReveal width="100%">
            <div>
              <span className="inline-block text-accent font-medium mb-4">Our Portfolio</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Featured Projects
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal width="fit-content" delay={0.2} className="self-start md:self-auto">
            <Button asChild variant="outline" className="btn-outline-gold">
              <Link to="/projects">
                View All Projects <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ScrollReveal key={project.title} delay={index * 0.1} width="100%">
              <Link
                to="/projects"
                className="group relative overflow-hidden rounded-lg card-hover block h-full"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-dark/90 via-slate-dark/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block bg-accent text-accent-foreground text-sm font-medium px-3 py-1 rounded mb-3">
                    {project.category}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-primary-foreground mb-2">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-primary-foreground/80">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{project.location}</span>
                  </div>
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
