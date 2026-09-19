/**
 * Wikipedia Harvester for Citizen Satisfaction Meter V2
 * Automated data collection from Wikipedia and Wikimedia Commons
 */

export interface ScrapedMinisterData {
  fullName: string;
  portfolio: string;
  bio: string;
  photoUrl: string | null;
  sourceUrl: string;
  metadata: {
    wikipediaTitle: string;
    originalPhotoUrl?: string;
    thumbnailPhotoUrl?: string;
    pageId?: number;
    scrapedAt: string;
  };
}

export interface HarvesterOptions {
  userAgent?: string;
  delayMs?: number;
  maxMinisters?: number;
}

const DEFAULT_USER_AGENT = 'CitizenSatisfactionMeterBot/2.0 (civic-transparency-ghana; contact@citizensatisfaction.gh)';
const WIKIPEDIA_API_BASE = 'https://en.wikipedia.org/w/api.php';

// Known fallback roster in case Wikipedia page structure changes or is unavailable offline
export const KNOWN_CABINET_ROSTER = [
  { name: 'John Dramani Mahama', portfolio: 'President of the Republic of Ghana', wikiTitle: 'John Mahama' },
  { name: 'Jane Naana Opoku-Agyemang', portfolio: 'Vice President of the Republic of Ghana', wikiTitle: 'Jane Naana Opoku-Agyemang' },
  { name: 'Cassiel Ato Forson', portfolio: 'Minister for Finance & Economic Planning', wikiTitle: 'Cassiel Ato Forson' },
  { name: 'Mohammed Mubarak Muntaka', portfolio: 'Minister for the Interior', wikiTitle: 'Mohammed Mubarak Muntaka' },
  { name: 'Samuel Okudzeto Ablakwa', portfolio: 'Minister for Foreign Affairs', wikiTitle: 'Samuel Okudzeto Ablakwa' },
  { name: 'Dominic Akuritinga Ayine', portfolio: 'Minister for Justice & Attorney General', wikiTitle: 'Dominic Akuritinga Ayine' },
  { name: 'Haruna Iddrisu', portfolio: 'Minister for Education', wikiTitle: 'Haruna Iddrisu' },
  { name: 'Kwabena Mintah Akandoh', portfolio: 'Minister for Health', wikiTitle: 'Kwabena Mintah Akandoh' },
  { name: 'John Abdulai Jinapor', portfolio: 'Minister for Energy', wikiTitle: 'John Abdulai Jinapor' },
  { name: 'Elizabeth Ofosu-Adjare', portfolio: 'Minister for Trade, Agribusiness and Industry', wikiTitle: 'Elizabeth Ofosu-Adjare' },
  { name: 'Emmanuel Armah Kofi Buah', portfolio: 'Minister for Lands and Natural Resources', wikiTitle: 'Emmanuel Armah Kofi Buah' },
  { name: 'Eric Opoku', portfolio: 'Minister for Food and Agriculture', wikiTitle: 'Eric Opoku (politician)' },
  { name: 'Kwame Governs Agbodza', portfolio: 'Minister for Roads and Highways', wikiTitle: 'Kwame Governs Agbodza' },
  { name: 'Samuel Nartey George', portfolio: 'Minister for Communication and Digital Technology', wikiTitle: 'Sam Nartey George' },
  { name: 'Abdul-Rashid Pelpuo', portfolio: 'Minister for Employment and Labour Relations', wikiTitle: 'Abdul-Rashid Pelpuo' },
  { name: 'Agnes Naa Momo Lartey', portfolio: 'Minister for Gender, Children and Social Protection', wikiTitle: 'Agnes Naa Momo Lartey' },
  { name: 'Ahmed Ibrahim', portfolio: 'Minister for Local Government and Rural Development', wikiTitle: 'Ahmed Ibrahim (Ghanaian politician)' }
];

export class WikipediaHarvester {
  private userAgent: string;
  private delayMs: number;

  constructor(options?: HarvesterOptions) {
    this.userAgent = options?.userAgent || DEFAULT_USER_AGENT;
    this.delayMs = options?.delayMs || 300;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleans Wiki markup links, e.g. [[Target|Display]] -> Display or [[Target]] -> Target
   */
  private cleanWikiLink(raw: string): { title: string; display: string } {
    const trimmed = raw.trim().replace(/^\[\[/, '').replace(/\]\]$/, '');
    const parts = trimmed.split('|');
    if (parts.length > 1) {
      return { title: parts[0].trim(), display: parts[1].trim() };
    }
    return { title: parts[0].trim(), display: parts[0].trim() };
  }

  /**
   * Scrapes the Cabinet of Ghana roster from Wikipedia template or article
   */
  async fetchCabinetRoster(): Promise<{ name: string; portfolio: string; wikiTitle: string }[]> {
    try {
      const url = new URL(WIKIPEDIA_API_BASE);
      url.searchParams.set('action', 'parse');
      url.searchParams.set('page', 'Template:Cabinet_of_John_Mahama\'s_Second_Term');
      url.searchParams.set('prop', 'wikitext');
      url.searchParams.set('format', 'json');

      const res = await fetch(url.toString(), {
        headers: { 'User-Agent': this.userAgent }
      });

      if (!res.ok) {
        console.warn(`[Harvester] Wikipedia template fetch returned ${res.status}. Falling back to default cabinet roster.`);
        return KNOWN_CABINET_ROSTER;
      }

      const json = await res.json();
      const wikitext = json?.parse?.wikitext?.['*'];
      if (!wikitext) {
        return KNOWN_CABINET_ROSTER;
      }

      const rows = wikitext.split('|-');
      const ministers: { name: string; portfolio: string; wikiTitle: string }[] = [];

      for (const row of rows) {
        // Look for rows with columns separated by ||
        if (!row.includes('||')) continue;
        const cols = row.split('||').map((c: string) => c.trim());
        // Expected format: | [Portrait] || [Portfolio] || [Incumbent] || [Term]
        if (cols.length >= 3) {
          const portfolioCol = cols[1];
          const incumbentCol = cols[2];

          const portfolioMatch = portfolioCol.match(/\[\[([^\]]+)\]\]/);
          const incumbentMatch = incumbentCol.match(/\[\[([^\]]+)\]\]/);

          if (incumbentMatch) {
            const incumbentLink = this.cleanWikiLink(incumbentMatch[0]);
            let portfolioName = incumbentLink.title;
            if (portfolioMatch) {
              const pLink = this.cleanWikiLink(portfolioMatch[0]);
              portfolioName = pLink.display.replace(/\(Ghana\)/g, '').trim();
            }

            ministers.push({
              name: incumbentLink.display,
              wikiTitle: incumbentLink.title,
              portfolio: portfolioName
            });
          }
        }
      }

      if (ministers.length > 0) {
        // Prepend President & Vice President if not in table
        const hasPresident = ministers.some(m => m.portfolio.toLowerCase().includes('president'));
        if (!hasPresident) {
          ministers.unshift(
            KNOWN_CABINET_ROSTER[0], // President
            KNOWN_CABINET_ROSTER[1]  // Vice President
          );
        }
        return ministers;
      }

      return KNOWN_CABINET_ROSTER;
    } catch (err) {
      console.error('[Harvester] Error fetching cabinet table:', err);
      return KNOWN_CABINET_ROSTER;
    }
  }

  /**
   * Fetches detailed biography, extract, and photo for a given Wikipedia title
   */
  async fetchMinisterDetails(wikiTitle: string, defaultName: string, portfolio: string): Promise<ScrapedMinisterData | null> {
    try {
      const url = new URL(WIKIPEDIA_API_BASE);
      url.searchParams.set('action', 'query');
      url.searchParams.set('titles', wikiTitle);
      url.searchParams.set('prop', 'extracts|pageimages|info');
      url.searchParams.set('inprop', 'url');
      url.searchParams.set('exintro', '1');
      url.searchParams.set('explaintext', '1');
      url.searchParams.set('piprop', 'thumbnail|original');
      url.searchParams.set('pithumbsize', '600');
      url.searchParams.set('format', 'json');

      const res = await fetch(url.toString(), {
        headers: { 'User-Agent': this.userAgent }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch Wikipedia page for ${wikiTitle}: HTTP ${res.status}`);
      }

      const data = await res.json();
      const pages = data?.query?.pages;
      if (!pages) return null;

      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      if (page.missing) {
        console.warn(`[Harvester] Page missing for title: "${wikiTitle}"`);
        return null;
      }

      const bio = page.extract ? page.extract.trim() : '';
      const photoUrl = page.thumbnail?.source || page.original?.source || null;
      const fullUrl = page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`;

      return {
        fullName: defaultName || page.title,
        portfolio,
        bio,
        photoUrl,
        sourceUrl: fullUrl,
        metadata: {
          wikipediaTitle: page.title,
          originalPhotoUrl: page.original?.source,
          thumbnailPhotoUrl: page.thumbnail?.source,
          pageId: page.pageid,
          scrapedAt: new Date().toISOString()
        }
      };
    } catch (err) {
      console.error(`[Harvester] Error fetching details for ${wikiTitle}:`, err);
      return null;
    }
  }

  /**
   * Runs the full automated scrape of all cabinet ministers
   */
  async harvestAll(max?: number): Promise<ScrapedMinisterData[]> {
    console.log('[Harvester] Discovering cabinet ministers from Wikipedia...');
    const roster = await this.fetchCabinetRoster();
    const limit = max ? Math.min(max, roster.length) : roster.length;
    console.log(`[Harvester] Found ${roster.length} ministers in roster. Fetching details for ${limit}...`);

    const results: ScrapedMinisterData[] = [];

    for (let i = 0; i < limit; i++) {
      const item = roster[i];
      console.log(`[Harvester] [${i + 1}/${limit}] Fetching: ${item.name} (${item.portfolio})...`);
      
      const details = await this.fetchMinisterDetails(item.wikiTitle, item.name, item.portfolio);
      if (details) {
        results.push(details);
      }

      if (i < limit - 1 && this.delayMs > 0) {
        await this.sleep(this.delayMs);
      }
    }

    console.log(`[Harvester] Harvest completed. Successfully extracted ${results.length} minister profiles.`);
    return results;
  }
}
