export const SECTION_EYEBROW_CLASS =
  "text-xs font-bold uppercase tracking-[0.2em] text-tm-green mb-3";

export const SECTION_TITLE_CLASS =
  "font-display text-3xl sm:text-4xl lg:text-5xl text-tm-black font-extrabold tracking-tight";

export const SECTION_TITLE_DARK_CLASS =
  "font-display text-3xl sm:text-4xl lg:text-5xl text-white font-extrabold tracking-tight";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  dark?: boolean;
  className?: string;
};

/** Matches Why TM NATURALS / Wellness, Thoughtfully Made. heading system */
export default function SectionHeading({
  eyebrow,
  title,
  dark = false,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <p className={SECTION_EYEBROW_CLASS}>{eyebrow}</p>
      <h2 className={dark ? SECTION_TITLE_DARK_CLASS : SECTION_TITLE_CLASS}>
        {title}
      </h2>
    </div>
  );
}
