interface SectionHeaderProps {
  eyebrow?: string;
  index?: string;
  title: string;
  titleEm?: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({
  eyebrow,
  index,
  title,
  titleEm,
  subtitle,
  centered,
}: SectionHeaderProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      {(eyebrow || index) && (
        <div
          className={`flex items-center gap-3 mb-4 ${centered ? "justify-center" : ""}`}
        >
          {index && <span className="mono text-xs text-faint">{index}</span>}
          {index && eyebrow && <span className="h-px w-6 bg-line-strong" />}
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        </div>
      )}
      <h2 className="display text-4xl sm:text-5xl lg:text-[3.4rem] text-ink">
        {title}
        {titleEm && <> </>}
        {titleEm && <span className="display-em text-accent">{titleEm}</span>}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-mute text-[15px] leading-relaxed max-w-2xl ${
            centered ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
