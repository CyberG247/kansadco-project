import { Award, Users, Building, Calendar } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number | null = null;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return { count, countRef };
};

const StatItem = ({ stat, index }: { stat: any, index: number }) => {
  const { count, countRef } = useCounter(stat.number);
  
  return (
    <div
      ref={countRef}
      className="text-center p-6 rounded-2xl transition-all duration-300 hover:bg-white/5 hover:scale-105 group border border-transparent hover:border-accent/20"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-16 h-16 bg-accent/10 group-hover:bg-accent rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
        <stat.icon className="h-8 w-8 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
      </div>
      <p className="font-display text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 group-hover:from-accent group-hover:to-gold mb-2 transition-all duration-300">
        {count}{stat.suffix}
      </p>
      <p className="text-primary-foreground/60 font-medium tracking-wide uppercase text-sm group-hover:text-primary-foreground/90 transition-colors">
        {stat.label}
      </p>
    </div>
  );
};

const stats = [
  {
    icon: Building,
    number: 500,
    suffix: "+",
    label: "Projects Completed",
  },
  {
    icon: Users,
    number: 10000,
    suffix: "+",
    label: "Satisfied Clients",
  },
  {
    icon: Calendar,
    number: 25,
    suffix: "+",
    label: "Years Experience",
  },
  {
    icon: Award,
    number: 50,
    suffix: "+",
    label: "Industry Awards",
  },
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
      <div className="absolute -left-20 top-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute -right-20 bottom-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.1} width="100%">
              <StatItem stat={stat} index={index} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
