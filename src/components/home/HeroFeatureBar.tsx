const items = [
  {
    title: "Interactive classes",
    subtitle: "Small groups, real teachers",
    icon: (
      <span
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg shadow-sm"
        aria-hidden
      >
        📹
      </span>
    ),
  },
  {
    title: "24 × 7 Mentor Support",
    subtitle: "Doubts when you need them",
    icon: <span className="text-2xl" aria-hidden>📝</span>,
  },
  {
    title: "Daily Progress Tracking",
    subtitle: "Visible growth for parents",
    icon: <span className="text-2xl" aria-hidden>🧠</span>,
  },
  {
    title: "Practice Led Learning",
    subtitle: "Learn by doing, not cramming",
    icon: <span className="text-2xl" aria-hidden>🏅</span>,
  },
];

export function HeroFeatureBar() {
  return (
    <div className="relative z-10 mx-auto -mt-2 max-w-6xl px-4 sm:px-6">
      <div className="rounded-2xl border border-border-soft bg-card px-2 py-4 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] sm:px-4 sm:py-6">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <li
              key={item.title}
              className={`flex gap-3 px-3 sm:px-4 ${i > 0 ? "lg:border-l lg:border-border-soft" : ""}`}
            >
              <div className="shrink-0 pt-0.5">{item.icon}</div>
              <div>
                <p className="font-display text-sm font-bold leading-snug text-foreground sm:text-[0.95rem]">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-muted">{item.subtitle}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
