import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Loader2, Search, Upload, FileText, X, Video, Film, ChevronDown, MessageSquare, ArrowRight } from "lucide-react";
import { AuditInput, AnalysisResult } from "../types";
import { SAMPLE_DATASETS } from "../data";

interface HeroProps {
  onAnalyzeStart: (input: AuditInput) => void;
  onAnalyzeComplete: (result: AnalysisResult) => void;
  isLoading: boolean;
}

export default function Hero({ onAnalyzeStart, onAnalyzeComplete, isLoading }: HeroProps) {
  const [brandName, setBrandName] = useState("");
  const [userCategory, setUserCategory] = useState("");
  const [reviews, setReviews] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // Accordion state for optional social proof & video link inputs
  const [isSocialProofOpen, setIsSocialProofOpen] = useState(false);
  const [isVideoProofOpen, setIsVideoProofOpen] = useState(false);

  // Rotating words list with smooth typewriter effect
  const rotatingWords = [
    "trust.",
    "understand.",
    "verify."
  ];
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = rotatingWords[wordIndex];

    if (!isDeleting && displayedText === currentWord) {
      // Pause at full word for 3.5 seconds
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 3500);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayedText === "") {
      // Move to next word index
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
      return;
    }

    // Typing speed: 85ms per character, deletion: 40ms per character
    const speed = isDeleting ? 40 : 85;
    const timeout = setTimeout(() => {
      setDisplayedText(
        isDeleting
          ? currentWord.slice(0, displayedText.length - 1)
          : currentWord.slice(0, displayedText.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, wordIndex]);

  // Cycle through loading micro-steps
  const loadingMessages = [
    "Searching G2, Trustpilot & web for verified brand reviews...",
    "Transcribing video/audio testimonials into AI-usable trust points...",
    "Auditing AI engine citations (Perplexity, ChatGPT, Gemini)...",
    "Scanning public web content for quantitative rating entities...",
    "Synthesizing standard Schema.org AggregateRating Product metadata...",
    "Drafting citation-optimized RAG snippets...",
    "Finalizing Generative Engine Optimization indexability report..."
  ];

  const handleSelectSample = (sampleId: string) => {
    const dataset = SAMPLE_DATASETS.find((d) => d.id === sampleId);
    if (dataset) {
      setBrandName(dataset.brandName);
      setUserCategory(dataset.userCategory);
      setReviews(dataset.reviews);
      setMediaUrl("https://youtube.com/watch?v=demo_testimonial_customer_review");
      setUploadedFileName(null);
      setError(null);
      setIsSocialProofOpen(true);
      setIsVideoProofOpen(true);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError("Please upload a .csv file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setReviews(text);
        setUploadedFileName(file.name);
        setError(null);
        setIsSocialProofOpen(true);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) {
      setError("Please provide your Brand Name.");
      return;
    }
    if (!userCategory.trim()) {
      setError("Please provide your Category / Industry.");
      return;
    }

    setError(null);
    const generatedDomain = `${brandName.trim().toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
    const input: AuditInput = {
      brandName: brandName.trim(),
      userCategory: userCategory.trim(),
      domain: generatedDomain,
      reviews: reviews.trim(),
      mediaUrl: mediaUrl.trim()
    };
    onAnalyzeStart(input);

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingMessages.length - 1) {
        currentStep++;
        setLoadingStep(currentStep);
      } else {
        clearInterval(interval);
      }
    }, 1200);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        throw new Error("Analysis request failed.");
      }
      
      const data = await response.json();
      clearInterval(interval);
      onAnalyzeComplete(data);
    } catch (err) {
      console.error("API error during submit:", err);
      clearInterval(interval);
      setError("An error occurred connecting to the backend. Please try again.");
    }
  };

  return (
    <section id="try-it-now" className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#f4f3ed] overflow-hidden">
      <div className="mx-auto max-w-7xl relative">
        
        {/* COMPOSITE GRAPHICAL HERO SECTION */}
        <div className="relative max-w-5xl mx-auto pt-4 pb-8 min-h-[460px] sm:min-h-[520px] flex flex-col items-center justify-center">
          
          {/* FLOATING LEFT ELEMENT: Oval Guy Avatar */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden xl:block absolute left-0 top-12 z-10"
          >
            <div className="relative">
              {/* Vertical Capsule Portrait - Young Woman 1 */}
              <div className="w-28 h-56 rounded-[100px] border-[3px] border-[#e8e6dc] overflow-hidden shadow-lg bg-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=700" 
                  alt="User proof portrait woman"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Chat Dots Badge Top-Left */}
              <div className="absolute -top-3 -left-4 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-md border border-slate-100 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#4b3aff]" />
                <span className="h-2 w-2 rounded-full bg-[#4b3aff]" />
                <span className="h-2 w-2 rounded-full bg-[#4b3aff]" />
              </div>

              {/* Floating Heart Counter Badge Bottom-Right */}
              <div className="absolute -bottom-2 -right-4 rounded-full bg-white/95 backdrop-blur-sm px-3.5 py-1.5 shadow-md border border-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="text-red-500">❤️</span> 2580
              </div>
            </div>
          </motion.div>

          {/* FLOATING TOP CENTER BADGE: 8600 star */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex absolute left-[38%] top-2 z-20 items-center gap-1.5 bg-white border border-slate-100 rounded-full py-1 px-3.5 shadow-xs text-xs font-bold text-slate-700"
          >
            <span className="text-amber-400">★</span> 8600
          </motion.div>

          {/* FLOATING MIDDLE CENTER-RIGHT BADGE: Brand mentions */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden lg:flex absolute left-[52%] bottom-16 z-20 items-center gap-2 bg-white/90 backdrop-blur-sm border border-slate-100 rounded-full py-1.5 px-4 shadow-xs text-xs font-medium text-slate-700"
          >
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            Brand mentions
          </motion.div>

          {/* FLOATING TOP RIGHT ELEMENT: Circular woman avatar with review tag - Young Woman 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block absolute right-6 xl:right-16 top-8 z-10"
          >
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-2 border-white shadow-md overflow-hidden bg-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=300&h=300"
                  alt="Verified reviewer avatar woman"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Verified Badge */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-extrabold border-2 border-white">
                ✓
              </div>
              {/* Floating Reviews Badge */}
              <div className="absolute -top-1 -right-16 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 shadow-xs border border-slate-100 text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <span className="text-emerald-500 font-extrabold">★</span> Reviews
              </div>
            </div>
          </motion.div>

          {/* FLOATING RIGHT BOTTOM ELEMENT: Green Woman Card - Young Woman 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block absolute -right-12 xl:-right-24 bottom-0 z-20"
          >
            <div className="relative">
              {/* Green Card */}
              <div className="rounded-[2.2rem] bg-white p-3.5 shadow-lg border border-slate-100 w-56 sm:w-64">
                <div className="rounded-[1.6rem] bg-[#00b069] h-48 overflow-hidden relative flex items-end justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500&h=600"
                    alt="Customer story woman"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex items-center gap-3 pt-3 px-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="Avatar" />
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100" alt="Avatar" />
                  </div>
                  <div className="text-amber-500 text-xs tracking-wider">
                    ★★★★★
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* MAIN HEADLINE COMPOSITION */}
          <div className="text-center max-w-3xl mx-auto space-y-5 relative z-10 pt-2">
            
            <h1 className="font-display text-2xl sm:text-4xl md:text-[52px] font-semibold tracking-tight text-[#2e2c4e] leading-[1.2] select-none max-w-3xl mx-auto">
              AI search engines choose brands they can{" "}
              <span className="text-[#3d26ff] font-extrabold inline-flex items-center">
                {displayedText}
                <span className="ml-1 sm:ml-1.5 inline-block w-[3px] sm:w-[4px] h-[0.7em] bg-[#3d26ff] animate-pulse rounded-full align-middle" />
              </span>
            </h1>

            {/* Subtext - 24px Regular font weight */}
            <div className="space-y-3 pt-2 max-w-2xl mx-auto text-center">
              <p className="text-xl sm:text-[24px] sm:leading-[1.35] text-[#2e2c4e] font-sans font-normal">
                Prooft turns your social / third-party proof into readable trust signals that AI models use.
              </p>
              <p className="text-sm sm:text-base text-slate-500 font-sans font-normal tracking-wide">
                Focus on clarity. Show proof. Build trust.
              </p>
            </div>
          </div>

        </div>

        {/* Interactive Audit Input Panel */}
        <div id="audit-form" className="mx-auto max-w-3xl mt-4 sm:mt-8 relative z-30">
          <div className="relative rounded-[2.5rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-[0_25px_60px_rgba(46,44,78,0.06)]">
            
            <AnimatePresence mode="wait">
              {!isLoading ? (
                <motion.form
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Header bar of box */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-2 text-[#2e2c4e]">
                        <Sparkles className="h-4.5 w-4.5 text-[#3d26ff]" />
                        <span className="text-base sm:text-lg font-extrabold font-display">Check AI Visibility</span>
                      </div>
                      <span className="text-xs text-[#3d26ff] font-sans font-semibold ml-6">
                        + Generate AI readable trust data
                      </span>
                    </div>

                    {/* Pre-filled Sample Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-slate-400 font-normal mr-1">Quick samples:</span>
                      {SAMPLE_DATASETS.map((dataset) => (
                        <button
                          key={dataset.id}
                          type="button"
                          onClick={() => handleSelectSample(dataset.id)}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 transition hover:border-[#3d26ff]/40 hover:bg-[#3d26ff]/5 active:scale-95 cursor-pointer font-sans font-normal"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#3d26ff]" />
                          {dataset.brandName}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inputs Grid: Brand & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-700 font-sans">Brand *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your brand name..."
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200/90 bg-white py-3.5 px-4 text-sm text-[#2e2c4e] placeholder:text-slate-400 font-sans focus:border-[#3d26ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d26ff]/15 shadow-2xs transition"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-700 font-sans">Category/Industry *</label>
                      <input
                        type="text"
                        required
                        placeholder="Software category, SaaS..."
                        value={userCategory}
                        onChange={(e) => setUserCategory(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200/90 bg-white py-3.5 px-4 text-sm text-[#2e2c4e] placeholder:text-slate-400 font-sans focus:border-[#3d26ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d26ff]/15 shadow-2xs transition"
                      />
                    </div>
                  </div>

                  {/* Optional Accordion 1: Social Proof / Customer Reviews */}
                  <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden text-left transition shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setIsSocialProofOpen(!isSocialProofOpen)}
                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/80 transition cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageSquare className="h-4 w-4 text-[#3d26ff] shrink-0" />
                        <span className="text-xs font-bold text-slate-800 font-sans">Social proof</span>
                        <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          Optional
                        </span>
                        {(reviews.trim() || uploadedFileName) && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Added
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isSocialProofOpen && (
                          <label
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#3d26ff] hover:text-[#2d1cd0] cursor-pointer bg-[#3d26ff]/5 hover:bg-[#3d26ff]/10 border border-[#3d26ff]/20 px-3 py-0.5 rounded-full transition"
                          >
                            <Upload className="h-3 w-3" />
                            <span>Upload CSV</span>
                            <input
                              type="file"
                              accept=".csv"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isSocialProofOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isSocialProofOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4 pt-1 space-y-2 border-t border-slate-100 bg-white"
                        >
                          {uploadedFileName && (
                            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-2 text-xs text-emerald-900 font-sans font-normal">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                                <span>Uploaded: <strong>{uploadedFileName}</strong></span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setUploadedFileName(null);
                                  setReviews("");
                                }}
                                className="text-emerald-700 hover:text-emerald-950 p-1 rounded-full hover:bg-emerald-100 cursor-pointer"
                                title="Remove file"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}

                          <textarea
                            rows={3}
                            placeholder="Paste your reviews, ratings, testimonials from G2, Trustpilot... if left blank, we'll run an automated web search for social proof"
                            value={reviews}
                            onChange={(e) => {
                              setReviews(e.target.value);
                              if (uploadedFileName) setUploadedFileName(null);
                            }}
                            className="w-full bg-slate-50/60 border border-slate-200/80 rounded-2xl p-3.5 text-sm text-[#2e2c4e] placeholder:text-slate-400 font-sans focus:outline-none focus:border-[#3d26ff] focus:bg-white focus:ring-2 focus:ring-[#3d26ff]/15 resize-none leading-relaxed transition"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Optional Accordion 2: Video / Audio Testimonial Link Field */}
                  <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden text-left transition shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setIsVideoProofOpen(!isVideoProofOpen)}
                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/80 transition cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <Video className="h-4 w-4 text-[#3d26ff] shrink-0" />
                        <span className="text-xs font-bold text-slate-800 font-sans">Link Video or Audio Testimonial</span>
                        <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          Optional
                        </span>
                        {mediaUrl.trim() && (
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                            Linked
                          </span>
                        )}
                      </div>

                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isVideoProofOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isVideoProofOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4 pt-1 space-y-2 border-t border-slate-100 bg-white"
                        >
                          <input
                            type="url"
                            placeholder="Paste YouTube, Loom, MP3, or Podcast link to transcribe into social proof..."
                            value={mediaUrl}
                            onChange={(e) => setMediaUrl(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/60 py-3 px-4 text-sm text-[#2e2c4e] placeholder:text-slate-400 font-sans focus:border-[#3d26ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d26ff]/15 transition"
                          />
                          <p className="text-[11px] text-slate-500 font-sans flex items-center gap-1 pt-1">
                            <Film className="h-3 w-3 text-indigo-500 shrink-0" />
                            Prooft will transcribe audio/video testimonials into machine-usable proof for AI search.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600 font-sans">
                      {error}
                    </div>
                  )}

                  {/* Submit CTA - Aligned Right with White Circle Arrow Icon */}
                  <div className="flex flex-col items-end pt-2 space-y-1.5">
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-3 rounded-full bg-[#3d26ff] hover:bg-[#2d1cd0] pl-6 pr-1.5 py-1.5 text-sm font-extrabold text-white shadow-lg shadow-[#3d26ff]/25 hover:shadow-xl hover:shadow-[#3d26ff]/35 transition-all duration-200 active:scale-95 cursor-pointer font-display"
                    >
                      <span className="tracking-tight">Run Audit</span>
                      <div className="h-8 w-8 rounded-full bg-white text-[#3d26ff] flex items-center justify-center transition group-hover:scale-105 shadow-xs">
                        <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                      </div>
                    </button>
                    <p className="text-[11px] text-slate-400 text-right font-sans font-normal">
                      Scans web reviews, audio/video proof & audits AI search engine visibility.
                    </p>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 space-y-6"
                >
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-2 border-slate-100 border-t-[#4b3aff] animate-spin" />
                    <Loader2 className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-[#4b3aff] animate-pulse" />
                  </div>

                  <div className="space-y-2 text-center max-w-sm">
                    <h3 className="font-display text-lg font-bold text-[#2e2c4e]">Prooft Engine Analyzing...</h3>
                    
                    {/* Step Indicator Animation */}
                    <div className="h-6 overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={loadingStep}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="text-xs font-mono text-[#4b3aff]"
                        >
                          {loadingMessages[loadingStep]}
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    {/* Skeleton Progress Lines */}
                    <div className="flex gap-1.5 justify-center pt-2">
                      {loadingMessages.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 w-10 rounded-full transition-all duration-300 ${
                            idx <= loadingStep ? "bg-[#4b3aff]" : "bg-slate-100"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="w-full border-t border-slate-100 pt-4 text-center">
                    <p className="text-[10px] font-mono text-slate-400">
                      Analyzing semantic entities for Perplexity & Gemini citation indexes
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Combined Automated Web Search Scanner & Supported Proof Sources Banner */}
          <div className="mt-5 rounded-2xl sm:rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50/90 via-white to-purple-50/70 p-4.5 sm:p-5 shadow-xs text-left space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#3d26ff]/10 text-[#3d26ff] flex items-center justify-center shrink-0 mt-0.5">
                <Search className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-1 text-left flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className="font-extrabold text-[#2e2c4e] text-sm font-display">Automated Web Social Proof Scanner</strong>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Live Active
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed font-sans text-xs font-normal">
                  Prooft automatically scans and indexes 9 core social & third-party proof sources for <strong className="text-slate-800">{brandName.trim() || "your brand"}</strong> to convert into AI-readable trust signals:
                </p>
              </div>
            </div>

            {/* 9 Social & Third-Party Proof Sources Pills */}
            <div className="pt-1 flex flex-wrap gap-1.5 border-t border-indigo-100/60 sm:ml-12">
              {[
                { label: "Reviews (G2 / Capterra / Trustpilot)", icon: "⭐" },
                { label: "Testimonials", icon: "💬" },
                { label: "Case Studies", icon: "📄" },
                { label: "Influencer Endorsements", icon: "🌟" },
                { label: "UGC", icon: "📱" },
                { label: "Video Reviews", icon: "🎥" },
                { label: "Brand Mentions", icon: "🌐" },
                { label: "Communities (Reddit, Quora)", icon: "🗣️" },
                { label: "PR / Media Coverage", icon: "📰" }
              ].map((proof, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white/90 border border-slate-200/80 px-2.5 py-1 rounded-lg shadow-2xs font-sans hover:border-[#3d26ff]/30 transition"
                >
                  <span className="text-xs">{proof.icon}</span>
                  <span>{proof.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

