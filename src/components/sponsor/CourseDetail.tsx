type CourseDetailProps = {
  detailDescription: string;
  idPrefix: string;
};

export function CourseDetail({ detailDescription, idPrefix }: CourseDetailProps) {
  const paragraphs = detailDescription
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <details className="group mt-4 rounded-xl border border-border-soft bg-surface-subtle/60">
      <summary className="cursor-pointer list-none px-4 py-3 font-display text-sm font-bold text-primary outline-none marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          Read full program details
          <span className="text-xs font-normal text-muted transition group-open:rotate-180">▼</span>
        </span>
      </summary>
      <div
        id={`${idPrefix}-detail`}
        className="space-y-4 border-t border-border-soft px-4 pb-4 pt-3 text-sm leading-relaxed"
      >
        {paragraphs.map((block, i) => (
          <p key={i} className="whitespace-pre-line text-foreground/90">
            {block}
          </p>
        ))}
      </div>
    </details>
  );
}
