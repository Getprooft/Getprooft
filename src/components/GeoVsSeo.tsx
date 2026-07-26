import { Check, X, Search, Sparkles } from "lucide-react";

export default function GeoVsSeo() {
  return (
    <section id="geo-comparison" className="border-t border-slate-200/50 bg-[#f4f3ed] py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="mx-auto max-w-7xl">
        
        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#2e2c4e]">
            GEO is the new SEO
          </h2>
          <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
            Buyers now ask AI engines instead of scrolling search results. Ranking isn&apos;t enough — you need to be cited.
          </p>
        </div>

        {/* Bento Grid Comparisons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Legacy SEO Column */}
          <div className="relative rounded-[2rem] border border-slate-200/60 bg-white/40 p-8 flex flex-col justify-between transition hover:bg-white/60">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#2e2c4e] font-display">Legacy Keyword SEO</h3>
                    <p className="text-xs text-slate-500 font-sans font-medium">Built for crawlers</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-200/50" />

              <div className="space-y-4 font-sans">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-bold shrink-0">✕</span>
                  <p className="text-xs sm:text-sm text-slate-600">Optimizes for keyword rankings on blue-link search results</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-bold shrink-0">✕</span>
                  <p className="text-xs sm:text-sm text-slate-600">Chases backlinks and meta tags for crawler bots</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-bold shrink-0">✕</span>
                  <p className="text-xs sm:text-sm text-slate-600">Success = position #1 on a Google results page</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-bold shrink-0">✕</span>
                  <p className="text-xs sm:text-sm text-slate-600">Reviews, video testimonials, UGC & Reddit mentions stay siloed & unindexed</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Trust Signals (GEO) Column */}
          <div className="relative rounded-[2rem] border border-[#4b3aff]/20 bg-white p-8 flex flex-col justify-between shadow-[0_15px_40px_rgba(75,58,255,0.04)]">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4b3aff]/5 text-[#4b3aff]">
                    <Sparkles className="h-5 w-5 fill-[#4b3aff]/10" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#2e2c4e] font-display">AI Trust Signals (GEO)</h3>
                    <p className="text-xs text-[#4b3aff] font-sans font-semibold">Built for language models</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-4 font-sans">
                <div className="flex items-center gap-3">
                  <span className="text-[#4b3aff] font-bold shrink-0">✓</span>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">Optimizes for citations inside AI-generated answers</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#4b3aff] font-bold shrink-0">✓</span>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">Structures verified proof into machine-readable trust signals</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#4b3aff] font-bold shrink-0">✓</span>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">Success = your brand named in ChatGPT, Perplexity & Gemini</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#4b3aff] font-bold shrink-0">✓</span>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">9 proof types (G2, video, case studies, Reddit, PR) become Schema + RAG vectors</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

