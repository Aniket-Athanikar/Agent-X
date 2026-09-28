import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HeroSection from "@/landing/HeroSection";
import PlatformSection from "@/landing/PlatformSection";
import AiWorkspaceSection from "@/landing/AiWorkspaceSection";
import RepositoryIntelligenceSection from "@/landing/RepositoryIntelligenceSection";
import WorkflowsSection from "@/landing/WorkflowsSection";
import IntegrationSection from "@/landing/IntegrationSection";
import FinalCtaSection from "@/landing/FinalCtaSection";
import PricingSection from "@/landing/PricingSection";

export default function Home() {
  return (
    <main className="bg-[#030712] min-h-screen text-white overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-50 aurora-bg relative">
      <Navbar />
      {/* Hero needs to mount independently */}
      <HeroSection />

      <PlatformSection />

      <AiWorkspaceSection />
      <RepositoryIntelligenceSection />
      <WorkflowsSection />

      <IntegrationSection />

      <PricingSection />
      <FinalCtaSection />
      <Footer />
    </main>
  );
}
