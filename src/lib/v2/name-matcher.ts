/**
 * Multi-Token Name and Portfolio Matcher for Citizen Satisfaction Meter V2
 * Prevents duplicate minister and photo creations by normalizing titles, honorifics, and token ordering.
 */

const HONORIFICS = [
  'dr.', 'dr', 'prof.', 'prof', 'professor', 'hon.', 'hon',
  'phd', 'fga', 'mp', '(mp)', 'esq.', 'esq', 'alhaj', 'alhadji'
];

export function normalizeMinisterName(name: string): string[] {
  if (!name) return [];

  // Convert to lowercase, remove punctuation except hyphens in compound names
  let cleaned = name.toLowerCase().replace(/[,()]/g, ' ');

  // Split into tokens
  let tokens = cleaned.split(/\s+/).filter(t => t.length > 0);

  // Filter out known honorifics and titles
  tokens = tokens.filter(t => !HONORIFICS.includes(t) && !HONORIFICS.includes(t.replace(/\./g, '')));

  // Normalize compound hyphens (e.g. opoku-agyemang -> opoku, agyemang)
  const expanded: string[] = [];
  for (const t of tokens) {
    if (t.includes('-')) {
      t.split('-').forEach(part => {
        if (part.length > 1) expanded.push(part);
      });
    } else if (t.length > 1) {
      expanded.push(t);
    }
  }

  return expanded;
}

export function extractPortfolioKeywords(portfolio: string): string[] {
  if (!portfolio) return [];
  const stopwords = ['minister', 'ministry', 'for', 'of', 'and', 'the', '&', 'state', 'department', 'national'];
  const words = portfolio.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/);
  return words.filter(w => w.length > 2 && !stopwords.includes(w));
}

export interface MatchResult<T> {
  matchedItem: T;
  confidence: number; // 0 to 1.0
  matchReason: string;
}

export class NameMatcher {
  /**
   * Finds the best matching candidate from an array of existing ministers
   */
  static findBestMatch<T extends { fullName: string; portfolio: string }>(
    targetName: string,
    targetPortfolio: string,
    candidates: T[],
    minConfidence: number = 0.65
  ): MatchResult<T> | null {
    const targetTokens = normalizeMinisterName(targetName);
    const targetPortfolioKws = extractPortfolioKeywords(targetPortfolio);

    let bestMatch: T | null = null;
    let highestScore = 0;
    let bestReason = '';

    for (const candidate of candidates) {
      const candidateTokens = normalizeMinisterName(candidate.fullName);
      const candidatePortfolioKws = extractPortfolioKeywords(candidate.portfolio);

      // 1. Calculate Name Token Overlap (Jaccard / containment)
      const commonTokens = targetTokens.filter(t => candidateTokens.includes(t));
      const tokenOverlap = (commonTokens.length * 2) / (targetTokens.length + candidateTokens.length);

      // Direct containment check (e.g. "cassiel ato forson" inside "cassiel ato baah forson")
      const isSubset = targetTokens.every(t => candidateTokens.includes(t)) ||
                       candidateTokens.every(t => targetTokens.includes(t));

      // 2. Calculate Portfolio Keyword Overlap
      const commonPortfolioKws = targetPortfolioKws.filter(kw => candidatePortfolioKws.includes(kw));
      const portfolioOverlap = targetPortfolioKws.length > 0 && candidatePortfolioKws.length > 0
        ? commonPortfolioKws.length / Math.min(targetPortfolioKws.length, candidatePortfolioKws.length)
        : 0;

      // Combined Confidence Score
      let score = tokenOverlap * 0.7 + portfolioOverlap * 0.3;

      if (isSubset && commonTokens.length >= 2) {
        score = Math.max(score, 0.85);
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = candidate;
        bestReason = `Matched ${commonTokens.join(' ')} (Score: ${(score * 100).toFixed(0)}%)`;
      }
    }

    if (bestMatch && highestScore >= minConfidence) {
      return {
        matchedItem: bestMatch,
        confidence: highestScore,
        matchReason: bestReason
      };
    }

    return null;
  }
}
