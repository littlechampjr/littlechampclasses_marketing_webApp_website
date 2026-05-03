import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site-config";

export function Logo() {
  return (
    <Link
      href="/"
      className="group flex min-w-fit shrink-0 items-center gap-2 sm:gap-3"
      aria-label={site.name}
    >
      <span className="inline-flex h-12 max-w-[min(92vw,420px)] shrink-0 sm:h-14 md:h-16 lg:h-[4.5rem]">
        <Image
          src={`/playful-little-champ-logo.png?v=${site.playfulLittleChampLogoVersion}`}
          alt={site.name}
          width={740}
          height={290}
          priority
          sizes="(max-width: 640px) 92vw, 420px"
          className="h-full w-auto max-w-full object-contain object-left"
        />
      </span>
      <span className="hidden shrink-0 border-l border-border-soft pl-3 text-[11px] font-medium leading-snug text-muted lg:block lg:max-w-[5.5rem]">
        {site.brandLine}
      </span>
    </Link>
  );
}
