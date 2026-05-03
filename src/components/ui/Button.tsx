import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  secondary:
    "bg-accent text-accent-foreground shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  outline:
    "border-2 border-primary/40 bg-transparent text-foreground hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  ghost: "text-foreground hover:bg-foreground/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-200 disabled:pointer-events-none disabled:opacity-50";

type ButtonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
} & ComponentProps<"button">;

export function Button({
  variant = "primary",
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(baseClass, variantClass[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  href: string;
} & Omit<ComponentProps<typeof Link>, "className" | "href" | "children">;

export function ButtonLink({
  variant = "primary",
  className,
  children,
  href,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(baseClass, variantClass[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
