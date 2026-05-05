import Image from "next/image";
import type { ReactNode } from "react";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/cn";

type AuthSplitShellProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Curious-style split: brand hero (left) + main content (right).
 * On small screens, stacks with the hero on top and auth below.
 */
export function AuthSplitShell({ children, className }: AuthSplitShellProps) {
  return (
    <div
      className={cn(
        "min-h-dvh w-full bg-[#f4f4f5] dark:bg-background",
        className,
      )}
    >
      <div className="flex min-h-[inherit] w-full justify-center">
        <div className="mx-auto flex w-full max-w-[1066px] flex-col px-4 py-4 sm:px-6 sm:py-6 lg:flex-row lg:items-stretch lg:py-10">
          <aside className="relative flex w-full shrink-0 flex-col border-b border-border-soft bg-card lg:w-auto lg:min-h-0 lg:border-b-0 lg:border-r lg:border-border-soft shadow-xl shadow-foreground/5 rounded-md">
            <div className="h-1 w-full bg-primary lg:h-1.5 rounded-t-md" aria-hidden />
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-5 text-center sm:gap-4 sm:px-8 sm:py-7 lg:gap-5 lg:px-10 lg:py-14">
              <h1 className="max-w-md font-display text-xl font-extrabold leading-tight tracking-tight text-foreground sm:text-2xl md:text-4xl">
                Spark your Child&apos;s{" "}
                <span className="text-primary" style={{ textTransform: "none" }}>
                  CURIOSITY!
                </span>
              </h1>
              <div className="relative mx-auto aspect-[4/3] w-full max-w-[200px] sm:max-w-[260px] lg:max-w-[min(100%,420px)]">
                <Image
                  src={site.heroCircleImageSrc}
                  alt=""
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 640px) 200px, (max-width: 1024px) 260px, 420px"
                  unoptimized={site.heroCircleImageSrc.includes(".png")}
                />
              </div>
              <p className="max-w-sm text-xs text-muted sm:text-sm">{site.tagline}</p>
            </div>
          </aside>
          <div className="flex min-h-0 w-full flex-1 items-center  pb-2 pt-2 sm:pb-4 sm:pt-4 lg:min-h-[592px] lg:py-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
