import Layout from "@/components/layout/Layout";
import { Building2, HardHat, Home, Key, Paintbrush, Truck, Check } from "lucide-react";
import paintService from "@/assets/paint-service.jpg";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const services = [
  {
    icon: Home,
    title: "Real Estate Sales",
    description:
      "We offer premium residential and commercial properties in strategic locations across Nigeria. From luxury apartments to sprawling estates, we help you find the perfect property.",
    features: [
      "Premium locations in Abuja and Kano",
      "Flexible payment plans",
      "Title documentation support",
      "Property valuation services",
      "Investment advisory",
    ],
  },
  {
    icon: HardHat,
    title: "Construction",
    description:
      "Our construction division handles projects of all scales, from residential buildings to major infrastructure. We deliver on time, within budget, and to the highest standards.",
    features: [
      "Residential construction",
      "Commercial buildings",
      "Industrial facilities",
      "Road construction",
      "Bridge engineering",
    ],
  },
  {
    icon: Building2,
    title: "Property Development",
    description:
      "From land acquisition to project delivery, we provide end-to-end property development solutions. Our estates are designed for modern living with world-class amenities.",
    features: [
      "Land acquisition & surveying",
      "Master planning & design",
      "Infrastructure development",
      "Estate management",
      "Smart home integration",
    ],
  },
  {
    icon: Key,
    title: "Property Management",
    description:
      "Our property management services ensure your investment is well-maintained and profitable. We handle everything from tenant relations to maintenance.",
    features: [
      "Tenant screening & placement",
      "Rent collection",
      "Maintenance coordination",
      "Financial reporting",
      "Property inspections",
    ],
  },
  {
    icon: Paintbrush,
    title: "Paint Manufacturing",
    description:
      "KANSADCO Paints are manufactured to international standards, offering superior coverage, durability, and a wide range of colors for all applications.",
    features: [
      "Interior & exterior paints",
      "Industrial coatings",
      "Eco-friendly formulations",
      "Color matching services",
      "Technical support",
    ],
  },
  {
    icon: Truck,
    title: "Paint Distribution",
    description:
      "Our extensive distribution network ensures KANSADCO paints are available across Nigeria. Dealers and retailers can partner with us for competitive pricing.",
    features: [
      "Nationwide delivery",
      "Dealer partnerships",
      "Bulk order discounts",
      "Quick turnaround",
      "Quality guarantee",
    ],
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={paintService}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <ScrollReveal width="100%">
              <span className="inline-block text-accent font-medium mb-4">Our Services</span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Comprehensive Solutions for All Your Needs
              </h1>
              <p className="text-primary-foreground/90 text-lg">
                From real estate and construction to paint manufacturing, KANSADCO delivers 
                excellence across multiple sectors with world-class standards.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <ScrollReveal direction={index % 2 === 1 ? "left" : "right"} width="100%">
                    <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                      <service.icon className="h-8 w-8 text-accent" />
                    </div>
                    <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center shrink-0">
                            <Check className="h-3 w-3 text-accent-foreground" />
                          </div>
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollReveal>
                </div>
                <div
                  className={`bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl p-8 flex items-center justify-center min-h-[300px] ${
                    index % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <ScrollReveal direction={index % 2 === 1 ? "right" : "left"} width="100%">
                    <service.icon className="h-32 w-32 text-accent/40" />
                  </ScrollReveal>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream">
        <div className="container-custom text-center">
          <ScrollReveal width="100%">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your project requirements. Our team is ready to 
              deliver exceptional results for you.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg font-medium hover:bg-gold-dark transition-colors shadow-gold"
            >
              Contact Us Today
            </a>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
