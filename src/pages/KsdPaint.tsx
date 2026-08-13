import { useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Droplets, Paintbrush, ShieldCheck, Sparkles, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/lib/contentStore";
import heroImage from "@/assets/ksd-paint-hero.webp";
import interiorImage from "@/assets/ksd-paint-interior.webp";
import exteriorImage from "@/assets/ksd-paint-exterior.webp";

const products = [
  {
    number: "01", name: "Silk", category: "Premium interior acrylic latex",
    description: "A refined interior finish developed for durability, easy maintenance and a subtle silk sheen that gives colour greater depth.",
    traits: ["High durability", "Easy clean", "Humidity resistance"], color: "#c97b59",
  },
  {
    number: "02", name: "Weather Shield", category: "Premium exterior acrylic latex · Textured coating",
    description: "A resilient textured exterior coating designed to deliver attractive, dependable finishes in demanding weather conditions.",
    traits: ["Exterior protection", "Textured finish", "Humidity resistance"], color: "#31513d",
  },
  {
    number: "03", name: "Super Shield", category: "Premium interior & exterior acrylic latex",
    description: "A versatile acrylic latex coating for suitable interior and exterior applications where consistent colour and performance matter.",
    traits: ["Multi-surface", "Easy clean", "Dependable coverage"], color: "#d7b36a",
  },
  {
    number: "04", name: "Screeding Paint", category: "Surface preparation & finishing",
    description: "A practical KSD Paint solution for appropriate surface preparation and finishing, creating a better foundation for the final result.",
    traits: ["Surface preparation", "Smooth foundation", "Finishing support"], color: "#d9d2c3",
  },
];

const colourFamilies = [
  { name: "Whites & neutrals", colors: ["#f2eadb", "#d8cebb", "#aca28d"] },
  { name: "Earth tones", colors: ["#d0916e", "#a96849", "#704737"] },
  { name: "Greens", colors: ["#a8b095", "#66765c", "#263f32"] },
  { name: "Blues", colors: ["#a9bec1", "#607e86", "#294950"] },
  { name: "Warm colours", colors: ["#e2b867", "#d17a4c", "#a74737"] },
  { name: "Dark & statement", colors: ["#342f2c", "#24342f", "#18252b"] },
];

const emptyDealerForm = { businessName: "", contactPerson: "", phone: "", email: "", location: "", businessType: "", message: "" };

const KsdPaint = () => {
  const { addEnquiry } = useContent();
  const { toast } = useToast();
  const [form, setForm] = useState(emptyDealerForm);
  const [website, setWebsite] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitted(false);
    try {
      await addEnquiry({
        name: `${form.contactPerson.trim()} · ${form.businessName.trim()}`,
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        subject: `KSD Paint dealer application · ${form.businessType}`,
        message: [`Business: ${form.businessName}`, `Location: ${form.location}`, `Business type: ${form.businessType}`, "", form.message].join("\n"),
        source: "Contact",
        website,
        formStartedAt,
      });
      setForm(emptyDealerForm);
      setWebsite("");
      setFormStartedAt(Date.now());
      setSubmitted(true);
    } catch (error) {
      toast({ title: "Application not sent", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <section data-no-route-reveal className="relative min-h-[780px] overflow-hidden bg-slate-dark text-white md:mx-4 md:rounded-[2.5rem]">
        <img src={heroImage} alt="Premium paint cans, roller and curated colour swatches" className="absolute inset-0 h-full w-full object-cover object-[64%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,16,12,.94)_0%,rgba(8,16,12,.77)_38%,rgba(8,16,12,.18)_72%),linear-gradient(0deg,rgba(8,16,12,.72)_0%,transparent_45%)]" />
        <div className="absolute inset-0 opacity-[.07] [background-image:linear-gradient(rgba(255,255,255,.32)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.32)_1px,transparent_1px)] [background-size:96px_96px]" />
        <div className="container-custom relative flex min-h-[780px] flex-col justify-end pb-14 pt-32 md:pb-16">
          <div className="mb-auto mt-auto max-w-3xl">
            <p className="eyebrow mb-8 text-accent">A KANSADCO company · Colour & coatings</p>
            <h1 className="font-display text-[clamp(4.25rem,16vw,8.75rem)] leading-[.78] tracking-[-.055em]">KSD<br /><span className="text-white/40">Paint.</span></h1>
            <p className="mt-10 font-display text-3xl italic text-accent md:text-5xl">Timeless beauty.</p>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/68 md:text-base">Premium colour and quality finishes for spaces that matter—bringing character and dependable performance to modern interiors and exteriors.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#products" className="group flex h-12 items-center gap-3 rounded-full bg-white px-5 font-mono text-[9px] font-semibold uppercase tracking-[.16em] text-slate-dark transition-all hover:-translate-y-0.5 hover:bg-accent">Explore products <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-1" /></a>
              <a href="#colours" className="flex h-12 items-center rounded-full border border-white/30 px-5 font-mono text-[9px] font-semibold uppercase tracking-[.16em] transition-colors hover:border-white hover:bg-white/10">Explore colours</a>
            </div>
          </div>
          <div className="mt-14 flex items-center justify-between border-t border-white/20 pt-5 font-mono text-[8px] uppercase tracking-[.18em] text-white/45"><span>KSD / 01</span><span>Interiors · Exteriors · Nigeria</span></div>
        </div>
      </section>

      <section id="products" className="section-padding scroll-mt-24 bg-background">
        <div className="container-custom">
          <div className="mb-16 grid gap-8 lg:grid-cols-12 lg:items-end"><div className="lg:col-span-8"><p className="eyebrow mb-7 text-accent">Product collection</p><h2 className="section-title">Find your <em className="text-accent">finish.</em></h2></div><p className="max-w-sm text-sm leading-7 text-muted-foreground lg:col-span-4">Four purposeful systems for interior beauty, exterior resilience and considered surface preparation.</p></div>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="image-reveal relative min-h-[500px] overflow-hidden rounded-[2rem] bg-muted lg:sticky lg:top-24 lg:col-span-5 lg:h-[calc(100vh-8rem)] lg:max-h-[740px]"><img src={heroImage} alt="Paint products and colour samples" className="absolute inset-0 h-full w-full object-cover object-[70%_center]" /><div className="absolute inset-0 bg-gradient-to-t from-slate-dark/75 via-transparent to-transparent" /><p className="absolute bottom-6 left-6 right-6 font-display text-3xl text-white">Colour, backed by <em className="text-white/55">performance.</em></p></div>
            <div className="border-t border-border lg:col-span-6 lg:col-start-7">
              {products.map((product) => <article data-reveal-item key={product.name} className="group border-b border-border py-9 md:py-11">
                <div className="grid gap-5 sm:grid-cols-[50px_1fr_auto] sm:items-start"><span className="font-mono text-[8px] tracking-[.18em] text-muted-foreground">{product.number}</span><div><h3 className="text-3xl md:text-4xl">{product.name}</h3><p className="mt-2 font-mono text-[8px] uppercase tracking-[.15em] text-accent">{product.category}</p><p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">{product.description}</p><div className="mt-5 flex flex-wrap gap-2">{product.traits.map((trait) => <span key={trait} className="rounded-full border border-border px-3 py-2 font-mono text-[7px] uppercase tracking-[.12em]">{trait}</span>)}</div></div><span className="h-10 w-10 rounded-full border-4 border-background shadow-[0_0_0_1px_hsl(var(--border))]" style={{ backgroundColor: product.color }} aria-hidden="true" /></div>
              </article>)}
            </div>
          </div>
        </div>
      </section>

      <section id="colours" className="scroll-mt-24 bg-slate-dark py-24 text-white md:mx-4 md:my-4 md:rounded-[2.5rem] md:py-32">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-12"><div className="lg:col-span-5"><p className="eyebrow mb-7 text-accent">KSD colours</p><h2 className="section-title">Colour your <em className="text-white/45">world.</em></h2><p className="mt-7 max-w-md text-sm leading-7 text-white/55">Find the colour that feels like you. Explore shade families designed for different moods, rooms and architectural expressions.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">{colourFamilies.map((family, index) => <article data-reveal-item key={family.name} className="rounded-[1.5rem] border border-white/12 bg-white/[.045] p-5"><div className="flex gap-2">{family.colors.map((color) => <span key={color} className="aspect-square flex-1 rounded-xl" style={{ backgroundColor: color }} />)}</div><div className="mt-5 flex items-center justify-between"><p className="text-sm">{family.name}</p><span className="font-mono text-[7px] text-white/35">0{index + 1}</span></div></article>)}</div></div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom"><div className="mb-14 flex items-end justify-between border-b border-border pb-6"><div><p className="eyebrow mb-6 text-accent">KSD inspiration</p><h2 className="section-title">See your space <em className="text-accent">differently.</em></h2></div><p className="hidden font-mono text-[8px] uppercase tracking-[.15em] text-muted-foreground md:block">Interior · Exterior</p></div><div className="grid gap-14 md:grid-cols-12 md:gap-8"><article className="group md:col-span-7"><div className="image-reveal aspect-[5/4] overflow-hidden rounded-[2rem]"><img src={interiorImage} alt="Warm contemporary living room with a refined silk paint finish" loading="lazy" className="h-full w-full object-cover" /></div><div className="mt-5 border-b border-border pb-5"><p className="font-mono text-[8px] uppercase tracking-[.16em] text-accent">Living · Interior</p><h3 className="mt-2 text-3xl">Quiet colour. Rich character.</h3></div></article><article className="group md:col-span-5 md:mt-24"><div className="image-reveal aspect-[4/5] overflow-hidden rounded-[2rem]"><img src={exteriorImage} alt="Contemporary residence with textured exterior paint" loading="lazy" className="h-full w-full object-cover" /></div><div className="mt-5 border-b border-border pb-5"><p className="font-mono text-[8px] uppercase tracking-[.16em] text-accent">Residential · Exterior</p><h3 className="mt-2 text-3xl">Protection can be beautiful.</h3></div></article></div></div>
      </section>

      <section className="bg-platinum py-24 md:mx-4 md:my-4 md:rounded-[2.5rem] md:py-32"><div className="container-custom grid gap-12 lg:grid-cols-12"><div className="lg:col-span-4"><p className="eyebrow text-accent">A brand built for beautiful spaces</p></div><div className="lg:col-span-8"><h2 className="section-title">Made by people who understand how spaces are <em className="text-accent">designed and built.</em></h2><p className="mt-9 max-w-3xl text-sm leading-7 text-muted-foreground">KSD Paint is a paint manufacturing subsidiary of Kansadco Services Nigerian Limited. Our connection to architecture, construction and real estate gives us a direct understanding of the needs of the people who design, build and transform spaces.</p><div className="mt-10 grid gap-3 sm:grid-cols-2">{[[ShieldCheck,"Quality"],[Droplets,"Consistency"],[Sparkles,"Colour"],[Paintbrush,"Innovation"]].map(([Icon,label]) => { const ItemIcon = Icon as typeof ShieldCheck; return <div key={label as string} className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background"><ItemIcon className="h-4 w-4" /></span><span className="font-mono text-[8px] uppercase tracking-[.15em]">{label as string}</span></div>; })}</div></div></div></section>

      <section id="dealers" className="section-padding scroll-mt-24 bg-background">
        <div className="container-custom grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4"><span className="grid h-12 w-12 place-items-center rounded-full bg-slate-dark text-white"><Store className="h-5 w-5" /></span><p className="eyebrow mb-7 mt-10 text-accent">Become a dealer</p><h2 className="section-title">Join the KSD Paint <em className="text-accent">network.</em></h2><p className="mt-7 max-w-md text-sm leading-7 text-muted-foreground">Interested in becoming an authorized KSD Paint dealer or distributor? Tell us about your business and the market you serve.</p></div>
          <form onSubmit={submit} className="grid gap-6 lg:col-span-7 lg:col-start-6 md:grid-cols-2">
            <label className="absolute -left-[10000px] h-px w-px overflow-hidden opacity-0" aria-hidden="true">Website<input name="website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" /></label>
            <label className="text-[10px] uppercase tracking-[.16em]">Business name<Input required name="businessName" value={form.businessName} onChange={change} className="premium-field mt-2" /></label>
            <label className="text-[10px] uppercase tracking-[.16em]">Contact person<Input required name="contactPerson" value={form.contactPerson} onChange={change} autoComplete="name" className="premium-field mt-2" /></label>
            <label className="text-[10px] uppercase tracking-[.16em]">Phone<Input required name="phone" type="tel" value={form.phone} onChange={change} autoComplete="tel" className="premium-field mt-2" /></label>
            <label className="text-[10px] uppercase tracking-[.16em]">Email<Input required name="email" type="email" value={form.email} onChange={change} autoComplete="email" className="premium-field mt-2" /></label>
            <label className="text-[10px] uppercase tracking-[.16em]">Location<Input required name="location" value={form.location} onChange={change} placeholder="City / State / Area" className="premium-field mt-2" /></label>
            <label className="text-[10px] uppercase tracking-[.16em]">Business type<select required name="businessType" value={form.businessType} onChange={change} className="premium-field mt-2"><option value="">Choose one</option><option>Retailer</option><option>Distributor</option><option>Contractor</option><option>Developer</option><option>Other</option></select></label>
            <label className="text-[10px] uppercase tracking-[.16em] md:col-span-2">Message<Textarea required name="message" value={form.message} onChange={change} placeholder="Tell us about your business and coverage area" className="premium-field mt-2" /></label>
            <div className="flex flex-col items-start gap-4 md:col-span-2 sm:flex-row sm:items-center"><button type="submit" disabled={submitting} className="group flex h-14 items-center gap-3 rounded-full bg-foreground px-6 font-mono text-[9px] font-semibold uppercase tracking-[.16em] text-background transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground disabled:opacity-60">{submitting ? "Sending…" : "Submit application"}<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></button>{submitted && <p role="status" className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[.13em] text-muted-foreground"><Check className="h-4 w-4 text-accent" />Application received</p>}</div>
          </form>
        </div>
      </section>
    </>
  );
};

export default KsdPaint;
