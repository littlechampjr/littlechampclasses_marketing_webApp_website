import Image from "next/image";

export type HeroCircleVisualProps = {
  /** Full-bleed artwork inside the peach / white rings (e.g. marketing illustration). */
  imageSrc: string;
};

export function HeroCircleVisual({ imageSrc }: HeroCircleVisualProps) {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="relative mx-auto aspect-square w-[min(100%,380px)]">
        {/* Outer peach ring — matches site chrome */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 p-[7px] shadow-[0_24px_50px_-12px_rgba(249,115,22,0.28)]">
          <div className="h-full w-full rounded-full bg-white p-[10px] shadow-[inset_0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-sky-100/40">
              <Image
                src={imageSrc}
                alt=""
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 90vw, 400px"
              />
              <div
                className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-black/[0.06]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-white/20"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
