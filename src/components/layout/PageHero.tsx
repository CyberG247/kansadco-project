import { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  image?: string;
  imageAlt?: string;
  index?: string;
}

const PageHero = ({ eyebrow, title, description, image, imageAlt = "", index = "K / 01" }: PageHeroProps) => (
  <section className="relative h-[88svh] min-h-[660px] overflow-hidden bg-slate-dark text-white md:mx-4 md:h-auto md:min-h-[650px] md:rounded-[2.5rem]">
    {image && <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover opacity-35" />}
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,16,12,.92)_0%,rgba(8,16,12,.7)_50%,rgba(8,16,12,.22)_100%)]" />
    <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:96px_96px]" />
    <div className="container-custom relative flex h-full min-h-[660px] flex-col justify-end pb-16 pt-32 md:min-h-[650px] md:pb-16">
      <p className="eyebrow mb-8 text-accent">{eyebrow}</p>
      <h1 className="max-w-5xl font-display text-[clamp(3.15rem,14vw,4.5rem)] leading-[.88] tracking-[-.045em] md:text-[clamp(3.6rem,8vw,8rem)]">{title}</h1>
      <div className="mt-10 grid gap-7 border-t border-white/25 pt-6 md:grid-cols-[1fr_1fr_auto]">
        <span className="hidden font-mono text-[9px] uppercase tracking-[.18em] text-white/45 md:block">KANSADCO · Nigeria</span>
        <p className="max-w-xl text-sm leading-7 text-white/65">{description}</p>
        <span className="font-mono text-[9px] uppercase tracking-[.18em] text-white/45">{index}</span>
      </div>
    </div>
  </section>
);

export default PageHero;
