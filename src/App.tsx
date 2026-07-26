import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import GeoVsSeo from "./components/GeoVsSeo";
import HowItWorks from "./components/HowItWorks";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import { AuditInput, AnalysisResult } from "./types";
import { Check, Shield, Award, Terminal } from "lucide-react";

type ViewType = "landing" | "dashboard";

export default function App() {
  const [view, setView] = useState<ViewType>("landing");
  const [input, setInput] = useState<AuditInput | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Smooth scroll handler for landing page anchors
  const handleScrollToTryNow = () => {
    const scrollToForm = () => {
      const el = document.getElementById("audit-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const firstInput = el.querySelector("input");
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 300);
        }
      }
    };

    if (view !== "landing") {
      setView("landing");
      setTimeout(scrollToForm, 150);
    } else {
      scrollToForm();
    }
  };

  const handleScrollToSection = (id: string) => {
    if (view !== "landing") {
      setView("landing");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAnalyzeStart = (auditInput: AuditInput) => {
    setIsLoading(true);
    setInput(auditInput);
    setResult(null);
  };

  const handleAnalyzeComplete = (analysisResult: AnalysisResult) => {
    setIsLoading(false);
    setResult(analysisResult);
    setView("dashboard");
    // Scroll to top of report
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToAudit = () => {
    setView("landing");
    // Wait a brief tick and scroll down to the try now form
    setTimeout(() => {
      document.getElementById("try-it-now")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#f4f3ed] font-sans text-slate-800 selection:bg-[#4b3aff]/10 selection:text-[#4b3aff]">
      
      {/* Universal Header */}
      <Header
        onScrollToTryNow={handleScrollToTryNow}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Content Area */}
      <main>
        {view === "landing" ? (
          <>
            {/* Hero Audit Section */}
            <Hero
              onAnalyzeStart={handleAnalyzeStart}
              onAnalyzeComplete={handleAnalyzeComplete}
              isLoading={isLoading}
            />

            {/* Feature Highlights Grid */}
            <section id="features" className="border-t border-slate-200/50 py-16 px-4 sm:px-6 lg:px-8 bg-[#f4f3ed]">
              <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  
                  <div className="rounded-[2rem] border border-slate-200/50 bg-white/40 p-8 space-y-4 hover:bg-white transition">
                    <div className="h-11 w-11 rounded-full bg-[#4b3aff]/5 text-[#4b3aff] flex items-center justify-center">
                      <Shield className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#2e2c4e] font-display">Entity Recognition</h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                      Prooft extracts quantitative brand metrics (e.g. ratings, counts, dates) and converts them into high-confidence entities that AI model crawlers love to ingest.
                    </p>
                  </div>

                  <div className="rounded-[2rem] border border-slate-200/50 bg-white/40 p-8 space-y-4 hover:bg-white transition">
                    <div className="h-11 w-11 rounded-full bg-[#4b3aff]/5 text-[#4b3aff] flex items-center justify-center">
                      <Terminal className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#2e2c4e] font-display">Valid JSON-LD Schema</h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                      Fully complaint AggregateRating schema generation. Makes your site instantly parsed by search engine indexers and rich Google AI Overviews.
                    </p>
                  </div>

                  <div className="rounded-[2rem] border border-slate-200/50 bg-white/40 p-8 space-y-4 hover:bg-white transition">
                    <div className="h-11 w-11 rounded-full bg-[#4b3aff]/5 text-[#4b3aff] flex items-center justify-center">
                      <Award className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#2e2c4e] font-display">RAG Index Optimization</h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                      Factual third-person translations customized for vector embedding semantic searches. Ensures your brand gets cited in response summaries.
                    </p>
                  </div>

                </div>
              </div>
            </section>

            {/* Comparatives Section */}
            <GeoVsSeo />

            {/* How It Works Section */}
            <HowItWorks />
          </>
        ) : (
          /* Report Dashboard */
          result && input && (
            <Dashboard
              brandName={input.brandName}
              domain={input.domain}
              result={result}
              onBack={handleBackToAudit}
            />
          )
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
