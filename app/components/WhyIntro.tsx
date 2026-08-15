import SectionHeading from "@/app/components/SectionHeading";

const brandDetails = [
  { num: "01", label: "Simple" },
  { num: "02", label: "Thoughtful" },
  { num: "03", label: "Everyday" },
];

export default function WhyIntro() {
  return (
    <div className="mx-auto max-w-md text-center lg:mx-0 lg:pr-8 lg:text-left">
      <SectionHeading
        eyebrow="Why TM NATURALS"
        title="Wellness, Thoughtfully Made."
        centerOnMobile
      />
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-tm-orange lg:mx-0" />
      <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-tm-muted lg:mx-0">
        We focus on clear formulas, practical daily use, and thoughtfully
        selected ingredients designed to fit naturally into everyday wellness
        routines.
      </p>

      <div className="mx-auto mt-9 grid max-w-md grid-cols-3 divide-x divide-[rgba(1,1,1,0.12)] lg:mx-0">
        {brandDetails.map((item, index) => (
          <div
            key={item.label}
            className={`min-w-0 ${index === 0 ? "pr-2 sm:pr-3" : index === brandDetails.length - 1 ? "pl-2 sm:pl-3" : "px-2 sm:px-3"}`}
          >
            <p className="text-xs font-medium text-[#FFA304]">{item.num}</p>
            <p className="mt-1 text-sm font-medium text-[#010101]">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-9 max-w-md lg:mx-0">
        <div
          aria-hidden="true"
          className="h-px w-full bg-[rgba(1,1,1,0.10)]"
        />
        <p className="mt-8 font-display text-xl font-medium leading-snug text-[#010101] md:text-2xl">
          Made for the way you live.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-tm-muted-secondary">
          Simple choices. Thoughtful formulas. Everyday wellness.
        </p>
        <div
          aria-hidden="true"
          className="mt-4 flex justify-center lg:justify-start"
        >
          <span className="h-0.5 w-7 bg-[#8FC642]" />
          <span className="h-0.5 w-[10px] bg-[#FFA304]" />
        </div>
      </div>
    </div>
  );
}
