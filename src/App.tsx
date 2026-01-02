import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/LoadingScreen";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import BookTour from "./booktour";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const LanguageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const [animating, setAnimating] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setAnimating(false);
      setKey(prev => prev + 1);
    }, 600); // Match animation duration
    return () => clearTimeout(timer);
  }, [i18n.language]);

  return (
    <div key={key} className={animating ? "animate-lang-switch" : ""}>
      {children}
    </div>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="kansadco-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
          <div className={isLoading ? "opacity-0" : "animate-fade-in"}>
            <BrowserRouter>
              <LanguageWrapper>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/book-tour" element={<BookTour />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </LanguageWrapper>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
