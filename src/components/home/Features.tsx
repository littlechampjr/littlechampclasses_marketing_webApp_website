import { Section } from "@/components/layout/Section";

const items = [
  {
    title: "IIT / NIT mentors who love teaching kids",
    body: "Bite-sized, visual steps so young minds stay curious—not overwhelmed.",
    icon: "🎓",
    tone: "from-primary/20 to-accent/10",
  },
  {
    title: "Tiny batches, real interaction",
    body: "Every child gets airtime: speaking, asking, and practicing at their pace.",
    icon: "👥",
    tone: "from-accent/20 to-primary/10",
  },
  {
    title: "Structured path, joyful rhythm",
    body: "Weekly goals and parent-friendly updates so progress is visible and steady.",
    icon: "📈",
    tone: "from-amber-200/40 to-primary/15",
  },
  {
    title: "Practice-led, like the best apps",
    body: "Short loops, instant feedback, and celebrations—without losing the human touch.",
    icon: "✨",
    tone: "from-sky-200/50 to-accent/15",
  },
];

export function Features() {
  return (
    <Section id="why-us" className="border-y border-border-soft bg-card/70 backdrop-blur-sm">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Why families choose us
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted">
          Built with the same clarity as leading learning platforms—orange energy, calm blues, and
          room to breathe.
        </p>
      </div>
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li
            key={item.title}
            className="group rounded-2xl border border-border-soft bg-background/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/10"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone} text-3xl shadow-inner ring-1 ring-black/5`}
              aria-hidden
            >
              {item.icon}
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
