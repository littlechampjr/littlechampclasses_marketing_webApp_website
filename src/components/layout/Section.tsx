import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  as?: "section" | "div";
};

export function Section({
  id,
  children,
  className,
  containerClassName,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag id={id} className={cn("px-4 py-16 sm:px-6 sm:py-20 lg:py-24", className)}>
      <div
        className={cn(
          "mx-auto w-full max-w-6xl",
          containerClassName,
        )}
      >
        {children}
      </div>
    </Tag>
  );
}
