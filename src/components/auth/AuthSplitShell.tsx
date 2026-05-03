import Image from "next/image";
import type { ReactNode } from "react";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/cn";

type AuthSplitShellProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Curious-style split: brand hero (left) + main content (right). Stacks on small screens.
 */
export function AuthSplitShell({ children, className }: AuthSplitShellProps) {
  return (
    <div
      className={cn(
        "min-h-dvh w-full bg-[#f4f4f5] dark:bg-background",
        className,
      )}
    >
      <div className="min-h-[inherit] w-full flex">
        <div className="flex items-center justify-center mx-auto my-auto max-w-[1066px] ">
          <aside className="relative flex min-h-[240px] flex-col border-b border-border-soft bg-card lg:min-h-0 lg:border-b-0 lg:border-r">
            <div className="h-1.5 w-full bg-primary" aria-hidden />
            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-10 text-center sm:px-10 lg:px-10 lg:py-14">
              <h1 className="max-w-md font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Spark your Child&apos;s{" "}
                <span className="text-primary" style={{ textTransform: "none" }}>
                  CURIOSITY!
                </span>
              </h1>
              <div className="relative aspect-[4/3] w-full max-w-[min(100%,420px)]">
                <Image
                  src={site.heroCircleImageSrc}
                  alt=""
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 1024px) 90vw, 420px"
                  unoptimized={site.heroCircleImageSrc.includes(".png")}
                />
              </div>
              <p className="max-w-sm text-sm text-muted">{site.tagline}</p>
            </div>
          </aside>
          <div className="flex flex-1 w-full h-[592px] items-center justify-center">{children}</div>

        </div>
      </div>
    </div>
  );
}
