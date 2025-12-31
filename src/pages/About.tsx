import Layout from "@/components/layout/Layout";
import { Award, Target, Eye, Users, Building, Calendar } from "lucide-react";
import ceoPortrait from "@/assets/ceo-portrait.jpg";
import heroEstate from "@/assets/hero-estate.jpg";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={heroEstate}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-accent font-medium mb-4">About Us</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Building Nigeria's Future Since Establishment
            </h1>
            <p className="text-primary-foreground/90 text-lg">
              KANSADCO is a multi-sector company operating in real estate, construction, 
              property development, and paint manufacturing. We are committed to excellence 
              and delivering world-class projects across Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-accent font-medium mb-4">Our Story</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Legacy of Excellence and Innovation
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                KANSADCO was founded with a singular vision: to transform the Nigerian real estate 
                and construction landscape through quality, innovation, and integrity. From our 
                humble beginnings, we have grown into a multi-sector powerhouse with operations 
                spanning real estate, construction, infrastructure development, and paint manufacturing.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our journey has been marked by landmark projects that have shaped communities and 
                contributed to national development. From residential estates that provide homes 
                for thousands of families to infrastructure projects that connect regions, KANSADCO 
                has consistently delivered excellence.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, with offices in Abuja and Kano, we continue to expand our footprint while 
                maintaining the core values that have defined our success: quality without compromise, 
                customer-centricity, and a commitment to Nigeria's development.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-accent/10 rounded-lg p-6 text-center">
                <Building className="h-10 w-10 text-accent mx-auto mb-3" />
                <p className="font-display text-3xl font-bold text-foreground">500+</p>
                <p className="text-muted-foreground text-sm">Projects Completed</p>
              </div>
              <div className="bg-accent/10 rounded-lg p-6 text-center">
                <Users className="h-10 w-10 text-accent mx-auto mb-3" />
                <p className="font-display text-3xl font-bold text-foreground">10K+</p>
                <p className="text-muted-foreground text-sm">Happy Clients</p>
              </div>
              <div className="bg-accent/10 rounded-lg p-6 text-center">
                <Calendar className="h-10 w-10 text-accent mx-auto mb-3" />
                <p className="font-display text-3xl font-bold text-foreground">25+</p>
                <p className="text-muted-foreground text-sm">Years Experience</p>
              </div>
              <div className="bg-accent/10 rounded-lg p-6 text-center">
                <Award className="h-10 w-10 text-accent mx-auto mb-3" />
                <p className="font-display text-3xl font-bold text-foreground">50+</p>
                <p className="text-muted-foreground text-sm">Awards Won</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl p-8 md:p-12 shadow-lg">
              <div className="w-14 h-14 bg-accent rounded-lg flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To deliver world-class real estate, construction, and infrastructure solutions that 
                meet international standards while addressing local needs. We are committed to 
                creating value for our clients, partners, and communities through innovation, 
                quality, and sustainable practices.
              </p>
            </div>
            <div className="bg-card rounded-xl p-8 md:p-12 shadow-lg">
              <div className="w-14 h-14 bg-accent rounded-lg flex items-center justify-center mb-6">
                <Eye className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be Nigeria's most trusted and preferred partner in real estate, construction, 
                and property development. We aspire to be recognized as a beacon of excellence, 
                setting industry standards and contributing significantly to Nigeria's infrastructural 
                development and economic growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-block text-accent font-medium mb-4">Leadership</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Meet Our Founder & CEO
              </h2>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Engr. Sadiq Abdullahi Kano
              </h3>
              <p className="text-accent font-medium mb-6">Founder & Chief Executive Officer</p>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Engr. Sadiq Abdullahi Kano is a visionary leader with over two decades of experience 
                in the construction and real estate industry. A graduate of Civil Engineering from 
                Ahmadu Bello University, Zaria, he has led KANSADCO from a small construction firm 
                to a diversified conglomerate with operations across multiple sectors.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Under his leadership, KANSADCO has completed over 500 projects, including major 
                infrastructure works for federal and state governments, residential estates housing 
                thousands of families, and commercial developments that have transformed urban landscapes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Engr. Kano is a Fellow of the Nigerian Society of Engineers (FNSE) and serves on 
                several industry boards. His commitment to excellence, integrity, and national 
                development continues to drive KANSADCO's growth and impact.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <img
                  src={ceoPortrait}
                  alt="Engr. Sadiq Abdullahi Kano - CEO of KANSADCO"
                  className="w-full max-w-md mx-auto rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-accent/20 rounded-lg -z-10 hidden lg:block" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-accent font-medium mb-4">Our Values</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
              The Principles That Guide Us
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Integrity", desc: "Honest and transparent in all our dealings" },
              { title: "Excellence", desc: "Committed to the highest quality standards" },
              { title: "Innovation", desc: "Embracing new technologies and methods" },
              { title: "Sustainability", desc: "Building for today and future generations" },
            ].map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-2xl font-bold text-accent-foreground">
                    {value.title.charAt(0)}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-primary-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-primary-foreground/80">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
