import { useState } from "react";
import PageHero from "@/components/layout/PageHero";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/lib/contentStore";

const emptyForm = { name: "", email: "", phone: "", subject: "", message: "" };
type ContactField = keyof typeof emptyForm;
type ContactErrors = Partial<Record<ContactField, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneDigits = (value: string) => value.replace(/\D/g, "").slice(0, 10);

const FieldError = ({ id, message }: { id: string; message?: string }) => message
  ? <p id={id} role="alert" className="mt-2 font-mono text-[8px] normal-case tracking-normal text-accent">{message}</p>
  : null;

const Contact = () => {
  const { toast } = useToast();
  const { addEnquiry, settings } = useContent();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [website, setWebsite] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ email: string; emailSent: boolean } | null>(null);
  const change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as ContactField;
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => current[field] ? { ...current, [field]: undefined } : current);
  };
  const changePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, phone: phoneDigits(event.target.value) }));
    setErrors((current) => current.phone ? { ...current, phone: undefined } : current);
  };
  const validate = () => {
    const nextErrors: ContactErrors = {};
    const normalizedEmail = form.email.trim().toLowerCase();
    if (form.name.trim().length < 2) nextErrors.name = "Please enter your full name.";
    if (!emailPattern.test(normalizedEmail) || normalizedEmail.length > 320) nextErrors.email = "Enter a valid email address, for example name@company.com.";
    if (!/^\d{10}$/.test(form.phone)) nextErrors.phone = "Add the 10 digits after +234.";
    if (form.subject.trim().length < 2) nextErrors.subject = "Please tell us the nature of your enquiry.";
    if (form.message.trim().length < 2) nextErrors.message = "Please add a short note about your project.";
    setErrors(nextErrors);
    const firstInvalidField = Object.keys(nextErrors)[0];
    if (firstInvalidField) {
      window.requestAnimationFrame(() => document.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)?.focus());
      return null;
    }
    return normalizedEmail;
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedEmail = validate();
    if (!normalizedEmail) return;
    setConfirmation(null);
    setSubmitting(true);
    try {
      const enquiry = await addEnquiry({
        ...form,
        name: form.name.trim(),
        email: normalizedEmail,
        phone: `+234${form.phone}`,
        subject: form.subject.trim(),
        message: form.message.trim(),
        source: "Contact",
        website,
        formStartedAt,
      });
      setConfirmation({ email: normalizedEmail, emailSent: enquiry.notificationStatus === "Sent" });
      setForm(emptyForm);
      setErrors({});
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
            <form onSubmit={submit} noValidate className="space-y-6">
              <label className="absolute -left-[10000px] h-px w-px overflow-hidden opacity-0" aria-hidden="true">Website<input name="website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" /></label>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="text-[10px] uppercase tracking-[.16em]">Your name<Input name="name" value={form.name} onChange={change} placeholder="Full name" autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} className="premium-field mt-2" /><FieldError id="contact-name-error" message={errors.name} /></label>
                <label className="text-[10px] uppercase tracking-[.16em]">Email address<Input type="email" inputMode="email" name="email" value={form.email} onChange={change} placeholder="name@company.com" autoComplete="email" maxLength={320} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} className="premium-field mt-2" /><FieldError id="contact-email-error" message={errors.email} /></label>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="text-[10px] uppercase tracking-[.16em]">Telephone
                  <span className="contact-phone-field premium-field mt-2 flex items-center" data-invalid={errors.phone ? "true" : undefined}>
                    <span className="shrink-0 border-r border-border pr-3 font-mono text-xs tracking-normal text-foreground">+234</span>
                    <input type="tel" inputMode="numeric" name="phone" value={form.phone} onChange={changePhone} placeholder="8012345678" autoComplete="tel-national" maxLength={10} pattern="[0-9]{10}" required aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "contact-phone-error" : "contact-phone-help"} className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm tracking-normal text-foreground outline-none placeholder:text-muted-foreground/60" />
                    <span id="contact-phone-help" className="shrink-0 font-mono text-[7px] tracking-normal text-muted-foreground">{form.phone.length}/10</span>
                  </span>
                  <FieldError id="contact-phone-error" message={errors.phone} />
                </label>
                <label className="text-[10px] uppercase tracking-[.16em]">Nature of enquiry<Input name="subject" value={form.subject} onChange={change} placeholder="Development, investment, construction…" required aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? "contact-subject-error" : undefined} className="premium-field mt-2" /><FieldError id="contact-subject-error" message={errors.subject} /></label>
              </div>
              <label className="block text-[10px] uppercase tracking-[.16em]">Project notes<Textarea name="message" value={form.message} onChange={change} placeholder="Context, location, ambition and timing" required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} className="premium-field mt-2" /><FieldError id="contact-message-error" message={errors.message} /></label>
              <button type="submit" disabled={submitting} className="group mt-4 flex h-14 w-full items-center justify-between rounded-full bg-foreground px-6 text-[10px] font-semibold uppercase tracking-[.18em] text-background transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-lg disabled:cursor-wait disabled:opacity-60 md:w-64">{submitting ? "Sending…" : "Send enquiry"} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></button>
              {confirmation && (
                <p role="status" aria-live="polite" className="animate-fade-up flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.13em] text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-accent" />
                  {confirmation.emailSent ? <>Sent · Confirmation emailed to <span className="normal-case tracking-normal text-foreground">{confirmation.email}</span></> : "Received · Our team will contact you directly"}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="h-[420px] overflow-hidden bg-muted grayscale-[85%] transition-all duration-700 hover:grayscale-0 md:mx-4 md:my-4 md:rounded-[2.5rem]"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.0647851!2d7.4330377!3d9.0633097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b5c5bafb807%3A0x1a2b3c4d5e6f7890!2sUtako%2C%20Abuja!5e0!3m2!1sen!2sng!4v1640000000000!5m2!1sen!2sng" width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="KANSADCO Abuja office" /></section>
    </>
  );
};

export default Contact;
