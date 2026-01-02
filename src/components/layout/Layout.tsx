import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "@/components/ui/whatsappbutton";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-[120px] md:pt-[140px] animate-fade-in">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;
