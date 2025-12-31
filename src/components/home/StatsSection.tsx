import { Award, Users, Building, Calendar } from "lucide-react";

const stats = [
  {
    icon: Building,
    value: "500+",
    label: "Projects Completed",
  },
  {
    icon: Users,
    value: "10,000+",
    label: "Satisfied Clients",
  },
  {
    icon: Calendar,
    value: "25+",
    label: "Years Experience",
  },
  {
    icon: Award,
    value: "50+",
    label: "Industry Awards",
  },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-accent-foreground" />
              </div>
              <p className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                {stat.value}
              </p>
              <p className="text-primary-foreground/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
