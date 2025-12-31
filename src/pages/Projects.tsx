import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { MapPin } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import heroEstate from "@/assets/hero-estate.jpg";
import heroConstruction from "@/assets/hero-construction.jpg";

const projects = [
  {
    image: project1,
    title: "Rahmaniyya Estate Phase 1",
    location: "Utako, Abuja",
    category: "Estate",
    description: "A premium residential estate featuring 250 luxury homes with modern amenities, landscaped gardens, and 24/7 security.",
  },
  {
    image: project2,
    title: "Kano-Zaria Expressway Rehabilitation",
    location: "Kano State",
    category: "Road",
    description: "Complete rehabilitation of 45km stretch of the Kano-Zaria expressway, including bridges and drainage systems.",
  },
  {
    image: project3,
    title: "KANSADCO Corporate Tower",
    location: "Central Business District, Abuja",
    category: "Commercial",
    description: "A 15-storey commercial building featuring Grade A office spaces, retail areas, and underground parking.",
  },
  {
    image: project4,
    title: "River Kaduna Bridge",
    location: "Kaduna State",
    category: "Bridge",
    description: "A 500-meter dual carriageway bridge connecting communities across River Kaduna with modern engineering standards.",
  },
  {
    image: heroEstate,
    title: "Rahmaniyya Estate Phase 2",
    location: "Gwarinpa, Abuja",
    category: "Estate",
    description: "Expansion of our flagship estate with 400 additional homes, shopping complex, and recreational facilities.",
  },
  {
    image: heroConstruction,
    title: "Federal Ministry Complex",
    location: "Abuja",
    category: "Government",
    description: "Construction of a multi-building government complex housing three federal ministries with modern facilities.",
  },
];

const categories = ["All", "Estate", "Commercial", "Road", "Bridge", "Government"];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-accent font-medium mb-4">Our Portfolio</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Projects That Define Excellence
            </h1>
            <p className="text-primary-foreground/90 text-lg">
              Explore our portfolio of completed and ongoing projects across residential estates, 
              commercial buildings, roads, bridges, and government infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-background border-b">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.title}
                className="group bg-card rounded-xl overflow-hidden shadow-lg card-hover"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-accent/10 text-accent text-sm font-medium px-3 py-1 rounded mb-3">
                    {project.category}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
