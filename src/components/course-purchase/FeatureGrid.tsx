import type { ApiPurchaseFeatureCard } from "@/lib/api/types";

export function FeatureGrid({ features }: { features: ApiPurchaseFeatureCard[] }) {
  if (!features.length) return null;
  return (
    <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f) => (
        <li
          key={f.title}
          className="flex gap-3 rounded-2xl border border-border-soft bg-surface-subtle/40 p-4 shadow-sm"
        >
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card text-xl shadow-inner"
            aria-hidden
          >
            {f.iconEmoji}
          </span>
          <div className="min-w-0 pt-1">
            <p className="font-semibold leading-snug text-foreground">{f.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{f.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
