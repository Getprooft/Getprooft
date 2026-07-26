import { Database, Workflow, MessageSquare } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Ingest Proof",
      description: "Ingest reviews (G2, Capterra, Trustpilot), testimonials, case studies, influencer endorsements, UGC, video reviews, brand mentions, community threads (Reddit, Quora), and PR/media coverage.",
      icon: <Database className="h-5 w-5 text-[#4b3aff]" />,
    },
    {
      step: "02",
      title: "Synthesize AI Signals",
      description: "Prooft extracts verified claims and generates schema.org markup plus neutral, retrieval-ready citation snippets.",
      icon: <Workflow className="h-5 w-5 text-[#4b3aff]" />,
    },
    {
      step: "03",
      title: "Get Cited in AI Answers",
      description: "Publish the output so ChatGPT, Perplexity, and Gemini retrieve and cite your brand in their answer summaries.",
      icon: <MessageSquare className="h-5 w-5 text-[#4b3aff]" />,
    },
  ];

  return (
    <section id="how-it-works" className="border-t border-slate-200/50 bg-[#f4f3ed] py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="mx-auto max-w-7xl text-center">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#2e2c4e]">
            How it works
          </h2>
          <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
            Three steps from raw customer proof to AI-engine citations.
          </p>
        </div>

        {/* Workflow steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch relative max-w-5xl mx-auto">
          {steps.map((item, index) => (
            <div
              key={index}
              className="relative rounded-[2rem] border border-slate-200/50 bg-white/40 p-8 text-left transition hover:bg-white hover:shadow-xs"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4b3aff]/5">
                  {item.icon}
                </div>
                <span className="font-display text-base font-medium text-slate-300 tracking-tight">{item.step}</span>
              </div>

              <h3 className="text-base font-bold text-[#2e2c4e] font-display mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

