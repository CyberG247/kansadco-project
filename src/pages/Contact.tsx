import { useState } from "react";
import PageHero from "@/components/layout/PageHero";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/lib/contentStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import logo from "@/assets/logo-transparent.png";

const Contact = () => {
  const { toast } = useToast();
  const { addEnquiry, settings } = useContent();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [website, setWebsite] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ email: string; emailSent: boolean } | null>(null);
  const change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setSubmitting(true);
    try {
      const enquiry = await addEnquiry({ ...form, source: "Contact", website, formStartedAt });
      setConfirmation({ email: form.email, emailSent: enquiry.notificationStatus === "Sent" });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setWebsite("");
      setFormStartedAt(Date.now());
    } catch (error) {
      toast({ title: "Message not sent", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally { setSubmitting(false); }
  };
  return (
    <>
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
              <label className="absolute -left-[10000px] h-px w-px overflow-hidden opacity-0" aria-hidden="true">Website<input name="website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" /></label>
              <div className="grid gap-6 md:grid-cols-2"><label className="text-[10px] uppercase tracking-[.16em]">Your name<Input name="name" value={form.name} onChange={change} placeholder="Full name" required className="premium-field mt-2" /></label><label className="text-[10px] uppercase tracking-[.16em]">Email address<Input type="email" name="email" value={form.email} onChange={change} placeholder="name@company.com" required className="premium-field mt-2" /></label></div>
              <div className="grid gap-6 md:grid-cols-2"><label className="text-[10px] uppercase tracking-[.16em]">Telephone<Input name="phone" value={form.phone} onChange={change} placeholder="+234" className="premium-field mt-2" /></label><label className="text-[10px] uppercase tracking-[.16em]">Nature of enquiry<Input name="subject" value={form.subject} onChange={change} placeholder="Development, investment, construction…" required className="premium-field mt-2" /></label></div>
              <label className="block text-[10px] uppercase tracking-[.16em]">Project notes<Textarea name="message" value={form.message} onChange={change} placeholder="Context, location, ambition and timing" required className="premium-field mt-2" /></label>
              <button type="submit" disabled={submitting} className="group mt-4 flex h-14 w-full items-center justify-between rounded-full bg-foreground px-6 text-[10px] font-semibold uppercase tracking-[.18em] text-background transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-lg disabled:cursor-wait disabled:opacity-60 md:w-64">{submitting ? "Sending…" : "Send enquiry"} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></button>
            </form>
          </div>
        </div>
      </section>

      <section className="h-[420px] overflow-hidden bg-muted grayscale-[85%] transition-all duration-700 hover:grayscale-0 md:mx-4 md:my-4 md:rounded-[2.5rem]"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.0647851!2d7.4330377!3d9.0633097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b5c5bafb807%3A0x1a2b3c4d5e6f7890!2sUtako%2C%20Abuja!5e0!3m2!1sen!2sng!4v1640000000000!5m2!1sen!2sng" width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="KANSADCO Abuja office" /></section>

      <Dialog open={Boolean(confirmation)} onOpenChange={(open) => { if (!open) setConfirmation(null); }}>
        <DialogContent className="overflow-hidden rounded-[2rem] border-border bg-background p-0 sm:max-w-lg">
          <div className="bg-foreground px-7 pb-8 pt-7 text-background sm:px-10 sm:pb-10">
            <div className="flex items-center justify-between"><img src={logo} alt="KANSADCO" className="h-14 w-auto brightness-0 invert" /><span className="grid h-10 w-10 place-items-center rounded-full border border-background/20"><Check className="h-4 w-4" /></span></div>
            <DialogHeader className="mt-10 text-left"><p className="font-mono text-[8px] uppercase tracking-[.2em] text-background/45">Enquiry received · Forwarded</p><DialogTitle className="mt-3 font-display text-[2.6rem] font-normal leading-[.98] text-background sm:text-5xl">Your request is now with our team.</DialogTitle></DialogHeader>
          </div>
          <div className="px-7 pb-7 pt-6 sm:px-10 sm:pb-9">
            <p className="text-sm leading-7 text-muted-foreground">Your enquiry has been securely forwarded to KANSADCO client relations. A member of the team will review your request and get back to you using the details provided.</p>
            <div className="mt-6 grid grid-cols-3 gap-2">{["Received", "Forwarded", "Personal reply"].map((item, index) => <div key={item} className={`border-t-2 px-1 pt-3 ${index < 2 ? "border-foreground" : "border-border"}`}><span className="font-mono text-[7px] text-muted-foreground">0{index + 1}</span><p className="mt-1 text-[9px] uppercase tracking-[.1em]">{item}</p></div>)}</div>
            <p className="mt-6 rounded-2xl bg-muted px-4 py-3 text-xs leading-5 text-muted-foreground">{confirmation?.emailSent ? <>A confirmation receipt has also been sent to <span className="font-medium text-foreground">{confirmation.email}</span>.</> : "Your request is safely recorded. Our team will contact you directly."}</p>
            <button onClick={() => setConfirmation(null)} className="mt-6 h-12 w-full rounded-full bg-foreground font-mono text-[8px] uppercase tracking-[.17em] text-background transition-transform hover:-translate-y-0.5">Done</button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Contact;
