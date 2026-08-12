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
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import BookTour from "./booktour";
import NotFound from "./pages/NotFound";

const Admin = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="kansadco-ui-theme">
        <AuthProvider><ContentProvider><TooltipProvider>
          <Toaster />
          <Sonner />
          <div>
            <BrowserRouter future={{ v7_startTransition: true }}>
              <SeoManager />
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/book-tour" element={<BookTour />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/admin" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><AdminAccess><Admin /></AdminAccess></Suspense>} />
              </Routes>
            </BrowserRouter>
          </div>
        </TooltipProvider></ContentProvider></AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
