import Image from "next/image";
import { Section } from "@/components/layout/Section";

/**
 * "Coming soon on mobile" banner. Compact two-column layout designed to
 * stay under ~480px total height. To swap in a real phone screenshot,
 * change the `PhoneMockup` <Image src=...> below — see the note there.
 */
export function MobileAppBanner() {
  return (
    <Section id="mobile-app" className="!py-4 sm:!py-6">
      <div className="relative overflow-hidden rounded-3xl border border-border-soft bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 px-5 py-5 sm:px-8 sm:py-6 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-rose-950/30">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(249,115,22,0.18) 0, transparent 45%), radial-gradient(circle at 90% 80%, rgba(244,63,94,0.15) 0, transparent 40%)",
          }}
          aria-hidden
        />

        <div className="relative grid items-center gap-6 md:grid-cols-[1.4fr_1fr] md:gap-8">
          {/* Left: pitch + CTA */}
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden />
              Coming soon
            </span>
            <h2 className="mt-3 font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl md:text-[28px] md:leading-[1.15]">
              Study on your schedule,
              <br className="hidden sm:inline" /> from anywhere in the world.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted md:mx-0">
              The LittleChamp Classes app is on its way. Live classes, doubt sessions, and your child&apos;s
              progress — all in your pocket.
            </p>

            <div className="mt-4 flex flex-col items-center gap-1.5 md:items-start">
              <GooglePlayBadge />
              <p className="text-[11px] text-muted">
                We&apos;ll let you know the moment it&apos;s live on Google Play.
              </p>
            </div>
          </div>

          {/* Right: dual phone mockup (stacked & overlapping) */}
          <div className="relative flex items-center justify-center md:justify-end">
            <DualPhoneMockup />
          </div>
        </div>
      </div>
    </Section>
  );
}

/**
 * "GET IT ON Google Play" badge, rendered inline so we don't depend on an
 * external asset. Disabled / non-interactive while the app isn't live.
 */
function GooglePlayBadge() {
  return (
    <div
      role="img"
      aria-label="Google Play — coming soon"
      className="relative inline-flex items-center gap-2.5 rounded-lg bg-black px-4 py-1.5 text-white shadow-lg shadow-black/20 ring-1 ring-white/10 select-none"
    >
      <PlayStoreIcon className="h-6 w-6" />
      <div className="flex flex-col leading-tight text-left">
        <span className="text-[9px] font-medium uppercase tracking-wider text-white/80">
          Get it on
        </span>
        <span className="font-display text-sm font-semibold tracking-tight">Google Play</span>
      </div>
    </div>
  );
}

function PlayStoreIcon({ className }: { className?: string }) {
  // Multicolor Google Play triangle. Pure SVG, no external dependency.
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden>
      <defs>
        <linearGradient id="gp-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00C3FF" />
          <stop offset="100%" stopColor="#0073E0" />
        </linearGradient>
        <linearGradient id="gp-b" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFD200" />
          <stop offset="100%" stopColor="#FFB300" />
        </linearGradient>
        <linearGradient id="gp-c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6A6A" />
          <stop offset="100%" stopColor="#E63950" />
        </linearGradient>
        <linearGradient id="gp-d" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#19D26C" />
          <stop offset="100%" stopColor="#00A859" />
        </linearGradient>
      </defs>
      <path d="M67 32c-7 4-11 12-11 22v404c0 10 4 18 11 22l232-224L67 32z" fill="url(#gp-a)" />
      <path d="M299 256l65-63L98 32c-7-4-15-4-22 0l223 224z" fill="url(#gp-d)" />
      <path d="M299 256l65 63-266 161c-7 4-15 4-22 0l223-224z" fill="url(#gp-c)" />
      <path d="M364 193l78 45c20 11 20 36 0 47l-78 45-65-63 65-74z" fill="url(#gp-b)" />
    </svg>
  );
}

/**
 * Two phones, staggered & overlapping (reference design). Back phone sits
 * upper-right, front phone lower-left and on top. Both use the same image
 * for now — swap one src later for variety.
 *
 * Footprint sized to keep total banner height under ~480px.
 */
function DualPhoneMockup() {
  return (
    <div className="relative h-[300px] w-[240px] sm:h-[340px] sm:w-[280px] md:h-[360px] md:w-[300px]">
      {/* Soft glow behind */}
      <div
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[40%] bg-primary/20 blur-3xl"
        aria-hidden
      />
      {/* Back phone — upper-right, slightly rotated */}
      <div className="absolute right-0 top-0 z-0 rotate-[6deg]">
        <PhoneMockup src={"/mobileview.webp"} />
      </div>
      {/* Front phone — lower-left, on top */}
      <div className="absolute bottom-0 left-0 z-10 -rotate-[4deg]">
        <PhoneMockup src={"/mobileview2.webp"} />
      </div>
    </div>
  );
}

/**
 * Compact phone mockup. Fixed height keeps the whole banner well under 500px.
 *
 * To swap the screen artwork:
 *   1. Drop your image into /public (e.g. /public/app-preview.png), or
 *   2. Use a web URL — but for next/image you must add the host to
 *      next.config.ts → images.remotePatterns. If you'd rather skip that,
 *      change <Image .../> below to a plain <img src="https://..." />.
 */
function PhoneMockup({ src }: { src: string }) {
  return (
    <div className="relative h-[230px] w-[115px] sm:h-[260px] sm:w-[130px] md:h-[280px] md:w-[140px]">
      <div className="relative h-full w-full rounded-[1.5rem] border-[6px] border-neutral-900 bg-neutral-900 shadow-2xl shadow-black/30 dark:border-neutral-800">
        {/* Notch */}
        <div className="absolute left-1/2 top-1.5 z-10 h-3 w-14 -translate-x-1/2 rounded-b-xl bg-neutral-900 dark:bg-neutral-800" />
        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[1.15rem] bg-gradient-to-b from-amber-100 via-orange-50 to-rose-100 dark:from-amber-900/40 dark:via-orange-900/30 dark:to-rose-900/30">
          <Image
            src={src}
            alt="LittleChamp Classes app preview"
            fill
            className="object-cover"
            sizes="170px"
            priority={false}
          />
          {/* Subtle top sheen */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
