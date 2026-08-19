interface CarouselNavButtonProps {
  direction: "previous" | "next";
  onClick: () => void;
  ariaLabel: string;
  className?: string;
  compact?: boolean;
}

export default function CarouselNavButton({
  direction,
  onClick,
  ariaLabel,
  className = "",
  compact = false,
}: CarouselNavButtonProps) {
  const isPrevious = direction === "previous";
  const sizeClass = compact
    ? "h-9 w-9 min-h-[36px] min-w-[36px]"
    : "h-11 w-11 min-h-[44px] min-w-[44px]";
  const iconClass = compact ? "h-4 w-4" : "h-[18px] w-[18px]";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`group absolute top-1/2 z-10 flex ${sizeClass} -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(1,1,1,0.15)] bg-[rgba(255,255,255,0.88)] text-[#010101] shadow-[0_2px_14px_rgba(1,1,1,0.08)] backdrop-blur-[6px] transition-all duration-200 hover:-translate-y-[calc(50%+2px)] hover:bg-[#010101] hover:text-white active:bg-[#010101] active:text-white ${className}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-[5px] rounded-full border border-transparent ${
          isPrevious
            ? "border-l-[#8FC642] border-t-[#8FC642]"
            : "border-r-[#8FC642] border-b-[#8FC642]"
        }`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute h-2 w-0.5 rounded-full bg-[#8FC642] transition-colors duration-200 group-hover:bg-[#8FC642] ${
          isPrevious
            ? "left-2 top-1/2 -translate-y-1/2"
            : "right-2 top-1/2 -translate-y-1/2"
        }`}
      />
      {isPrevious ? (
        <ChevronLeftIcon className={`relative z-[1] ${iconClass} transition-transform duration-200 group-hover:-translate-x-0.5 group-active:-translate-x-0.5`} />
      ) : (
        <ChevronRightIcon className={`relative z-[1] ${iconClass} transition-transform duration-200 group-hover:translate-x-0.5 group-active:translate-x-0.5`} />
      )}
    </button>
  );
}

function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.5 6.5-5.5 5.5 5.5 5.5" />
    </svg>
  );
}

function ChevronRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.5 6.5 5.5 5.5-5.5 5.5" />
    </svg>
  );
}
