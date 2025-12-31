import { Quote } from "lucide-react";
import ceoPortrait from "@/assets/ceo-portrait.jpg";

const CEOSection = () => {
  return (
    <section className="section-padding bg-cream">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* CEO Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={ceoPortrait}
                alt="CEO of KANSADCO"
                className="w-full max-w-md mx-auto rounded-lg shadow-xl"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-accent/20 rounded-lg -z-0 hidden lg:block" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-4 border-accent rounded-lg -z-0 hidden lg:block" />
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-medium">From the CEO's Desk</span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Building Nigeria's Future, One Project at a Time
            </h2>

            <div className="relative mb-6">
              <Quote className="absolute -left-2 -top-2 h-8 w-8 text-accent/30" />
              <p className="text-muted-foreground leading-relaxed pl-8">
                At KANSADCO, we are committed to excellence in every endeavor. Our vision extends beyond 
                constructing buildings – we are architects of dreams, builders of communities, and 
                partners in Nigeria's development story.
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">
              With decades of combined experience in real estate, construction, and infrastructure 
              development, our team brings unmatched expertise to every project. We take pride in 
              delivering quality that exceeds expectations, maintaining transparency in all dealings, 
              and fostering lasting relationships with our clients, partners, and communities.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              As we continue to expand our footprint across Nigeria, from the federal capital to the 
              ancient city of Kano, we remain dedicated to our core values: integrity, innovation, 
              and impact. Together, we are building not just structures, but a legacy of excellence 
              for generations to come.
            </p>

            <div className="border-l-4 border-accent pl-4">
              <p className="font-display text-xl font-semibold text-foreground">
                Engr. Sadiq Abdullahi Kano
              </p>
              <p className="text-muted-foreground">Founder & Chief Executive Officer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CEOSection;
