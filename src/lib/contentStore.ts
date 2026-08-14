import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import heroSignature from "@/assets/hero-signature.webp";
import heroEstate from "@/assets/hero-estate.jpg";
import heroConstruction from "@/assets/hero-construction.webp";
import paint from "@/assets/paint-service.jpg";
import chairman from "@/assets/chairman.webp";
import { useAuth } from "@/lib/auth";
import { MEDIA_BUCKET, supabase } from "@/lib/supabase";

export type ProjectStatus = "Published" | "In progress" | "Draft";
export type AssetStatus = "Published" | "Draft";
export type TeamMemberStatus = "Published" | "Draft";
export type TestimonialStatus = "Published" | "Draft";
export type EnquiryStatus = "New" | "Review" | "Replied" | "Archived";
export type EnquiryNotificationStatus = "Pending" | "Sent" | "Partial" | "Failed";
export type BackendStatus = "loading" | "connected" | "unconfigured" | "error";

export interface ManagedProject {
  id: string;
  slug: string;
  name: string;
  type: string;
  location: string;
  progress: number;
  status: ProjectStatus;
  year: string;
  description: string;
  image: string;
  client: string;
  scope: string;
  area: string;
  duration: string;
  overview: string;
  challenge: string;
  solution: string;
  features: string[];
  galleryImages: string[];
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

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  discipline: string;
  bio: string;
  image: string;
  email: string;
  featured: boolean;
  sortOrder: number;
  status: TeamMemberStatus;
  updatedAt: string;
}

export const getTeamLeader = (team: TeamMember[]) => {
  const published = team
    .filter((member) => member.status === "Published")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  return published.find((member) => member.featured) ?? published[0];
};

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  sortOrder: number;
  status: TestimonialStatus;
  updatedAt: string;
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
  notificationStatus: EnquiryNotificationStatus;
  notificationError: string | null;
  notifiedAt: string | null;
}

export interface EnquiryReply {
  id: string;
  enquiryId: string;
  adminId: string | null;
  subject: string;
  message: string;
  deliveryStatus: "Pending" | "Sent" | "Failed";
  deliveryError: string | null;
  sentAt: string | null;
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
  type: "project" | "gallery" | "team" | "testimonial" | "enquiry" | "settings";
}

interface ContentState {
  projects: ManagedProject[];
  gallery: GalleryAsset[];
  team: TeamMember[];
  testimonials: Testimonial[];
  enquiries: Enquiry[];
  enquiryReplies: EnquiryReply[];
  settings: SiteSettings;
  activities: Activity[];
}

export type ProjectInput = Omit<ManagedProject, "id" | "updatedAt">;
export type AssetInput = Omit<GalleryAsset, "id" | "createdAt">;
export type TeamMemberInput = Omit<TeamMember, "id" | "updatedAt">;
export type TestimonialInput = Omit<Testimonial, "id" | "updatedAt">;
export type EnquiryInput = Omit<Enquiry, "id" | "createdAt" | "status" | "notificationStatus" | "notificationError" | "notifiedAt"> & {
  status?: EnquiryStatus;
  website?: string;
  formStartedAt?: number;
};

interface ContentContextValue extends ContentState {
  loading: boolean;
  backendStatus: BackendStatus;
  backendError: string | null;
  refreshContent: () => Promise<void>;
  addProject: (project: ProjectInput) => Promise<ManagedProject>;
  updateProject: (id: string, updates: Partial<ProjectInput>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addGalleryAsset: (asset: AssetInput) => Promise<GalleryAsset>;
  updateGalleryAsset: (id: string, updates: Partial<AssetInput>) => Promise<void>;
  deleteGalleryAsset: (id: string) => Promise<void>;
  addTeamMember: (member: TeamMemberInput) => Promise<TeamMember>;
  updateTeamMember: (id: string, updates: Partial<TeamMemberInput>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  addTestimonial: (testimonial: TestimonialInput) => Promise<Testimonial>;
  updateTestimonial: (id: string, updates: Partial<TestimonialInput>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  uploadMedia: (file: File) => Promise<string>;
  addEnquiry: (enquiry: EnquiryInput) => Promise<Enquiry>;
  replyToEnquiry: (id: string, subject: string, message: string) => Promise<void>;
  retryEnquiryNotification: (id: string) => Promise<void>;
  updateEnquiry: (id: string, updates: Partial<Pick<Enquiry, "status" | "subject" | "message">>) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  updateSettings: (settings: SiteSettings) => Promise<void>;
  markActivitiesRead: () => Promise<void>;
}

const defaultState: ContentState = {
  projects: [
    { id: "project-rahmaniyya-2", slug: "rahmaniyya-estate-ii", name: "Rahmaniyya Estate II", type: "Residential", location: "Gwarinpa, Abuja", progress: 78, status: "In progress", year: "Ongoing", description: "The next expression of our residential vision: connected living, essential amenities and generous public landscape.", image: heroEstate, client: "Private residential development", scope: "Masterplanning · Architecture · Construction", area: "18 hectares", duration: "2024 — Ongoing", overview: "Rahmaniyya Estate II is conceived as a calm, connected residential community where contemporary homes sit within a generous landscape framework. The plan balances privacy with neighbourhood life through shaded streets, shared green spaces and a clear hierarchy of movement.", challenge: "The brief called for a high-quality residential environment that could accommodate different household types while preserving a coherent identity, efficient infrastructure and a strong sense of arrival.", solution: "A landscape-led masterplan organizes homes into intimate clusters, separates service movement from primary pedestrian routes and uses a restrained material palette to unify the development as it grows.", features: ["Secure arrival and controlled access", "Landscaped communal spaces", "Flexible contemporary home types", "Pedestrian-focused internal streets", "Integrated utility and service planning"], galleryImages: [heroEstate, project1, heroSignature], updatedAt: "2026-08-12T08:00:00.000Z" },
    { id: "project-ministry", slug: "federal-ministry-complex", name: "Federal Ministry Complex", type: "Civic", location: "Abuja", progress: 61, status: "In progress", year: "Ongoing", description: "A coordinated government campus designed around durable construction, intuitive circulation and institutional dignity.", image: heroConstruction, client: "Federal institution", scope: "Architecture · Construction · Project management", area: "32,000 m²", duration: "2023 — Ongoing", overview: "The Federal Ministry Complex brings several administrative functions into one legible civic campus. Its architecture is measured and durable, using shaded circulation, generous public thresholds and clearly organized work environments to support everyday institutional life.", challenge: "The project needed to reconcile public accessibility, staff security and complex departmental relationships within a dignified building that remains practical to operate over time.", solution: "The campus is arranged around a central orientation spine with distinct public and secure zones. Repetitive structural bays, protected façades and accessible courtyards simplify construction while improving daylight and navigation.", features: ["Clearly separated public and staff circulation", "Shaded civic courtyards", "Flexible departmental floor plates", "Durable low-maintenance finishes", "Integrated project delivery coordination"], galleryImages: [heroConstruction, project3, heroSignature], updatedAt: "2026-08-11T10:30:00.000Z" },
    { id: "project-tower", slug: "kansadco-corporate-tower", name: "KANSADCO Corporate Tower", type: "Commercial", location: "Central Business District, Abuja", progress: 100, status: "Published", year: "2025", description: "Grade-A workspaces and retail arranged as a clear, efficient vertical business address in the capital.", image: project3, client: "Private corporate client", scope: "Architecture · Interior coordination · Construction", area: "21,500 m²", duration: "2022 — 2025", overview: "KANSADCO Corporate Tower is imagined as a confident commercial address with efficient floor plates, active ground-level uses and a composed skyline presence. The building pairs contemporary workplace flexibility with a warm, regionally responsive material character.", challenge: "A constrained urban site required an efficient vertical programme without compromising arrival, daylight, service access or the quality of shared business amenities.", solution: "A compact service core releases adaptable perimeter workspace while a layered façade manages glare and heat. Retail, lobby and meeting functions animate the lower levels and strengthen the tower's relationship with the street.", features: ["Flexible Grade-A office floors", "Ground-floor retail and hospitality", "High-performance shaded façade", "Executive meeting and amenity levels", "Efficient vertical circulation core"], galleryImages: [project3, heroConstruction, project4], updatedAt: "2026-08-04T09:00:00.000Z" },
    { id: "project-kaduna", slug: "river-kaduna-bridge", name: "River Kaduna Bridge", type: "Infrastructure", location: "Kaduna State", progress: 100, status: "Published", year: "2022", description: "A 500-metre dual carriageway bridge engineered to connect communities and stand up to intensive daily use.", image: project4, client: "Public infrastructure client", scope: "Engineering · Construction · Delivery coordination", area: "500-metre crossing", duration: "2019 — 2022", overview: "The River Kaduna Bridge creates a dependable connection across a critical waterway, improving movement between communities and supporting the wider transport network. Its straightforward structural expression reflects a focus on resilience, safety and long service life.", challenge: "Seasonal water levels, demanding ground conditions and the need to maintain regional movement required a carefully phased engineering and construction strategy.", solution: "Robust pier geometry, coordinated drainage and staged works reduced disruption while responding to the river environment. Clear carriageway separation and protected pedestrian edges improve everyday safety.", features: ["Dual carriageway crossing", "Protected pedestrian movement", "Resilient drainage strategy", "Durable structural system", "Phased construction planning"], galleryImages: [project4, project2, heroConstruction], updatedAt: "2026-07-29T09:00:00.000Z" },
    { id: "project-kano-zaria", slug: "kano-zaria-corridor", name: "Kano–Zaria Corridor", type: "Infrastructure", location: "Kano State", progress: 100, status: "Draft", year: "2023", description: "A strategic 45-kilometre transport link rehabilitated for safer movement, stronger drainage and regional commerce.", image: project2, client: "Public infrastructure client", scope: "Rehabilitation · Drainage · Construction", area: "45-kilometre corridor", duration: "2020 — 2023", overview: "The Kano–Zaria Corridor rehabilitation focused on safer, more reliable movement along an economically important regional route. Improvements address pavement performance, drainage and the points where settlements meet the road.", challenge: "Heavy daily use, seasonal runoff and continuous roadside activity demanded a construction approach that improved long-term performance while keeping people and goods moving.", solution: "Targeted pavement reconstruction was coordinated with strengthened drainage, clearer junctions and a phased traffic plan designed around the corridor's most active sections.", features: ["Rehabilitated carriageway", "Strengthened drainage network", "Safer junction transitions", "Phased traffic management", "Roadside settlement coordination"], galleryImages: [project2, project4, heroConstruction], updatedAt: "2026-07-22T09:00:00.000Z" },
    { id: "project-rahmaniyya-1", slug: "rahmaniyya-estate-i", name: "Rahmaniyya Estate I", type: "Residential", location: "Utako, Abuja", progress: 100, status: "Published", year: "2024", description: "A considered residential community pairing contemporary homes with landscape, security and an enduring sense of place.", image: project1, client: "Private residential development", scope: "Architecture · Construction · Landscape coordination", area: "64 residences", duration: "2021 — 2024", overview: "Rahmaniyya Estate I is a composed residential enclave shaped around privacy, security and an everyday relationship with landscape. Contemporary elevations and carefully scaled streets give each home an individual presence while maintaining a coherent community character.", challenge: "The site needed to support a varied collection of homes and shared amenities without feeling repetitive, congested or disconnected from its landscaped setting.", solution: "Homes are positioned to create comfortable setbacks, framed views and pockets of communal green. A consistent architectural language is varied through proportion, screening and material detail.", features: ["Contemporary residential architecture", "Secure managed community", "Private and shared landscape", "Considered daylight and ventilation", "Integrated parking and services"], galleryImages: [project1, heroEstate, heroSignature], updatedAt: "2026-07-18T09:00:00.000Z" },
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
  team: [
    { id: "team-chairman", name: "Arch. Yunusa Ibrahim Hassan, MNIA", role: "Founder & Chief Executive Officer", discipline: "Architecture · Leadership", bio: "He established KANSADCO in 2018 around a commitment to vision, responsibility, professionalism and excellence—transforming client aspirations into purposeful spaces and lasting relationships.", image: chairman, email: "kansadco@gmail.com", featured: true, sortOrder: 1, status: "Published", updatedAt: "2026-08-13T08:00:00.000Z" },
    { id: "team-fatima", name: "Arc. Fatima Ibrahim", role: "Chief Architect", discipline: "Architecture · Design", bio: "", image: "", email: "kansadco@gmail.com", featured: false, sortOrder: 2, status: "Published", updatedAt: "2026-08-13T08:00:00.000Z" },
    { id: "team-chukwuma", name: "Engr. Chukwuma Okafor", role: "Director of Construction", discipline: "Delivery · Civil works", bio: "", image: "", email: "kansadco@gmail.com", featured: false, sortOrder: 3, status: "Published", updatedAt: "2026-08-13T08:00:00.000Z" },
    { id: "team-aisha", name: "Hajia Aisha Mohammed", role: "Director of Real Estate", discipline: "Investment · Property", bio: "", image: "", email: "kansadco@gmail.com", featured: false, sortOrder: 4, status: "Published", updatedAt: "2026-08-13T08:00:00.000Z" },
    { id: "team-david", name: "Engr. David Adeleke", role: "Chief Engineer", discipline: "Structures · Infrastructure", bio: "", image: "", email: "kansadco@gmail.com", featured: false, sortOrder: 5, status: "Published", updatedAt: "2026-08-13T08:00:00.000Z" },
    { id: "team-grace", name: "Mrs. Grace Okonkwo", role: "Finance Director", discipline: "Finance · Governance", bio: "", image: "", email: "kansadco@gmail.com", featured: false, sortOrder: 6, status: "Published", updatedAt: "2026-08-13T08:00:00.000Z" },
    { id: "team-yusuf", name: "Mallam Yusuf Garba", role: "Head of Operations", discipline: "Operations · Quality", bio: "", image: "", email: "kansadco@gmail.com", featured: false, sortOrder: 7, status: "Published", updatedAt: "2026-08-13T08:00:00.000Z" },
    { id: "team-amaka", name: "Engr. Amaka Nwosu", role: "Project Manager", discipline: "Projects · Coordination", bio: "", image: "", email: "kansadco@gmail.com", featured: false, sortOrder: 8, status: "Published", updatedAt: "2026-08-13T08:00:00.000Z" },
  ],
  testimonials: [
    { id: "testimonial-innova", quote: "KANSADCO brought unusual discipline to a complex brief. Every decision felt considered, every milestone was visible, and the finished place exceeded the promise.", name: "Abdullahi Bala Musa", role: "Managing Director, InnovaTech Consultancy", sortOrder: 1, status: "Published", updatedAt: "2026-08-14T08:00:00.000Z" },
    { id: "testimonial-investor", quote: "They understand that property is both a financial asset and a lived experience. That balance is why we continue to invest with them.", name: "Ibrahim Suleiman", role: "Property Investor, Kano", sortOrder: 2, status: "Published", updatedAt: "2026-08-14T08:00:00.000Z" },
    { id: "testimonial-resident", quote: "The quality is evident in the details you touch every day. Our home feels calm, resolved, and built for the long term.", name: "Dr. Amina Bello", role: "Resident, Rahmaniyya Estate", sortOrder: 3, status: "Published", updatedAt: "2026-08-14T08:00:00.000Z" },
  ],
  enquiries: [],
  enquiryReplies: [],
  settings: {
    displayName: "Kansadco Services Nigerian Limited",
    primaryEmail: "kansadco@gmail.com",
    telephone: "+234 803 738 0434",
    abujaAddress: "Rahmaniyya Estate 1, Ajose Adeogun Street, Utako, Abuja",
    kanoAddress: "No. 28 Lamido Road, Nasarawa GRA, Kano, Nigeria",
    defaultAuthor: "KANSADCO Editorial",
    reviewWorkflow: "Approval required",
    imageQuality: "Web optimized",
  },
  activities: [],
};

const cloneDefaults = (): ContentState => JSON.parse(JSON.stringify(defaultState)) as ContentState;

const getLegacyState = () => {
  try {
    const saved = window.localStorage.getItem("kansadco-content-v1");
    if (!saved) return cloneDefaults();
    const parsed = JSON.parse(saved) as Partial<ContentState>;
    return {
      ...cloneDefaults(),
      projects: Array.isArray(parsed.projects) ? parsed.projects.map((project) => {
        const matchedDefault = defaultState.projects.find((item) => item.id === project.id || item.name === project.name);
        return {
          slug: (project.name || "project").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
          client: "", scope: "", area: "", duration: project.year || "", overview: project.description || "",
          challenge: "", solution: "", features: [], galleryImages: project.image ? [project.image] : [],
          ...matchedDefault,
          ...project,
        };
      }) : defaultState.projects,
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : defaultState.gallery,
      team: defaultState.team,
      settings: { ...defaultState.settings, ...parsed.settings },
    };
  } catch {
    return cloneDefaults();
  }
};

const mapProject = (row: { id: string; slug: string; name: string; type: string; location: string; progress: number; status: ProjectStatus; year: string; description: string; image: string; client: string; scope: string; area: string; duration: string; overview: string; challenge: string; solution: string; features: string[]; gallery_images: string[]; updated_at: string }): ManagedProject => ({
  id: row.id, slug: row.slug, name: row.name, type: row.type, location: row.location, progress: row.progress,
  status: row.status, year: row.year, description: row.description, image: row.image,
  client: row.client, scope: row.scope, area: row.area, duration: row.duration, overview: row.overview,
  challenge: row.challenge, solution: row.solution, features: row.features ?? [], galleryImages: row.gallery_images ?? [], updatedAt: row.updated_at,
});

const mapGallery = (row: { id: string; src: string; name: string; type: string; location: string; year: string; status: AssetStatus; created_at: string }): GalleryAsset => ({
  id: row.id, src: row.src, name: row.name, type: row.type, location: row.location,
  year: row.year, status: row.status, createdAt: row.created_at,
});

const mapTeamMember = (row: { id: string; name: string; role: string; discipline: string; bio: string; image: string; email: string; featured: boolean; sort_order: number; status: TeamMemberStatus; updated_at: string }): TeamMember => ({
  id: row.id, name: row.name, role: row.role, discipline: row.discipline, bio: row.bio,
  image: row.image === "bundled:chairman" ? chairman : row.image, email: row.email,
  featured: row.featured, sortOrder: row.sort_order, status: row.status, updatedAt: row.updated_at,
});

const mapTestimonial = (row: { id: string; quote: string; name: string; role: string; sort_order: number; status: TestimonialStatus; updated_at: string }): Testimonial => ({
  id: row.id, quote: row.quote, name: row.name, role: row.role,
  sortOrder: row.sort_order, status: row.status, updatedAt: row.updated_at,
});

const mapEnquiry = (row: { id: string; name: string; email: string; phone: string; subject: string; message: string; status: EnquiryStatus; source: Enquiry["source"]; created_at: string; notification_status: EnquiryNotificationStatus; notification_error: string | null; notified_at: string | null }): Enquiry => ({
  id: row.id, name: row.name, email: row.email, phone: row.phone, subject: row.subject,
  message: row.message, status: row.status, source: row.source, createdAt: row.created_at,
  notificationStatus: row.notification_status, notificationError: row.notification_error, notifiedAt: row.notified_at,
});

const mapEnquiryReply = (row: { id: string; enquiry_id: string; admin_id: string | null; subject: string; message: string; delivery_status: EnquiryReply["deliveryStatus"]; delivery_error: string | null; sent_at: string | null; created_at: string }): EnquiryReply => ({
  id: row.id, enquiryId: row.enquiry_id, adminId: row.admin_id, subject: row.subject, message: row.message,
  deliveryStatus: row.delivery_status, deliveryError: row.delivery_error, sentAt: row.sent_at, createdAt: row.created_at,
});

const mapSettings = (row: { display_name: string; primary_email: string; telephone: string; abuja_address: string; kano_address: string; default_author: string; review_workflow: string; image_quality: string }): SiteSettings => ({
  displayName: row.display_name, primaryEmail: row.primary_email, telephone: row.telephone,
  abujaAddress: row.abuja_address, kanoAddress: row.kano_address, defaultAuthor: row.default_author,
  reviewWorkflow: row.review_workflow, imageQuality: row.image_quality,
});

const projectRow = (project: ProjectInput) => ({
  slug: project.slug, name: project.name, type: project.type, location: project.location, progress: project.progress,
  status: project.status, year: project.year, description: project.description, image: project.image,
  client: project.client, scope: project.scope, area: project.area, duration: project.duration,
  overview: project.overview, challenge: project.challenge, solution: project.solution,
  features: project.features, gallery_images: project.galleryImages,
});

const galleryRow = (asset: AssetInput) => ({
  src: asset.src, name: asset.name, type: asset.type, location: asset.location,
  year: asset.year, status: asset.status,
});

const teamMemberRow = (member: TeamMemberInput) => ({
  name: member.name, role: member.role, discipline: member.discipline, bio: member.bio,
  image: member.image === chairman ? "bundled:chairman" : member.image, email: member.email,
  featured: member.featured, sort_order: member.sortOrder, status: member.status,
});

const testimonialRow = (testimonial: TestimonialInput) => ({
  quote: testimonial.quote.trim(), name: testimonial.name.trim(), role: testimonial.role.trim(),
  sort_order: testimonial.sortOrder, status: testimonial.status,
});

const settingsRow = (settings: SiteSettings) => ({
  display_name: settings.displayName, primary_email: settings.primaryEmail, telephone: settings.telephone,
  abuja_address: settings.abujaAddress, kano_address: settings.kanoAddress, default_author: settings.defaultAuthor,
  review_workflow: settings.reviewWorkflow, image_quality: settings.imageQuality,
});

const friendlyDatabaseError = (error: { code?: string; message: string }) => {
  if (error.code === "PGRST205" || error.message.includes("schema cache")) {
    return "Supabase is connected, but the KANSADCO database migration has not been installed.";
  }
  if (error.message.includes("projects_description_check")) {
    return "Add a project summary with at least 2 characters.";
  }
  return error.message;
};

const friendlyFunctionError = async (error: unknown) => {
  const functionError = error as { message?: string; context?: Response };
  if (functionError.context instanceof Response) {
    try {
      const payload = await functionError.context.clone().json() as { error?: string };
      if (payload.error) return payload.error;
    } catch {
      // Fall back to the SDK message when the response is not JSON.
    }
  }
  return functionError.message ?? "The enquiry service could not be reached.";
};

const submitPublicEnquiry = async (body: Record<string, unknown>) => {
  const directUrl = `${import.meta.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/submit-enquiry`;
  const response = await fetch(import.meta.env.PROD ? "/api/submit-enquiry" : directUrl, {
    method: "POST",
    headers: {
      apikey: import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null) as { error?: string; enquiry?: Parameters<typeof mapEnquiry>[0] } | null;
  if (!response.ok) {
    throw new Error(payload?.error ?? "The enquiry service could not complete your request. Please try again.");
  }
  if (!payload?.enquiry) throw new Error("The enquiry service did not confirm your submission.");
  return payload.enquiry;
};

const storeSeedMedia = async (url: string, slug: string) => {
  const storageMarker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  if (url.includes(storageMarker)) return url;
  try {
    const response = await fetch(url);
    if (!response.ok) return url;
    const blob = await response.blob();
    const extension = blob.type === "image/webp" ? "webp"
      : blob.type === "image/png" ? "png"
        : blob.type === "image/avif" ? "avif"
          : blob.type === "image/gif" ? "gif"
            : "jpg";
    const path = `seed/${slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.${extension}`;
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, { contentType: blob.type, cacheControl: "31536000", upsert: true });
    if (error) return url;
    return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
  } catch {
    return url;
  }
};

const ContentContext = createContext<ContentContextValue | null>(null);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthorized, session } = useAuth();
  const [state, setState] = useState<ContentState>(cloneDefaults);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("loading");
  const [backendError, setBackendError] = useState<string | null>(null);
  const refreshIdRef = useRef(0);

  const refreshContent = useCallback(async () => {
    const refreshId = ++refreshIdRef.current;
    const isCurrentRefresh = () => refreshId === refreshIdRef.current;
    setLoading(true);
    const projectRequest = supabase.from("projects").select("*").order("updated_at", { ascending: false });
    const galleryRequest = supabase.from("gallery_assets").select("*").order("created_at", { ascending: false });
    const teamRequest = supabase.from("team_members").select("*").order("sort_order", { ascending: true }).order("updated_at", { ascending: false });
    const testimonialRequest = supabase.from("testimonials").select("*").order("sort_order", { ascending: true }).order("updated_at", { ascending: false });
    const settingsRequest = supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    const enquiryRequest = isAuthorized
      ? supabase.from("enquiries").select("*").order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null });
    const replyRequest = isAuthorized
      ? supabase.from("enquiry_replies").select("*").order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null });
    const activityRequest = isAuthorized
      ? supabase.from("activities").select("*").order("created_at", { ascending: false }).limit(100)
      : Promise.resolve({ data: [], error: null });

    try {
      let [projectsResult, galleryResult, teamResult, testimonialsResult, settingsResult, enquiriesResult, repliesResult, activitiesResult] = await Promise.all([
        projectRequest, galleryRequest, teamRequest, testimonialRequest, settingsRequest, enquiryRequest, replyRequest, activityRequest,
      ]);
      if (!isCurrentRefresh()) return;

      // The admin inbox is operational data and must remain available even when
      // an unrelated content table is temporarily unavailable or out of date.
      if (isAuthorized && !enquiriesResult.error) {
        setState((current) => ({
          ...current,
          enquiries: (enquiriesResult.data ?? []).map(mapEnquiry),
          enquiryReplies: repliesResult.error ? current.enquiryReplies : (repliesResult.data ?? []).map(mapEnquiryReply),
          activities: activitiesResult.error ? current.activities : (activitiesResult.data ?? []).map((row) => ({ id: row.id, message: row.message, type: row.type, read: row.read, createdAt: row.created_at })),
        }));
      }

      const firstError = [projectsResult.error, galleryResult.error, settingsResult.error, enquiriesResult.error].find(Boolean);
      if (firstError) throw firstError;

      if (isAuthorized && settingsResult.data && !settingsResult.data.content_initialized) {
        // Keep the live inbox usable even if one-time portfolio initialization
        // encounters an unrelated media or settings failure.
        setState((current) => ({
          ...current,
          enquiries: (enquiriesResult.data ?? []).map(mapEnquiry),
          enquiryReplies: (repliesResult.data ?? []).map(mapEnquiryReply),
          activities: (activitiesResult.data ?? []).map((row) => ({ id: row.id, message: row.message, type: row.type, read: row.read, createdAt: row.created_at })),
        }));
        const legacy = getLegacyState();
        if (!projectsResult.data?.length) {
          const seededProjects = await Promise.all(legacy.projects.map(async ({ id, updatedAt: _updatedAt, ...project }) => projectRow({
            ...project,
            image: await storeSeedMedia(project.image, id),
            galleryImages: await Promise.all(project.galleryImages.map((image, index) => storeSeedMedia(image, `${id}-gallery-${index + 1}`))),
          })));
          if (!isCurrentRefresh()) return;
          const { error } = await supabase.from("projects").insert(seededProjects);
          if (error) throw error;
        }
        if (!galleryResult.data?.length) {
          const seededGallery = await Promise.all(legacy.gallery.map(async ({ id, createdAt: _createdAt, ...asset }) => galleryRow({ ...asset, src: await storeSeedMedia(asset.src, id) })));
          if (!isCurrentRefresh()) return;
          const { error } = await supabase.from("gallery_assets").insert(seededGallery);
          if (error) throw error;
        }
        if (!isCurrentRefresh()) return;
        const { error: initializedError } = await supabase.from("site_settings").update({ ...settingsRow(legacy.settings), content_initialized: true }).eq("id", 1);
        if (initializedError) throw initializedError;
        window.localStorage.removeItem("kansadco-content-v1");

        [projectsResult, galleryResult, teamResult, testimonialsResult, settingsResult, enquiriesResult, repliesResult, activitiesResult] = await Promise.all([
          supabase.from("projects").select("*").order("updated_at", { ascending: false }),
          supabase.from("gallery_assets").select("*").order("created_at", { ascending: false }),
          supabase.from("team_members").select("*").order("sort_order", { ascending: true }).order("updated_at", { ascending: false }),
          supabase.from("testimonials").select("*").order("sort_order", { ascending: true }).order("updated_at", { ascending: false }),
          supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
          supabase.from("enquiries").select("*").order("created_at", { ascending: false }),
          supabase.from("enquiry_replies").select("*").order("created_at", { ascending: false }),
          supabase.from("activities").select("*").order("created_at", { ascending: false }).limit(100),
        ]);
        if (!isCurrentRefresh()) return;
        const retryError = [projectsResult.error, galleryResult.error, settingsResult.error, enquiriesResult.error].find(Boolean);
        if (retryError) throw retryError;
      }

      const useBundledContent = settingsResult.data?.content_initialized === false;
      const optionalError = [teamResult.error, testimonialsResult.error, repliesResult.error, activitiesResult.error].find(Boolean);
      setState((current) => ({
        projects: useBundledContent ? cloneDefaults().projects : (projectsResult.data ?? []).map(mapProject),
        gallery: useBundledContent ? cloneDefaults().gallery : (galleryResult.data ?? []).map(mapGallery),
        team: teamResult.error ? current.team : (teamResult.data ?? []).map(mapTeamMember),
        testimonials: testimonialsResult.error ? current.testimonials : (testimonialsResult.data ?? []).map(mapTestimonial),
        enquiries: (enquiriesResult.data ?? []).map(mapEnquiry),
        enquiryReplies: repliesResult.error ? current.enquiryReplies : (repliesResult.data ?? []).map(mapEnquiryReply),
        settings: settingsResult.data ? mapSettings(settingsResult.data) : cloneDefaults().settings,
        activities: activitiesResult.error ? current.activities : (activitiesResult.data ?? []).map((row) => ({ id: row.id, message: row.message, type: row.type, read: row.read, createdAt: row.created_at })),
      }));
      setBackendStatus(optionalError ? "error" : "connected");
      setBackendError(optionalError ? friendlyDatabaseError(optionalError) : null);
    } catch (unknownError) {
      if (!isCurrentRefresh()) return;
      const error = unknownError as { code?: string; message: string };
      const message = friendlyDatabaseError(error);
      setBackendStatus(error.code === "PGRST205" || error.message?.includes("schema cache") ? "unconfigured" : "error");
      setBackendError(message);
      setState((current) => ({
        ...cloneDefaults(),
        settings: current.settings,
        enquiries: isAuthorized ? current.enquiries : [],
        enquiryReplies: isAuthorized ? current.enquiryReplies : [],
        activities: isAuthorized ? current.activities : [],
      }));
    } finally {
      if (isCurrentRefresh()) setLoading(false);
    }
  }, [isAuthorized]);

  useEffect(() => {
    void refreshContent();
  }, [refreshContent, session?.user.id]);

  useEffect(() => {
    if (!isAuthorized || !session?.user.id) return;
    let refreshTimer: number | undefined;
    const queueRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => void refreshContent(), 250);
    };
    const channel = supabase
      .channel(`admin-enquiry-inbox-${session.user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "enquiries" }, queueRefresh)
      .subscribe();
    const refreshOnVisible = () => { if (document.visibilityState === "visible") queueRefresh(); };
    window.addEventListener("focus", queueRefresh);
    document.addEventListener("visibilitychange", refreshOnVisible);
    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("focus", queueRefresh);
      document.removeEventListener("visibilitychange", refreshOnVisible);
      void supabase.removeChannel(channel);
    };
  }, [isAuthorized, refreshContent, session?.user.id]);

  const requireData = <T,>(data: T | null, error: { code?: string; message: string } | null): T => {
    if (error) throw new Error(friendlyDatabaseError(error));
    if (!data) throw new Error("Supabase returned no data.");
    return data;
  };

  const value = useMemo<ContentContextValue>(() => ({
    ...state,
    loading,
    backendStatus,
    backendError,
    refreshContent,
    addProject: async (input) => {
      const result = await supabase.from("projects").insert(projectRow(input)).select("*").single();
      const project = mapProject(requireData(result.data, result.error));
      await refreshContent();
      return project;
    },
    updateProject: async (id, updates) => {
      const payload = {
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.slug !== undefined && { slug: updates.slug }),
        ...(updates.type !== undefined && { type: updates.type }),
        ...(updates.location !== undefined && { location: updates.location }),
        ...(updates.progress !== undefined && { progress: Math.max(0, Math.min(100, updates.progress)) }),
        ...(updates.status !== undefined && { status: updates.status }),
        ...(updates.year !== undefined && { year: updates.year }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.image !== undefined && { image: updates.image }),
        ...(updates.client !== undefined && { client: updates.client }),
        ...(updates.scope !== undefined && { scope: updates.scope }),
        ...(updates.area !== undefined && { area: updates.area }),
        ...(updates.duration !== undefined && { duration: updates.duration }),
        ...(updates.overview !== undefined && { overview: updates.overview }),
        ...(updates.challenge !== undefined && { challenge: updates.challenge }),
        ...(updates.solution !== undefined && { solution: updates.solution }),
        ...(updates.features !== undefined && { features: updates.features }),
        ...(updates.galleryImages !== undefined && { gallery_images: updates.galleryImages }),
      };
      const { error } = await supabase.from("projects").update(payload).eq("id", id);
      if (error) throw new Error(friendlyDatabaseError(error));
      await refreshContent();
    },
    deleteProject: async (id) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw new Error(error.message);
      await refreshContent();
    },
    addGalleryAsset: async (input) => {
      const result = await supabase.from("gallery_assets").insert(galleryRow(input)).select("*").single();
      const asset = mapGallery(requireData(result.data, result.error));
      await refreshContent();
      return asset;
    },
    updateGalleryAsset: async (id, updates) => {
      const { error } = await supabase.from("gallery_assets").update(updates).eq("id", id);
      if (error) throw new Error(error.message);
      await refreshContent();
    },
    deleteGalleryAsset: async (id) => {
      const current = state.gallery.find((asset) => asset.id === id);
      const { error } = await supabase.from("gallery_assets").delete().eq("id", id);
      if (error) throw new Error(error.message);
      const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
      if (current?.src.includes(marker)) {
        const path = decodeURIComponent(current.src.split(marker)[1]);
        await supabase.storage.from(MEDIA_BUCKET).remove([path]);
      }
      await refreshContent();
    },
    addTeamMember: async (input) => {
      const result = await supabase.from("team_members").insert(teamMemberRow(input)).select("*").single();
      const member = mapTeamMember(requireData(result.data, result.error));
      await refreshContent();
      return member;
    },
    updateTeamMember: async (id, updates) => {
      const current = state.team.find((member) => member.id === id);
      if (!current) throw new Error("Team member not found.");
      const { error } = await supabase.from("team_members").update(teamMemberRow({ ...current, ...updates })).eq("id", id);
      if (error) throw new Error(error.message);
      await refreshContent();
    },
    deleteTeamMember: async (id) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw new Error(error.message);
      await refreshContent();
    },
    addTestimonial: async (input) => {
      const result = await supabase.from("testimonials").insert(testimonialRow(input)).select("*").single();
      const testimonial = mapTestimonial(requireData(result.data, result.error));
      await refreshContent();
      return testimonial;
    },
    updateTestimonial: async (id, updates) => {
      const current = state.testimonials.find((testimonial) => testimonial.id === id);
      if (!current) throw new Error("Testimonial not found.");
      const { error } = await supabase.from("testimonials").update(testimonialRow({ ...current, ...updates })).eq("id", id);
      if (error) throw new Error(error.message);
      await refreshContent();
    },
    deleteTestimonial: async (id) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw new Error(error.message);
      await refreshContent();
    },
    uploadMedia: async (file) => {
      if (!file.type.startsWith("image/")) throw new Error("Choose a valid image file.");
      if (file.size > 10 * 1024 * 1024) throw new Error("Images must be smaller than 10 MB.");
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");
      const path = `gallery/${new Date().getFullYear()}/${crypto.randomUUID()}-${safeName}`;
      const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { cacheControl: "31536000", upsert: false });
      if (error) throw new Error(error.message);
      return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
    },
    addEnquiry: async (input) => {
      const row = await submitPublicEnquiry({
        name: input.name,
        email: input.email,
        phone: input.phone,
        subject: input.subject,
        message: input.message,
        source: input.source === "Private tour" ? "Private tour" : "Contact",
        website: input.website ?? "",
        formStartedAt: input.formStartedAt,
      });
      if (isAuthorized) await refreshContent();
      return mapEnquiry(row);
    },
    replyToEnquiry: async (id, subject, message) => {
      const { error } = await supabase.functions.invoke("reply-enquiry", { body: { enquiryId: id, subject, message } });
      if (error) throw new Error(await friendlyFunctionError(error));
      await refreshContent();
    },
    retryEnquiryNotification: async (id) => {
      const { error } = await supabase.functions.invoke("retry-enquiry-email", { body: { enquiryId: id } });
      if (error) throw new Error(await friendlyFunctionError(error));
      await refreshContent();
    },
    updateEnquiry: async (id, updates) => {
      const { error } = await supabase.from("enquiries").update(updates).eq("id", id);
      if (error) throw new Error(error.message);
      await refreshContent();
    },
    deleteEnquiry: async (id) => {
      const { error } = await supabase.from("enquiries").delete().eq("id", id);
      if (error) throw new Error(error.message);
      await refreshContent();
    },
    updateSettings: async (settings) => {
      const { error } = await supabase.from("site_settings").update(settingsRow(settings)).eq("id", 1);
      if (error) throw new Error(error.message);
      await refreshContent();
    },
    markActivitiesRead: async () => {
      const { error } = await supabase.from("activities").update({ read: true }).eq("read", false);
      if (error) throw new Error(error.message);
      setState((current) => ({ ...current, activities: current.activities.map((item) => ({ ...item, read: true })) }));
    },
  }), [backendError, backendStatus, isAuthorized, loading, refreshContent, state]);

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
