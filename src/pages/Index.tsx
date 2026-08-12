import HeroSlider from "@/components/home/HeroSlider";
import CEOSection from "@/components/home/CEOSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import StatsSection from "@/components/home/StatsSection";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <>
      <HeroSlider />
      <StatsSection />
      <CEOSection />
      <ServicesPreview />
      <ProjectsPreview />
      <Testimonials />
      <CTASection />
    </>
  );
};

export default Index;
