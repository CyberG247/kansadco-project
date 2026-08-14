import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight, Bell, Building2, Check, ChevronRight, CircleDot,
  Cloud, CloudOff, Download, Eye, EyeOff, Images, KeyRound, LayoutDashboard, LoaderCircle, LogOut, Mail, Menu, MessageSquare, Moon,
  MoreHorizontal, Plus, Quote, RefreshCw, Search, Settings, ShieldCheck, Sun, Trash2, TrendingUp, Upload, UsersRound, X,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  formatRelativeDate, useContent, type Enquiry, type GalleryAsset,
  type ManagedProject, type ProjectStatus, type AssetStatus, type SiteSettings,
  type TeamMember, type TeamMemberStatus, type Testimonial, type TestimonialStatus,
} from "@/lib/contentStore";
import logo from "@/assets/logo-transparent.png";
import heroSignature from "@/assets/hero-signature.webp";
import { useAuth } from "@/lib/auth";

type Section = "Overview" | "Projects" | "Gallery" | "Team" | "Testimonials" | "Enquiries" | "Settings";

const navItems: { label: Section; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Projects", icon: Building2 },
  { label: "Gallery", icon: Images },
  { label: "Team", icon: UsersRound },
  { label: "Testimonials", icon: Quote },
  { label: "Enquiries", icon: MessageSquare },
  { label: "Settings", icon: Settings },
];

const panelClass = "rounded-[1.5rem] border border-border/80 bg-card shadow-[0_16px_50px_rgba(8,16,12,.045)]";
type EditorState = { kind: "project"; item?: ManagedProject } | { kind: "gallery"; item?: GalleryAsset } | { kind: "team"; item?: TeamMember } | { kind: "testimonial"; item?: Testimonial } | { kind: "enquiry"; item: Enquiry } | null;
const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const Status = ({ value }: { value: string }) => {
  const tone = value === "Published" || value === "Replied" || value === "Sent"
    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    : value === "Failed"
      ? "bg-red-500/10 text-red-700 dark:text-red-400"
      : value === "Draft" || value === "Review" || value === "Pending" || value === "Partial"
      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
      : "bg-blue-500/10 text-blue-700 dark:text-blue-400";
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[7px] uppercase tracking-[.12em] ${tone}`}><span className="h-1 w-1 rounded-full bg-current" />{value}</span>;
};

const SectionHeading = ({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) => (
  <div className="mb-6 flex flex-col gap-5 border-b border-border pb-6 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-8">
    <div>
      <p className="font-mono text-[8px] uppercase tracking-[.2em] text-muted-foreground">{eyebrow}</p>
      <h1 className="mt-3 font-display text-[2.75rem] leading-[.92] tracking-[-.035em] sm:text-5xl lg:text-[3.5rem]">{title}</h1>
      <p className="mt-3 max-w-xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">{description}</p>
    </div>
    {action}
  </div>
);

const WorkspaceNavigation = ({ section, navigate }: { section: Section; navigate: (section: Section) => void }) => {
  const { enquiries } = useContent();
  const unread = enquiries.filter((item) => item.status === "New").length;
  return <nav className="space-y-1.5" aria-label="Admin navigation">
    {navItems.map((item, index) => {
      const active = section === item.label;
      return <button key={item.label} onClick={() => navigate(item.label)} className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-3.5 py-3 text-left text-xs transition-all duration-300 ${active ? "bg-white text-slate-dark shadow-[0_10px_30px_rgba(0,0,0,.12)]" : "text-white/55 hover:bg-white/[.07] hover:text-white"}`}>
        <span className="font-mono text-[7px] opacity-45">0{index + 1}</span>
        <item.icon className={`h-4 w-4 transition-transform duration-300 ${active ? "scale-105" : "group-hover:scale-105"}`} />
        <span>{item.label}</span>
        {item.label === "Enquiries" && unread > 0 && <span className={`ml-auto grid h-5 min-w-5 place-items-center rounded-full px-1 font-mono text-[7px] ${active ? "bg-slate-dark text-white" : "bg-accent text-accent-foreground"}`}>{unread}</span>}
        {active && <motion.span layoutId="admin-sidebar-active" className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-accent" />}
      </button>;
    })}
  </nav>;
};

const SidebarContent = ({ section, navigate, close }: { section: Section; navigate: (section: Section) => void; close?: () => void }) => {
  const { profile, signOut } = useAuth();
  const displayName = profile?.fullName || profile?.email || "Administrator";
  return <>
    <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
      <div className="flex items-center gap-3"><img src={logo} alt="KANSADCO" className="h-10 w-auto brightness-0 invert" /><span className="h-7 w-px bg-white/15" /><span className="font-mono text-[7px] uppercase tracking-[.18em] text-white/40">Admin</span></div>
      {close && <button onClick={close} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition-colors hover:bg-white hover:text-slate-dark" aria-label="Close admin navigation"><X className="h-4 w-4" /></button>}
    </div>
    <div className="px-4 py-7">
      <div className="mb-5 flex items-center justify-between px-3"><p className="font-mono text-[8px] uppercase tracking-[.2em] text-white/35">Workspace</p><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,.7)]" /></div>
      <WorkspaceNavigation section={section} navigate={navigate} />
    </div>
    <div className="mt-auto p-4">
      <div className="rounded-[1.4rem] border border-white/10 bg-white/[.045] p-4">
        <div className="flex items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 font-display text-lg">{initials(displayName)}</div><div className="min-w-0"><p className="truncate text-xs font-medium">{displayName}</p><p className="mt-1 font-mono text-[7px] uppercase tracking-[.15em] text-white/35">{profile?.role ?? "Administrator"}</p></div></div>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2 border-t border-white/10 pt-4"><a href="/" className="group flex items-center justify-between font-mono text-[8px] uppercase tracking-[.15em] text-white/40 transition-colors hover:text-white">View site <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a><button onClick={() => void signOut()} className="grid h-8 w-8 place-items-center rounded-full text-white/35 transition-colors hover:bg-white/10 hover:text-white" aria-label="Sign out"><LogOut className="h-3.5 w-3.5" /></button></div>
      </div>
    </div>
  </>
};

const Admin = () => {
  const { profile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { projects, gallery, team, testimonials, enquiries, activities, markActivitiesRead, backendStatus, backendError, loading } = useContent();
  const reduceMotion = useReducedMotion();
  const [section, setSection] = useState<Section>("Overview");
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [editor, setEditor] = useState<EditorState>(null);

  const matchingProjects = useMemo(() => projects.filter((project) => `${project.name} ${project.type} ${project.location}`.toLowerCase().includes(query.toLowerCase())), [projects, query]);
  const matchingTeam = useMemo(() => team.filter((member) => `${member.name} ${member.role} ${member.discipline}`.toLowerCase().includes(query.toLowerCase())), [team, query]);
  const unreadActivities = activities.filter((item) => !item.read).length;
  const newEnquiries = enquiries.filter((item) => item.status === "New").length;
  const dateLabel = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "2-digit", month: "short", year: "numeric" }).format(new Date());
  const navigate = (next: Section) => { setSection(next); setSidebarOpen(false); setQuery(""); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); };
  const create = (kind: "project" | "gallery" | "team" | "testimonial") => { setComposerOpen(false); window.setTimeout(() => setEditor({ kind }), 120); };

  useEffect(() => {
    document.body.style.overflow = sidebarOpen || composerOpen || editor ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen, composerOpen, editor]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setSidebarOpen(false); setComposerOpen(false); setNotificationsOpen(false); setEditor(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="min-h-screen w-full min-w-0 max-w-full overflow-x-clip bg-background text-foreground lg:bg-[radial-gradient(circle_at_90%_5%,hsl(var(--muted))_0,transparent_30%)]">
      <aside className="admin-sidebar-shell fixed bottom-4 left-4 top-4 z-40 hidden w-[252px] flex-col overflow-hidden rounded-[2rem] bg-slate-dark text-white shadow-[0_28px_90px_rgba(8,16,12,.22)] lg:flex">
        <SidebarContent section={section} navigate={navigate} />
      </aside>

      <AnimatePresence>
        {sidebarOpen && <>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-slate-dark/35 backdrop-blur-[2px] lg:hidden" aria-label="Close navigation overlay" />
          <motion.aside initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -28, scale: .98 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24, scale: .98 }} transition={{ duration: .35, ease: [.2, .8, .2, 1] }} className="fixed bottom-3 left-3 top-3 z-50 flex w-[min(310px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[2rem] bg-slate-dark text-white shadow-[0_28px_90px_rgba(8,16,12,.3)] lg:hidden">
            <SidebarContent section={section} navigate={navigate} close={() => setSidebarOpen(false)} />
          </motion.aside>
        </>}
      </AnimatePresence>

      <div className="lg:pl-[284px]">
        <div className="sticky top-0 z-30 p-3 pb-0 sm:px-5 lg:px-6 lg:pt-4">
          <header className="admin-topbar-shell relative flex h-[58px] items-center justify-between rounded-[1.25rem] border border-border/70 bg-background/90 px-3 shadow-[0_14px_40px_rgba(8,16,12,.08)] backdrop-blur-xl sm:h-16 sm:px-4 lg:rounded-[1.5rem] lg:px-5">
            <div className="flex min-w-0 items-center gap-2.5">
              <button onClick={() => setSidebarOpen(true)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border transition-all hover:border-foreground lg:hidden" aria-label="Open admin navigation"><Menu className="h-4 w-4" /></button>
              <div className="min-w-0 lg:hidden"><p className="font-mono text-[7px] uppercase tracking-[.16em] text-muted-foreground">Workspace</p><p className="mt-0.5 truncate font-display text-lg leading-none">{section}</p></div>
              <div className="hidden items-center gap-3 rounded-full bg-muted/70 px-4 md:flex"><Search className="h-3.5 w-3.5 text-muted-foreground" /><input value={query} onChange={(event) => { setQuery(event.target.value); if (event.target.value && section !== "Projects" && section !== "Team") setSection("Projects"); }} placeholder={section === "Team" ? "Search team" : "Search projects"} className="h-9 w-40 bg-transparent text-xs outline-none placeholder:text-muted-foreground lg:w-52" /></div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <p className="mr-2 hidden font-mono text-[8px] uppercase tracking-[.14em] text-muted-foreground xl:block">{dateLabel}</p>
              <span title={backendError ?? "Supabase database connected"} className={`hidden h-9 items-center gap-2 rounded-full border px-3 font-mono text-[7px] uppercase tracking-[.12em] sm:flex ${backendStatus === "connected" ? "border-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "border-destructive/20 text-destructive"}`}>{loading ? <LoaderCircle className="h-3 w-3 animate-spin" /> : backendStatus === "connected" ? <Cloud className="h-3 w-3" /> : <CloudOff className="h-3 w-3" />}<span className="hidden xl:inline">{loading ? "Syncing" : backendStatus === "connected" ? "Live" : "Setup needed"}</span></span>
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="grid h-9 w-9 place-items-center rounded-full transition-all duration-300 hover:rotate-12 hover:bg-muted" aria-label="Toggle color theme">{theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}</button>
              <button onClick={() => setNotificationsOpen((open) => !open)} className="relative grid h-9 w-9 place-items-center rounded-full border border-border transition-colors hover:border-foreground" aria-label="Notifications" aria-expanded={notificationsOpen}><Bell className="h-3.5 w-3.5" />{unreadActivities > 0 && <span className="absolute right-1.5 top-1.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-accent px-0.5 font-mono text-[6px] text-accent-foreground">{Math.min(unreadActivities, 9)}</span>}</button>
              <button onClick={() => setComposerOpen(true)} className="group flex h-9 items-center gap-2 rounded-full bg-foreground px-3.5 font-mono text-[8px] font-medium uppercase tracking-[.13em] text-background transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:px-4"><Plus className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-90" /><span className="hidden sm:inline">New entry</span></button>
            </div>

            <AnimatePresence>
              {notificationsOpen && <motion.div initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: .98 }} transition={{ duration: .25 }} className={`absolute right-0 top-[calc(100%+.6rem)] w-[min(340px,calc(100vw-1.5rem))] ${panelClass} overflow-hidden bg-background p-2 shadow-[0_24px_70px_rgba(8,16,12,.18)]`}>
                <div className="flex items-center justify-between px-3 py-2"><div><p className="font-mono text-[7px] uppercase tracking-[.18em] text-muted-foreground">Notifications</p><p className="mt-1 text-xs">Workspace activity</p></div><button onClick={() => void markActivitiesRead()} className="font-mono text-[7px] uppercase tracking-[.12em] text-muted-foreground hover:text-foreground">Mark read</button></div>
                {activities.slice(0, 6).map((item) => <button key={item.id} onClick={() => { setNotificationsOpen(false); navigate(item.type === "enquiry" ? "Enquiries" : item.type === "gallery" ? "Gallery" : item.type === "team" ? "Team" : item.type === "testimonial" ? "Testimonials" : item.type === "settings" ? "Settings" : "Projects"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted"><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.read ? "bg-border" : "bg-accent"}`} /><span className="min-w-0 flex-1 truncate text-[11px]">{item.message}</span><span className="font-mono text-[7px] text-muted-foreground">{formatRelativeDate(item.createdAt)}</span></button>)}
                {activities.length === 0 && <p className="px-3 py-5 text-center text-xs text-muted-foreground">No activity yet.</p>}
              </motion.div>}
            </AnimatePresence>
          </header>
        </div>

        <main className="px-3 pb-28 pt-6 sm:px-5 sm:pt-8 lg:px-6 lg:pb-12 xl:px-8">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }} transition={{ duration: .35, ease: [.2, .75, .2, 1] }} className="mx-auto max-w-[1500px]">
              {section === "Overview" && <Overview name={profile?.fullName || profile?.email || "Administrator"} onNavigate={navigate} onEditProject={(item) => setEditor({ kind: "project", item })} onOpenEnquiry={(item) => setEditor({ kind: "enquiry", item })} />}
              {section === "Projects" && <ProjectsPanel projects={matchingProjects} query={query} setQuery={setQuery} onCreate={() => create("project")} onEdit={(item) => setEditor({ kind: "project", item })} />}
              {section === "Gallery" && <GalleryPanel gallery={gallery} onUpload={() => create("gallery")} onEdit={(item) => setEditor({ kind: "gallery", item })} />}
              {section === "Team" && <TeamPanel team={matchingTeam} query={query} setQuery={setQuery} onCreate={() => create("team")} onEdit={(item) => setEditor({ kind: "team", item })} />}
              {section === "Testimonials" && <TestimonialsPanel testimonials={testimonials} onCreate={() => create("testimonial")} onEdit={(item) => setEditor({ kind: "testimonial", item })} />}
              {section === "Enquiries" && <EnquiriesPanel enquiries={enquiries} onOpen={(item) => setEditor({ kind: "enquiry", item })} />}
              {section === "Settings" && <SettingsPanel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <nav aria-label="Admin mobile navigation" className="admin-dock-shell fixed inset-x-3 bottom-[max(.75rem,env(safe-area-inset-bottom))] z-30 grid h-[58px] grid-cols-7 rounded-[1.2rem] border border-white/10 bg-slate-dark/95 p-1 text-white shadow-[0_16px_48px_rgba(8,16,12,.28)] backdrop-blur-xl lg:hidden">
        {navItems.map((item) => {
          const active = item.label === section;
          return <button key={item.label} onClick={() => navigate(item.label)} aria-current={active ? "page" : undefined} className={`relative flex flex-col items-center justify-center gap-1 rounded-[.85rem] transition-all duration-300 active:scale-95 ${active ? "bg-white/[.09] text-white" : "text-white/40"}`}>
            {active && <motion.span layoutId="admin-mobile-active" className="absolute left-1/2 top-0 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent" />}
            <item.icon className={`h-[14px] w-[14px] transition-transform duration-300 ${active ? "-translate-y-px" : ""}`} />
            <span className="font-mono text-[5.5px] uppercase tracking-[.08em]">{item.label}</span>
            {item.label === "Enquiries" && newEnquiries > 0 && <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />}
          </button>;
        })}
      </nav>

      {createPortal(<AnimatePresence>{composerOpen && <Composer close={() => setComposerOpen(false)} reduceMotion={Boolean(reduceMotion)} create={create} />}{editor?.kind === "project" && <ProjectEditor key={`project-${editor.item?.id ?? "new"}`} project={editor.item} close={() => setEditor(null)} />}{editor?.kind === "gallery" && <GalleryEditor key={`gallery-${editor.item?.id ?? "new"}`} asset={editor.item} close={() => setEditor(null)} />}{editor?.kind === "team" && <TeamEditor key={`team-${editor.item?.id ?? "new"}`} member={editor.item} close={() => setEditor(null)} />}{editor?.kind === "testimonial" && <TestimonialEditor key={`testimonial-${editor.item?.id ?? "new"}`} testimonial={editor.item} close={() => setEditor(null)} />}{editor?.kind === "enquiry" && <EnquiryEditor key={`enquiry-${editor.item.id}`} enquiry={editor.item} close={() => setEditor(null)} />}</AnimatePresence>, document.body)}
    </div>
  );
};

const Overview = ({ name, onNavigate, onEditProject, onOpenEnquiry }: { name: string; onNavigate: (section: Section) => void; onEditProject: (project: ManagedProject) => void; onOpenEnquiry: (enquiry: Enquiry) => void }) => {
  const { projects, gallery, enquiries } = useContent();
  const reduceMotion = useReducedMotion();
  const activeProjects = projects.filter((item) => item.status === "In progress");
  const openEnquiries = enquiries.filter((item) => item.status === "New" || item.status === "Review");
  const averageProgress = activeProjects.length ? Math.round(activeProjects.reduce((sum, item) => sum + item.progress, 0) / activeProjects.length) : 100;
  const stats = [
    { label: "Active projects", value: String(activeProjects.length).padStart(2, "0"), note: `${projects.length} total records`, icon: Building2 },
    { label: "Gallery assets", value: String(gallery.length).padStart(2, "0"), note: `${gallery.filter((item) => item.status === "Draft").length} unpublished`, icon: Images },
    { label: "Open enquiries", value: String(openEnquiries.length).padStart(2, "0"), note: `${enquiries.filter((item) => item.status === "New").length} need attention`, icon: MessageSquare },
    { label: "Delivery health", value: `${averageProgress}%`, note: "Active portfolio average", icon: TrendingUp },
  ];
  const bars = [42, 58, 47, 72, 65, 84, 78, 91, 76, 88, 82, 96];
  return <>
    <SectionHeading eyebrow={`Command centre · ${new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date())}`} title={`Welcome, ${name.split(/\s|@/)[0]}.`} description="A clear view of what is moving, what needs attention and what is ready to publish." />
    <div className="-mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
      {stats.map((stat, index) => <motion.article key={stat.label} initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }} whileHover={reduceMotion ? undefined : { y: -4 }} className={`${panelClass} min-w-[72vw] snap-center p-5 sm:min-w-0`}>
        <div className="flex items-start justify-between"><p className="font-mono text-[7px] uppercase tracking-[.16em] text-muted-foreground">{stat.label}</p><span className="grid h-8 w-8 place-items-center rounded-full bg-muted"><stat.icon className="h-3.5 w-3.5 text-muted-foreground" /></span></div>
        <p className="mt-7 font-display text-5xl leading-none">{stat.value}</p><div className="mt-4 flex items-center justify-between border-t border-border pt-3"><p className="text-[10px] text-muted-foreground">{stat.note}</p><ArrowUpRight className="h-3 w-3 text-muted-foreground" /></div>
      </motion.article>)}
    </div>

    <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
      <section className={`${panelClass} overflow-hidden p-5 sm:p-7`}>
        <div className="flex items-start justify-between"><div><p className="font-mono text-[7px] uppercase tracking-[.17em] text-muted-foreground">Portfolio activity</p><h2 className="mt-2 text-3xl">Delivery momentum</h2></div><span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-mono text-[7px] uppercase tracking-[.14em] text-emerald-700 dark:text-emerald-400">+12.4%</span></div>
        <div className="mt-8 flex h-44 items-end gap-2 border-b border-border sm:h-52 sm:gap-3">{bars.map((height, index) => <div key={index} className="group flex h-full flex-1 items-end"><motion.div initial={reduceMotion ? { height: `${height}%` } : { height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: .7, delay: .08 + index * .035, ease: [.2, .7, .2, 1] }} className="w-full rounded-t-full bg-foreground/[.11] transition-colors duration-300 group-hover:bg-accent" /></div>)}</div>
        <div className="mt-3 flex justify-between font-mono text-[7px] uppercase tracking-[.12em] text-muted-foreground"><span>Sep</span><span>Dec</span><span>Mar</span><span>Jun</span><span>Aug</span></div>
      </section>

      <section className={`${panelClass} p-5 sm:p-7`}>
        <div className="flex items-center justify-between"><div><p className="font-mono text-[7px] uppercase tracking-[.17em] text-muted-foreground">Attention</p><h2 className="mt-2 text-3xl">Next actions</h2></div><span className="grid h-9 w-9 place-items-center rounded-full bg-accent/10"><CircleDot className="h-4 w-4 text-accent" /></span></div>
        <div className="mt-6 space-y-2">{([{ title: "Approve new photography", section: "Gallery", time: `${gallery.filter((item) => item.status === "Draft").length} drafts` }, { title: "Review active delivery", section: "Projects", time: `${activeProjects.length} active` }, { title: "Respond to new enquiries", section: "Enquiries", time: `${enquiries.filter((item) => item.status === "New").length} new` }] as const).map((action, index) => <button key={action.title} onClick={() => onNavigate(action.section)} className="group flex w-full items-center gap-3 rounded-2xl bg-muted/55 p-3.5 text-left transition-all duration-300 hover:bg-muted"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-background font-mono text-[7px]">0{index + 1}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs">{action.title}</span><span className="mt-1 block font-mono text-[7px] uppercase tracking-[.13em] text-muted-foreground">{action.section} · {action.time}</span></span><ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" /></button>)}</div>
      </section>
    </div>
    <div className="mt-4 grid gap-4 xl:grid-cols-2"><RecentProjects projects={projects} onView={() => onNavigate("Projects")} onEdit={onEditProject} /><RecentEnquiries enquiries={enquiries} onView={() => onNavigate("Enquiries")} onOpen={onOpenEnquiry} /></div>
  </>;
};

const RecentProjects = ({ projects, onView, onEdit }: { projects: ManagedProject[]; onView: () => void; onEdit: (project: ManagedProject) => void }) => <section className={`${panelClass} overflow-hidden`}><div className="flex items-center justify-between p-5 sm:p-6"><div><p className="font-mono text-[7px] uppercase tracking-[.16em] text-muted-foreground">Portfolio</p><h2 className="mt-2 text-2xl">Recent projects</h2></div><button onClick={onView} className="rounded-full border border-border px-3 py-2 font-mono text-[7px] uppercase tracking-[.14em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">View all</button></div><div className="space-y-1 px-2 pb-2">{projects.slice(0, 4).map((project) => <button key={project.id} onClick={() => onEdit(project)} className="grid w-full grid-cols-[1fr_auto] gap-3 rounded-2xl px-3 py-3.5 text-left transition-colors hover:bg-muted sm:px-4"><span><span className="block text-xs font-medium">{project.name}</span><span className="mt-1 block truncate font-mono text-[7px] uppercase tracking-[.12em] text-muted-foreground">{project.type} · {project.location}</span></span><span className="text-right"><Status value={project.status} /><span className="mt-1 block font-mono text-[7px] text-muted-foreground">{formatRelativeDate(project.updatedAt)}</span></span></button>)}</div></section>;

const RecentEnquiries = ({ enquiries, onView, onOpen }: { enquiries: Enquiry[]; onView: () => void; onOpen: (enquiry: Enquiry) => void }) => <section className={`${panelClass} overflow-hidden`}><div className="flex items-center justify-between p-5 sm:p-6"><div><p className="font-mono text-[7px] uppercase tracking-[.16em] text-muted-foreground">Inbox</p><h2 className="mt-2 text-2xl">Recent enquiries</h2></div><button onClick={onView} className="rounded-full border border-border px-3 py-2 font-mono text-[7px] uppercase tracking-[.14em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">View all</button></div><div className="space-y-1 px-2 pb-2">{enquiries.slice(0, 4).map((item) => <button key={item.id} onClick={() => onOpen(item)} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-muted sm:px-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted font-mono text-[7px]">{initials(item.name)}</span><span className="min-w-0 flex-1"><span className="block text-xs font-medium">{item.name}</span><span className="mt-1 block truncate text-[10px] text-muted-foreground">{item.subject}</span></span><span className="text-right"><Status value={item.status} /><span className="mt-1 block font-mono text-[7px] text-muted-foreground">{formatRelativeDate(item.createdAt)}</span></span></button>)}</div></section>;

const ProjectsPanel = ({ projects, query, setQuery, onCreate, onEdit }: { projects: ManagedProject[]; query: string; setQuery: (value: string) => void; onCreate: () => void; onEdit: (project: ManagedProject) => void }) => <>
  <SectionHeading eyebrow="Content · Projects" title="Project portfolio" description="Create, review and publish project stories across the public website." action={<button onClick={onCreate} className="group flex h-10 w-fit items-center gap-2 rounded-full bg-foreground px-4 font-mono text-[8px] uppercase tracking-[.14em] text-background transition-all hover:-translate-y-0.5 hover:shadow-lg"><Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />New project</button>} />
  <div className="mb-4 flex items-center gap-3 rounded-full bg-muted px-4 md:hidden"><Search className="h-3.5 w-3.5 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" className="h-11 w-full bg-transparent text-xs outline-none" /></div>

  <div className="space-y-3 md:hidden">{projects.map((project, index) => <motion.article key={project.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .045 }} className={`${panelClass} p-4`}>
    <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[7px] uppercase tracking-[.14em] text-muted-foreground">{project.type} · {project.location}</p><h2 className="mt-2 text-2xl leading-tight">{project.name}</h2></div><button onClick={() => onEdit(project)} aria-label={`Edit ${project.name}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted"><MoreHorizontal className="h-4 w-4" /></button></div>
    <div className="mt-5 flex items-center justify-between"><Status value={project.status} /><span className="font-mono text-[7px] text-muted-foreground">Updated {formatRelativeDate(project.updatedAt)}</span></div>
    <div className="mt-4"><div className="flex justify-between font-mono text-[7px] uppercase tracking-[.12em] text-muted-foreground"><span>Completion</span><span>{project.progress}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: .65, delay: .1 + index * .04 }} className="h-full rounded-full bg-foreground" /></div></div>
  </motion.article>)}{projects.length === 0 && <EmptyState text="No projects match that search." />}</div>

  <div className={`${panelClass} hidden overflow-x-auto md:block`}><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b border-border font-mono text-[7px] uppercase tracking-[.15em] text-muted-foreground"><th className="px-5 py-4 font-normal">Project</th><th className="px-5 py-4 font-normal">Status</th><th className="px-5 py-4 font-normal">Progress</th><th className="px-5 py-4 font-normal">Updated</th><th className="px-5 py-4 font-normal" /></tr></thead><tbody>{projects.map((project) => <tr key={project.id} className="group border-b border-border last:border-0 transition-colors hover:bg-muted/45"><td className="px-5 py-5"><p className="text-sm font-medium">{project.name}</p><p className="mt-1 font-mono text-[7px] uppercase tracking-[.12em] text-muted-foreground">{project.type} · {project.location}</p></td><td className="px-5 py-5"><Status value={project.status} /></td><td className="px-5 py-5"><div className="flex items-center gap-3"><span className="h-1.5 w-28 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-foreground transition-all duration-700" style={{ width: `${project.progress}%` }} /></span><span className="font-mono text-[7px] text-muted-foreground">{project.progress}%</span></div></td><td className="px-5 py-5 font-mono text-[7px] text-muted-foreground">{formatRelativeDate(project.updatedAt)}</td><td className="px-5 py-5"><button onClick={() => onEdit(project)} aria-label={`Edit ${project.name}`} className="grid h-8 w-8 place-items-center rounded-full transition-colors group-hover:bg-background"><MoreHorizontal className="h-4 w-4" /></button></td></tr>)}</tbody></table>{projects.length === 0 && <EmptyState text="No projects match that search." />}</div>
</>;

const GalleryPanel = ({ gallery, onUpload, onEdit }: { gallery: GalleryAsset[]; onUpload: () => void; onEdit: (asset: GalleryAsset) => void }) => <>
  <SectionHeading eyebrow="Content · Media" title="Gallery library" description="Curate the visual archive and control which images appear on the public gallery." action={<button onClick={onUpload} className="group flex h-10 w-fit items-center gap-2 rounded-full bg-foreground px-4 font-mono text-[8px] uppercase tracking-[.14em] text-background transition-all hover:-translate-y-0.5 hover:shadow-lg"><Upload className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />Upload assets</button>} />
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
    <button onClick={onUpload} className={`${panelClass} group grid min-h-52 place-items-center border-dashed p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:bg-muted sm:min-h-72`}><span><span className="mx-auto grid h-11 w-11 place-items-center rounded-full border border-border transition-all duration-500 group-hover:rotate-90 group-hover:bg-foreground group-hover:text-background"><Plus className="h-4 w-4" /></span><span className="mt-4 block text-sm">Add images or video</span><span className="mt-2 block font-mono text-[7px] uppercase tracking-[.13em] text-muted-foreground">JPG · PNG · WEBP · MP4</span></span></button>
    {gallery.map((item, index) => <motion.article key={item.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .035 }} className={`${panelClass} group overflow-hidden`}><div className="relative aspect-[4/3] overflow-hidden"><img src={item.src} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" /><div className="absolute inset-x-3 top-3 flex justify-between"><span className="rounded-full bg-slate-dark/80 px-2.5 py-1 font-mono text-[7px] uppercase tracking-[.13em] text-white backdrop-blur">{item.status}</span><button onClick={() => onEdit(item)} aria-label={`Edit ${item.name}`} className="grid h-8 w-8 place-items-center rounded-full bg-background/90 backdrop-blur"><MoreHorizontal className="h-4 w-4" /></button></div></div><div className="flex items-end justify-between p-4"><div><h3 className="text-lg">{item.name}</h3><p className="mt-1 font-mono text-[7px] uppercase tracking-[.13em] text-muted-foreground">{item.type} · {item.year}</p></div><a href={item.src} target="_blank" rel="noreferrer" aria-label={`Preview ${item.name}`} className="grid h-8 w-8 place-items-center rounded-full border border-border transition-colors hover:bg-foreground hover:text-background"><Eye className="h-3.5 w-3.5" /></a></div></motion.article>)}
  </div>
</>;

const TeamPanel = ({ team, query, setQuery, onCreate, onEdit }: { team: TeamMember[]; query: string; setQuery: (value: string) => void; onCreate: () => void; onEdit: (member: TeamMember) => void }) => <>
  <SectionHeading eyebrow="Content · People" title="Team directory" description="Add, edit, order and publish the people shown on the public team page." action={<button onClick={onCreate} className="group flex h-10 w-fit items-center gap-2 rounded-full bg-foreground px-4 font-mono text-[8px] uppercase tracking-[.14em] text-background transition-all hover:-translate-y-0.5 hover:shadow-lg"><Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />New team member</button>} />
  <div className="mb-4 flex items-center gap-3 rounded-full bg-muted px-4 md:hidden"><Search className="h-3.5 w-3.5 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search team" className="h-11 w-full bg-transparent text-xs outline-none" /></div>
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
    {team.map((member, index) => <motion.article key={member.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .035 }} className={`${panelClass} group overflow-hidden`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">{member.image ? <img src={member.image} alt={member.name} className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.035]" /> : <div className="grid h-full place-items-center font-display text-6xl text-muted-foreground/35">{initials(member.name)}</div>}<div className="absolute inset-x-3 top-3 flex justify-between"><Status value={member.status} /><button onClick={() => onEdit(member)} aria-label={`Edit ${member.name}`} className="grid h-8 w-8 place-items-center rounded-full bg-background/90 backdrop-blur"><MoreHorizontal className="h-4 w-4" /></button></div>{member.featured && <span className="absolute bottom-3 left-3 rounded-full bg-slate-dark/80 px-2.5 py-1 font-mono text-[7px] uppercase tracking-[.13em] text-white backdrop-blur">Featured leader</span>}</div>
      <div className="flex items-end justify-between gap-4 p-4"><div className="min-w-0"><h3 className="truncate text-lg">{member.name}</h3><p className="mt-1 text-[10px] text-muted-foreground">{member.role}</p><p className="mt-2 font-mono text-[7px] uppercase tracking-[.13em] text-muted-foreground">{String(member.sortOrder).padStart(2, "0")} · {member.discipline}</p></div><button onClick={() => onEdit(member)} aria-label={`Edit ${member.name}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border transition-colors hover:bg-foreground hover:text-background"><ChevronRight className="h-3.5 w-3.5" /></button></div>
    </motion.article>)}
  </div>
  {team.length === 0 && <div className={panelClass}><EmptyState text="No team members match that search." /></div>}
</>;

const TestimonialsPanel = ({ testimonials, onCreate, onEdit }: { testimonials: Testimonial[]; onCreate: () => void; onEdit: (testimonial: Testimonial) => void }) => <>
  <SectionHeading eyebrow="Content · Endorsements" title="Testimonials" description="Curate the client voices shown on the public homepage carousel." action={<button onClick={onCreate} className="group flex h-10 w-fit items-center gap-2 rounded-full bg-foreground px-4 font-mono text-[8px] uppercase tracking-[.14em] text-background transition-all hover:-translate-y-0.5 hover:shadow-lg"><Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />New testimonial</button>} />
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    {testimonials.map((testimonial, index) => <motion.article key={testimonial.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .035 }} className={`${panelClass} flex flex-col p-5 sm:p-6`}>
      <div className="flex items-start justify-between gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted"><Quote className="h-4 w-4 text-muted-foreground" /></span><div className="flex items-center gap-2"><Status value={testimonial.status} /><button onClick={() => onEdit(testimonial)} aria-label={`Edit ${testimonial.name}'s testimonial`} className="grid h-8 w-8 place-items-center rounded-full bg-muted"><MoreHorizontal className="h-4 w-4" /></button></div></div>
      <p className="mt-5 line-clamp-5 flex-1 text-[11px] leading-6 text-muted-foreground">“{testimonial.quote}”</p>
      <div className="mt-5 border-t border-border pt-4"><p className="text-sm font-medium">{testimonial.name}</p><p className="mt-1 font-mono text-[7px] uppercase tracking-[.13em] text-muted-foreground">{String(testimonial.sortOrder).padStart(2, "0")} · {testimonial.role}</p></div>
    </motion.article>)}
  </div>
  {testimonials.length === 0 && <div className={panelClass}><EmptyState text="No testimonials yet. Create the first endorsement." /></div>}
</>;

const EnquiriesPanel = ({ enquiries, onOpen }: { enquiries: Enquiry[]; onOpen: (enquiry: Enquiry) => void }) => {
  const { refreshContent, loading } = useContent();
  return <>
    <SectionHeading eyebrow="Inbox · Client relations" title="Enquiries" description="Review new conversations, viewing requests and partnership opportunities." action={<button onClick={() => void refreshContent()} disabled={loading} className="group flex h-10 w-fit items-center gap-2 rounded-full border border-border px-4 font-mono text-[8px] uppercase tracking-[.14em] transition-colors hover:border-foreground disabled:opacity-50"><RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : "transition-transform duration-500 group-hover:rotate-180"}`} />Refresh inbox</button>} />
    <div className="grid gap-4 xl:grid-cols-[1fr_330px]">
      <section className={`${panelClass} space-y-1 overflow-hidden p-2`}>{enquiries.map((item, index) => <motion.button key={item.id} onClick={() => onOpen(item)} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .04 }} className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left transition-colors hover:bg-muted sm:px-4 ${item.status === "New" ? "bg-muted/60" : ""}`}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-background font-mono text-[8px] shadow-sm">{initials(item.name)}</span><span className="min-w-0 flex-1"><span className="block text-xs font-medium sm:text-sm">{item.name}</span><span className="mt-1 block truncate text-[10px] text-muted-foreground sm:text-xs">{item.subject}</span></span><span className="shrink-0 text-right"><Status value={item.status} /><span className="mt-1.5 block font-mono text-[7px] text-muted-foreground">{formatRelativeDate(item.createdAt)}</span></span><ChevronRight className="hidden h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:block" /></motion.button>)}{enquiries.length === 0 && <EmptyState text="No enquiries yet." />}</section>
      <aside className="overflow-hidden rounded-[1.5rem] bg-slate-dark p-6 text-white shadow-[0_22px_70px_rgba(8,16,12,.16)]"><div className="flex items-center justify-between"><MessageSquare className="h-5 w-5 text-white/45" /><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,.7)]" /></div><p className="mt-10 font-mono text-[7px] uppercase tracking-[.17em] text-white/40">Response health</p><p className="mt-3 font-display text-6xl">{enquiries.filter((item) => item.status === "New").length}</p><p className="mt-2 text-xs text-white/50">New conversations</p><div className="mt-9 rounded-[1.25rem] bg-white/[.06] p-4"><p className="font-mono text-[7px] uppercase tracking-[.14em] text-white/40">All records</p><div className="mt-4 space-y-3">{[["Received", enquiries.length], ["Replied", enquiries.filter((item) => item.status === "Replied").length], ["In review", enquiries.filter((item) => item.status === "Review").length]].map(([label, value]) => <div key={label} className="flex justify-between text-xs"><span className="text-white/55">{label}</span><span>{String(value).padStart(2, "0")}</span></div>)}</div></div></aside>
    </div>
  </>;
};

const passwordRules = [
  { label: "12 or more characters", test: (value: string) => value.length >= 12 },
  { label: "Upper and lowercase letters", test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { label: "At least one number", test: (value: string) => /\d/.test(value) },
  { label: "At least one symbol", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

const PasswordSettings = () => {
  const { profile, changeOwnPassword } = useAuth();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const passedRules = passwordRules.filter((rule) => rule.test(newPassword)).length;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    if (!passwordRules.every((rule) => rule.test(newPassword))) {
      setError("Your new password must satisfy all four security requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The new password and confirmation do not match.");
      return;
    }
    if (currentPassword === newPassword) {
      setError("Choose a password different from your current password.");
      return;
    }

    setSaving(true);
    try {
      await changeOwnPassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswords(false);
      setSuccess("Your password has been changed successfully.");
      toast({ title: "Password changed", description: "Your administrator account now uses the new password." });
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "Your password could not be changed.");
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = "mt-2 flex h-12 items-center rounded-xl border border-border bg-background px-3 transition-colors focus-within:border-foreground";
  return <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16 }} className={`${panelClass} overflow-hidden xl:col-span-2`}>
    <div className="grid lg:grid-cols-[.85fr_1.15fr]">
      <div className="flex flex-col justify-between bg-slate-dark p-6 text-white sm:p-8">
        <div>
          <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/[.06]"><KeyRound className="h-4 w-4 text-white/70" /></span><span className="font-mono text-[7px] uppercase tracking-[.16em] text-white/35">03 · Account security</span></div>
          <p className="mt-10 font-mono text-[8px] uppercase tracking-[.18em] text-white/40">Authenticated account</p>
          <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">Change your password.</h2>
          <p className="mt-5 max-w-md text-xs leading-6 text-white/50">Verify your current password before replacing it. Your new password takes effect immediately for the next sign-in.</p>
        </div>
        <div className="mt-10 rounded-[1.25rem] border border-white/10 bg-white/[.045] p-4">
          <p className="font-mono text-[7px] uppercase tracking-[.14em] text-white/35">Signed in as</p>
          <p className="mt-2 truncate text-xs text-white/75">{profile?.email}</p>
        </div>
      </div>

      <form onSubmit={submit} className="p-5 sm:p-8">
        <div className="flex items-start justify-between gap-5"><div><p className="font-mono text-[7px] uppercase tracking-[.16em] text-muted-foreground">Secure credentials</p><h3 className="mt-2 text-2xl">Set a new password</h3></div><button type="button" onClick={() => setShowPasswords((visible) => !visible)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border transition-colors hover:bg-foreground hover:text-background" aria-label={showPasswords ? "Hide passwords" : "Show passwords"}>{showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2"><span className={editorLabel}>Current password</span><span className={fieldClass}><KeyRound className="h-3.5 w-3.5 text-muted-foreground" /><input type={showPasswords ? "text" : "password"} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" required className="h-full min-w-0 flex-1 bg-transparent px-3 text-xs outline-none" placeholder="Verify your current password" /></span></label>
          <label className="block"><span className={editorLabel}>New password</span><span className={fieldClass}><ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" /><input type={showPasswords ? "text" : "password"} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" minLength={12} required className="h-full min-w-0 flex-1 bg-transparent px-3 text-xs outline-none" placeholder="Create a strong password" /></span></label>
          <label className="block"><span className={editorLabel}>Confirm new password</span><span className={fieldClass}><ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" /><input type={showPasswords ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={12} required className="h-full min-w-0 flex-1 bg-transparent px-3 text-xs outline-none" placeholder="Repeat the new password" /></span></label>
        </div>

        <div className="mt-5 rounded-2xl bg-muted/60 p-4">
          <div className="grid grid-cols-4 gap-1.5">{passwordRules.map((rule, index) => <span key={rule.label} className={`h-1 rounded-full transition-colors duration-300 ${index < passedRules ? "bg-foreground" : "bg-border"}`} />)}</div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">{passwordRules.map((rule) => { const passed = rule.test(newPassword); return <p key={rule.label} className={`flex items-center gap-2 text-[10px] transition-colors ${passed ? "text-foreground" : "text-muted-foreground"}`}><span className={`grid h-4 w-4 place-items-center rounded-full border ${passed ? "border-foreground bg-foreground text-background" : "border-border"}`}>{passed && <Check className="h-2.5 w-2.5" />}</span>{rule.label}</p>; })}</div>
        </div>

        <div aria-live="polite">{error && <p role="alert" className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs leading-5 text-destructive">{error}</p>}{success && <p className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs leading-5 text-emerald-700 dark:text-emerald-400">{success}</p>}</div>
        <button type="submit" disabled={saving} className="mt-5 flex h-11 items-center gap-2 rounded-full bg-foreground px-5 font-mono text-[7px] uppercase tracking-[.15em] text-background transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-wait disabled:opacity-60">{saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}{saving ? "Verifying account" : "Change password"}</button>
      </form>
    </div>
  </motion.section>;
};

const SettingsPanel = () => {
  const { settings, updateSettings, projects, gallery, team, enquiries, activities } = useContent();
  const { toast } = useToast();
  const [form, setForm] = useState<SiteSettings>(settings);
  const change = (key: keyof SiteSettings, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    try {
      await updateSettings(form);
      toast({ title: "Settings saved", description: "Public contact details were updated in Supabase." });
    } catch (error) {
      toast({ title: "Settings could not be saved", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ projects, gallery, team, enquiries, settings: form, activities }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `kansadco-content-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url);
  };
  const groups: { title: string; icon: typeof Building2; fields: [string, keyof SiteSettings][] }[] = [
    { title: "Company profile", icon: Building2, fields: [["Display name", "displayName"], ["Primary email", "primaryEmail"], ["Telephone", "telephone"], ["Abuja address", "abujaAddress"], ["Kano address", "kanoAddress"]] },
    { title: "Publishing", icon: Check, fields: [["Default author", "defaultAuthor"], ["Review workflow", "reviewWorkflow"], ["Image quality", "imageQuality"]] },
  ];
  return <><SectionHeading eyebrow="Workspace · Configuration" title="Settings" description="Control brand details, public contact information and account security." action={<button onClick={exportData} className="flex h-10 w-fit items-center gap-2 rounded-full border border-border px-4 font-mono text-[7px] uppercase tracking-[.14em] transition-colors hover:border-foreground"><Download className="h-3.5 w-3.5" />Export content</button>} /><div className="grid gap-4 xl:grid-cols-2">{groups.map((group, groupIndex) => <motion.section key={group.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: groupIndex * .08 }} className={`${panelClass} p-5 sm:p-6`}><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-muted"><group.icon className="h-4 w-4 text-muted-foreground" /></span><h2 className="text-2xl">{group.title}</h2></div><span className="font-mono text-[7px] uppercase tracking-[.14em] text-muted-foreground">0{groupIndex + 1}</span></div><div className="mt-6 space-y-2">{group.fields.map(([label, key]) => <label key={key} className="block rounded-2xl bg-muted/55 px-4 py-3 transition-colors focus-within:bg-muted"><span className="font-mono text-[7px] uppercase tracking-[.14em] text-muted-foreground">{label}</span><input value={form[key]} onChange={(event) => change(key, event.target.value)} className="mt-1.5 block w-full bg-transparent text-xs outline-none sm:text-sm" /></label>)}</div><button onClick={() => void save()} disabled={saving} className="mt-5 flex h-10 items-center gap-2 rounded-full bg-foreground px-5 font-mono text-[7px] uppercase tracking-[.15em] text-background transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60">{saving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}{saving ? "Saving" : "Save changes"}</button></motion.section>)}<PasswordSettings /></div></>;
};

const EmptyState = ({ text }: { text: string }) => <div className="p-10 text-center"><Search className="mx-auto h-5 w-5 text-muted-foreground" /><p className="mt-3 text-xs text-muted-foreground">{text}</p></div>;

const Composer = ({ close, reduceMotion, create }: { close: () => void; reduceMotion: boolean; create: (kind: "project" | "gallery" | "team" | "testimonial") => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }} className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-dark/50 p-3 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label="Create new entry">
    <button onClick={close} className="absolute inset-0" aria-label="Close create dialog" />
    <motion.div initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 30, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 22, scale: .98 }} transition={{ duration: .4, ease: [.2, .8, .2, 1] }} className="relative w-full max-w-xl rounded-[2rem] border border-border bg-background p-5 shadow-[0_30px_100px_rgba(8,16,12,.3)] sm:p-7">
      <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[8px] uppercase tracking-[.18em] text-muted-foreground">Quick create</p><h2 className="mt-2 text-[2.5rem] leading-none sm:text-5xl">Add to the workspace.</h2></div><button onClick={close} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border transition-colors hover:bg-foreground hover:text-background"><X className="h-4 w-4" /></button></div>
      <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">{([{ label: "Project", kind: "project" }, { label: "Gallery asset", kind: "gallery" }, { label: "Team member", kind: "team" }, { label: "Testimonial", kind: "testimonial" }] as const).map((item, index) => <motion.button key={item.kind} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 + index * .05 }} onClick={() => create(item.kind)} className="group flex min-h-28 flex-col justify-between rounded-[1.25rem] border border-border p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-foreground hover:text-background sm:min-h-36 sm:p-4"><Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" /><span><span className="block text-[11px] sm:text-sm">{item.label}</span><ArrowUpRight className="ml-auto mt-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span></motion.button>)}</div>
      <p className="mt-5 font-mono text-[7px] uppercase leading-5 tracking-[.13em] text-muted-foreground">New entries remain drafts until reviewed and published.</p>
    </motion.div>
  </motion.div>
);

const editorField = "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-xs outline-none transition-colors focus:border-foreground";
const editorLabel = "font-mono text-[7px] uppercase tracking-[.14em] text-muted-foreground";
const projectSlug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const BrandedDeleteDialog = ({ itemName, itemType, disabled, trigger, onConfirm }: {
  itemName: string;
  itemType: string;
  disabled?: boolean;
  trigger: ReactNode;
  onConfirm: () => void | Promise<void>;
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild disabled={disabled}>{trigger}</AlertDialogTrigger>
    <AlertDialogContent className="w-[min(28rem,calc(100vw-1.5rem))] max-w-none gap-0 overflow-hidden rounded-[2rem] border-border bg-background p-0 shadow-[0_32px_110px_rgba(8,16,12,.42)] sm:rounded-[2rem]">
      <AlertDialogHeader className="space-y-0 bg-slate-dark p-6 text-left text-white sm:p-7">
        <span className="mb-8 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[.07]"><Trash2 className="h-4 w-4 text-red-300" /></span>
        <p className="font-mono text-[8px] uppercase tracking-[.19em] text-white/40">Permanent action</p>
        <AlertDialogTitle className="mt-3 font-display text-[2.35rem] font-normal leading-[.95] tracking-[-.025em]">Remove {itemType}?</AlertDialogTitle>
      </AlertDialogHeader>
      <div className="p-6 sm:p-7">
        <AlertDialogDescription className="text-sm leading-6 text-muted-foreground">
          <span className="font-medium text-foreground">{itemName}</span> will be permanently removed from the workspace{itemType === "team member" ? " and the public team page" : ""}. This cannot be undone.
        </AlertDialogDescription>
        <AlertDialogFooter className="mt-7 grid grid-cols-2 gap-2 space-x-0 sm:grid-cols-2 sm:space-x-0">
          <AlertDialogCancel disabled={disabled} className="mt-0 h-11 rounded-full border-border bg-transparent font-mono text-[8px] uppercase tracking-[.14em] hover:bg-muted">Keep it</AlertDialogCancel>
          <AlertDialogAction onClick={() => void onConfirm()} disabled={disabled} className="h-11 rounded-full bg-destructive font-mono text-[8px] uppercase tracking-[.14em] text-destructive-foreground hover:bg-destructive/90">
            {disabled ? <LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Trash2 className="mr-2 h-3.5 w-3.5" />}Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);

const EditorShell = ({ label, title, close, children }: { label: string; title: string; close: () => void; children: ReactNode }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-dark/55 p-3 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label={title}>
    <button onClick={close} className="absolute inset-0" aria-label="Close editor" />
    <motion.div initial={{ opacity: 0, y: 28, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .985 }} transition={{ duration: .35, ease: [.2, .8, .2, 1] }} className="relative max-h-[calc(100svh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-border bg-background p-5 shadow-[0_30px_100px_rgba(8,16,12,.35)] sm:p-7">
      <div className="sticky top-0 z-10 -mx-1 flex items-start justify-between gap-4 bg-background/95 px-1 pb-5 backdrop-blur"><div><p className="font-mono text-[8px] uppercase tracking-[.18em] text-muted-foreground">{label}</p><h2 className="mt-2 text-[2.35rem] leading-none sm:text-5xl">{title}</h2></div><button onClick={close} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border transition-colors hover:bg-foreground hover:text-background"><X className="h-4 w-4" /></button></div>
      {children}
    </motion.div>
  </motion.div>
);

const ProjectEditor = ({ project, close }: { project?: ManagedProject; close: () => void }) => {
  const { addProject, updateProject, deleteProject, uploadMedia } = useContent();
  const { toast } = useToast();
  const [form, setForm] = useState({
    slug: project?.slug ?? "", name: project?.name ?? "", type: project?.type ?? "Residential", location: project?.location ?? "",
    progress: project?.progress ?? 0, status: project?.status ?? "Draft" as ProjectStatus,
    year: project?.year ?? new Date().getFullYear().toString(), description: project?.description ?? "", image: project?.image ?? heroSignature,
    client: project?.client ?? "", scope: project?.scope ?? "", area: project?.area ?? "", duration: project?.duration ?? "",
    overview: project?.overview ?? "", challenge: project?.challenge ?? "", solution: project?.solution ?? "",
    features: project?.features ?? [], galleryImages: project?.galleryImages ?? [],
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(project?.slug));
  const change = (key: keyof typeof form, value: string | number | string[]) => setForm((current) => ({ ...current, [key]: value }));
  const changeName = (value: string) => setForm((current) => ({ ...current, name: value, slug: slugEdited ? current.slug : projectSlug(value) }));
  const uploadCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { change("image", await uploadMedia(file)); toast({ title: "Cover uploaded" }); }
    catch (error) { toast({ title: "Upload failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setUploading(false); event.target.value = ""; }
  };
  const uploadGallery = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []); if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadMedia));
      setForm((current) => ({ ...current, galleryImages: [...current.galleryImages, ...urls] }));
      toast({ title: `${urls.length} gallery ${urls.length === 1 ? "image" : "images"} uploaded` });
    } catch (error) { toast({ title: "Upload failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setUploading(false); event.target.value = ""; }
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (project) await updateProject(project.id, form); else await addProject(form);
      toast({ title: project ? "Project updated" : "Project created", description: `${form.name} is ${form.status.toLowerCase()}.` });
      close();
    } catch (error) {
      toast({ title: "Project could not be saved", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };
  const remove = async () => {
    if (!project) return;
    setSaving(true);
    try { await deleteProject(project.id); toast({ title: "Project deleted" }); close(); }
    catch (error) { toast({ title: "Project could not be deleted", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setSaving(false); }
  };
  return <EditorShell label={project ? "Portfolio · Edit" : "Portfolio · New"} title={project ? "Edit project." : "Create a project."} close={close}>
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className={editorLabel}>Project name<input value={form.name} onChange={(e) => changeName(e.target.value)} required className={editorField} /></label>
      <label className={editorLabel}>Category<input value={form.type} onChange={(e) => change("type", e.target.value)} required className={editorField} /></label>
      <label className={`${editorLabel} sm:col-span-2`}>Public URL slug<input value={form.slug} onChange={(e) => { setSlugEdited(true); change("slug", projectSlug(e.target.value)); }} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="project-name" className={editorField} /><span className="mt-1.5 block normal-case tracking-normal text-[9px]">kansadco.com/projects/{form.slug || "project-name"}</span></label>
      <label className={editorLabel}>Location<input value={form.location} onChange={(e) => change("location", e.target.value)} required className={editorField} /></label>
      <label className={editorLabel}>Year<input value={form.year} onChange={(e) => change("year", e.target.value)} required className={editorField} /></label>
      <label className={editorLabel}>Status<select value={form.status} onChange={(e) => change("status", e.target.value as ProjectStatus)} className={editorField}><option>Draft</option><option>In progress</option><option>Published</option></select></label>
      <label className={editorLabel}>Completion · {form.progress}%<input type="range" min="0" max="100" value={form.progress} onChange={(e) => change("progress", Number(e.target.value))} className="mt-4 h-6 w-full accent-current" /></label>
      <label className={editorLabel}>Client<input value={form.client} onChange={(e) => change("client", e.target.value)} placeholder="Client or client type" className={editorField} /></label>
      <label className={editorLabel}>Scope<input value={form.scope} onChange={(e) => change("scope", e.target.value)} placeholder="Architecture · Construction" className={editorField} /></label>
      <label className={editorLabel}>Area / scale<input value={form.area} onChange={(e) => change("area", e.target.value)} placeholder="18 hectares" className={editorField} /></label>
      <label className={editorLabel}>Project duration<input value={form.duration} onChange={(e) => change("duration", e.target.value)} placeholder="2024 — Ongoing" className={editorField} /></label>
      <label className={`${editorLabel} sm:col-span-2`}>Card summary<textarea value={form.description} onChange={(e) => change("description", e.target.value)} required rows={3} className={`${editorField} h-auto py-3`} /></label>
      <label className={`${editorLabel} sm:col-span-2`}>Project overview<textarea value={form.overview} onChange={(e) => change("overview", e.target.value)} required rows={5} className={`${editorField} h-auto py-3 leading-6`} /></label>
      <label className={`${editorLabel} sm:col-span-2`}>The challenge<textarea value={form.challenge} onChange={(e) => change("challenge", e.target.value)} rows={4} className={`${editorField} h-auto py-3 leading-6`} /></label>
      <label className={`${editorLabel} sm:col-span-2`}>KANSADCO's response<textarea value={form.solution} onChange={(e) => change("solution", e.target.value)} rows={4} className={`${editorField} h-auto py-3 leading-6`} /></label>
      <label className={`${editorLabel} sm:col-span-2`}>Key features · one per line<textarea value={form.features.join("\n")} onChange={(e) => change("features", e.target.value.split("\n").map((item) => item.trim()).filter(Boolean))} rows={5} placeholder={"Secure arrival\nLandscaped communal spaces\nFlexible home types"} className={`${editorField} h-auto py-3 leading-6`} /></label>
      <label className={editorLabel}>Upload cover image<span className="relative mt-2 block"><input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={(event) => void uploadCover(event)} disabled={uploading} className="block w-full text-[10px] file:mr-3 file:rounded-full file:border-0 file:bg-foreground file:px-3 file:py-2 file:text-[8px] file:uppercase file:text-background disabled:opacity-50" /></span></label>
      <label className={editorLabel}>Or paste cover URL<input value={form.image} onChange={(e) => change("image", e.target.value)} required className={editorField} /></label>
      {form.image && <div className="sm:col-span-2"><img src={form.image} alt="Project preview" className="h-40 w-full rounded-2xl object-cover" /></div>}
      <label className={editorLabel}>Upload gallery images<span className="relative mt-2 block"><input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={(event) => void uploadGallery(event)} disabled={uploading} className="block w-full text-[10px] file:mr-3 file:rounded-full file:border-0 file:bg-foreground file:px-3 file:py-2 file:text-[8px] file:uppercase file:text-background disabled:opacity-50" />{uploading && <span className="mt-2 flex items-center gap-2 text-[9px] normal-case tracking-normal"><LoaderCircle className="h-3 w-3 animate-spin" />Uploading securely…</span>}</span></label>
      <label className={editorLabel}>Or add gallery URLs · one per line<textarea value={form.galleryImages.join("\n")} onChange={(e) => change("galleryImages", e.target.value.split("\n").map((item) => item.trim()).filter(Boolean))} rows={4} placeholder="https://…" className={`${editorField} h-auto py-3 normal-case tracking-normal`} /></label>
      {form.galleryImages.length > 0 && <div className="grid grid-cols-2 gap-2 sm:col-span-2 sm:grid-cols-3">{form.galleryImages.map((image, index) => <div key={`${image}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted"><img src={image} alt={`Gallery preview ${index + 1}`} className="h-full w-full object-cover" /><button type="button" onClick={() => change("galleryImages", form.galleryImages.filter((_, imageIndex) => imageIndex !== index))} aria-label={`Remove gallery image ${index + 1}`} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-slate-dark/80 text-white opacity-0 transition-opacity group-hover:opacity-100"><X className="h-3 w-3" /></button></div>)}</div>}
      <div className="mt-2 flex items-center justify-between gap-3 sm:col-span-2">{project ? <BrandedDeleteDialog itemName={project.name} itemType="project" disabled={saving || uploading} onConfirm={remove} trigger={<button type="button" className="flex h-10 items-center gap-2 rounded-full border border-destructive/30 px-4 font-mono text-[7px] uppercase tracking-[.14em] text-destructive disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" />Delete</button>} /> : <span />}<button type="submit" disabled={saving || uploading} className="flex h-11 items-center gap-2 rounded-full bg-foreground px-6 font-mono text-[8px] uppercase tracking-[.15em] text-background disabled:opacity-60">{saving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}{saving ? "Saving" : project ? "Save changes" : "Create project"}</button></div>
    </form>
  </EditorShell>;
};

const GalleryEditor = ({ asset, close }: { asset?: GalleryAsset; close: () => void }) => {
  const { addGalleryAsset, updateGalleryAsset, deleteGalleryAsset, uploadMedia } = useContent();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: asset?.name ?? "", type: asset?.type ?? "Residential", location: asset?.location ?? "Abuja", year: asset?.year ?? new Date().getFullYear().toString(), status: asset?.status ?? "Draft" as AssetStatus, src: asset?.src ?? heroSignature });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const change = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const chooseFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const publicUrl = await uploadMedia(file);
      change("src", publicUrl);
      toast({ title: "Image uploaded", description: "The file is now stored in the Supabase media library." });
    } catch (error) {
      toast({ title: "Upload failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true);
    try { if (asset) await updateGalleryAsset(asset.id, form); else await addGalleryAsset(form); toast({ title: asset ? "Asset updated" : "Asset added", description: `${form.name} is ${form.status.toLowerCase()}.` }); close(); }
    catch (error) { toast({ title: "Asset could not be saved", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setSaving(false); }
  };
  const remove = async () => {
    if (!asset) return;
    setSaving(true);
    try { await deleteGalleryAsset(asset.id); toast({ title: "Gallery asset deleted" }); close(); }
    catch (error) { toast({ title: "Asset could not be deleted", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setSaving(false); }
  };
  return <EditorShell label={asset ? "Gallery · Edit" : "Gallery · Upload"} title={asset ? "Edit asset." : "Add to the archive."} close={close}>
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className={editorLabel}>Title<input value={form.name} onChange={(e) => change("name", e.target.value)} required className={editorField} /></label>
      <label className={editorLabel}>Category<input value={form.type} onChange={(e) => change("type", e.target.value)} required className={editorField} /></label>
      <label className={editorLabel}>Location<input value={form.location} onChange={(e) => change("location", e.target.value)} required className={editorField} /></label>
      <label className={editorLabel}>Year<input value={form.year} onChange={(e) => change("year", e.target.value)} required className={editorField} /></label>
      <label className={editorLabel}>Status<select value={form.status} onChange={(e) => change("status", e.target.value as AssetStatus)} className={editorField}><option>Draft</option><option>Published</option></select></label>
      <label className={editorLabel}>Upload image<span className="relative mt-2 block"><input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={(event) => void chooseFile(event)} disabled={uploading} className="block w-full text-[10px] file:mr-3 file:rounded-full file:border-0 file:bg-foreground file:px-3 file:py-2 file:text-[8px] file:uppercase file:text-background disabled:opacity-50" />{uploading && <span className="mt-2 flex items-center gap-2 text-[9px] normal-case tracking-normal"><LoaderCircle className="h-3 w-3 animate-spin" />Uploading securely…</span>}</span></label>
      <label className={`${editorLabel} sm:col-span-2`}>Supabase media URL<input value={form.src} onChange={(e) => change("src", e.target.value)} required className={editorField} /></label>
      {form.src && <div className="sm:col-span-2"><img src={form.src} alt="Asset preview" className="h-56 w-full rounded-2xl object-cover" /></div>}
      <div className="mt-2 flex items-center justify-between gap-3 sm:col-span-2">{asset ? <BrandedDeleteDialog itemName={asset.name} itemType="gallery asset" disabled={saving || uploading} onConfirm={remove} trigger={<button type="button" className="flex h-10 items-center gap-2 rounded-full border border-destructive/30 px-4 font-mono text-[7px] uppercase tracking-[.14em] text-destructive disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" />Delete</button>} /> : <span />}<button type="submit" disabled={saving || uploading} className="flex h-11 items-center gap-2 rounded-full bg-foreground px-6 font-mono text-[8px] uppercase tracking-[.15em] text-background disabled:opacity-60">{saving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}{saving ? "Saving" : asset ? "Save changes" : "Add asset"}</button></div>
    </form>
  </EditorShell>;
};

const TeamEditor = ({ member, close }: { member?: TeamMember; close: () => void }) => {
  const { team, settings, addTeamMember, updateTeamMember, deleteTeamMember, uploadMedia } = useContent();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: member?.name ?? "", role: member?.role ?? "", discipline: member?.discipline ?? "",
    bio: member?.bio ?? "", image: member?.image ?? "", email: member?.email ?? settings.primaryEmail,
    featured: member?.featured ?? false, sortOrder: member?.sortOrder ?? (Math.max(0, ...team.map((item) => item.sortOrder)) + 1),
    status: member?.status ?? "Draft" as TeamMemberStatus,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const change = <K extends keyof typeof form>(key: K, value: typeof form[K]) => setForm((current) => ({ ...current, [key]: value }));
  const chooseFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { change("image", await uploadMedia(file)); toast({ title: "Portrait uploaded" }); }
    catch (error) { toast({ title: "Upload failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setUploading(false); event.target.value = ""; }
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.image.trim()) {
      toast({ title: "Portrait required", description: "Upload an image from your device or paste an image URL before saving.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try { if (member) await updateTeamMember(member.id, form); else await addTeamMember(form); toast({ title: member ? "Team member updated" : "Team member added", description: `${form.name} is ${form.status.toLowerCase()}.` }); close(); }
    catch (error) { toast({ title: "Team member could not be saved", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setSaving(false); }
  };
  const remove = async () => {
    if (!member) return;
    setSaving(true);
    try { await deleteTeamMember(member.id); toast({ title: "Team member deleted" }); close(); }
    catch (error) { toast({ title: "Team member could not be deleted", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setSaving(false); }
  };
  return <EditorShell label={member ? "Team · Edit" : "Team · New"} title={member ? "Edit team member." : "Add a team member."} close={close}>
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className={editorLabel}>Full name<input value={form.name} onChange={(e) => change("name", e.target.value)} minLength={2} required className={editorField} /></label>
      <label className={editorLabel}>Role / title<input value={form.role} onChange={(e) => change("role", e.target.value)} minLength={2} required className={editorField} /></label>
      <label className={editorLabel}>Discipline<input value={form.discipline} onChange={(e) => change("discipline", e.target.value)} minLength={2} required placeholder="Architecture · Design" className={editorField} /></label>
      <label className={editorLabel}>Email<input type="email" value={form.email} onChange={(e) => change("email", e.target.value)} required className={editorField} /></label>
      <label className={editorLabel}>Status<select value={form.status} onChange={(e) => change("status", e.target.value as TeamMemberStatus)} className={editorField}><option>Draft</option><option>Published</option></select></label>
      <label className={editorLabel}>Display order<input type="number" min="1" value={form.sortOrder} onChange={(e) => change("sortOrder", Number(e.target.value))} required className={editorField} /></label>
      <label className="flex items-center gap-3 rounded-xl border border-border px-3 py-3 text-xs sm:col-span-2"><input type="checkbox" checked={form.featured} onChange={(e) => change("featured", e.target.checked)} className="h-4 w-4 accent-current" /><span><span className="block font-medium">Feature as team leader</span><span className="mt-1 block text-[10px] text-muted-foreground">The first published featured profile becomes the large leadership card.</span></span></label>
      <label className={`${editorLabel} sm:col-span-2`}>Biography<textarea value={form.bio} onChange={(e) => change("bio", e.target.value)} maxLength={4000} rows={4} className={`${editorField} h-auto py-3`} /></label>
      <label className={editorLabel}>Upload from device<span className="relative mt-2 block"><input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={(event) => void chooseFile(event)} disabled={uploading} className="block w-full text-[10px] file:mr-3 file:rounded-full file:border-0 file:bg-foreground file:px-3 file:py-2 file:text-[8px] file:uppercase file:text-background disabled:opacity-50" />{uploading && <span className="mt-2 flex items-center gap-2 text-[9px] normal-case tracking-normal"><LoaderCircle className="h-3 w-3 animate-spin" />Uploading securely…</span>}</span></label>
      <label className={editorLabel}>Or paste image URL<input value={form.image} onChange={(e) => change("image", e.target.value)} placeholder="https://example.com/portrait.jpg" className={editorField} /></label>
      {form.image && <div className="sm:col-span-2"><img src={form.image} alt="Team member preview" className="h-56 w-full rounded-2xl object-cover object-top" /></div>}
      <div className="mt-2 flex items-center justify-between gap-3 sm:col-span-2">{member ? <BrandedDeleteDialog itemName={member.name} itemType="team member" disabled={saving || uploading} onConfirm={remove} trigger={<button type="button" className="flex h-10 items-center gap-2 rounded-full border border-destructive/30 px-4 font-mono text-[7px] uppercase tracking-[.14em] text-destructive disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" />Delete</button>} /> : <span />}<button type="submit" disabled={saving || uploading} className="flex h-11 items-center gap-2 rounded-full bg-foreground px-6 font-mono text-[8px] uppercase tracking-[.15em] text-background disabled:opacity-60">{saving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}{saving ? "Saving" : member ? "Save changes" : "Add member"}</button></div>
    </form>
  </EditorShell>;
};

const TestimonialEditor = ({ testimonial, close }: { testimonial?: Testimonial; close: () => void }) => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useContent();
  const { toast } = useToast();
  const [form, setForm] = useState({
    quote: testimonial?.quote ?? "", name: testimonial?.name ?? "", role: testimonial?.role ?? "",
    sortOrder: testimonial?.sortOrder ?? (Math.max(0, ...testimonials.map((item) => item.sortOrder)) + 1),
    status: testimonial?.status ?? "Draft" as TestimonialStatus,
  });
  const [saving, setSaving] = useState(false);
  const change = <K extends keyof typeof form>(key: K, value: typeof form[K]) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try { if (testimonial) await updateTestimonial(testimonial.id, form); else await addTestimonial(form); toast({ title: testimonial ? "Testimonial updated" : "Testimonial added", description: `${form.name} is ${form.status.toLowerCase()}.` }); close(); }
    catch (error) { toast({ title: "Testimonial could not be saved", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setSaving(false); }
  };
  const remove = async () => {
    if (!testimonial) return;
    setSaving(true);
    try { await deleteTestimonial(testimonial.id); toast({ title: "Testimonial deleted" }); close(); }
    catch (error) { toast({ title: "Testimonial could not be deleted", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setSaving(false); }
  };
  return <EditorShell label={testimonial ? "Testimonials · Edit" : "Testimonials · New"} title={testimonial ? "Edit testimonial." : "Add a testimonial."} close={close}>
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className={`${editorLabel} sm:col-span-2`}>Quote<textarea value={form.quote} onChange={(e) => change("quote", e.target.value)} minLength={2} maxLength={2000} rows={5} required placeholder="What did the client say about working with KANSADCO?" className={`${editorField} h-auto py-3`} /></label>
      <label className={editorLabel}>Full name<input value={form.name} onChange={(e) => change("name", e.target.value)} minLength={2} required className={editorField} /></label>
      <label className={editorLabel}>Role / title<input value={form.role} onChange={(e) => change("role", e.target.value)} minLength={2} required placeholder="Managing Director, InnovaTech Consultancy" className={editorField} /></label>
      <label className={editorLabel}>Status<select value={form.status} onChange={(e) => change("status", e.target.value as TestimonialStatus)} className={editorField}><option>Draft</option><option>Published</option></select></label>
      <label className={editorLabel}>Display order<input type="number" min="1" value={form.sortOrder} onChange={(e) => change("sortOrder", Number(e.target.value))} required className={editorField} /></label>
      <div className="mt-2 flex items-center justify-between gap-3 sm:col-span-2">{testimonial ? <BrandedDeleteDialog itemName={testimonial.name} itemType="testimonial" disabled={saving} onConfirm={remove} trigger={<button type="button" className="flex h-10 items-center gap-2 rounded-full border border-destructive/30 px-4 font-mono text-[7px] uppercase tracking-[.14em] text-destructive disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" />Delete</button>} /> : <span />}<button type="submit" disabled={saving} className="flex h-11 items-center gap-2 rounded-full bg-foreground px-6 font-mono text-[8px] uppercase tracking-[.15em] text-background disabled:opacity-60">{saving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}{saving ? "Saving" : testimonial ? "Save changes" : "Add testimonial"}</button></div>
    </form>
  </EditorShell>;
};

const EnquiryEditor = ({ enquiry, close }: { enquiry: Enquiry; close: () => void }) => {
  const { enquiries, enquiryReplies, updateEnquiry, deleteEnquiry, replyToEnquiry, retryEnquiryNotification } = useContent();
  const { toast } = useToast();
  const currentEnquiry = enquiries.find((item) => item.id === enquiry.id) ?? enquiry;
  const replies = enquiryReplies.filter((item) => item.enquiryId === enquiry.id);
  const [saving, setSaving] = useState(false);
  const [replySubject, setReplySubject] = useState(`Re: ${enquiry.subject}`);
  const [replyMessage, setReplyMessage] = useState("");
  const sendReply = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await replyToEnquiry(enquiry.id, replySubject, replyMessage);
      setReplyMessage("");
      toast({ title: "Reply sent", description: `The response was emailed to ${enquiry.email} and saved to this conversation.` });
      close();
    } catch (error) {
      toast({ title: "Reply not sent", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally { setSaving(false); }
  };
  const setStatus = async (status: Enquiry["status"]) => {
    setSaving(true);
    try { await updateEnquiry(enquiry.id, { status }); toast({ title: `Enquiry marked ${status.toLowerCase()}` }); close(); }
    catch (error) { toast({ title: "Status could not be updated", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setSaving(false); }
  };
  const remove = async () => {
    setSaving(true);
    try { await deleteEnquiry(enquiry.id); toast({ title: "Enquiry deleted" }); close(); }
    catch (error) { toast({ title: "Enquiry could not be deleted", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setSaving(false); }
  };
  const retryNotification = async () => {
    setSaving(true);
    try { await retryEnquiryNotification(enquiry.id); toast({ title: "Email delivery retried", description: "Brevo accepted the transactional message." }); close(); }
    catch (error) { toast({ title: "Email was not delivered", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }); }
    finally { setSaving(false); }
  };
  return <EditorShell label={`${currentEnquiry.source} · ${formatRelativeDate(currentEnquiry.createdAt)}`} title={currentEnquiry.subject} close={close}>
    <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-muted p-4"><p className={editorLabel}>From</p><p className="mt-2 text-sm">{currentEnquiry.name}</p><p className="mt-1 text-xs text-muted-foreground">{currentEnquiry.email}</p><p className="mt-1 text-xs text-muted-foreground">{currentEnquiry.phone || "No telephone"}</p></div><div className="rounded-2xl bg-muted p-4"><p className={editorLabel}>Status</p><div className="mt-2 flex flex-wrap gap-2"><Status value={currentEnquiry.status} /><Status value={currentEnquiry.notificationStatus} /></div><p className="mt-3 font-mono text-[7px] uppercase tracking-[.12em] text-muted-foreground">{new Date(currentEnquiry.createdAt).toLocaleString()}</p>{currentEnquiry.notifiedAt && <p className="mt-1 font-mono text-[7px] uppercase tracking-[.12em] text-muted-foreground">Mail · {new Date(currentEnquiry.notifiedAt).toLocaleString()}</p>}</div></div>
    <div className="mt-3 rounded-2xl border border-border p-4"><p className={editorLabel}>Message</p><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{currentEnquiry.message}</p></div>
    {currentEnquiry.notificationError && <div className="mt-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4"><p className={editorLabel}>Mail delivery note</p><p className="mt-2 text-xs leading-5 text-destructive">{currentEnquiry.notificationError}</p></div>}

    <form onSubmit={sendReply} className="mt-4 rounded-[1.35rem] bg-slate-dark p-4 text-white sm:p-5">
      <div className="flex items-center justify-between gap-3"><div><p className="font-mono text-[7px] uppercase tracking-[.17em] text-white/40">Direct response</p><p className="mt-1.5 text-sm">Reply from the workspace</p></div><span className="grid h-9 w-9 place-items-center rounded-full border border-white/15"><Mail className="h-3.5 w-3.5 text-white/60" /></span></div>
      <label className="mt-5 block"><span className="font-mono text-[7px] uppercase tracking-[.14em] text-white/40">Subject</span><input value={replySubject} onChange={(event) => setReplySubject(event.target.value)} required minLength={2} maxLength={240} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[.06] px-3 text-xs text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/30" /></label>
      <label className="mt-3 block"><span className="font-mono text-[7px] uppercase tracking-[.14em] text-white/40">Message</span><textarea value={replyMessage} onChange={(event) => setReplyMessage(event.target.value)} required minLength={2} maxLength={5000} rows={6} placeholder="Write a considered response…" className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-white/[.06] p-3 text-xs leading-6 text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/30" /></label>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="font-mono text-[7px] uppercase tracking-[.12em] text-white/35">Sent to {currentEnquiry.email}</p><button type="submit" disabled={saving || replyMessage.trim().length < 2} className="flex h-10 items-center gap-2 rounded-full bg-white px-4 font-mono text-[7px] uppercase tracking-[.14em] text-slate-dark transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-50">{saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <ArrowUpRight className="h-3.5 w-3.5" />}{saving ? "Sending" : "Send reply"}</button></div>
    </form>

    {replies.length > 0 && <div className="mt-4 rounded-2xl border border-border p-4"><p className={editorLabel}>Reply history · {replies.length}</p><div className="mt-3 space-y-3">{replies.map((reply) => <div key={reply.id} className="rounded-xl bg-muted p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium">{reply.subject}</p><p className="mt-1 font-mono text-[7px] uppercase tracking-[.11em] text-muted-foreground">{reply.sentAt ? new Date(reply.sentAt).toLocaleString() : new Date(reply.createdAt).toLocaleString()}</p></div><Status value={reply.deliveryStatus} /></div><p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-muted-foreground">{reply.message}</p>{reply.deliveryError && <p className="mt-2 text-xs text-destructive">{reply.deliveryError}</p>}</div>)}</div></div>}

    <div className="mt-5 flex flex-wrap items-center gap-2">{currentEnquiry.notificationStatus !== "Sent" && <button onClick={() => void retryNotification()} disabled={saving} className="flex h-10 items-center gap-2 rounded-full border border-border px-4 font-mono text-[7px] uppercase tracking-[.13em] transition-colors hover:border-foreground disabled:opacity-50"><RefreshCw className={`h-3.5 w-3.5 ${saving ? "animate-spin" : ""}`} />Retry receipt</button>}{(["New", "Review", "Replied", "Archived"] as const).filter((status) => status !== currentEnquiry.status).map((status) => <button key={status} onClick={() => void setStatus(status)} disabled={saving} className="h-10 rounded-full border border-border px-4 font-mono text-[7px] uppercase tracking-[.13em] transition-colors hover:border-foreground disabled:opacity-50">Mark {status}</button>)}<a href={`mailto:${currentEnquiry.email}?subject=${encodeURIComponent(replySubject)}`} className="flex h-10 items-center gap-2 rounded-full border border-border px-4 font-mono text-[7px] uppercase tracking-[.13em] transition-colors hover:border-foreground"><Mail className="h-3.5 w-3.5" />Email app</a><span className="ml-auto"><BrandedDeleteDialog itemName={`${currentEnquiry.name}'s enquiry`} itemType="enquiry" disabled={saving} onConfirm={remove} trigger={<button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-destructive/30 text-destructive disabled:opacity-50" aria-label="Delete enquiry"><Trash2 className="h-3.5 w-3.5" /></button>} /></span></div>
  </EditorShell>;
};

export default Admin;
