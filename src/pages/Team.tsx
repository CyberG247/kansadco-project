import Layout from "@/components/layout/Layout";
import { Linkedin, Mail } from "lucide-react";

const teamMembers = [
  {
    name: "Engr. Sadiq Abdullahi Kano",
    position: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=face",
    bio: "Visionary leader with 25+ years of experience in construction and real estate.",
  },
  {
    name: "Arc. Fatima Ibrahim",
    position: "Chief Architect",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face",
    bio: "Award-winning architect specializing in sustainable residential design.",
  },
  {
    name: "Engr. Chukwuma Okafor",
    position: "Director of Construction",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
    bio: "Civil engineer with expertise in large-scale infrastructure projects.",
  },
  {
    name: "Hajia Aisha Mohammed",
    position: "Director of Real Estate",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face",
    bio: "Real estate expert with extensive knowledge of Nigerian property market.",
  },
  {
    name: "Engr. David Adeleke",
    position: "Chief Engineer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
    bio: "Structural engineer with experience on major government projects.",
  },
  {
    name: "Mrs. Grace Okonkwo",
    position: "Finance Director",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=500&fit=crop&crop=face",
    bio: "Chartered accountant with expertise in real estate finance.",
  },
  {
    name: "Mallam Yusuf Garba",
    position: "Head of Operations",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&crop=face",
    bio: "Operations expert ensuring seamless project delivery.",
  },
  {
    name: "Engr. Amaka Nwosu",
    position: "Project Manager",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop&crop=face",
    bio: "PMP-certified project manager with focus on quality delivery.",
  },
];

const Team = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-primary">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="inline-block text-accent font-medium mb-4">Our Team</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Meet the Experts Behind Our Success
            </h1>
            <p className="text-primary-foreground/90 text-lg">
              Our team comprises experienced professionals in engineering, architecture, 
              real estate, and project management, all committed to delivering excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="group bg-card rounded-xl overflow-hidden shadow-lg card-hover"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-accent font-medium text-sm mb-3">{member.position}</p>
                  <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="py-20 bg-cream">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Join Our Team
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our growing team. 
            If you're passionate about construction, real estate, or making a difference, 
            we'd love to hear from you.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg font-medium hover:bg-gold-dark transition-colors shadow-gold"
          >
            View Open Positions
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Team;
