import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  image?: string;
  imageAlt?: string;
  index?: string;
}

const PageHero = ({ eyebrow, title, description, image, imageAlt = "", index = "K / 01" }: PageHeroProps) => {
  const reduceMotion = useReducedMotion();
  const enter = (delay: number, distance = 18) => reduceMotion
    ? { initial: false as const, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: distance }, animate: { opacity: 1, y: 0 }, transition: { duration: .72, delay, ease: [.22, 1, .36, 1] as const } };

  return <section data-no-route-reveal className="relative h-[88svh] min-h-[660px] overflow-hidden bg-slate-dark text-white md:mx-4 md:h-auto md:min-h-[650px] md:rounded-[2.5rem]">
    {image && <motion.img initial={reduceMotion ? false : { scale: 1.055, opacity: .22 }} animate={{ scale: 1, opacity: .35 }} transition={{ duration: reduceMotion ? 0 : 1.35, ease: [.22, 1, .36, 1] }} src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover will-change-transform" />}
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,16,12,.92)_0%,rgba(8,16,12,.7)_50%,rgba(8,16,12,.22)_100%)]" />
    <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:96px_96px]" />
    <div className="container-custom relative flex h-full min-h-[660px] flex-col justify-end pb-16 pt-32 md:min-h-[650px] md:pb-16">
      <motion.p {...enter(.06, 12)} className="eyebrow mb-8 text-accent">{eyebrow}</motion.p>
      <motion.h1 {...enter(.12, 24)} className="max-w-5xl font-display text-[clamp(3.15rem,14vw,4.5rem)] leading-[.88] tracking-[-.045em] md:text-[clamp(3.6rem,8vw,8rem)]">{title}</motion.h1>
      <motion.div {...enter(.2, 16)} className="mt-10 grid gap-7 border-t border-white/25 pt-6 md:grid-cols-[1fr_1fr_auto]">
        <span className="hidden font-mono text-[9px] uppercase tracking-[.18em] text-white/45 md:block">KANSADCO · Nigeria</span>
        <p className="max-w-xl text-sm leading-7 text-white/65">{description}</p>
        <span className="font-mono text-[9px] uppercase tracking-[.18em] text-white/45">{index}</span>
      </motion.div>
    </div>
  </section>;
};

export default PageHero;
