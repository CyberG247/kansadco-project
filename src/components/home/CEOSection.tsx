import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ceoPortrait from "@/assets/chairman.webp";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getTeamLeader, useContent } from "@/lib/contentStore";

const CEOSection = () => {
  const { team } = useContent();
  const leader = getTeamLeader(team);
  const leaderName = leader?.name ?? "Arch. Yunusa Ibrahim Hassan, MNIA";
  const leaderRole = leader?.role ?? "Founder & Chief Executive Officer";
  const leaderImage = leader?.image || ceoPortrait;

  return <section className="section-padding bg-background">
    <div className="container-custom">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4 lg:pt-20">
          <ScrollReveal direction="left" width="100%">
            <p className="eyebrow mb-8 text-accent">Our point of view</p>
            <p className="font-display text-4xl leading-[1.02] md:text-5xl">“Exceptional spaces are created through vision, integrity, precision and a commitment to excellence.”</p>
            <div className="mt-10 border-t border-border pt-5">
              <p className="text-sm font-medium">{leaderName}</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{leaderRole}</p>
            </div>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-5 lg:px-5">
          <ScrollReveal width="100%">
            <div className="image-reveal relative aspect-[4/5] bg-muted">
              <img src={leaderImage} alt={`${leaderName}, ${leaderRole}`} className="h-full w-full object-cover object-top grayscale-[12%]" />
              <span className="absolute bottom-4 right-4 rounded-full bg-background px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em]">Leadership · Abuja</span>
            </div>
          </ScrollReveal>
        </div>

        <div className="flex flex-col justify-end lg:col-span-3 lg:pb-8">
          <ScrollReveal direction="right" width="100%" delay={0.15}>
            <p className="text-sm leading-7 text-muted-foreground">Our practice connects architecture, construction and real estate so that ideas can move more clearly from concept to purposeful space. That integrated view supports stronger decisions, professional execution and lasting client relationships.</p>
            <Link to="/about" className="group mt-9 flex items-center justify-between border-b border-foreground pb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em]">
              Discover our story <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </div>
  </section>;
};

export default CEOSection;
