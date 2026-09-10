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
  title,
  titleEm,
  subtitle,
  centered,
}: SectionHeaderProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      {eyebrow && (
        <div
          className={`flex items-center gap-3 mb-4 ${centered ? "justify-center" : ""}`}
        >
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        </div>
      )}
      <h1 className="display text-4xl sm:text-5xl lg:text-[3.4rem] text-ink">
        {title}
        {titleEm && <> </>}
        {titleEm && <span className="display-em text-accent">{titleEm}</span>}
      </h1>
      {subtitle && (
        <p
          className={`mt-4 text-mute text-[15px] leading-relaxed max-w-2xl ${
            centered ? "mx-auto" : ""
          }`}
        >
          {subtitle.replaceAll("—", ",")}
        </p>
      )}
    </div>
  );
}
