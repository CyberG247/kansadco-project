import { motion, useAnimation, useInView, useReducedMotion, Variants } from "framer-motion";
import { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}

export const ScrollReveal = ({ 
  children, 
  width = "fit-content", 
  direction = "up", 
  delay = 0,
  className = ""
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const mainControls = useAnimation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  const variants: Variants = {
    hidden: { 
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : direction === "up" ? 28 : direction === "down" ? -28 : 0,
      x: reduceMotion ? 0 : direction === "left" ? 28 : direction === "right" ? -28 : 0,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0,
      transition: {
        duration: reduceMotion ? 0 : .72,
        ease: [0.22, 1, 0.36, 1],
        delay: delay,
      }
    },
  };

  return (
    <div ref={ref} style={{ position: "relative", width }} className={className}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={mainControls}
      >
        {children}
      </motion.div>
    </div>
  );
};
