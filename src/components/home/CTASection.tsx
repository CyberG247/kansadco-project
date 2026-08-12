import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const CTASection = () => (
  <section className="border-t border-border bg-background px-0 text-foreground md:border-0 md:px-4 md:py-4">
    <Link to="/contact" className="group container-custom block py-24 md:rounded-[2.5rem] md:border md:border-border md:bg-card md:px-12 md:py-28 lg:px-16">
      <p className="eyebrow mb-9">Start a conversation</p>
      <div className="flex items-end justify-between gap-8">
        <h2 className="max-w-6xl font-display text-[clamp(3.5rem,9.5vw,10rem)] leading-[.82] tracking-[-.05em]">Let's shape what comes next.</h2>
        <span className="mb-2 hidden h-20 w-20 shrink-0 place-items-center rounded-full border border-current transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground md:grid"><ArrowUpRight className="h-7 w-7" /></span>
      </div>
    </Link>
  </section>
);

export default CTASection;
