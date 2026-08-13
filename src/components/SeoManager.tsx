import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://kansadco.com";
const SOCIAL_IMAGE = `${SITE_URL}/social-card.jpg`;

type RouteMetadata = {
  title: string;
  description: string;
};

const routeMetadata: Record<string, RouteMetadata> = {
  "/": {
    title: "KANSADCO | Architecture, Construction & Real Estate",
    description: "KANSADCO delivers integrated architecture, construction and real estate services across Abuja, Kano and Nigeria.",
  },
  "/about": {
    title: "About KANSADCO | Built for Generations",
    description: "Discover KANSADCO's story, leadership and commitment to purposeful architecture, professional construction and lasting real estate value.",
  },
  "/services": {
    title: "Architecture, Construction & Real Estate Services | KANSADCO",
    description: "Explore KANSADCO's architecture, construction, real estate, project management and KSD Paint capabilities.",
  },
  "/projects": {
    title: "Selected Real Estate & Construction Projects | KANSADCO",
    description: "View selected KANSADCO residential, commercial and real estate projects delivered across Nigeria.",
  },
  "/team": {
    title: "Leadership & Team | KANSADCO",
    description: "Meet the experienced leadership and multidisciplinary team shaping KANSADCO's projects and long-term vision.",
  },
  "/gallery": {
    title: "Architecture & Construction Gallery | KANSADCO",
    description: "Explore a visual journal of KANSADCO developments, construction detail, architecture and completed spaces.",
  },
  "/contact": {
    title: "Contact KANSADCO | Abuja & Kano",
    description: "Contact KANSADCO in Abuja or Kano to discuss architecture, construction, real estate, project delivery and KSD Paint opportunities.",
  },
  "/book-tour": {
    title: "Book a Private Property Tour | KANSADCO",
    description: "Arrange a private KANSADCO property viewing with a member of our real estate team.",
  },
  "/ksd-paint": {
    title: "KSD Paint | Premium Interior & Exterior Paint in Nigeria",
    description: "Explore KSD Paint interior, exterior and surface-preparation finishes, colour families and dealer opportunities across Nigeria.",
  },
};

const setMeta = (attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
};

const SeoManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = pathname === "/" ? pathname : pathname.replace(/\/+$/, "");
    const publicMetadata = routeMetadata[normalizedPath];
    const isAdmin = normalizedPath === "/admin";
    const metadata = publicMetadata ?? {
      title: isAdmin ? "KANSADCO Content Workspace" : "Page Not Found | KANSADCO",
      description: isAdmin
        ? "KANSADCO's private content management workspace."
        : "The requested page could not be found.",
    };
    const canonicalUrl = `${SITE_URL}${normalizedPath === "/" ? "/" : normalizedPath}`;
    const robots = publicMetadata
      ? "index, follow, max-image-preview:large"
      : "noindex, nofollow, noarchive";

    document.title = metadata.title;
    setMeta("name", "description", metadata.description);
    setMeta("name", "robots", robots);
    setMeta("name", "googlebot", robots);
    setMeta("property", "og:title", metadata.title);
    setMeta("property", "og:description", metadata.description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", SOCIAL_IMAGE);
    setMeta("name", "twitter:title", metadata.title);
    setMeta("name", "twitter:description", metadata.description);
    setMeta("name", "twitter:image", SOCIAL_IMAGE);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let pageSchema = document.head.querySelector<HTMLScriptElement>('script[data-page-schema="true"]');
    if (!publicMetadata) {
      pageSchema?.remove();
      return;
    }

    if (!pageSchema) {
      pageSchema = document.createElement("script");
      pageSchema.type = "application/ld+json";
      pageSchema.dataset.pageSchema = "true";
      document.head.appendChild(pageSchema);
    }

    pageSchema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: metadata.title,
      description: metadata.description,
      url: canonicalUrl,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      inLanguage: "en-NG",
    });
  }, [pathname]);

  return null;
};

export default SeoManager;
