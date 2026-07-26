import { ArrowRight } from "lucide-react";
import ProoftLogo from "./ProoftLogo";

interface HeaderProps {
  onScrollToTryNow: () => void;
  onScrollToSection: (id: string) => void;
}

export default function Header({ onScrollToTryNow, onScrollToSection }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-[#f4f3ed]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Enlarged Brand Logo */}
        <button
          onClick={onScrollToTryNow}
          className="cursor-pointer text-left focus:outline-none p-2 -ml-2 rounded-2xl hover:bg-white/50 transition"
          title="Prooft Home"
        >
          <ProoftLogo size="lg" />
        </button>

        {/* Centered Navigation Pill - Same height (h-[44px]) as Launch App button */}
        <div className="hidden md:flex items-center h-[44px] bg-white shadow-xs border border-slate-200/60 rounded-full px-6 gap-7 text-sm font-semibold text-slate-700">
          <button
            onClick={() => onScrollToSection("features")}
            className="transition hover:text-[#3d26ff] cursor-pointer font-sans"
          >
            Features
          </button>
          <button
            onClick={() => onScrollToSection("geo-comparison")}
            className="transition hover:text-[#3d26ff] cursor-pointer font-sans"
          >
            GEO vs SEO
          </button>
          <button
            onClick={() => onScrollToSection("how-it-works")}
            className="transition hover:text-[#3d26ff] cursor-pointer font-sans"
          >
            How it Works
          </button>
        </div>

        {/* Action Button - Same height (h-[44px]) as nav pill */}
        <div className="flex items-center gap-4">
          <button
            onClick={onScrollToTryNow}
            className="group inline-flex items-center h-[44px] gap-3 rounded-full bg-white border border-slate-200/70 pl-5 pr-1.5 text-xs font-semibold text-slate-800 shadow-xs hover:border-slate-300 transition duration-200 active:scale-95 cursor-pointer"
          >
            <span className="font-display text-sm tracking-tight text-[#2e2c4e] font-extrabold">Launch App</span>
            <div className="h-8 w-8 rounded-full bg-[#e2f853] text-[#1e1e38] flex items-center justify-center transition group-hover:scale-105 shadow-xs">
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

