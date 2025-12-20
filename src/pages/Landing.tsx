// src/pages/Landing.tsx
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { ModernTeams } from "@/components/landing/modern-teams";
import { FeatureCards } from "@/components/landing/feature-cards";
import { HowItWorks } from "@/components/landing/how-it-works";
// import { Features } from "@/components/landing/features";
// import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <ModernTeams />
        <FeatureCards />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}