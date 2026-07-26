import ProoftLogo from "./ProoftLogo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/50 bg-[#f4f3ed] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <ProoftLogo size="sm" />

        <div className="text-center md:text-right space-y-1">
          <p className="text-xs text-slate-500 font-sans">
            &copy; {new Date().getFullYear()} prooft. All rights reserved.
          </p>
          <p className="text-[10px] text-slate-400 font-mono font-medium">
            Optimizing trust entities for generative retrieval indexes. Built with Google AI Studio.
          </p>
        </div>

      </div>
    </footer>
  );
}

