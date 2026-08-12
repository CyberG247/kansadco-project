import { useState } from "react";
import PageHero from "@/components/layout/PageHero";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight, Check } from "lucide-react";
import heroEstate from "@/assets/hero-estate.jpg";
import { useContent } from "@/lib/contentStore";
import { useToast } from "@/hooks/use-toast";

const BookTour = () => {
  const { addEnquiry } = useContent();
  const { toast } = useToast();
  const [confirmation, setConfirmation] = useState<{ email: string; emailSent: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "", interest: "residential", message: "" });
  const [website, setWebsite] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setConfirmation(null);
    setSubmitting(true);
    try {
      const enquiry = await addEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: `Private viewing · ${form.interest} · ${form.date} ${form.time}`,
        message: form.message || "Private viewing requested from the website.",
        source: "Private tour",
        website,
        formStartedAt,
      });
      setConfirmation({ email: form.email, emailSent: enquiry.notificationStatus === "Sent" });
      setForm({ name: "", email: "", phone: "", date: "", time: "", interest: "residential", message: "" });
      setWebsite("");
      setFormStartedAt(Date.now());
    } catch (error) {
      toast({ title: "Request not sent", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <PageHero eyebrow="Private viewings" title={<>See the difference<br /><em className="text-accent">for yourself.</em></>} description="Arrange a focused tour of a KANSADCO property with a team member who can answer the questions that matter to you." image={heroEstate} imageAlt="KANSADCO residence" index="K / VISIT" />

      <section className="section-padding bg-background">
        <div className="container-custom grid gap-16 lg:grid-cols-12">
          <aside className="lg:col-span-4"><p className="eyebrow mb-9 text-accent">What to expect</p><h2 className="text-4xl md:text-5xl">A visit tailored to your priorities.</h2><div className="mt-10 border-t border-border">{["A dedicated property specialist", "A closer look at materials and finishes", "Clear answers on availability and acquisition", "No-pressure, considered guidance"].map((item)=><p key={item} className="flex gap-3 border-b border-border py-4 text-sm text-muted-foreground"><Check className="h-4 w-4 shrink-0 text-accent" />{item}</p>)}</div><div className="mt-10"><p className="text-[9px] uppercase tracking-[.17em] text-accent">Viewing hours</p><p className="mt-3 text-sm leading-7 text-muted-foreground">Monday–Saturday<br />09:00–17:00</p></div></aside>

          <div className="lg:col-span-7 lg:col-start-6">
            <p className="mb-10 font-display text-4xl md:text-5xl">Request your private tour.</p>
            <form onSubmit={submit} className="space-y-6">
              <label className="absolute -left-[10000px] h-px w-px overflow-hidden opacity-0" aria-hidden="true">Website<input name="website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" /></label>
              <div className="grid gap-6 md:grid-cols-2"><label className="text-[10px] uppercase tracking-[.16em]">Full name<Input name="name" value={form.name} onChange={change} placeholder="Your name" required className="premium-field mt-2" /></label><label className="text-[10px] uppercase tracking-[.16em]">Email<Input type="email" name="email" value={form.email} onChange={change} placeholder="name@company.com" required className="premium-field mt-2" /></label></div>
              <div className="grid gap-6 md:grid-cols-2"><label className="text-[10px] uppercase tracking-[.16em]">Telephone<Input name="phone" value={form.phone} onChange={change} placeholder="+234" required className="premium-field mt-2" /></label><label className="text-[10px] uppercase tracking-[.16em]">Area of interest<select name="interest" value={form.interest} onChange={change} className="premium-field mt-2"><option value="residential">Residential property</option><option value="commercial">Commercial property</option><option value="investment">Investment opportunity</option><option value="land">Land acquisition</option></select></label></div>
              <div className="grid gap-6 md:grid-cols-2"><label className="text-[10px] uppercase tracking-[.16em]">Preferred date<Input type="date" name="date" value={form.date} onChange={change} required className="premium-field mt-2" /></label><label className="text-[10px] uppercase tracking-[.16em]">Preferred time<Input type="time" name="time" value={form.time} onChange={change} required className="premium-field mt-2" /></label></div>
              <label className="block text-[10px] uppercase tracking-[.16em]">Anything we should know?<Textarea name="message" value={form.message} onChange={change} placeholder="Tell us what you are looking for" className="premium-field mt-2" /></label>
              <button type="submit" disabled={submitting} className="group mt-4 flex h-14 w-full items-center justify-between rounded-full bg-foreground px-6 text-[10px] font-semibold uppercase tracking-[.18em] text-background transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-lg disabled:cursor-wait disabled:opacity-60 md:w-72">{submitting ? "Sending…" : "Request a viewing"} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></button>
              {confirmation && (
                <p role="status" aria-live="polite" className="animate-fade-up flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.13em] text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-accent" />
                  {confirmation.emailSent ? <>Sent · Confirmation emailed to <span className="normal-case tracking-normal text-foreground">{confirmation.email}</span></> : "Received · Our property team will contact you directly"}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookTour;
