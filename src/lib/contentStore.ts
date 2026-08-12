import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import heroSignature from "@/assets/hero-signature.webp";
import heroEstate from "@/assets/hero-estate.jpg";
import heroConstruction from "@/assets/hero-construction.webp";
import paint from "@/assets/paint-service.jpg";
import { useAuth } from "@/lib/auth";
import { MEDIA_BUCKET, supabase } from "@/lib/supabase";

export type ProjectStatus = "Published" | "In progress" | "Draft";
export type AssetStatus = "Published" | "Draft";
export type EnquiryStatus = "New" | "Review" | "Replied" | "Archived";
export type EnquiryNotificationStatus = "Pending" | "Sent" | "Partial" | "Failed";
export type BackendStatus = "loading" | "connected" | "unconfigured" | "error";

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
  notificationStatus: EnquiryNotificationStatus;
  notificationError: string | null;
  notifiedAt: string | null;
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

export type ProjectInput = Omit<ManagedProject, "id" | "updatedAt">;
export type AssetInput = Omit<GalleryAsset, "id" | "createdAt">;
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
  uploadMedia: (file: File) => Promise<string>;
  addEnquiry: (enquiry: EnquiryInput) => Promise<Enquiry>;
  retryEnquiryNotification: (id: string) => Promise<void>;
  updateEnquiry: (id: string, updates: Partial<Pick<Enquiry, "status" | "subject" | "message">>) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  updateSettings: (settings: SiteSettings) => Promise<void>;
  markActivitiesRead: () => Promise<void>;
}

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
  enquiries: [],
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
      projects: Array.isArray(parsed.projects) ? parsed.projects : defaultState.projects,
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : defaultState.gallery,
      settings: { ...defaultState.settings, ...parsed.settings },
    };
  } catch {
    return cloneDefaults();
  }
};

const mapProject = (row: { id: string; name: string; type: string; location: string; progress: number; status: ProjectStatus; year: string; description: string; image: string; updated_at: string }): ManagedProject => ({
  id: row.id, name: row.name, type: row.type, location: row.location, progress: row.progress,
  status: row.status, year: row.year, description: row.description, image: row.image, updatedAt: row.updated_at,
});

const mapGallery = (row: { id: string; src: string; name: string; type: string; location: string; year: string; status: AssetStatus; created_at: string }): GalleryAsset => ({
  id: row.id, src: row.src, name: row.name, type: row.type, location: row.location,
  year: row.year, status: row.status, createdAt: row.created_at,
});

const mapEnquiry = (row: { id: string; name: string; email: string; phone: string; subject: string; message: string; status: EnquiryStatus; source: Enquiry["source"]; created_at: string; notification_status: EnquiryNotificationStatus; notification_error: string | null; notified_at: string | null }): Enquiry => ({
  id: row.id, name: row.name, email: row.email, phone: row.phone, subject: row.subject,
  message: row.message, status: row.status, source: row.source, createdAt: row.created_at,
  notificationStatus: row.notification_status, notificationError: row.notification_error, notifiedAt: row.notified_at,
});

const mapSettings = (row: { display_name: string; primary_email: string; telephone: string; abuja_address: string; kano_address: string; default_author: string; review_workflow: string; image_quality: string }): SiteSettings => ({
  displayName: row.display_name, primaryEmail: row.primary_email, telephone: row.telephone,
  abujaAddress: row.abuja_address, kanoAddress: row.kano_address, defaultAuthor: row.default_author,
  reviewWorkflow: row.review_workflow, imageQuality: row.image_quality,
});

const projectRow = (project: ProjectInput) => ({
  name: project.name, type: project.type, location: project.location, progress: project.progress,
  status: project.status, year: project.year, description: project.description, image: project.image,
});

const galleryRow = (asset: AssetInput) => ({
  src: asset.src, name: asset.name, type: asset.type, location: asset.location,
  year: asset.year, status: asset.status,
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

  const refreshContent = useCallback(async () => {
    setLoading(true);
    const projectRequest = supabase.from("projects").select("*").order("updated_at", { ascending: false });
    const galleryRequest = supabase.from("gallery_assets").select("*").order("created_at", { ascending: false });
    const settingsRequest = supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    const enquiryRequest = isAuthorized
      ? supabase.from("enquiries").select("*").order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null });
    const activityRequest = isAuthorized
      ? supabase.from("activities").select("*").order("created_at", { ascending: false }).limit(100)
      : Promise.resolve({ data: [], error: null });

    try {
      let [projectsResult, galleryResult, settingsResult, enquiriesResult, activitiesResult] = await Promise.all([
        projectRequest, galleryRequest, settingsRequest, enquiryRequest, activityRequest,
      ]);
      const firstError = [projectsResult.error, galleryResult.error, settingsResult.error, enquiriesResult.error, activitiesResult.error].find(Boolean);
      if (firstError) throw firstError;

      if (isAuthorized && settingsResult.data && !settingsResult.data.content_initialized) {
        const legacy = getLegacyState();
        if (!projectsResult.data?.length) {
          const seededProjects = await Promise.all(legacy.projects.map(async ({ id, updatedAt: _updatedAt, ...project }) => projectRow({ ...project, image: await storeSeedMedia(project.image, id) })));
          const { error } = await supabase.from("projects").insert(seededProjects);
          if (error) throw error;
        }
        if (!galleryResult.data?.length) {
          const seededGallery = await Promise.all(legacy.gallery.map(async ({ id, createdAt: _createdAt, ...asset }) => galleryRow({ ...asset, src: await storeSeedMedia(asset.src, id) })));
          const { error } = await supabase.from("gallery_assets").insert(seededGallery);
          if (error) throw error;
        }
        const { error: initializedError } = await supabase.from("site_settings").update({ ...settingsRow(legacy.settings), content_initialized: true }).eq("id", 1);
        if (initializedError) throw initializedError;
        window.localStorage.removeItem("kansadco-content-v1");

        [projectsResult, galleryResult, settingsResult, enquiriesResult, activitiesResult] = await Promise.all([
          supabase.from("projects").select("*").order("updated_at", { ascending: false }),
          supabase.from("gallery_assets").select("*").order("created_at", { ascending: false }),
          supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
          supabase.from("enquiries").select("*").order("created_at", { ascending: false }),
          supabase.from("activities").select("*").order("created_at", { ascending: false }).limit(100),
        ]);
        const retryError = [projectsResult.error, galleryResult.error, settingsResult.error, enquiriesResult.error, activitiesResult.error].find(Boolean);
        if (retryError) throw retryError;
      }

      const useBundledContent = settingsResult.data?.content_initialized === false;
      setState({
        projects: useBundledContent ? cloneDefaults().projects : (projectsResult.data ?? []).map(mapProject),
        gallery: useBundledContent ? cloneDefaults().gallery : (galleryResult.data ?? []).map(mapGallery),
        enquiries: (enquiriesResult.data ?? []).map(mapEnquiry),
        settings: settingsResult.data ? mapSettings(settingsResult.data) : cloneDefaults().settings,
        activities: (activitiesResult.data ?? []).map((row) => ({ id: row.id, message: row.message, type: row.type, read: row.read, createdAt: row.created_at })),
      });
      setBackendStatus("connected");
      setBackendError(null);
    } catch (unknownError) {
      const error = unknownError as { code?: string; message: string };
      const message = friendlyDatabaseError(error);
      setBackendStatus(error.code === "PGRST205" || error.message?.includes("schema cache") ? "unconfigured" : "error");
      setBackendError(message);
      setState((current) => ({ ...cloneDefaults(), settings: current.settings }));
    } finally {
      setLoading(false);
    }
  }, [isAuthorized]);

  useEffect(() => {
    void refreshContent();
  }, [refreshContent, session?.user.id]);

  const requireData = <T,>(data: T | null, error: { message: string } | null): T => {
    if (error) throw new Error(error.message);
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
        ...(updates.type !== undefined && { type: updates.type }),
        ...(updates.location !== undefined && { location: updates.location }),
        ...(updates.progress !== undefined && { progress: Math.max(0, Math.min(100, updates.progress)) }),
        ...(updates.status !== undefined && { status: updates.status }),
        ...(updates.year !== undefined && { year: updates.year }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.image !== undefined && { image: updates.image }),
      };
      const { error } = await supabase.from("projects").update(payload).eq("id", id);
      if (error) throw new Error(error.message);
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
