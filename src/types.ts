export interface AuditInput {
  brandName: string;
  domain: string;
  userCategory?: string;
  email?: string;
  reviews: string;
  mediaUrl?: string;
}

export interface SchemaOrgAggregateRating {
  "@type": "AggregateRating";
  ratingValue: string;
  reviewCount: string;
  bestRating?: string;
  worstRating?: string;
}

export interface SchemaOrgProduct {
  "@context": "https://schema.org";
  "@type": string;
  name: string;
  url?: string;
  aggregateRating?: SchemaOrgAggregateRating;
  [key: string]: any;
}

export interface AIVisibilityAudit {
  userBrand: string;
  userCategory: string;
  email?: string;
  is_target_brand_mentioned: boolean;
  exclusion_reason?: string | null;
  top_recommended_brands: string[];
  ai_visibility_score: number;
  search_engines: {
    perplexity: boolean;
    gemini: boolean;
    chatgpt: boolean;
  };
  insights: string[];
  actionable_recommendations?: string[];
}

export interface PlaybookItem {
  id: string;
  source: string;
  icon: string;
  category: "Aggregators" | "Direct Proof" | "Social & Community" | "Media & PR";
  priority: "High Priority" | "Quick Win" | "Strategic";
  recommended_actions: string[];
  impact_summary: string;
}

export interface AnalysisResult {
  overall_score: number;
  authenticity_index: "High" | "Medium" | "Low";
  trust_claims: string[];
  json_ld: SchemaOrgProduct;
  citation_snippets: string[];
  geo_tips: string[];
  proof_playbook?: PlaybookItem[];
  ai_visibility?: AIVisibilityAudit;
  media_summary?: {
    url: string;
    key_takeaways: string[];
    audio_social_proof: string;
  };
  _debug_warning?: string;
}

export interface SampleData {
  id: string;
  brandName: string;
  domain: string;
  userCategory: string;
  email: string;
  reviews: string;
}

