import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, useLayoutEffect, useRef } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>("section:not([data-no-route-reveal])"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: "0px 0px -7%" });

    sections.forEach((section, sectionIndex) => {
      section.classList.add("route-reveal");
      section.style.setProperty("--reveal-delay", `${Math.min(sectionIndex * 35, 105)}ms`);
      const items = Array.from(section.querySelectorAll<HTMLElement>("article, [data-reveal-item]"));
      items.forEach((item, itemIndex) => {
        item.classList.add("route-reveal-item");
        item.style.setProperty("--item-delay", `${Math.min(itemIndex * 55, 330)}ms`);
      });
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <motion.div
      ref={rootRef}
      initial={reduceMotion ? false : { opacity: .88, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : .34, ease: [.22, 1, .36, 1] }}
      className="w-full min-w-0 max-w-full overflow-x-clip transform-gpu"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
