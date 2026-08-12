import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, LogOut, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/logo-transparent.png";
import heroSignature from "@/assets/hero-signature.webp";

type Mode = "login" | "forgot" | "recovery";

const AdminAccess = ({ children }: { children: ReactNode }) => {
  const { session, profile, loading, isAuthorized, recoveryMode, authError, signIn, signOut, sendPasswordReset, updatePassword, refreshProfile } = useAuth();
  const [mode, setMode] = useState<Mode>(recoveryMode ? "recovery" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeMode = recoveryMode ? "recovery" : mode;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      if (activeMode === "forgot") {
        await sendPasswordReset(email);
        setMessage("A secure recovery link has been sent if that account exists.");
      } else if (activeMode === "recovery") {
        if (password.length < 8) throw new Error("Use at least 8 characters for your new password.");
        if (password !== confirmPassword) throw new Error("The passwords do not match.");
        await updatePassword(password);
        setMessage("Password updated. Your workspace is ready.");
        setMode("login");
      } else {
        await signIn(email, password);
      }
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "Unable to complete authentication.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-slate-dark text-white"><div className="text-center"><LoaderCircle className="mx-auto h-5 w-5 animate-spin text-white/60" /><p className="mt-4 font-mono text-[8px] uppercase tracking-[.2em] text-white/40">Securing workspace</p></div></div>;
  }

  if (session && isAuthorized) return <>{children}</>;

  if (session && !isAuthorized) {
    return <div className="grid min-h-screen place-items-center bg-slate-dark px-5 text-white">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/[.055] p-7 shadow-[0_30px_100px_rgba(0,0,0,.3)] backdrop-blur-xl sm:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10"><ShieldCheck className="h-5 w-5" /></span>
        <p className="mt-8 font-mono text-[8px] uppercase tracking-[.2em] text-white/40">Authenticated · Access pending</p>
        <h1 className="mt-3 font-display text-5xl leading-[.92]">Your account needs approval.</h1>
        <p className="mt-5 text-sm leading-7 text-white/55">{authError ?? `The account ${profile?.email ?? session.user.email} is signed in but is not assigned an administrator or editor role.`}</p>
        <div className="mt-8 flex flex-wrap gap-2">
          <button onClick={() => void refreshProfile()} className="flex h-11 items-center gap-2 rounded-full bg-white px-5 font-mono text-[8px] uppercase tracking-[.14em] text-slate-dark"><RefreshCw className="h-3.5 w-3.5" />Check access</button>
          <button onClick={() => void signOut()} className="flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 font-mono text-[8px] uppercase tracking-[.14em] text-white/65"><LogOut className="h-3.5 w-3.5" />Sign out</button>
        </div>
      </motion.div>
    </div>;
  }

  return <div className="min-h-screen bg-slate-dark text-white lg:grid lg:grid-cols-[1.02fr_.98fr]">
    <div className="relative hidden min-h-screen overflow-hidden lg:block">
      <img src={heroSignature} alt="KANSADCO signature residence" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-dark via-slate-dark/25 to-slate-dark/10" />
      <div className="absolute inset-x-10 bottom-10 rounded-[2rem] border border-white/15 bg-slate-dark/35 p-8 backdrop-blur-lg xl:inset-x-14 xl:bottom-14 xl:p-10">
        <p className="font-mono text-[8px] uppercase tracking-[.22em] text-white/45">Private content system</p>
        <p className="mt-4 max-w-xl font-display text-5xl leading-[.94] xl:text-6xl">One secure place for every project, image and conversation.</p>
      </div>
    </div>

    <div className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-14 lg:py-10 xl:px-20">
      <div className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-3"><img src={logo} alt="KANSADCO" className="h-12 w-auto brightness-0 invert" /><span className="h-7 w-px bg-white/15" /><span className="font-mono text-[7px] uppercase tracking-[.18em] text-white/40">Admin</span></a>
        <a href="/" className="flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 font-mono text-[7px] uppercase tracking-[.14em] text-white/55 transition-colors hover:bg-white hover:text-slate-dark"><ArrowLeft className="h-3.5 w-3.5" />Website</a>
      </div>

      <motion.div key={activeMode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="my-auto w-full max-w-md py-14 lg:mx-auto">
        <span className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/[.06]"><LockKeyhole className="h-5 w-5 text-white/70" /></span>
        <p className="mt-8 font-mono text-[8px] uppercase tracking-[.2em] text-white/40">{activeMode === "forgot" ? "Account recovery" : activeMode === "recovery" ? "Secure reset" : "Authorized personnel"}</p>
        <h1 className="mt-3 font-display text-[3.4rem] leading-[.9] sm:text-6xl">{activeMode === "forgot" ? "Recover access." : activeMode === "recovery" ? "Choose a new password." : "Welcome back."}</h1>
        <p className="mt-5 max-w-sm text-sm leading-7 text-white/50">{activeMode === "login" ? "Sign in to manage the live KANSADCO portfolio and client workspace." : activeMode === "forgot" ? "We will send a one-time recovery link to your approved email address." : "Use a strong password you do not use anywhere else."}</p>

        <form onSubmit={submit} className="mt-10 space-y-5">
          {activeMode !== "recovery" && <label className="block"><span className="font-mono text-[7px] uppercase tracking-[.16em] text-white/40">Email address</span><span className="mt-2 flex items-center border-b border-white/20 focus-within:border-white"><Mail className="h-4 w-4 text-white/35" /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required className="h-14 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-white/25" placeholder="name@kansadco.com" /></span></label>}
          {activeMode !== "forgot" && <label className="block"><span className="font-mono text-[7px] uppercase tracking-[.16em] text-white/40">{activeMode === "recovery" ? "New password" : "Password"}</span><span className="mt-2 flex items-center border-b border-white/20 focus-within:border-white"><LockKeyhole className="h-4 w-4 text-white/35" /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={activeMode === "recovery" ? "new-password" : "current-password"} minLength={8} required className="h-14 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-white/25" placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="grid h-10 w-10 place-items-center text-white/35" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span></label>}
          {activeMode === "recovery" && <label className="block"><span className="font-mono text-[7px] uppercase tracking-[.16em] text-white/40">Confirm new password</span><span className="mt-2 flex items-center border-b border-white/20 focus-within:border-white"><ShieldCheck className="h-4 w-4 text-white/35" /><input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required className="h-14 flex-1 bg-transparent px-3 text-sm outline-none" /></span></label>}

          {(error || authError) && <p role="alert" className="rounded-2xl border border-red-300/15 bg-red-300/[.07] px-4 py-3 text-xs leading-5 text-red-100/80">{error ?? authError}</p>}
          {message && <p className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[.07] px-4 py-3 text-xs leading-5 text-emerald-100/80">{message}</p>}

          <button disabled={submitting} className="group flex h-13 w-full items-center justify-between rounded-full bg-white px-5 py-4 font-mono text-[8px] font-medium uppercase tracking-[.16em] text-slate-dark transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">{submitting ? "Please wait" : activeMode === "forgot" ? "Send recovery link" : activeMode === "recovery" ? "Update password" : "Enter workspace"}{submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}</button>
        </form>

        {activeMode === "login" ? <button onClick={() => { setMode("forgot"); setError(null); setMessage(null); }} className="mt-6 font-mono text-[7px] uppercase tracking-[.14em] text-white/35 hover:text-white">Forgot password?</button> : activeMode === "forgot" ? <button onClick={() => { setMode("login"); setError(null); setMessage(null); }} className="mt-6 flex items-center gap-2 font-mono text-[7px] uppercase tracking-[.14em] text-white/35 hover:text-white"><ArrowLeft className="h-3.5 w-3.5" />Back to sign in</button> : null}
      </motion.div>

      <div className="flex items-center justify-between border-t border-white/10 pt-5 font-mono text-[7px] uppercase tracking-[.15em] text-white/25"><span>Encrypted session</span><span>Supabase Auth</span></div>
    </div>
  </div>;
};

export default AdminAccess;
