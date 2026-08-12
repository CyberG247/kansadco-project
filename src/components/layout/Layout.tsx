import { useLayoutEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "@/components/ui/whatsappbutton";
import MobileDock from "./MobileDock";
import { useLocation, useOutlet } from "react-router-dom";
import PageTransition from "@/components/home/pagetransition";

const Layout = () => {
  const location = useLocation();
  const outlet = useOutlet();

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    root.style.scrollBehavior = previousBehavior;
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen w-full min-w-0 max-w-full flex-col overflow-x-clip bg-background">
      <Header />
      <main className={`flex-1 ${location.pathname === "/" ? "" : "pt-0 md:pt-[88px]"}`}>
        <PageTransition key={location.pathname}>{outlet}</PageTransition>
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileDock />
    </div>
  );
};

export default Layout;
