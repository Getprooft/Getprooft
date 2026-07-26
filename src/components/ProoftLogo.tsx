interface ProoftLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function ProoftLogo({ className = "", iconOnly = false, size = "md" }: ProoftLogoProps) {
  // Configured dimensions for different size variants
  const iconDimensions = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
    xl: "h-14 w-14"
  }[size];

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl sm:text-[28px]",
    lg: "text-3xl sm:text-[34px]",
    xl: "text-4xl sm:text-5xl"
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Vibrant Electric Blue Prooft Speech Bubble Icon */}
      <svg
        viewBox="0 0 120 120"
        className={`${iconDimensions} shrink-0 drop-shadow-xs`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Squircle Bubble Body */}
        <path
          d="M 32 0 
             H 88 
             C 105.67 0 120 14.33 120 32 
             V 48 
             C 120 65.67 105.67 80 88 80 
             H 44 
             V 66 
             H 58 
             V 80 
             H 44 
             L 26 108 
             C 18 120 0 114 0 98 
             V 32 
             C 0 14.33 14.33 0 32 0 Z"
          fill="#3d26ff"
        />
        {/* Crisp Inset White Notch at bottom */}
        <rect x="42" y="66" width="28" height="16" fill="white" />
      </svg>

      {!iconOnly && (
        <span className={`font-display ${textSizes} font-black tracking-[-0.05em] text-[#2b284c] leading-none`}>
          prooft
        </span>
      )}
    </div>
  );
}
