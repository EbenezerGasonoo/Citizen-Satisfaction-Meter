/**
 * AI-Powered News Harvester & Civic Intelligence Engine
 * Continuously ingests live Ghanaian news via Google News RSS,
 * synthesizes factual headlines & civic context using AI/NLP,
 * and maintains verified source attribution.
 */

import https from 'https';
import { prisma } from '@/lib/prisma';

export interface RawNewsArticle {
  title: string;
  link: string;
  source: string;
  pubDate: string;
}

export interface SynthesizedNews {
  title: string;
  description: string;
  civicContext: string;
  impact: 'High' | 'Medium';
  sourcePublisher: string;
  sourceUrl: string;
  date: Date;
}

/**
 * Fetch raw RSS news articles from Google News for a given query
 */
export async function fetchGoogleNews(query: string): Promise<RawNewsArticle[]> {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-US&gl=US&ceid=US:en`;

  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (CitizenSatisfactionMeter/1.0)' } }, (res) => {
        let xml = '';
        res.on('data', (chunk) => (xml += chunk));
        res.on('end', () => {
          const items: RawNewsArticle[] = [];
          const itemRegex = /<item>[\s\S]*?<\/item>/g;
          const matches = xml.match(itemRegex) || [];

          for (const rawItem of matches.slice(0, 10)) {
            let title = rawItem.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '';
            const link = rawItem.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
            const source = rawItem.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || 'Ghana News';
            const pubDate = rawItem.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || new Date().toISOString();

            // Decode HTML entities
            title = title
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>');

            if (title && link) {
              items.push({ title, link, source, pubDate });
            }
          }

          resolve(items);
        });
      })
      .on('error', (err) => {
        console.error('[NewsHarvester] Failed to fetch Google News RSS:', err);
        resolve([]);
      });
  });
}

/**
 * Clean minister name for optimized search queries
 */
export function cleanMinisterSearchName(name: string): string {
  return name
    .replace(/\(MP\)/gi, '')
    .replace(/\b(Dr|H\.E\.|Hon|Alhaji|Alhaj)\b\.?/gi, '')
    .trim();
}

/**
 * Generate civic context ("Why This Matters") based on ministerial sector/portfolio
 */
export function generateCivicContext(portfolio: string, headline: string): string {
  const p = portfolio.toLowerCase();
  const h = headline.toLowerCase();

  if (p.includes('finance') || p.includes('economic')) {
    return 'Directly influences public spending transparency, national debt stability, and citizen cost of living.';
  }
  if (p.includes('education')) {
    return 'Impacts national academic infrastructure, tertiary tuition costs, and student enrollment welfare.';
  }
  if (p.includes('health')) {
    return 'Affects public clinic resource availability, essential drug supplies, and NHIS reimbursement reliability.';
  }
  if (p.includes('energy')) {
    return 'Crucial for national power grid consistency, power tariff stability, and renewable energy adoption.';
  }
  if (p.includes('communication') || p.includes('digit')) {
    return 'Shapes mobile data affordability, network service quality, and citizen cyber-security protections.';
  }
  if (p.includes('defence') || p.includes('interior')) {
    return 'Safeguards homeland security, border integrity, and regional peace enforcement.';
  }
  if (p.includes('roads') || p.includes('transport') || p.includes('works') || p.includes('housing')) {
    return 'Impacts public commuter infrastructure, commercial transit corridors, and access to affordable shelter.';
  }
  if (p.includes('environment') || p.includes('lands')) {
    return 'Protects vital clean water bodies, halts illegal mining destruction, and safeguards natural reserves.';
  }
  if (p.includes('food') || p.includes('agriculture') || p.includes('fisheries')) {
    return 'Strengthens domestic food security, farmer fertilizer subsidies, and coastal marine sustainability.';
  }

  return 'Informs government accountability, policy implementation, and public resource allocation.';
}

/**
 * Synthesizes raw articles using OpenAI/Gemini when available, or robust NLP rules
 */
export async function synthesizeMinisterNews(
  ministerName: string,
  portfolio: string,
  articles: RawNewsArticle[]
): Promise<SynthesizedNews | null> {
  if (!articles || articles.length === 0) {
    return null;
  }

  const primary = articles[0];
  const openaiApiKey = process.env.OPENAI_API_KEY;

  // 1. If OpenAI API key is configured, use GPT-4o-mini for editorial synthesis
  if (openaiApiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an objective civic news editor in Ghana. Synthesize the provided news article about Ghanaian Minister ${ministerName} (${portfolio}). Return strictly JSON with:
{
  "title": "Punchy, clear 6-12 word factual headline without news source name suffix",
  "description": "Objective 2-sentence summary of the decision, reform, or event.",
  "civicContext": "1 sentence starting with 'Why this matters:' explaining direct citizen impact.",
  "impact": "High" or "Medium"
}`
            },
            {
              role: 'user',
              content: `Headline: ${primary.title}\nSource: ${primary.source}\nDate: ${primary.pubDate}`
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2
        })
      });

      if (response.ok) {
        const data = await response.json();
        const parsed = JSON.parse(data.choices[0].message.content);
        return {
          title: parsed.title,
          description: parsed.description,
          civicContext: parsed.civicContext,
          impact: parsed.impact === 'High' ? 'High' : 'Medium',
          sourcePublisher: primary.source,
          sourceUrl: primary.link,
          date: new Date(primary.pubDate) || new Date()
        };
      }
    } catch (e) {
      console.warn('[NewsHarvester] OpenAI synthesis error, falling back to NLP heuristics:', e);
    }
  }

  // 2. Intelligent NLP Heuristic Synthesis (Zero API cost fallback)
  // Strip trailing publisher tag from headline (e.g. "... - Modern Ghana")
  let cleanTitle = primary.title;
  if (cleanTitle.includes(' - ')) {
    const parts = cleanTitle.split(' - ');
    parts.pop(); // Remove source publisher suffix
    cleanTitle = parts.join(' - ').trim();
  }

  // Remove surrounding quotes if any
  cleanTitle = cleanTitle.replace(/^["'“]|["'”]$/g, '').trim();

  const impact: 'High' | 'Medium' =
    /crisis|reform|bill|budget|sworn in|emergency|ultimatum|ban|launch|debt|fund|investigation/i.test(cleanTitle)
      ? 'High'
      : 'Medium';

  const description = `${ministerName} has been prominently highlighted regarding ${cleanTitle.toLowerCase()}. Reported by ${primary.source}.`;
  const civicContext = `Why this matters: ${generateCivicContext(portfolio, cleanTitle)}`;

  let dateObj = new Date(primary.pubDate);
  if (isNaN(dateObj.getTime())) {
    dateObj = new Date();
  }

  return {
    title: cleanTitle,
    description,
    civicContext,
    impact,
    sourcePublisher: primary.source,
    sourceUrl: primary.link,
    date: dateObj
  };
}

/**
 * Harvest and save the latest news item for a specific minister in the database
 */
export async function harvestAndSaveMinisterNews(ministerId: number): Promise<any> {
  const minister = await prisma.minister.findUnique({
    where: { id: ministerId },
    include: {
      actions: {
        orderBy: { date: 'desc' },
        take: 3
      }
    }
  });

  if (!minister) {
    throw new Error(`Minister #${ministerId} not found`);
  }

  const queryName = cleanMinisterSearchName(minister.fullName);
  const articles = await fetchGoogleNews(`"${queryName}" Ghana`);

  if (!articles || articles.length === 0) {
    return { success: false, message: `No recent news articles found for ${minister.fullName}` };
  }

  const synthesized = await synthesizeMinisterNews(minister.fullName, minister.portfolio, articles);
  if (!synthesized) {
    return { success: false, message: `Could not synthesize news for ${minister.fullName}` };
  }

  // Check if an identical action title already exists for this minister
  const existingAction = minister.actions.find(
    (a) => a.title.toLowerCase().trim() === synthesized.title.toLowerCase().trim()
  );

  if (existingAction) {
    // Update existing action with source attribution & civic context
    const updated = await prisma.action.update({
      where: { id: existingAction.id },
      data: {
        sourceUrl: synthesized.sourceUrl,
        sourcePublisher: synthesized.sourcePublisher,
        civicContext: synthesized.civicContext,
        impact: synthesized.impact
      }
    });
    return { success: true, action: updated, isNew: false };
  }

  // Otherwise create new Action
  const created = await prisma.action.create({
    data: {
      ministerId: minister.id,
      title: synthesized.title,
      description: synthesized.description,
      civicContext: synthesized.civicContext,
      impact: synthesized.impact,
      sourcePublisher: synthesized.sourcePublisher,
      sourceUrl: synthesized.sourceUrl,
      status: 'Active',
      date: synthesized.date
    }
  });

  return { success: true, action: created, isNew: true };
}
