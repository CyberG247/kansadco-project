import { useState } from "react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight, Check } from "lucide-react";
import heroEstate from "@/assets/hero-estate.jpg";
import logo from "@/assets/logo-transparent.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useContent } from "@/lib/contentStore";

const BookTour = () => {
  const { addEnquiry } = useContent();
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "", interest: "residential", message: "" });
  const change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [event.target.name]: event.target.value });
  return (
    <Layout>
      <PageHero eyebrow="Private viewings" title={<>See the difference<br /><em className="text-accent">for yourself.</em></>} description="Arrange a focused tour of a KANSADCO property with a team member who can answer the questions that matter to you." image={heroEstate} imageAlt="KANSADCO residence" index="K / VISIT" />

      <section className="section-padding bg-background">
        <div className="container-custom grid gap-16 lg:grid-cols-12">
          <aside className="lg:col-span-4"><p className="eyebrow mb-9 text-accent">What to expect</p><h2 className="text-4xl md:text-5xl">A visit tailored to your priorities.</h2><div className="mt-10 border-t border-border">{["A dedicated property specialist", "A closer look at materials and finishes", "Clear answers on availability and acquisition", "No-pressure, considered guidance"].map((item)=><p key={item} className="flex gap-3 border-b border-border py-4 text-sm text-muted-foreground"><Check className="h-4 w-4 shrink-0 text-accent" />{item}</p>)}</div><div className="mt-10"><p className="text-[9px] uppercase tracking-[.17em] text-accent">Viewing hours</p><p className="mt-3 text-sm leading-7 text-muted-foreground">Monday–Saturday<br />09:00–17:00</p></div></aside>

          <div className="lg:col-span-7 lg:col-start-6">
            <p className="mb-10 font-display text-4xl md:text-5xl">Request your private tour.</p>
            <form onSubmit={(event) => { event.preventDefault(); addEnquiry({ name: form.name, email: form.email, phone: form.phone, subject: `Private viewing · ${form.interest} · ${form.date} ${form.time}`, message: form.message || "Private viewing requested from the website.", source: "Private tour" }); setConfirmed(true); setForm({ name: "", email: "", phone: "", date: "", time: "", interest: "residential", message: "" }); }} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2"><label className="text-[10px] uppercase tracking-[.16em]">Full name<Input name="name" value={form.name} onChange={change} placeholder="Your name" required className="premium-field mt-2" /></label><label className="text-[10px] uppercase tracking-[.16em]">Email<Input type="email" name="email" value={form.email} onChange={change} placeholder="name@company.com" required className="premium-field mt-2" /></label></div>
              <div className="grid gap-6 md:grid-cols-2"><label className="text-[10px] uppercase tracking-[.16em]">Telephone<Input name="phone" value={form.phone} onChange={change} placeholder="+234" required className="premium-field mt-2" /></label><label className="text-[10px] uppercase tracking-[.16em]">Area of interest<select name="interest" value={form.interest} onChange={change} className="premium-field mt-2"><option value="residential">Residential property</option><option value="commercial">Commercial property</option><option value="investment">Investment opportunity</option><option value="land">Land acquisition</option></select></label></div>
              <div className="grid gap-6 md:grid-cols-2"><label className="text-[10px] uppercase tracking-[.16em]">Preferred date<Input type="date" name="date" value={form.date} onChange={change} required className="premium-field mt-2" /></label><label className="text-[10px] uppercase tracking-[.16em]">Preferred time<Input type="time" name="time" value={form.time} onChange={change} required className="premium-field mt-2" /></label></div>
              <label className="block text-[10px] uppercase tracking-[.16em]">Anything we should know?<Textarea name="message" value={form.message} onChange={change} placeholder="Tell us what you are looking for" className="premium-field mt-2" /></label>
              <button type="submit" className="group mt-4 flex h-14 w-full items-center justify-between rounded-full bg-foreground px-6 text-[10px] font-semibold uppercase tracking-[.18em] text-background transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-lg md:w-72">Request a viewing <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></button>
            </form>
          </div>
        </div>
      </section>

      <Dialog open={confirmed} onOpenChange={setConfirmed}><DialogContent className="rounded-[2rem] border-border bg-background p-10 sm:max-w-md"><DialogHeader className="items-center text-center"><img src={logo} alt="KANSADCO" className="mb-5 h-20 w-auto dark:brightness-0 dark:invert" /><DialogTitle className="font-display text-4xl font-normal">Your request is with us.</DialogTitle></DialogHeader><p className="mt-4 text-center text-sm leading-7 text-muted-foreground">A member of our property team will review your preferred date and contact you to confirm the details.</p><button onClick={() => setConfirmed(false)} className="mt-7 h-12 rounded-full bg-foreground text-[10px] font-semibold uppercase tracking-[.17em] text-background">Close</button></DialogContent></Dialog>
    </Layout>
  );
};

export default BookTour;
