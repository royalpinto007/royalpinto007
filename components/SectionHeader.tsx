interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleEm?: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({ eyebrow, title, titleEm, subtitle, centered }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      {eyebrow && (
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent mb-3">
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl text-ink tracking-tight font-normal">
        {title}{" "}
        {titleEm && <span className="display-em text-accent">{titleEm}</span>}
      </h2>
      {subtitle && (
        <p className="mt-3 text-mute text-base leading-relaxed max-w-xl">{subtitle}</p>
      )}
    </div>
  );
}
