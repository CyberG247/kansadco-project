import { ReactNode, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "@/components/ui/whatsappbutton";
import MobileDock from "./MobileDock";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 animate-fade-in ${location.pathname === "/" ? "" : "pt-0 md:pt-[88px]"}`}>{children}</main>
      <Footer />
      <WhatsAppButton />
      <MobileDock />
    </div>
  );
};

export default Layout;
