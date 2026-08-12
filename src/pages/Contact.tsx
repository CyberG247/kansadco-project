import { useState } from "react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/lib/contentStore";

const Contact = () => {
  const { toast } = useToast();
  const { addEnquiry, settings } = useContent();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event: React.FormEvent) => { event.preventDefault(); addEnquiry({ ...form, source: "Contact" }); toast({ title: "Enquiry received", description: "It is now available in the admin workspace." }); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); };
  return (
    <Layout>
      <PageHero eyebrow="Contact" title={<>A good project starts<br />with a <em className="text-accent">conversation.</em></>} description="Tell us what you are considering—an investment, a development, a construction brief or a place to call home." index="K / 05" />

      <section className="section-padding bg-background">
        <div className="container-custom grid gap-16 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <p className="eyebrow mb-9 text-accent">Direct enquiries</p>
            <a href={`mailto:${settings.primaryEmail}`} className="block border-b border-border py-5 text-2xl hover:text-accent">{settings.primaryEmail}</a>
            <a href={`tel:${settings.telephone.replace(/\s/g, "")}`} className="block border-b border-border py-5 text-2xl hover:text-accent">{settings.telephone}</a>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
              <div><p className="text-[10px] uppercase tracking-[.17em] text-accent">Abuja</p><p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{settings.abujaAddress}</p></div>
              <div><p className="text-[10px] uppercase tracking-[.17em] text-accent">Kano</p><p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{settings.kanoAddress}</p></div>
              <div><p className="text-[10px] uppercase tracking-[.17em] text-accent">Office hours</p><p className="mt-3 text-sm leading-6 text-muted-foreground">Mon–Fri · 08:00–18:00<br />Saturday · 09:00–14:00</p></div>
            </div>
          </aside>

          <div className="lg:col-span-7 lg:col-start-6">
            <p className="mb-10 font-display text-4xl md:text-5xl">Tell us where you want to go.</p>
            <form onSubmit={submit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2"><label className="text-[10px] uppercase tracking-[.16em]">Your name<Input name="name" value={form.name} onChange={change} placeholder="Full name" required className="premium-field mt-2" /></label><label className="text-[10px] uppercase tracking-[.16em]">Email address<Input type="email" name="email" value={form.email} onChange={change} placeholder="name@company.com" required className="premium-field mt-2" /></label></div>
              <div className="grid gap-6 md:grid-cols-2"><label className="text-[10px] uppercase tracking-[.16em]">Telephone<Input name="phone" value={form.phone} onChange={change} placeholder="+234" className="premium-field mt-2" /></label><label className="text-[10px] uppercase tracking-[.16em]">Nature of enquiry<Input name="subject" value={form.subject} onChange={change} placeholder="Development, investment, construction…" required className="premium-field mt-2" /></label></div>
              <label className="block text-[10px] uppercase tracking-[.16em]">Project notes<Textarea name="message" value={form.message} onChange={change} placeholder="Context, location, ambition and timing" required className="premium-field mt-2" /></label>
              <button type="submit" className="group mt-4 flex h-14 w-full items-center justify-between rounded-full bg-foreground px-6 text-[10px] font-semibold uppercase tracking-[.18em] text-background transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-lg md:w-64">Send enquiry <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></button>
            </form>
          </div>
        </div>
      </section>

      <section className="h-[420px] overflow-hidden bg-muted grayscale-[85%] transition-all duration-700 hover:grayscale-0 md:mx-4 md:my-4 md:rounded-[2.5rem]"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.0647851!2d7.4330377!3d9.0633097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b5c5bafb807%3A0x1a2b3c4d5e6f7890!2sUtako%2C%20Abuja!5e0!3m2!1sen!2sng!4v1640000000000!5m2!1sen!2sng" width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="KANSADCO Abuja office" /></section>
    </Layout>
  );
};

export default Contact;
