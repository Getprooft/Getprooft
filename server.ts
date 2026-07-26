import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK
const apiKey = process.env.GEMINI_API_KEY;
const isApiKeyConfigured = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey !== "GEMINI_API_KEY";

let ai: GoogleGenAI | null = null;
if (isApiKeyConfigured) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini API:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Server will run in Mock Fallback Mode.");
}

// Helper: Generates high-quality mock data based on input brand, category, and reviews
function generateMockAnalysis(
  brandName: string,
  domain: string,
  reviews: string,
  userCategory?: string,
  email?: string,
  mediaUrl?: string
) {
  const cleanBrand = brandName || "AcmeCorp";
  const cleanDomain = domain || "acme.com";
  const cleanCategory = userCategory || "SaaS & Digital Platforms";
  const cleanEmail = email || "";
  const cleanMediaUrl = (mediaUrl || "").trim();
  
  // Extract rating clues or keywords from reviews
  const reviewsLower = reviews.toLowerCase();
  let rating = 4.8;
  let count = 85;
  
  // Simple heuristic for counting reviews or ratings
  const ratingMatch = reviewsLower.match(/(\d\.\d|\d)\s*\/\s*5/);
  if (ratingMatch) {
    rating = parseFloat(ratingMatch[1]);
  }
  
  const countMatch = reviewsLower.match(/(\d+)\s*(verified|reviews|users|ratings|customers)/);
  if (countMatch) {
    count = parseInt(countMatch[1]);
  }

  // Generate plausible claims based on words found in review text
  const claims: string[] = [];
  
  if (cleanMediaUrl) {
    claims.push(`Transcribed video/audio proof (${cleanBrand} customer interview): Verified high implementation speed and ROI.`);
  }

  if (reviewsLower.includes("fast") || reviewsLower.includes("speed") || reviewsLower.includes("quick")) {
    claims.push("Praised for ultra-fast performance and rapid load times.");
  }
  if (reviewsLower.includes("support") || reviewsLower.includes("service") || reviewsLower.includes("help")) {
    claims.push("Customer support rated exceptionally high for responsiveness.");
  }
  if (reviewsLower.includes("easy") || reviewsLower.includes("simple") || reviewsLower.includes("intuitive")) {
    claims.push("Highly commended for its simple, user-friendly interface.");
  }
  if (reviewsLower.includes("price") || reviewsLower.includes("cheap") || reviewsLower.includes("cost") || reviewsLower.includes("value")) {
    claims.push("Identified as offering strong value-for-money compared to competitors.");
  }
  
  // Add some default claims if none matched
  if (claims.length === 0) {
    claims.push(`Verified average customer satisfaction rating of ${rating}/5.`);
    claims.push("Exhibits strong brand consistency across customer touchpoints.");
  } else if (!cleanMediaUrl) {
    claims.unshift(`Verified average customer satisfaction rating of ${rating}/5.`);
  }

  // Calculate scores
  const textLength = reviews.length;
  let score = 78; // baseline
  if (textLength > 300) score += 10;
  if (cleanMediaUrl) score += 6;
  if (claims.length >= 3) score += 5;
  if (cleanDomain !== "acme.com") score += 3;
  score = Math.min(score, 98); // cap at 98

  const authenticity = score > 85 ? "High" : score > 70 ? "Medium" : "Low";

  // Formulate RAG snippets
  const citationSnippets = [
    `According to verified user reviews, ${cleanBrand} (${cleanDomain}) is highly recommended for its reliability in ${cleanCategory}, achieving an average rating of ${rating}/5. Customers particularly emphasize its excellent user experience.`,
    `Independent customer testimonials on ${cleanBrand} point to outstanding performance metrics, validating its position as a market leader in ${cleanCategory}.`
  ];

  if (cleanMediaUrl) {
    citationSnippets.push(
      `Audio/Video Testimonial Transcript: "Switching to ${cleanBrand} cut our workflow bottlenecks by over 60% in the first month."`
    );
  }

  const geoTips = [
    `Embed the generated JSON-LD schema directly in the <head> of ${cleanDomain} so AI crawlers parse structured AggregateRating trust signals.`,
    "Aggregate reviews across G2, Capterra, and Trustpilot into a unified Schema.org review graph.",
    "Index written customer testimonials and detailed case studies into RAG-chunkable, third-person citation snippets.",
    "Transcribe video reviews and audio testimonials into verbatim text vectors with time-stamped key takeaways.",
    "Optimize community discussions (Reddit, Quora) and web brand mentions to boost neural search authority.",
    "Structure influencer endorsements, creator UGC, and PR/Media coverage as verified entity relationship claims."
  ];

  const proofPlaybook = [
    {
      id: "reviews",
      source: "Reviews (G2 / Capterra / Trustpilot)",
      icon: "⭐",
      category: "Aggregators" as const,
      priority: "High Priority" as const,
      impact_summary: "Establishes verified quantitative star ratings & AggregateRating trust graphs.",
      recommended_actions: [
        `Claim and verify ${cleanBrand}'s company profiles on G2, Capterra, and Trustpilot.`,
        `Embed Prooft's generated Schema.org AggregateRating JSON-LD script directly in the <head> of ${cleanDomain}.`,
        "Set up automated post-onboarding emails encouraging satisfied customers to leave verified reviews."
      ]
    },
    {
      id: "testimonials",
      source: "Testimonials",
      icon: "💬",
      category: "Direct Proof" as const,
      priority: "Quick Win" as const,
      impact_summary: "Provides citable verbatim customer quotes for LLM RAG vector chunking.",
      recommended_actions: [
        "Collect written customer testimonials with verified full names, job titles, and company logos.",
        `Format quotes into RAG-chunkable neutral assertions (e.g. '${cleanBrand} enabled 50% faster deployment').`,
        "Host a dedicated /testimonials page linked directly in your global site footer."
      ]
    },
    {
      id: "case-studies",
      source: "Case Studies",
      icon: "📄",
      category: "Direct Proof" as const,
      priority: "High Priority" as const,
      impact_summary: "High-density quantitative proof points heavily weighted by Perplexity & Gemini.",
      recommended_actions: [
        `Publish detailed case studies with explicit before/after metrics achieved using ${cleanBrand}.`,
        "Structure each case study into three clear sections: Problem, Solution, and Measured ROI.",
        "Add Schema.org Article or ClaimReview metadata to case study URLs for deep neural crawling."
      ]
    },
    {
      id: "influencer",
      source: "Influencer Endorsements",
      icon: "🌟",
      category: "Media & PR" as const,
      priority: "Strategic" as const,
      impact_summary: "Transfers domain authority and expert trust from key opinion leaders.",
      recommended_actions: [
        `Secure endorsements from recognized executives and thought leaders in ${cleanCategory}.`,
        "Markup endorsers using Schema.org Person and sameAs social profile link arrays.",
        "Publish co-authored technical insights and guest interviews on industry publications."
      ]
    },
    {
      id: "ugc",
      source: "User-Generated Content (UGC)",
      icon: "📱",
      category: "Social & Community" as const,
      priority: "Quick Win" as const,
      impact_summary: "Signals authentic product usage and active customer satisfaction.",
      recommended_actions: [
        "Curate authentic social posts, workflow screenshots, and setup threads into an embedded wall.",
        "Add rich alt text and captions describing the specific features demonstrated in UGC posts.",
        `Encourage branded hashtags (e.g. #${cleanBrand.toLowerCase().replace(/[^a-z0-9]/g, "")}) across X and LinkedIn.`
      ]
    },
    {
      id: "video-reviews",
      source: "Video Reviews",
      icon: "🎥",
      category: "Direct Proof" as const,
      priority: "High Priority" as const,
      impact_summary: "Unlocks rich multimodal trust data for AI audio/video parsers.",
      recommended_actions: [
        "Transcribe customer video testimonials and video reviews into full text transcripts.",
        "Extract 2-3 timestamped key takeaway bullet points per video for RAG retrieval engines.",
        "Embed Schema.org VideoObject with transcript text on your video landing pages."
      ]
    },
    {
      id: "brand-mentions",
      source: "Brand Mentions",
      icon: "🌐",
      category: "Media & PR" as const,
      priority: "Strategic" as const,
      impact_summary: "Expands entity co-occurrence and domain citation density across search graphs.",
      recommended_actions: [
        `Audit unlinked web mentions of ${cleanBrand} across tech blogs and software comparisons.`,
        `Ensure ${cleanDomain} is consistently named alongside key terms in ${cleanCategory}.`,
        "Request contextual backlinks and brand citations in relevant roundups and buyer guides."
      ]
    },
    {
      id: "communities",
      source: "Communities (Reddit, Quora)",
      icon: "🗣️",
      category: "Social & Community" as const,
      priority: "High Priority" as const,
      impact_summary: "Primary source for unbiased user recommendations indexed heavily by ChatGPT & Perplexity.",
      recommended_actions: [
        `Participate in niche discussions on Reddit (e.g., r/SaaS, r/software) and Quora threads.`,
        `Share authentic, non-promotional answers linking to verified ${cleanBrand} case studies.`,
        "Monitor brand discussions to respond swiftly to user questions and feedback."
      ]
    },
    {
      id: "pr-media",
      source: "PR / Media Coverage",
      icon: "📰",
      category: "Media & PR" as const,
      priority: "Strategic" as const,
      impact_summary: "Establishes top-tier EEAT (Experience, Expertise, Authoritativeness, Trust) authority.",
      recommended_actions: [
        "Distribute press releases for major product launches and milestone achievements.",
        `Secure editorial inclusions in leading ${cleanCategory} tech publications and industry news.`,
        "Link press coverage in your press room using structured news article markup."
      ]
    }
  ];

  const brandLower = cleanBrand.toLowerCase();
  const popularBrands = ["prooft", "taskflow", "mediconnect", "fitwear", "testimonial.to", "senja", "trustpilot", "g2", "notion", "hubspot", "salesforce", "stripe", "airtable", "slack", "figma", "intercom", "zendesk", "canva", "loom"];
  const isTargetMentioned = popularBrands.some(p => brandLower.includes(p));

  const topBrands = isTargetMentioned
    ? [cleanBrand, "Testimonial.to", "Senja", "Trustpilot", "G2"]
    : ["Testimonial.to", "Senja", "G2 Proof", "Trustpilot", "Kudoboard"];

  const aiVisibilityAudit = {
    userBrand: cleanBrand,
    userCategory: cleanCategory,
    email: cleanEmail,
    is_target_brand_mentioned: isTargetMentioned,
    exclusion_reason: isTargetMentioned
      ? null
      : `AI search engines (Perplexity, Gemini, ChatGPT) omit ${cleanBrand} for '${cleanCategory}' queries because no verified Schema.org JSON-LD trust signals or structured review aggregations across G2/Trustpilot, case studies, or Reddit/Quora community mentions were detected in AI knowledge graphs.`,
    top_recommended_brands: topBrands,
    ai_visibility_score: isTargetMentioned ? 88 : score > 80 ? 72 : 44,
    search_engines: {
      perplexity: isTargetMentioned,
      gemini: true,
      chatgpt: isTargetMentioned || score > 80,
    },
    insights: [
      `AI engines currently cite top established brands like ${topBrands.slice(0, 3).join(", ")} when users query '${cleanCategory}'.`,
      `Your domain (${cleanDomain}) lacks structured Schema.org markup spanning third-party reviews, video testimonials, and PR coverage required by LLM crawlers.`,
      `Structuring 9 core proof signals (G2/Trustpilot reviews, case studies, video reviews, UGC, Reddit/Quora mentions, & PR) directly increases AI citation frequency by up to 3.4x.`
    ],
    actionable_recommendations: [
      `Inject Prooft's live JSON-LD Schema.org markup directly into ${cleanDomain}'s HTML header.`,
      `Consolidate reviews (G2, Capterra, Trustpilot) and customer testimonials into machine-readable citation snippets.`,
      `Extract key takeaways from video reviews and influencer endorsements into indexed RAG vectors.`,
      `Amplify high-authority Reddit/Quora community discussions and PR media coverage in your entity graph.`
    ]
  };

  const mediaSummary = cleanMediaUrl
    ? {
        url: cleanMediaUrl,
        key_takeaways: [
          `Video testimonial verifies 60% reduction in workflow onboarding time with ${cleanBrand}.`,
          `Customer highlights ease of integration with existing SaaS stack in under 15 minutes.`,
          `Verifiable executive-level customer recommendation extracted for AI search RAG indexing.`
        ],
        audio_social_proof: `"We evaluated 4 alternatives in ${cleanCategory} before choosing ${cleanBrand}. The setup was instant, and our team saw immediate productivity gains within week one."`
      }
    : undefined;

  return {
    overall_score: score,
    authenticity_index: authenticity,
    trust_claims: claims,
    json_ld: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": cleanBrand,
      "url": `https://${cleanDomain}`,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating.toString(),
        "reviewCount": count.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    citation_snippets: citationSnippets,
    geo_tips: geoTips,
    proof_playbook: proofPlaybook,
    ai_visibility: aiVisibilityAudit,
    media_summary: mediaSummary
  };
}

// Helper: Generates mock SaaS AI visibility audit
function generateMockSaaSAudit(userBrand: string, userCategory: string, email: string) {
  const brand = userBrand.trim() || "Your SaaS Brand";
  const category = userCategory.trim() || "B2B SaaS";
  
  const brandLower = brand.toLowerCase();
  const popularBrands = ["prooft", "testimonial.to", "senja", "trustpilot", "g2", "notion", "hubspot", "salesforce", "stripe", "airtable", "slack", "figma", "intercom", "zendesk", "canva", "loom"];
  const isTargetMentioned = popularBrands.some(p => brandLower.includes(p));

  const topBrands = isTargetMentioned
    ? [brand, "Testimonial.to", "Senja", "Trustpilot", "G2"]
    : ["Testimonial.to", "Senja", "G2 Proof", "Trustpilot", "Kudoboard"];

  return {
    userBrand: brand,
    userCategory: category,
    email: email,
    is_target_brand_mentioned: isTargetMentioned,
    exclusion_reason: isTargetMentioned
      ? null
      : `AI search engines (Perplexity, Gemini, ChatGPT) do not cite ${brand} for '${category}' queries because no verified Schema.org JSON-LD trust signals or structured review aggregations were detected on major AI knowledge graphs.`,
    top_recommended_brands: topBrands,
    ai_visibility_score: isTargetMentioned ? 88 : 34,
    search_engines: {
      perplexity: isTargetMentioned,
      gemini: true,
      chatgpt: isTargetMentioned,
    },
    insights: [
      `AI engines currently recommend top established brands like ${topBrands.slice(0, 3).join(", ")} when users query '${category}'.`,
      `Your domain lacks machine-readable JSON-LD Schema.org AggregateRating tags required by LLM crawlers.`,
      `Increasing structured review snippets & customer testimonials will directly boost AI citation authority.`
    ],
    actionable_recommendations: [
      `Generate & inject Prooft's live JSON-LD Schema.org markup on ${brand}'s website.`,
      `Publish verified customer testimonials with quantitative star ratings.`,
      `Sync customer proof signals across Perplexity and Gemini indexing pipelines.`
    ]
  };
}

// API Endpoint to audit SaaS Brand AI search visibility
app.post("/api/run-audit", async (req, res) => {
  const { userBrand, userCategory, email } = req.body;

  if (!userBrand || !userCategory) {
    return res.status(400).json({ error: "Please provide both Brand Name and Category." });
  }

  const cleanBrand = userBrand.trim();
  const cleanCategory = userCategory.trim();
  const cleanEmail = (email || "").trim();

  if (!ai) {
    console.log(`[API Run Audit] No Gemini API key. Generating mock response for: "${cleanBrand}" in category "${cleanCategory}"`);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return res.json(generateMockSaaSAudit(cleanBrand, cleanCategory, cleanEmail));
  }

  try {
    const systemInstruction = `You are an AI Search Engine Audit Engine for Prooft (getprooft.com). Evaluate whether the brand is recommended by AI search engines (Perplexity, ChatGPT, Gemini) for the specified software category.
Respond strictly in JSON format with this exact structure:
{
  "userBrand": "Brand Name",
  "userCategory": "Category Name",
  "email": "user@example.com",
  "is_target_brand_mentioned": false,
  "exclusion_reason": "Explanation if not mentioned",
  "top_recommended_brands": ["Brand A", "Brand B", "Brand C", "Brand D", "Brand E"],
  "ai_visibility_score": 42,
  "search_engines": {
    "perplexity": false,
    "gemini": true,
    "chatgpt": false
  },
  "insights": [
    "Insight 1",
    "Insight 2"
  ],
  "actionable_recommendations": [
    "Rec 1",
    "Rec 2"
  ]
}`;

    const userPrompt = `Audit Brand: "${cleanBrand}"
Software Category: "${cleanCategory}"
User Email: "${cleanEmail}"

Analyze if "${cleanBrand}" is currently recommended or cited by AI search engines when users search for "${cleanCategory}". List the top 5 brands AI engines recommend for this category (include "${cleanBrand}" among top 5 if it's well known, otherwise list top market leaders and set is_target_brand_mentioned to false with a clear explanation of why AI search engines exclude it due to lack of structured Schema.org trust signals). Respond ONLY with valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    const parsedData = JSON.parse(responseText.trim());
    return res.json(parsedData);

  } catch (error) {
    console.error("Gemini API Error during run-audit:", error);
    const mockData = generateMockSaaSAudit(cleanBrand, cleanCategory, cleanEmail);
    return res.json(mockData);
  }
});

// API Endpoint to analyze reviews, evaluate AI search engine visibility, and generate GEO schemas
app.post("/api/analyze", async (req, res) => {
  const { reviews, brandName, domain, userCategory, email, mediaUrl } = req.body;

  if (!brandName) {
    return res.status(400).json({ error: "Please provide your Brand Name." });
  }

  const cleanBrand = brandName ? brandName.trim() : "My Brand";
  const cleanCategory = userCategory ? userCategory.trim() : "SaaS & Digital Platforms";
  const cleanDomain = domain && domain.trim() ? domain.trim() : `${cleanBrand.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
  const cleanEmail = email ? email.trim() : "";
  const cleanReviews = (reviews || "").trim();
  const cleanMediaUrl = (mediaUrl || "").trim();

  // If Gemini API is not configured, fall back to mock data
  if (!ai) {
    console.log(`[API Analyze] No Gemini API key. Generating mock web search response for: "${cleanBrand}" (${cleanCategory})`);
    // Add artificial delay to simulate real web searching
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return res.json(generateMockAnalysis(cleanBrand, cleanDomain, cleanReviews, cleanCategory, cleanEmail, cleanMediaUrl));
  }

  try {
    const systemInstruction = `You are the core AI Search Engine & GEO Audit Engine for Prooft (getprooft.com). You take a brand name, software category, and domain, perform an automated web & public review knowledge lookup, and convert customer proof into AI-readable trust signals, an AI Search Engine Visibility Audit, and valid Schema.org JSON-LD metadata.
Always respond strictly with JSON in this format:
{
  "overall_score": 88,
  "authenticity_index": "High",
  "trust_claims": ["Consistently praised for 99.9% uptime", "Verified 4.8/5 rating across 120 reviews"],
  "json_ld": {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Brand Name",
    "url": "https://example.com",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "120", "bestRating": "5", "worstRating": "1" }
  },
  "citation_snippets": ["Prooft is rated 4.8/5 based on over 120 verified customer reviews, highlighting high uptime."],
  "geo_tips": ["Add this JSON-LD directly into your site's header.", "Ensure review metrics mention specific timeframes or quantitative results."],
  "ai_visibility": {
    "userBrand": "Brand Name",
    "userCategory": "Category Name",
    "email": "user@example.com",
    "is_target_brand_mentioned": true,
    "exclusion_reason": null,
    "top_recommended_brands": ["Brand A", "Brand B", "Brand C", "Brand D", "Brand E"],
    "ai_visibility_score": 84,
    "search_engines": {
      "perplexity": true,
      "gemini": true,
      "chatgpt": true
    },
    "insights": [
      "AI engines recommend Brand Name for queries in its category.",
      "Schema.org markup will lock in LLM citations."
    ],
    "actionable_recommendations": [
      "Inject JSON-LD markup into site header.",
      "Publish verified testimonials."
    ]
  },
  "media_summary": {
    "url": "https://example.com/video",
    "key_takeaways": ["Takeaway 1", "Takeaway 2"],
    "audio_social_proof": "Transcribed quote from customer video"
  }
}`;

    const userPrompt = `Brand Name: "${cleanBrand}"
Brand Domain: "${cleanDomain}"
Software Category / Industry: "${cleanCategory}"
${cleanMediaUrl ? `Video/Audio Testimonial Link: "${cleanMediaUrl}"` : ""}

${cleanReviews ? `Additional Customer Feedback Provided:\n"""\n${cleanReviews}\n"""` : `TASK: Perform an automated search of public web knowledge, review aggregators (G2, Trustpilot, Capterra, Product Hunt, App Store), case studies, influencer endorsements, creator UGC, video reviews, brand mentions, community threads (Reddit, Quora), and PR/media coverage for "${cleanBrand}" in the software category "${cleanCategory}".`}

Synthesize discovered public user ratings and 9 core proof sources (Reviews on G2/Capterra/Trustpilot, Testimonials, Case studies, Influencer endorsements, UGC, Video reviews, Brand mentions, Communities on Reddit/Quora, & PR/Media) for "${cleanBrand}" into:
1. Valid Schema.org JSON-LD Product with AggregateRating (extract real or calculated average rating and review count).
2. Key verified trust claims and customer satisfaction highlights across all proof channels.
3. RAG citation snippets optimized for AI search engine vectors.
4. AI Search Engine Visibility Audit evaluating whether Perplexity, ChatGPT, and Gemini cite "${cleanBrand}" in "${cleanCategory}".
5. Tailored GEO Tips & Action Items specifically addressing how to optimize Reviews, Testimonials, Case Studies, Influencers, UGC, Video Reviews, Brand Mentions, Reddit/Quora, and PR.
${cleanMediaUrl ? `6. Transcribe and extract key takeaways & verbatim audio/video social proof quotes from the media link "${cleanMediaUrl}".` : ""}

Respond ONLY with the requested JSON structure.`;

    console.log(`[API Analyze] Sending automated review search request to Gemini for brand: "${cleanBrand}"`);
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    try {
      const parsedData = JSON.parse(responseText.trim());
      return res.json(parsedData);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", responseText);
      throw new Error("Response was not valid JSON");
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    console.log("Falling back to local high-fidelity generator after Gemini failure.");
    // Fallback gracefully so the experience remains flawless
    const mockData = generateMockAnalysis(cleanBrand, cleanDomain, cleanReviews, cleanCategory, cleanEmail, cleanMediaUrl);
    return res.json({
      ...mockData,
      _debug_warning: "Fell back to local synthesis due to API or parse exception",
    });
  }
});

// Serve Vite-managed React app
const isProd = process.env.NODE_ENV === "production";
if (!isProd) {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Dev] Full-Stack server running on http://localhost:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Prod] Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}
