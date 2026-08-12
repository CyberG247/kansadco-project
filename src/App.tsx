import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ContentProvider } from "@/lib/contentStore";
import { AuthProvider } from "@/lib/auth";
import SeoManager from "@/components/SeoManager";
import AdminAccess from "@/components/admin/AdminAccess";
import Index from "./pages/Index";

const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Projects = lazy(() => import("./pages/Projects"));
const Team = lazy(() => import("./pages/Team"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Admin = lazy(() => import("./pages/Admin"));
const Contact = lazy(() => import("./pages/Contact"));
const BookTour = lazy(() => import("./booktour"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="kansadco-ui-theme">
        <AuthProvider><ContentProvider><TooltipProvider>
          <Toaster />
          <Sonner />
          <div>
            <BrowserRouter>
              <SeoManager />
              <Suspense fallback={<div className="min-h-screen bg-background" />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/book-tour" element={<BookTour />} />
                  <Route path="/admin" element={<AdminAccess><Admin /></AdminAccess>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </div>
        </TooltipProvider></ContentProvider></AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
