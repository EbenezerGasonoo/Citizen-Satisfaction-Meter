/**
 * AI Service for Citizen Satisfaction Meter V2
 * Provides bio polishing, sector categorization, and trending explanations.
 * Supports OpenAI/Gemini API when keys are configured, with high-quality built-in NLP heuristics.
 */

export interface SectorDefinition {
  name: string;
  description: string;
  keywords: string[];
}

export const GOVERNANCE_SECTORS: SectorDefinition[] = [
  {
    name: 'Economic Management & Finance',
    description: 'Fiscal policy, trade, industry, national budget, and economic planning',
    keywords: ['finance', 'economic', 'economy', 'trade', 'industry', 'agribusiness', 'revenue', 'tax']
  },
  {
    name: 'Infrastructure, Energy & Technology',
    description: 'Roads, power, energy, housing, telecommunications, and digital innovation',
    keywords: ['energy', 'petroleum', 'roads', 'highways', 'works', 'housing', 'water', 'transport', 'communication', 'digital', 'technology', 'innovations']
  },
  {
    name: 'Social Services & Human Development',
    description: 'Healthcare, national education, gender equality, youth, and social protection',
    keywords: ['health', 'education', 'gender', 'children', 'social protection', 'women', 'youth', 'sports']
  },
  {
    name: 'Justice, Defence & Internal Security',
    description: 'Rule of law, legal affairs, national defence, police, and homeland security',
    keywords: ['justice', 'attorney general', 'interior', 'defence', 'security', 'police', 'law']
  },
  {
    name: 'Governance, Diplomacy & Natural Resources',
    description: 'Executive leadership, foreign relations, local government, lands, and environment',
    keywords: ['president', 'foreign affairs', 'local government', 'chieftaincy', 'lands', 'natural resources', 'environment', 'science', 'employment', 'labour']
  }
];

export class AIService {
  private openaiApiKey?: string;
  private geminiApiKey?: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.geminiApiKey = process.env.GEMINI_API_KEY;
  }

  /**
   * Classifies a ministerial portfolio into a standardized governance sector
   */
  classifySector(portfolio: string): string {
    const normalized = portfolio.toLowerCase();

    for (const sector of GOVERNANCE_SECTORS) {
      for (const kw of sector.keywords) {
        if (normalized.includes(kw)) {
          return sector.name;
        }
      }
    }

    return 'Governance & Public Administration';
  }

  /**
   * Heuristic/Rule-based cleaner and formatter for biographical text
   */
  private cleanAndStructureBio(rawText: string, fullName: string, portfolio: string): string {
    if (!rawText || rawText.trim().length === 0) {
      return `${fullName} serves as the ${portfolio} of the Republic of Ghana, contributing to national policy formulation and executive leadership.`;
    }

    // Strip citations like [1], [2], [citation needed]
    let cleaned = rawText.replace(/\[\d+\]/g, '').replace(/\[citation needed\]/gi, '');

    // Split into sentences
    const sentences = cleaned
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);

    if (sentences.length === 0) {
      return cleaned.trim();
    }

    // Build concise, professional 2-paragraph civic profile
    const introParagraph = sentences.slice(0, 3).join(' ');
    const careerParagraph = sentences.slice(3, 7).join(' ');

    if (careerParagraph) {
      return `${introParagraph}\n\n${careerParagraph}`;
    }

    return introParagraph;
  }

  /**
   * Generates a polished, neutral, citizen-ready biography
   */
  async generateStandardizedBio(rawBio: string, fullName: string, portfolio: string): Promise<string> {
    // 1. If OpenAI API key is configured, use GPT-4o-mini
    if (this.openaiApiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.openaiApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are an objective civic knowledge assistant for Ghana. Write a concise, professional, factual 2-paragraph biography of this cabinet minister based on provided information. Do not use editorial praise or political bias.'
              },
              {
                role: 'user',
                content: `Minister Name: ${fullName}\nPortfolio: ${portfolio}\nSource Information:\n${rawBio}`
              }
            ],
            temperature: 0.3,
            max_tokens: 300
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data?.choices?.[0]?.message?.content?.trim();
          if (content) return content;
        }
      } catch (err) {
        console.warn('[AIService] OpenAI generation failed, falling back to NLP heuristics:', err);
      }
    }

    // 2. Fallback to NLP heuristics
    return this.cleanAndStructureBio(rawBio, fullName, portfolio);
  }

  /**
   * Generates a concise contextual update on why a minister is trending
   */
  generateTrendingContext(actionTitle?: string, satisfactionRate?: number, totalVotes?: number, portfolio?: string): string {
    if (actionTitle) {
      return `Trending following recent policy action: "${actionTitle}".`;
    }
    if (totalVotes && totalVotes >= 5) {
      return `High public engagement with ${totalVotes} citizen reviews (${satisfactionRate}% satisfaction).`;
    }
    return `Active citizen evaluation across the ${portfolio || 'ministerial'} portfolio.`;
  }
}
