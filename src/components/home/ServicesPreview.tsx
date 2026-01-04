import { Link } from "react-router-dom";
import { Building2, HardHat, Home, Key, Paintbrush, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const services = [
  {
    icon: Home,
    title: "Real Estate Sales",
    description: "Premium residential and commercial properties in prime locations across Nigeria.",
  },
  {
    icon: HardHat,
    title: "Construction",
    description: "Residential, commercial, and infrastructure construction with world-class standards.",
  },
  {
    icon: Building2,
    title: "Property Development",
    description: "Comprehensive property development from land acquisition to project delivery.",
  },
  {
    icon: Key,
    title: "Property Management",
    description: "Professional management services ensuring optimal value for property owners.",
  },
  {
    icon: Paintbrush,
    title: "Paint Manufacturing",
    description: "High-quality paints manufactured to international standards for lasting finish.",
  },
  {
    icon: Truck,
    title: "Paint Distribution",
    description: "Nationwide distribution network ensuring accessibility across all regions.",
  },
];

const ServicesPreview = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal width="100%">
            <span className="inline-block text-accent font-medium mb-4">What We Do</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Solutions Across Industries
            </h2>
            <p className="text-muted-foreground">
              From real estate and construction to paint manufacturing, KANSADCO delivers 
              excellence across multiple sectors, providing end-to-end solutions for all 
              your property and construction needs.
            </p>
          </ScrollReveal>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.1} width="100%">
              <div
                className="group p-8 bg-card rounded-lg border border-border hover:border-accent/50 card-hover h-full"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <service.icon className="h-7 w-7 text-accent group-hover:text-accent-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
                >
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <ScrollReveal width="100%" delay={0.4}>
            <Button asChild size="lg" className="btn-gold">
              <Link to="/services">View All Services</Link>
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
