import { HeroCircleVisual } from "@/components/home/HeroCircleVisual";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site-config";

export function CuriousHero() {
  return (
    <section className="relative overflow-hidden bg-background px-4 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-12">
      {/* Soft background blobs — landing-page depth */}
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="order-2 lg:order-1">
          <h1 className="font-display text-4xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-[2.75rem]">
            Learning made fun for{" "}
            <span className="text-primary">Curious Minds!</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Let your child start learning how to excel—with joyful live classes in early maths,
            English, and discovery activities, guided by{" "}
            <span className="font-semibold text-foreground/90">IIT mentors</span>.
          </p>
          <p className="mt-5 font-display text-lg font-bold text-foreground sm:text-xl">
            <span className="scribble-underline">For Class 1st to 8th</span>
          </p>
          <div className="mt-8">
            <ButtonLink
              href="#programs"
              className="min-h-12 rounded-2xl px-8 text-base font-bold shadow-lg shadow-primary/25 active:scale-[0.99]"
            >
              View Learning Programs
            </ButtonLink>
          </div>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-lg">
          <HeroCircleVisual imageSrc={site.heroCircleImageSrc} />
        </div>
      </div>
    </section>
  );
}
