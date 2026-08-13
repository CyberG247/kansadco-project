import { ScrollReveal } from "@/components/ui/ScrollReveal";

const stats = [
  ["2018", "Established in Nigeria"], ["03", "Core disciplines"],
  ["06", "Operating principles"], ["02", "Strategic offices"],
];

const StatsSection = () => (
  <section className="bg-background">
    <div className="container-custom border-b border-border py-16 md:py-20">
      <ScrollReveal width="100%">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <p className="section-title max-w-4xl">Progress, measured in places that <em className="text-accent">endure.</em></p>
          <div className="grid grid-cols-2 content-end border-t border-border">
            {stats.map(([value, label], index) => (
              <div key={label} className={`border-b border-border py-6 ${index % 2 === 0 ? "pr-4" : "border-l pl-5"}`}>
                <p className="font-display text-4xl tracking-tight md:text-5xl">{value}</p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default StatsSection;
