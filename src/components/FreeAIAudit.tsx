import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Loader2, RefreshCw, ShieldCheck, Building2, Layers, Mail } from "lucide-react";

interface AuditReport {
  userBrand: string;
  userCategory: string;
  email: string;
  is_target_brand_mentioned: boolean;
  exclusion_reason?: string | null;
  top_recommended_brands: string[];
  ai_visibility_score?: number;
  search_engines?: {
    perplexity: boolean;
    gemini: boolean;
    chatgpt: boolean;
  };
  insights?: string[];
  actionable_recommendations?: string[];
}

interface FreeAIAuditProps {
  onScrollToTryNow?: () => void;
}

export default function FreeAIAudit({ onScrollToTryNow }: FreeAIAuditProps) {
  const [formData, setFormData] = useState({ userBrand: "", userCategory: "" });
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleAudits = [
    { brand: "Prooft", category: "B2B Customer Proof Platforms" },
    { brand: "TaskFlow", category: "B2B Team Productivity SaaS" },
    { brand: "MediConnect", category: "HIPAA Telehealth Software" }
  ];

  const handleSelectSample = (brand: string, category: string) => {
    setFormData({
      userBrand: brand,
      userCategory: category
    });
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.userBrand.trim()) {
      setError("Please enter your Brand Name.");
      return;
    }
    if (!formData.userCategory.trim()) {
      setError("Please enter your Software Category.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/run-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userBrand: formData.userBrand,
          userCategory: formData.userCategory,
          email: ""
        }),
      });

      if (!res.ok) {
        throw new Error("Audit request failed.");
      }

      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Error running audit", err);
      setError("An error occurred while running the AI audit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-visibility-audit" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f4f3ed] border-t border-slate-200/50 relative">
      <div className="mx-auto max-w-4xl">
        
        {/* Section Headline */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#4b3aff]/5 border border-[#4b3aff]/10 px-3.5 py-1 text-xs font-semibold text-[#4b3aff]">
            <Search className="h-3.5 w-3.5" />
            Instant Brand AI Audit
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2e2c4e]">
            Check Your SaaS Brand's AI Visibility
          </h2>
          <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
            Discover if Perplexity, ChatGPT, and Gemini recommend your SaaS brand when potential customers ask for recommendations in your category.
          </p>
        </div>

        {/* Audit Tool Card Container */}
        <div className="relative rounded-[2.5rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-[0_25px_60px_rgba(46,44,78,0.06)]">
          
          <AnimatePresence mode="wait">
            {!report && !loading && (
              <motion.form
                key="audit-form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Header bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                  <div className="flex items-center gap-2 text-[#2e2c4e]">
                    <div className="text-[#4b3aff]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold font-display">Free AI Engine Citation Scan</span>
                  </div>

                  {/* Sample presets */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-slate-400 font-medium mr-1">Quick Sample:</span>
                    {sampleAudits.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSample(item.brand, item.category)}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 transition hover:border-[#4b3aff]/40 hover:bg-[#4b3aff]/5 cursor-pointer font-sans"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4b3aff]" />
                        {item.brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Brand Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-sans">
                      <Building2 className="h-3.5 w-3.5 text-[#4b3aff]" />
                      Your Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Brand Name (e.g., Prooft)"
                      value={formData.userBrand}
                      onChange={(e) => setFormData({ ...formData, userBrand: e.target.value })}
                      className="w-full rounded-2xl border border-slate-100 bg-[#f4f3ed]/60 py-3.5 px-5 text-sm text-[#2e2c4e] placeholder-slate-400 focus:border-[#4b3aff] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4b3aff]/20 font-sans font-medium transition"
                    />
                  </div>

                  {/* Software Category Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-sans">
                      <Layers className="h-3.5 w-3.5 text-[#4b3aff]" />
                      Software Category
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Software Category (e.g., B2B Customer Proof Platforms)"
                      value={formData.userCategory}
                      onChange={(e) => setFormData({ ...formData, userCategory: e.target.value })}
                      className="w-full rounded-2xl border border-slate-100 bg-[#f4f3ed]/60 py-3.5 px-5 text-sm text-[#2e2c4e] placeholder-slate-400 focus:border-[#4b3aff] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4b3aff]/20 font-sans font-medium transition"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600 font-sans">
                    {error}
                  </div>
                )}

                {/* Submit CTA Button */}
                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#4b3aff] text-white font-bold font-display rounded-full shadow-lg shadow-[#4b3aff]/15 hover:bg-[#3c2fd0] transition-all duration-200 cursor-pointer text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
                  >
                    <Search className="h-4 w-4" />
                    Run Free AI Trust Audit
                  </button>
                  <p className="text-[11px] text-slate-400 text-center font-sans">
                    Instantly scans Perplexity, ChatGPT, and Gemini model knowledge graphs. Zero cost.
                  </p>
                </div>
              </motion.form>
            )}

            {/* Loading State */}
            {loading && (
              <motion.div
                key="audit-loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
              >
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-2 border-slate-100 border-t-[#4b3aff] animate-spin" />
                  <Loader2 className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-[#4b3aff] animate-pulse" />
                </div>

                <div className="space-y-2 max-w-md">
                  <h3 className="font-display text-xl font-extrabold text-[#2e2c4e]">
                    Auditing AI Visibility...
                  </h3>
                  <p className="animate-pulse text-sm font-semibold text-[#4b3aff] font-sans">
                    Simulating AI search engines and scanning the live web...
                  </p>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed pt-2">
                    Querying model indexes for <span className="font-bold text-slate-600">{formData.userBrand}</span> in category <span className="font-bold text-slate-600">{formData.userCategory}</span>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Audit Report View */}
            {report && !loading && (
              <motion.div
                key="audit-report"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 font-sans"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-3">
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#2e2c4e] font-display">
                      Your GetProoft Audit Results
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Target Brand: <strong className="text-slate-800">{report.userBrand}</strong> • Category: <strong className="text-slate-800">{report.userCategory}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => setReport(null)}
                    className="inline-flex items-center gap-1.5 self-start sm:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200/70 rounded-full text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Audit Another Brand
                  </button>
                </div>

                {/* Mentioned Banner */}
                {report.is_target_brand_mentioned ? (
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-5 flex items-start gap-3 text-emerald-800">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-base font-bold">Good news! You are recommended by AI engines in your niche.</h4>
                      <p className="text-xs text-emerald-700 leading-relaxed">
                        AI models currently detect positive entity mentions and structured reviews for {report.userBrand}. Maintaining live Schema.org updates will preserve your competitive rank.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50/90 border border-red-200/80 rounded-2xl p-5 flex items-start gap-3 text-red-900">
                    <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-base font-bold flex items-center gap-2">
                        <span>🔴 Visibility Deficit Detected</span>
                      </h4>
                      <p className="text-xs text-red-700 leading-relaxed font-sans">
                        {report.exclusion_reason || `AI search engines currently omit ${report.userBrand} because no structured Schema.org trust signals or review aggregations were detected on major AI knowledge graphs.`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Grid stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Top 5 Recommended Brands Card */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">
                      Top 5 Brands Recommended by AI:
                    </h4>
                    <ul className="space-y-2">
                      {report.top_recommended_brands.map((brandName, idx) => {
                        const isTarget = brandName.toLowerCase() === report.userBrand.toLowerCase();
                        return (
                          <li
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold font-sans transition ${
                              isTarget
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                                : "bg-white border-slate-200/70 text-slate-800"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[11px] font-mono font-bold text-slate-600">
                                #{idx + 1}
                              </span>
                              <span>{brandName}</span>
                            </div>
                            {isTarget ? (
                              <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                                Your Brand
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-400">
                                Cited
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* AI Search Engine Coverage & Insights */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans mb-3">
                        Model Indexing Coverage
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white border border-slate-200/60 rounded-xl p-3 text-center space-y-1">
                          <span className="text-[11px] font-bold text-slate-600 block">Perplexity</span>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            report.search_engines?.perplexity ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                          }`}>
                            {report.search_engines?.perplexity ? "Indexed" : "Omitted"}
                          </span>
                        </div>

                        <div className="bg-white border border-slate-200/60 rounded-xl p-3 text-center space-y-1">
                          <span className="text-[11px] font-bold text-slate-600 block">Gemini</span>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            report.search_engines?.gemini ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                          }`}>
                            {report.search_engines?.gemini ? "Indexed" : "Omitted"}
                          </span>
                        </div>

                        <div className="bg-white border border-slate-200/60 rounded-xl p-3 text-center space-y-1">
                          <span className="text-[11px] font-bold text-slate-600 block">ChatGPT</span>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            report.search_engines?.chatgpt ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                          }`}>
                            {report.search_engines?.chatgpt ? "Indexed" : "Omitted"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actionable recommendations */}
                    <div className="space-y-2 pt-2 border-t border-slate-200/50">
                      <h5 className="text-xs font-bold text-[#2e2c4e] flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-[#4b3aff]" />
                        Recommended Action Plan:
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {report.actionable_recommendations?.map((rec, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2">
                            <span className="text-[#4b3aff] font-bold">•</span>
                            <span>{rec}</span>
                          </li>
                        )) || (
                          <li className="flex items-start gap-2">
                            <span className="text-[#4b3aff] font-bold">•</span>
                            <span>Convert reviews and brand proof into live JSON-LD schema using Prooft.</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Call To Action Box */}
                <div className="bg-[#4b3aff]/5 border border-[#4b3aff]/20 rounded-2xl p-6 text-center space-y-3 mt-4">
                  <h4 className="text-lg font-bold text-[#2e2c4e] font-display">
                    Ready to turn customer proof into AI citations for {report.userBrand}?
                  </h4>
                  <p className="text-xs text-slate-600 max-w-lg mx-auto font-sans">
                    Use our instant schema generator above to convert your raw reviews, ratings, and testimonials into machine-readable trust signals.
                  </p>
                  <button
                    onClick={() => {
                      if (onScrollToTryNow) onScrollToTryNow();
                      else document.getElementById("try-it-now")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#4b3aff] hover:bg-[#3c2fd0] text-white font-bold rounded-full text-xs transition shadow-md cursor-pointer active:scale-95"
                  >
                    <span>Generate Schema for {report.userBrand}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
