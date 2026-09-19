/**
 * Citizen Sentiment Analysis Engine for Citizen Satisfaction Meter V2
 * Analyzes citizen comments, detects civic topics, and scores public sentiment polarity.
 */

export interface AnalyzedComment {
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number; // -1.0 to +1.0
  topics: string[];
}

export interface AggregatedSentiment {
  totalComments: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  positivePercent: number;
  negativePercent: number;
  neutralPercent: number;
  netSentimentScore: number; // -100 to +100
  topTopics: { topic: string; count: number }[];
}

const POSITIVE_LEXICON = [
  'good', 'great', 'excellent', 'commendable', 'impressive', 'doing well', 'proud',
  'effective', 'hardworking', 'transparent', 'progress', 'improvement', 'support',
  'promising', 'visionary', 'competent', 'solid', 'action', 'dedicated', 'thank you',
  'best', 'delivering', 'positive', 'reforms', 'solution', 'hopeful'
];

const NEGATIVE_LEXICON = [
  'bad', 'poor', 'terrible', 'worst', 'incompetent', 'failure', 'disappointed',
  'corrupt', 'corruption', 'useless', 'resign', 'disaster', 'suffering', 'dumsor',
  'potholes', 'scandal', 'inflation', 'unacceptable', 'dishonest', 'slow', 'waste',
  'arrogant', 'broken', 'neglect', 'stalling', 'clueless', 'lied', 'strike'
];

const CIVIC_TOPIC_RULES: { topic: string; keywords: string[] }[] = [
  {
    topic: 'Economy & Cost of Living',
    keywords: ['economy', 'inflation', 'cedi', 'dollar', 'prices', 'tax', 'taxes', 'revenue', 'debt', 'market', 'cost of living']
  },
  {
    topic: 'Roads & Infrastructure',
    keywords: ['road', 'roads', 'highway', 'bridge', 'pothole', 'contractor', 'infrastructure', 'traffic', 'transport', 'train']
  },
  {
    topic: 'Power & Energy',
    keywords: ['dumsor', 'light', 'electricity', 'grid', 'power', 'tariff', 'ecg', 'energy', 'fuel', 'petrol', 'oil', 'bui']
  },
  {
    topic: 'Education & Schools',
    keywords: ['school', 'teachers', 'university', 'students', 'education', 'curriculum', 'exam', 'fees', 'free shs', 'classrooms']
  },
  {
    topic: 'Healthcare & Sanitation',
    keywords: ['hospital', 'doctor', 'nurses', 'medicine', 'clinic', 'health', 'nhis', 'sanitation', 'drugs', 'beds']
  },
  {
    topic: 'Governance & Integrity',
    keywords: ['corruption', 'transparency', 'accountability', 'scandal', 'leadership', 'policy', 'minister', 'government', 'parliament', 'audit']
  },
  {
    topic: 'Jobs & Youth Employment',
    keywords: ['job', 'jobs', 'unemployment', 'youth', 'work', 'salary', 'allowance', 'strike', 'graduates']
  }
];

export class SentimentAnalyzer {
  /**
   * Analyzes an individual comment text for sentiment polarity and topics
   */
  analyzeComment(text: string): AnalyzedComment {
    if (!text || text.trim().length === 0) {
      return {
        sentiment: 'neutral',
        sentimentScore: 0,
        topics: []
      };
    }

    const normalized = text.toLowerCase();
    const words = normalized.split(/[^a-zA-Z0-9]+/).filter(w => w.length > 2);

    let positiveScore = 0;
    let negativeScore = 0;

    // Detect negation context
    const hasNegation = /\b(not|never|no|hardly|scarcely|barely)\b/i.test(normalized);

    for (const word of words) {
      if (POSITIVE_LEXICON.includes(word)) {
        positiveScore++;
      }
      if (NEGATIVE_LEXICON.includes(word)) {
        negativeScore++;
      }
    }

    // Flip or attenuate if negation words are strongly present
    if (hasNegation) {
      const temp = positiveScore;
      positiveScore = negativeScore * 0.5;
      negativeScore = temp * 1.2;
    }

    const totalMatches = positiveScore + negativeScore;
    let score = 0;
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';

    if (totalMatches > 0) {
      score = (positiveScore - negativeScore) / (totalMatches + 1);
      if (score >= 0.15) {
        sentiment = 'positive';
      } else if (score <= -0.15) {
        sentiment = 'negative';
      } else {
        sentiment = 'neutral';
      }
    } else {
      sentiment = 'neutral';
      score = 0;
    }

    // Detect civic topics
    const matchedTopics: string[] = [];
    for (const rule of CIVIC_TOPIC_RULES) {
      for (const kw of rule.keywords) {
        if (normalized.includes(kw)) {
          matchedTopics.push(rule.topic);
          break;
        }
      }
    }

    return {
      sentiment,
      sentimentScore: Math.round(score * 100) / 100,
      topics: matchedTopics
    };
  }

  /**
   * Aggregates sentiment metrics across a collection of comments
   */
  calculateAggregatedSentiment(
    comments: {
      sentiment?: string | null;
      sentimentScore?: number | null;
      topics?: string | null;
    }[]
  ): AggregatedSentiment {
    const total = comments.length;
    if (total === 0) {
      return {
        totalComments: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
        positivePercent: 0,
        negativePercent: 0,
        neutralPercent: 0,
        netSentimentScore: 0,
        topTopics: []
      };
    }

    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    let totalScore = 0;
    const topicFrequency: Record<string, number> = {};

    for (const c of comments) {
      const s = c.sentiment || 'neutral';
      if (s === 'positive') positiveCount++;
      else if (s === 'negative') negativeCount++;
      else neutralCount++;

      totalScore += c.sentimentScore || 0;

      if (c.topics) {
        try {
          const parsed = JSON.parse(c.topics);
          if (Array.isArray(parsed)) {
            parsed.forEach((t: string) => {
              topicFrequency[t] = (topicFrequency[t] || 0) + 1;
            });
          }
        } catch {
          // ignore JSON parse error
        }
      }
    }

    const positivePercent = Math.round((positiveCount / total) * 100);
    const negativePercent = Math.round((negativeCount / total) * 100);
    const neutralPercent = 100 - positivePercent - negativePercent;

    const netScore = Math.round(((positiveCount - negativeCount) / total) * 100);

    const topTopics = Object.entries(topicFrequency)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalComments: total,
      positiveCount,
      negativeCount,
      neutralCount,
      positivePercent,
      negativePercent,
      neutralPercent: Math.max(0, neutralPercent),
      netSentimentScore: netScore,
      topTopics
    };
  }
}
