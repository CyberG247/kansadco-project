import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import heroSignature from "@/assets/hero-signature.webp";
import heroEstate from "@/assets/hero-estate.jpg";
import heroConstruction from "@/assets/hero-construction.webp";
import paint from "@/assets/paint-service.jpg";

export type ProjectStatus = "Published" | "In progress" | "Draft";
export type AssetStatus = "Published" | "Draft";
export type EnquiryStatus = "New" | "Review" | "Replied" | "Archived";

export interface ManagedProject {
  id: string;
  name: string;
  type: string;
  location: string;
  progress: number;
  status: ProjectStatus;
  year: string;
  description: string;
  image: string;
  updatedAt: string;
}

export interface GalleryAsset {
  id: string;
  src: string;
  name: string;
  type: string;
  location: string;
  year: string;
  status: AssetStatus;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  source: "Contact" | "Private tour" | "Admin";
  createdAt: string;
}

export interface SiteSettings {
  displayName: string;
  primaryEmail: string;
  telephone: string;
  abujaAddress: string;
  kanoAddress: string;
  defaultAuthor: string;
  reviewWorkflow: string;
  imageQuality: string;
}

export interface Activity {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: "project" | "gallery" | "enquiry" | "settings";
}

interface ContentState {
  projects: ManagedProject[];
  gallery: GalleryAsset[];
  enquiries: Enquiry[];
  settings: SiteSettings;
  activities: Activity[];
}

type ProjectInput = Omit<ManagedProject, "id" | "updatedAt">;
type AssetInput = Omit<GalleryAsset, "id" | "createdAt">;
type EnquiryInput = Omit<Enquiry, "id" | "createdAt" | "status"> & { status?: EnquiryStatus };

interface ContentContextValue extends ContentState {
  addProject: (project: ProjectInput) => ManagedProject;
  updateProject: (id: string, updates: Partial<ProjectInput>) => void;
  deleteProject: (id: string) => void;
  addGalleryAsset: (asset: AssetInput) => GalleryAsset;
  updateGalleryAsset: (id: string, updates: Partial<AssetInput>) => void;
  deleteGalleryAsset: (id: string) => void;
  addEnquiry: (enquiry: EnquiryInput) => Enquiry;
  updateEnquiry: (id: string, updates: Partial<Pick<Enquiry, "status" | "subject" | "message">>) => void;
  deleteEnquiry: (id: string) => void;
  updateSettings: (settings: SiteSettings) => void;
  markActivitiesRead: () => void;
  resetContent: () => void;
}

const now = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const defaultState: ContentState = {
  projects: [
    { id: "project-rahmaniyya-2", name: "Rahmaniyya Estate II", type: "Residential", location: "Gwarinpa, Abuja", progress: 78, status: "In progress", year: "Ongoing", description: "The next expression of our residential vision: connected living, essential amenities and generous public landscape.", image: heroEstate, updatedAt: "2026-08-12T08:00:00.000Z" },
    { id: "project-ministry", name: "Federal Ministry Complex", type: "Civic", location: "Abuja", progress: 61, status: "In progress", year: "Ongoing", description: "A coordinated government campus designed around durable construction, intuitive circulation and institutional dignity.", image: heroConstruction, updatedAt: "2026-08-11T10:30:00.000Z" },
    { id: "project-tower", name: "KANSADCO Corporate Tower", type: "Commercial", location: "Central Business District, Abuja", progress: 100, status: "Published", year: "2025", description: "Grade-A workspaces and retail arranged as a clear, efficient vertical business address in the capital.", image: project3, updatedAt: "2026-08-04T09:00:00.000Z" },
    { id: "project-kaduna", name: "River Kaduna Bridge", type: "Infrastructure", location: "Kaduna State", progress: 100, status: "Published", year: "2022", description: "A 500-metre dual carriageway bridge engineered to connect communities and stand up to intensive daily use.", image: project4, updatedAt: "2026-07-29T09:00:00.000Z" },
    { id: "project-kano-zaria", name: "Kano–Zaria Corridor", type: "Infrastructure", location: "Kano State", progress: 100, status: "Draft", year: "2023", description: "A strategic 45-kilometre transport link rehabilitated for safer movement, stronger drainage and regional commerce.", image: project2, updatedAt: "2026-07-22T09:00:00.000Z" },
    { id: "project-rahmaniyya-1", name: "Rahmaniyya Estate I", type: "Residential", location: "Utako, Abuja", progress: 100, status: "Published", year: "2024", description: "A considered residential community pairing contemporary homes with landscape, security and an enduring sense of place.", image: project1, updatedAt: "2026-07-18T09:00:00.000Z" },
  ],
  gallery: [
    { id: "asset-arrival", src: heroSignature, name: "The Arrival Court", type: "Residential", location: "Abuja", year: "2026", status: "Published", createdAt: "2026-08-08T08:00:00.000Z" },
    { id: "asset-living", src: project1, name: "Rahmaniyya Living", type: "Residential", location: "Utako, Abuja", year: "2024", status: "Published", createdAt: "2026-08-04T08:00:00.000Z" },
    { id: "asset-corridor", src: project2, name: "Open Corridor", type: "Infrastructure", location: "Kano State", year: "2023", status: "Published", createdAt: "2026-07-29T08:00:00.000Z" },
    { id: "asset-elevation", src: project3, name: "Corporate Elevation", type: "Commercial", location: "Central Abuja", year: "2025", status: "Published", createdAt: "2026-07-25T08:00:00.000Z" },
    { id: "asset-profile", src: heroEstate, name: "A Home in Profile", type: "Residential", location: "Abuja", year: "2025", status: "Draft", createdAt: "2026-07-20T08:00:00.000Z" },
    { id: "asset-kaduna", src: project4, name: "Across the Kaduna", type: "Infrastructure", location: "Kaduna State", year: "2022", status: "Published", createdAt: "2026-07-16T08:00:00.000Z" },
    { id: "asset-garden", src: heroConstruction, name: "Garden Residence", type: "Residential", location: "Nigeria", year: "2026", status: "Draft", createdAt: "2026-07-12T08:00:00.000Z" },
    { id: "asset-material", src: paint, name: "Material Library", type: "Materials", location: "KANSADCO Studio", year: "2026", status: "Published", createdAt: "2026-07-08T08:00:00.000Z" },
  ],
  enquiries: [
    { id: "enquiry-musa", name: "Musa Abdullahi", email: "musa@example.com", phone: "+234 803 111 0202", subject: "Residential investment", message: "I would like to understand the current residential investment options in Abuja.", status: "New", source: "Contact", createdAt: "2026-08-12T10:48:00.000Z" },
    { id: "enquiry-nneka", name: "Nneka & Co.", email: "projects@nnekaco.example", phone: "+234 805 442 0101", subject: "Commercial construction brief", message: "We are preparing a commercial construction brief and would like an introductory meeting.", status: "New", source: "Contact", createdAt: "2026-08-12T09:55:00.000Z" },
    { id: "enquiry-amina", name: "Amina Bello", email: "amina@example.com", phone: "+234 806 100 3030", subject: "Private viewing request", message: "Please confirm availability for a private viewing this week.", status: "Replied", source: "Private tour", createdAt: "2026-08-12T07:20:00.000Z" },
    { id: "enquiry-kano", name: "Kano State Works", email: "works@example.gov.ng", phone: "+234 809 440 0011", subject: "Infrastructure partnership", message: "Our team would like to discuss a potential infrastructure delivery partnership.", status: "Review", source: "Contact", createdAt: "2026-08-11T14:00:00.000Z" },
  ],
  settings: {
    displayName: "KANSADCO Engineering Nig. Ltd.",
    primaryEmail: "kansadco@gmail.com",
    telephone: "+234 803 738 0434",
    abujaAddress: "Rahmaniyya Estate 1, Ajose Adeogun Street, Utako, Abuja",
    kanoAddress: "No. 30 Lamido Road, Nassarawa GRA, Kano",
    defaultAuthor: "KANSADCO Editorial",
    reviewWorkflow: "Approval required",
    imageQuality: "Web optimized",
  },
  activities: [
    { id: "activity-enquiry", message: "New investment enquiry", createdAt: "2026-08-12T10:48:00.000Z", read: false, type: "enquiry" },
    { id: "activity-gallery", message: "Gallery upload ready", createdAt: "2026-08-12T09:00:00.000Z", read: false, type: "gallery" },
    { id: "activity-project", message: "Project update awaiting review", createdAt: "2026-08-12T08:30:00.000Z", read: false, type: "project" },
  ],
};

const STORAGE_KEY = "kansadco-content-v1";
const cloneDefaults = (): ContentState => JSON.parse(JSON.stringify(defaultState)) as ContentState;

const loadState = (): ContentState => {
  if (typeof window === "undefined") return cloneDefaults();
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return cloneDefaults();
    const parsed = JSON.parse(saved) as Partial<ContentState>;
    return {
      projects: Array.isArray(parsed.projects) ? parsed.projects : cloneDefaults().projects,
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : cloneDefaults().gallery,
      enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : cloneDefaults().enquiries,
      settings: { ...cloneDefaults().settings, ...parsed.settings },
      activities: Array.isArray(parsed.activities) ? parsed.activities : cloneDefaults().activities,
    };
  } catch {
    return cloneDefaults();
  }
};

const ContentContext = createContext<ContentContextValue | null>(null);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ContentState>(loadState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Unable to persist KANSADCO content", error);
    }
  }, [state]);

  const addActivity = (message: string, type: Activity["type"]): Activity => ({ id: uid("activity"), message, type, read: false, createdAt: now() });

  const value = useMemo<ContentContextValue>(() => ({
    ...state,
    addProject: (input) => {
      const project = { ...input, id: uid("project"), updatedAt: now() };
      setState((current) => ({ ...current, projects: [project, ...current.projects], activities: [addActivity(`Project created: ${project.name}`, "project"), ...current.activities] }));
      return project;
    },
    updateProject: (id, updates) => setState((current) => {
      const existing = current.projects.find((item) => item.id === id);
      return { ...current, projects: current.projects.map((item) => item.id === id ? { ...item, ...updates, progress: Math.max(0, Math.min(100, updates.progress ?? item.progress)), updatedAt: now() } : item), activities: existing ? [addActivity(`Project updated: ${updates.name ?? existing.name}`, "project"), ...current.activities] : current.activities };
    }),
    deleteProject: (id) => setState((current) => ({ ...current, projects: current.projects.filter((item) => item.id !== id) })),
    addGalleryAsset: (input) => {
      const asset = { ...input, id: uid("asset"), createdAt: now() };
      setState((current) => ({ ...current, gallery: [asset, ...current.gallery], activities: [addActivity(`Gallery asset added: ${asset.name}`, "gallery"), ...current.activities] }));
      return asset;
    },
    updateGalleryAsset: (id, updates) => setState((current) => {
      const existing = current.gallery.find((item) => item.id === id);
      return { ...current, gallery: current.gallery.map((item) => item.id === id ? { ...item, ...updates } : item), activities: existing ? [addActivity(`Gallery asset updated: ${updates.name ?? existing.name}`, "gallery"), ...current.activities] : current.activities };
    }),
    deleteGalleryAsset: (id) => setState((current) => ({ ...current, gallery: current.gallery.filter((item) => item.id !== id) })),
    addEnquiry: (input) => {
      const enquiry: Enquiry = { ...input, id: uid("enquiry"), status: input.status ?? "New", createdAt: now() };
      setState((current) => ({ ...current, enquiries: [enquiry, ...current.enquiries], activities: [addActivity(`New enquiry: ${enquiry.subject}`, "enquiry"), ...current.activities] }));
      return enquiry;
    },
    updateEnquiry: (id, updates) => setState((current) => ({ ...current, enquiries: current.enquiries.map((item) => item.id === id ? { ...item, ...updates } : item) })),
    deleteEnquiry: (id) => setState((current) => ({ ...current, enquiries: current.enquiries.filter((item) => item.id !== id) })),
    updateSettings: (settings) => setState((current) => ({ ...current, settings, activities: [addActivity("Workspace settings updated", "settings"), ...current.activities] })),
    markActivitiesRead: () => setState((current) => ({ ...current, activities: current.activities.map((item) => ({ ...item, read: true })) })),
    resetContent: () => setState(cloneDefaults()),
  }), [state]);

  return createElement(ContentContext.Provider, { value }, children);
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used within ContentProvider");
  return context;
};

export const formatRelativeDate = (iso: string) => {
  const delta = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(0, Math.floor(delta / 60000));
  if (minutes < 1) return "Now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(new Date(iso));
};
