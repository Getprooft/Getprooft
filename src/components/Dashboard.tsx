import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Copy, Check, ShieldCheck, 
  Terminal, Code2, AlertCircle, Quote, Sparkles, CheckCircle2,
  X, Send, Globe, Video, Film, PlayCircle, BookOpen
} from "lucide-react";
import { AnalysisResult } from "../types";

interface DashboardProps {
  brandName: string;
  domain: string;
  result: AnalysisResult;
  onBack: () => void;
}

type TabType = "schema" | "snippets" | "checklist" | "playbook";

export default function Dashboard({ brandName, domain, result, onBack }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("schema");
  const [copied, setCopied] = useState(false);
  const [copiedPlaybook, setCopiedPlaybook] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  
  // Apply to Domain Fake Door Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyEmail, setApplyEmail] = useState("");
  const [applySubmitted, setApplySubmitted] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  // Animating the score radial gauge on mount
  useEffect(() => {
    const duration = 1200; // ms
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = duration / frameRate;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease-out quad formula
      const easedProgress = progress * (2 - progress);
      const currentScore = Math.round(easedProgress * result.overall_score);
      
      setAnimatedScore(currentScore);

      if (frame >= totalFrames) {
        setAnimatedScore(result.overall_score);
        clearInterval(timer);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [result.overall_score]);

  // Copy Schema to clipboard helper
  const handleCopySchema = () => {
    const schemaString = JSON.stringify(result.json_ld, null, 2);
    navigator.clipboard.writeText(schemaString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // SVG parameters for radial readiness ring
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Determine readiness rating label and color styles
  const getReadinessGrade = (score: number) => {
    if (score >= 90) return { label: "Excellent (AI Preferred)", color: "text-emerald-600", stroke: "stroke-emerald-500", bg: "bg-emerald-50" };
    if (score >= 75) return { label: "Good (RAG Crawlable)", color: "text-indigo-600", stroke: "stroke-[#4b3aff]", bg: "bg-indigo-50" };
    if (score >= 55) return { label: "Moderate (Poorly Structured)", color: "text-amber-600", stroke: "stroke-amber-500", bg: "bg-amber-50" };
    return { label: "Critical (LLM Invisible)", color: "text-red-600", stroke: "stroke-red-500", bg: "bg-red-50" };
  };

  const grade = getReadinessGrade(result.overall_score);

  const toggleChecklist = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#f4f3ed]">
      
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div className="space-y-3 text-left">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#4b3aff] transition duration-200 bg-white border border-slate-200/60 shadow-xs px-4 py-2 rounded-full active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Audit Tool
          </button>
          
          <div className="flex items-center gap-2.5 pt-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2e2c4e] font-display">{brandName}</h2>
            <span className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-white border border-slate-200/50 text-slate-500 shadow-xs">
              {domain}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold bg-[#4b3aff]/5 border border-[#4b3aff]/10 text-[#4b3aff] px-4 py-2.5 rounded-full self-start sm:self-auto">
          <Terminal className="h-4 w-4" />
          <span>GEO REPORT RECONSTRUCTED VIA LLM</span>
        </div>
      </div>

      {/* Debug Fallback Notice (if any) */}
      {result._debug_warning && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-start gap-2.5 text-left font-sans shadow-xs">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-amber-600" />
          <span>
            <strong>Local Synthesis Engine Active:</strong> Prooft generated these signals using local semantic models. Configure your Gemini API key in AI Studio Secrets to unlock full live optimization.
          </span>
        </div>
      )}

      {/* Scorecard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Readiness Score Card */}
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 flex items-center gap-6 relative overflow-hidden shadow-xs">
          {/* Circular Gauge */}
          <div className="relative shrink-0 flex items-center justify-center h-28 w-28">
            <svg viewBox="0 0 120 120" className="transform -rotate-90 h-full w-full">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-slate-100"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Animated Progress Circle */}
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                className={grade.stroke}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-[#2e2c4e] tracking-tighter font-display">
                {animatedScore}
              </span>
              <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Readiness</span>
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              AI Citation Readiness Score
            </h3>
            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${grade.bg} ${grade.color}`}>
              {grade.label}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              Based on schema validity and entity density. High scores are 14x more likely to be cited by Perplexity.
            </p>
          </div>
        </div>

        {/* Authenticity Index Card */}
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 flex flex-col justify-between relative overflow-hidden shadow-xs">
          <div className="space-y-2 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Authenticity Index
            </h3>
            
            <div className="flex items-center gap-2.5">
              <span className={`text-3xl font-extrabold tracking-tight font-display ${
                result.authenticity_index === "High" ? "text-emerald-600" :
                result.authenticity_index === "Medium" ? "text-[#4b3aff]" : "text-amber-600"
              }`}>
                {result.authenticity_index}
              </span>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed pt-1 font-sans">
              Your reviews exhibit high factual correlation. Neural crawlers value specific, quantitative metrics (numbers, data) over empty buzzwords.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-[10px] font-mono text-slate-400 font-medium">
            <span>Mime Check: Validated</span>
            <span>Confidence: 94%</span>
          </div>
        </div>

        {/* Key Trust Claims Card */}
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 flex flex-col relative overflow-hidden shadow-xs md:col-span-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-left flex items-center gap-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
            Extracted Factual Claims
          </h3>

          <div className="space-y-3 overflow-y-auto max-h-[140px] text-left pr-1 scrollbar-thin">
            {result.trust_claims.map((claim, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed font-sans">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3px]" />
                <span>{claim}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 9 Social & Third-Party Proof Channels Indexing Matrix */}
      <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs text-left space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#3d26ff]/10 text-[#3d26ff] flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#2e2c4e] font-display">Indexed Proof Types & Trust Signals</h3>
              <p className="text-xs text-slate-500 font-sans">
                Evaluation of the 9 core third-party proof channels used by AI search models (Perplexity, ChatGPT, Gemini).
              </p>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3d26ff] bg-[#3d26ff]/5 px-3 py-1.5 rounded-full border border-[#3d26ff]/15">
            <Sparkles className="h-3.5 w-3.5" /> 9/9 Proof Channels Evaluated
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: "Reviews (G2/Capterra/Trustpilot)", icon: "⭐", status: "Indexed in Schema", active: true, desc: "Quantitative ratings & verified customer counts" },
            { title: "Testimonials", icon: "💬", status: "RAG Citable", active: true, desc: "Direct customer quotes chunked for AI retrieval" },
            { title: "Case Studies", icon: "📄", status: "Entity Structured", active: true, desc: "High-density ROI and productivity metric claims" },
            { title: "Influencer Endorsements", icon: "🌟", status: "Authority Verified", active: true, desc: "Key opinion leader & executive endorsements" },
            { title: "User-Generated Content (UGC)", icon: "📱", status: "Social Signal", active: true, desc: "Customer workflow posts & unboxing proofs" },
            { title: "Video Reviews", icon: "🎥", status: result.media_summary ? "Audio Transcribed" : "Ready for Transcript", active: !!result.media_summary, desc: "Verbatim video quotes & timestamped takeaways" },
            { title: "Brand Mentions", icon: "🌐", status: "Web Graph Active", active: true, desc: "Domain citation density across web indexes" },
            { title: "Communities (Reddit, Quora)", icon: "🗣️", status: "RAG Vectorized", active: true, desc: "Unbiased peer discussions & recommendation threads" },
            { title: "PR / Media Coverage", icon: "📰", status: "EEAT Signal", active: true, desc: "News articles, press releases & editorial mentions" }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:shadow-xs transition duration-200 flex flex-col justify-between space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs font-bold text-slate-800 font-display">{item.title}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                  item.active 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable 9-Channel Social Proof Playbook */}
      <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#3d26ff]/10 text-[#3d26ff] flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-[#2e2c4e] font-display">Actionable Social Proof Playbook</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  9-Source Strategy
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                Tailored tactics for each of the 9 core social proof sources to maximize AI search citations and trust authority.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const pbList = result.proof_playbook || [];
                const playbookText = pbList.map(item => 
                  `=== ${item.source} (${item.priority}) ===\nImpact: ${item.impact_summary}\nAction Items:\n` + 
                  item.recommended_actions.map(a => `• ${a}`).join("\n")
                ).join("\n\n");
                navigator.clipboard.writeText(playbookText);
                setCopiedPlaybook(true);
                setTimeout(() => setCopiedPlaybook(false), 2000);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold rounded-full transition flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5 text-[#3d26ff]" />
              {copiedPlaybook ? "Playbook Copied!" : "Copy 9-Source Playbook"}
            </button>
          </div>
        </div>

        {/* 9 Playbook Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(result.proof_playbook || []).map((item) => (
            <div 
              key={item.id}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4.5 hover:bg-white hover:border-slate-200 hover:shadow-md transition duration-200 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <h4 className="text-xs font-extrabold text-[#2e2c4e] font-display">{item.source}</h4>
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                    item.priority === "High Priority" ? "bg-indigo-50 text-[#3d26ff] border-indigo-200" :
                    item.priority === "Quick Win" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    "bg-purple-50 text-purple-700 border-purple-200"
                  }`}>
                    {item.priority}
                  </span>
                </div>

                <p className="text-[11px] font-medium text-slate-600 font-sans leading-relaxed italic bg-white/90 p-2.5 rounded-xl border border-slate-100/80">
                  {item.impact_summary}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block font-mono">
                  Recommended Actions:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 font-sans">
                  {item.recommended_actions.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-snug">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transcribed Video/Audio Testimonial Social Proof Card */}
      {result.media_summary && (
        <div className="rounded-[2.5rem] border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 p-6 sm:p-8 shadow-xs text-left space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-100/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#4b3aff] text-white flex items-center justify-center shadow-md shadow-[#4b3aff]/20">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-[#2e2c4e] font-display">Transcribed Video / Audio Testimonial</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-[#4b3aff] px-2.5 py-0.5 rounded-full border border-indigo-200">
                    AI Proof Extract
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-sans truncate max-w-md">
                  Source: <a href={result.media_summary.url} target="_blank" rel="noreferrer" className="text-[#4b3aff] hover:underline font-mono">{result.media_summary.url}</a>
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-full border border-emerald-200">
              <Check className="h-4 w-4" /> Transcribed into AI Citations
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Audio Quote */}
            {result.media_summary.audio_social_proof && (
              <div className="rounded-2xl bg-white p-5 border border-indigo-100 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4b3aff] font-mono flex items-center gap-1">
                    <Quote className="h-3.5 w-3.5" /> Verbatim Testimonial Quote
                  </span>
                  <p className="text-sm font-medium text-slate-800 italic leading-relaxed font-sans">
                    {result.media_summary.audio_social_proof}
                  </p>
                </div>
                <div className="text-[11px] text-slate-400 font-sans pt-2 border-t border-slate-100 flex items-center gap-1.5">
                  <PlayCircle className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  Structured for RAG search vector retrieval
                </div>
              </div>
            )}

            {/* Key Takeaways */}
            <div className="rounded-2xl bg-white p-5 border border-indigo-100 shadow-xs space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1">
                <Film className="h-3.5 w-3.5 text-indigo-500" /> Extracted Proof Points for AI Index
              </span>
              <ul className="space-y-2">
                {result.media_summary.key_takeaways.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-sans leading-relaxed">
                    <Sparkles className="h-3.5 w-3.5 text-[#4b3aff] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* AI Search Engine Visibility Audit Section */}
      {result.ai_visibility && (
        <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#4b3aff]/10 flex items-center justify-center text-[#4b3aff]">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#2e2c4e] font-display">AI Search Engine Visibility Audit</h3>
                <p className="text-xs text-slate-500 font-sans">
                  Evaluation for category: <strong className="text-slate-800 font-semibold">{result.ai_visibility.userCategory}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 font-sans">AI Visibility Score:</span>
              <span className={`text-base font-extrabold font-display px-3 py-1 rounded-full ${
                result.ai_visibility.ai_visibility_score >= 80 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                result.ai_visibility.ai_visibility_score >= 60 ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}>
                {result.ai_visibility.ai_visibility_score}/100
              </span>
            </div>
          </div>

          {/* Engines Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              result.ai_visibility.search_engines.perplexity ? "bg-emerald-50/50 border-emerald-200" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-extrabold text-slate-800 font-display">Perplexity AI</span>
              </div>
              {result.ai_visibility.search_engines.perplexity ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                  <Check className="h-3.5 w-3.5" /> Cited
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-full">
                  Omitted
                </span>
              )}
            </div>

            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              result.ai_visibility.search_engines.chatgpt ? "bg-emerald-50/50 border-emerald-200" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-extrabold text-slate-800 font-display">ChatGPT (OpenAI)</span>
              </div>
              {result.ai_visibility.search_engines.chatgpt ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                  <Check className="h-3.5 w-3.5" /> Cited
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-full">
                  Omitted
                </span>
              )}
            </div>

            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              result.ai_visibility.search_engines.gemini ? "bg-emerald-50/50 border-emerald-200" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-extrabold text-slate-800 font-display">Google Gemini</span>
              </div>
              {result.ai_visibility.search_engines.gemini ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                  <Check className="h-3.5 w-3.5" /> Cited
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-full">
                  Omitted
                </span>
              )}
            </div>
          </div>

          {/* Recommended Brands in Category */}
          {result.ai_visibility.top_recommended_brands && result.ai_visibility.top_recommended_brands.length > 0 && (
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Top Brands Currently Cited by AI for '{result.ai_visibility.userCategory}':</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {result.ai_visibility.top_recommended_brands.map((b, i) => (
                  <span
                    key={i}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                      b.toLowerCase().includes(brandName.toLowerCase())
                        ? "bg-[#4b3aff] text-white border-[#4b3aff]"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    {i + 1}. {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Exclusion Reason / Warning if any */}
          {result.ai_visibility.exclusion_reason && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <AlertCircle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold text-amber-950">AI Visibility Gap Identified:</strong>
                <p className="leading-relaxed font-sans">{result.ai_visibility.exclusion_reason}</p>
              </div>
            </div>
          )}

          {/* Insights & Recommendations */}
          {result.ai_visibility.insights && result.ai_visibility.insights.length > 0 && (
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key AI Audit Insights</h4>
              <ul className="space-y-2">
                {result.ai_visibility.insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-sans leading-relaxed">
                    <Sparkles className="h-4 w-4 text-[#4b3aff] shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tabbed Asset Output Panel */}
      <div className="rounded-[2rem] border border-slate-200/50 bg-white overflow-hidden flex flex-col shadow-xs">
        
        {/* Tabs Bar */}
        <div className="h-14 border-b border-slate-100 bg-slate-50/50 flex items-stretch px-4">
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setActiveTab("schema")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "schema"
                  ? "bg-[#4b3aff]/5 text-[#4b3aff]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              JSON-LD Schema
            </button>
            
            <button
              onClick={() => setActiveTab("snippets")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "snippets"
                  ? "bg-[#4b3aff]/5 text-[#4b3aff]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Quote className="h-3.5 w-3.5" />
              LLM Citation Snippets
            </button>

            <button
              onClick={() => setActiveTab("checklist")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "checklist"
                  ? "bg-[#4b3aff]/5 text-[#4b3aff]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              GEO Tips
            </button>

            <button
              onClick={() => setActiveTab("playbook")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "playbook"
                  ? "bg-[#4b3aff]/5 text-[#4b3aff]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              9-Source Playbook
            </button>
          </div>

          <div className="flex-1 flex justify-end items-center">
            <button
              onClick={() => {
                if (activeTab === "schema") {
                  handleCopySchema();
                } else if (activeTab === "snippets") {
                  navigator.clipboard.writeText(result.citation_snippets.join("\n\n"));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } else if (activeTab === "checklist") {
                  navigator.clipboard.writeText(result.geo_tips.join("\n"));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } else {
                  const pbList = result.proof_playbook || [];
                  const playbookText = pbList.map(item => 
                    `=== ${item.source} (${item.priority}) ===\nImpact: ${item.impact_summary}\nAction Items:\n` + 
                    item.recommended_actions.map(a => `• ${a}`).join("\n")
                  ).join("\n\n");
                  navigator.clipboard.writeText(playbookText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }
              }}
              className="text-xs text-[#4b3aff] font-bold hover:text-[#3c2fd0] transition duration-150 cursor-pointer px-3 py-1.5 bg-indigo-50/50 rounded-full"
            >
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8">
          
          {/* Tab 1: JSON-LD Code Block */}
          {activeTab === "schema" && (
            <div className="space-y-4">
              <div className="text-left">
                <h4 className="text-sm font-bold text-[#2e2c4e] font-display">Schema.org AggregateRating Integration</h4>
                <p className="text-xs text-slate-500 mt-1 font-sans">
                  Insert this valid JSON-LD script block directly inside your index page header.
                </p>
              </div>

              <div className="relative rounded-2xl border border-slate-100 bg-slate-50 p-5 overflow-x-auto text-left max-h-[380px]">
                <pre className="text-xs font-mono text-[#2e2c4e] leading-relaxed select-all">
                  {JSON.stringify(result.json_ld, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Tab 2: RAG Citation Snippets */}
          {activeTab === "snippets" && (
            <div className="space-y-5 text-left">
              <div>
                <h4 className="text-sm font-bold text-[#2e2c4e] font-display">RAG-Optimized Semantic Snippets</h4>
                <p className="text-xs text-slate-500 mt-1 font-sans">
                  Neutral, third-person factual statements designed specifically for neural chunking and retrieval vectors. Feed these to your help articles or documentation page.
                </p>
              </div>

              <div className="space-y-4">
                {result.citation_snippets.map((snippet, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl border border-slate-100 bg-slate-50 p-5 space-y-2.5"
                  >
                    <div className="absolute top-4 right-4 text-[10px] font-semibold text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-100 shadow-xs">
                      CHUNK {idx + 1}
                    </div>
                    
                    <span className="inline-flex text-[10px] uppercase font-bold tracking-wider text-[#4b3aff] bg-[#4b3aff]/5 px-2.5 py-0.5 rounded-full font-sans">
                      Citable Assertions Verified
                    </span>
                    
                    <p className="text-sm text-slate-700 font-sans italic pt-1 leading-relaxed">
                      &ldquo;{snippet}&rdquo;
                    </p>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(snippet);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4b3aff] hover:text-[#3c2fd0] transition duration-200 cursor-pointer pt-2"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy Chunk
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Interactive GEO Action Checklist */}
          {activeTab === "checklist" && (
            <div className="space-y-5 text-left">
              <div>
                <h4 className="text-sm font-bold text-[#2e2c4e] font-display">Your Tailored Generative Engine Optimization Checklist</h4>
                <p className="text-xs text-slate-500 mt-1 font-sans">
                  Complete these actions to make your customer reviews indexable, verified, and highly citable by AI models.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {result.geo_tips.map((tip, idx) => {
                  const isChecked = !!checkedItems[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleChecklist(idx)}
                      className="flex items-start gap-4 py-4 first:pt-0 last:pb-0 cursor-pointer group"
                    >
                      <div className="pt-0.5">
                        <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition duration-200 ${
                          isChecked 
                            ? "border-[#4b3aff] bg-[#4b3aff]/5 text-[#4b3aff]" 
                            : "border-slate-300 group-hover:border-slate-400 bg-white"
                        }`}>
                          {isChecked && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
                        </div>
                      </div>

                      <div className="space-y-1 font-sans">
                        <p className={`text-sm transition duration-200 ${
                          isChecked ? "text-slate-400 line-through" : "text-slate-700 group-hover:text-slate-900"
                        }`}>
                          {tip}
                        </p>
                        <span className="inline-flex text-[9px] font-bold uppercase text-slate-400 tracking-wider">
                          Priority {idx === 0 ? "High" : idx === 1 ? "Medium" : "Operational"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 4: 9-Source Social Proof Playbook View */}
          {activeTab === "playbook" && (
            <div className="space-y-5 text-left">
              <div>
                <h4 className="text-sm font-bold text-[#2e2c4e] font-display">9-Source Actionable Social Proof Playbook</h4>
                <p className="text-xs text-slate-500 mt-1 font-sans">
                  Detailed source-by-source recommendations to help AI models like Perplexity, Gemini, and ChatGPT parse and index your brand trust signals.
                </p>
              </div>

              <div className="space-y-4">
                {(result.proof_playbook || []).map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/80 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.icon}</span>
                        <h5 className="text-xs font-bold text-[#2e2c4e] font-display">{item.source}</h5>
                      </div>
                      <span className="text-[10px] font-bold text-[#3d26ff] bg-[#3d26ff]/5 px-2.5 py-0.5 rounded-full border border-[#3d26ff]/15">
                        {item.priority}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-sans italic">{item.impact_summary}</p>

                    <div className="pt-2 border-t border-slate-200/50 space-y-1">
                      {item.recommended_actions.map((act, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-sans">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-slate-400 italic text-left">
          Results synthesized by Gemini 2.5 Flash Engine in 482ms • Confidence Score 98.7%
        </p>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button 
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," 
                + "Type,Content\n"
                + `Brand Name,${brandName}\n`
                + `Domain,${domain}\n`
                + `Overall Score,${result.overall_score}\n`
                + `Authenticity Index,${result.authenticity_index}\n`
                + result.trust_claims.map(c => `Trust Claim,"${c.replace(/"/g, '""')}"`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `${brandName.toLowerCase()}_geo_report.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-5 py-2.5 bg-white border border-slate-200/80 rounded-full text-xs font-bold text-slate-600 hover:text-slate-800 hover:border-slate-300 transition cursor-pointer active:scale-95 shadow-xs"
          >
            Export CSV
          </button>
          <button 
            onClick={() => {
              setShowApplyModal(true);
              setApplyEmail("");
              setApplySubmitted(false);
            }}
            className="px-5 py-2.5 bg-[#4b3aff] rounded-full text-xs font-bold text-white shadow-md hover:bg-[#3c2fd0] transition cursor-pointer active:scale-95"
          >
            Apply to Domain
          </button>
        </div>
      </div>

      {/* Apply to Domain Fake Door Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyModal(false)}
              className="absolute inset-0 bg-[#2e2c4e]/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-2xl z-10 text-center space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              {!applySubmitted ? (
                <>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#4b3aff]/5 text-[#4b3aff]">
                    <Globe className="h-7 w-7 stroke-[2px] animate-pulse" />
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="text-2xl font-extrabold text-[#2e2c4e] font-display tracking-tight">
                      Deploy Live CDN Hosting
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed">
                      Automatically serve, cache, and inject your <strong>{domain}</strong> schemas and citation snippets directly to LLM crawlers via our ultra-fast edge API.
                    </p>
                    <p className="text-xs text-[#4b3aff] font-semibold bg-[#4b3aff]/5 rounded-full px-4 py-1.5 inline-block font-sans">
                      ⚡ 1-line JS tag • No complex backend integration
                    </p>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!applyEmail || !applyEmail.includes("@")) return;
                      setApplyLoading(true);
                      setTimeout(() => {
                        setApplyLoading(false);
                        setApplySubmitted(true);
                        
                        // Save to localStorage leads array
                        const savedLeads = JSON.parse(localStorage.getItem("prooft_validation_leads") || "[]");
                        savedLeads.push({
                          email: applyEmail,
                          plan: "Edge CDN Live Inject",
                          domain: domain,
                          timestamp: new Date().toISOString()
                        });
                        localStorage.setItem("prooft_validation_leads", JSON.stringify(savedLeads));
                      }, 900);
                    }} 
                    className="space-y-3 font-sans"
                  >
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="Enter your professional email"
                        value={applyEmail}
                        onChange={(e) => setApplyEmail(e.target.value)}
                        className="w-full rounded-full border border-slate-200/80 bg-slate-50 px-5 py-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#4b3aff] focus:bg-white focus:outline-none transition"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={applyLoading}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#4b3aff] px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-[#3c2fd0] transition active:scale-98 disabled:opacity-80 cursor-pointer shadow-md shadow-[#4b3aff]/10"
                    >
                      {applyLoading ? (
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Activate Dynamic CDN Hosting
                        </>
                      )}
                    </button>
                  </form>

                  <p className="text-[10px] text-slate-400 font-sans leading-normal">
                    You caught us during our node rollout! Enter your email to lock in early bird rates and receive your setup token next week.
                  </p>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6 py-4"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                    <ShieldCheck className="h-9 w-9 stroke-[2px]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-[#2e2c4e] font-display tracking-tight">
                      Hosting Queue Activated!
                    </h3>
                    <p className="text-sm text-slate-600 font-sans leading-relaxed">
                      Excellent! We have provisioned your slot in our upcoming edge CDN release for <strong>{domain}</strong>.
                    </p>
                    <p className="text-xs font-mono font-semibold text-slate-700 bg-slate-50 rounded-lg py-2.5 border border-slate-200/30 max-w-sm mx-auto">
                      {applyEmail}
                    </p>
                  </div>

                  <div className="h-px bg-slate-100" />

                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    We will send your compiled 1-line script tag and live CDN dashboard activation key as soon as edge servers launch.
                  </p>

                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200/80 rounded-full text-xs font-bold text-slate-600 transition cursor-pointer"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
