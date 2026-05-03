import { CTABand } from "@/components/home/CTABand";
import { CuriousHero } from "@/components/home/CuriousHero";
import { FAQ } from "@/components/home/FAQ";
import { FeaturedPrograms } from "@/components/home/FeaturedPrograms";
import { Features } from "@/components/home/Features";
import { HeroFeatureBar } from "@/components/home/HeroFeatureBar";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Programs } from "@/components/home/Programs";

/**
 * Full marketing homepage body (below layout header). Shared by `/` and `/dashboard` when the learner has no enrollments.
 */
export function MarketingHomeSections() {
  return (
    <>
      <CuriousHero />
      <HeroFeatureBar />
      <FeaturedPrograms />
      <div className="pt-10 sm:pt-14">
        <Features />
        <Programs />
        <HowItWorks />
        <FAQ />
        <CTABand />
      </div>
    </>
  );
}
