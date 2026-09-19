/**
 * Presidency Harvester for Citizen Satisfaction Meter V2
 * Ingests authoritative cabinet data from https://presidency.gov.gh/members-of-the-cabinet/
 * Enforces strict deduplication across minister names and localized image files.
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { NameMatcher } from './name-matcher';
import { AIService } from './ai-service';

export interface OfficialCabinetMember {
  fullName: string;
  portfolio: string;
  photoUrl: string;
  bio: string;
  sourceUrl: string;
}

export interface PresidencySyncResult {
  totalOfficial: number;
  matchedCount: number;
  updatedCount: number;
  unmatchedCount: number;
  details: {
    officialName: string;
    matchedMinisterId?: number;
    matchedLiveName?: string;
    portfolio: string;
    photoSavedAs?: string;
    action: 'updated' | 'unmatched';
    confidence?: number;
  }[];
}

const PRESIDENCY_CABINET_URL = 'https://presidency.gov.gh/members-of-the-cabinet/';
const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export class PresidencyHarvester {
  private prisma: PrismaClient;
  private aiService: AIService;
  private uploadsDir: string;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
    this.aiService = new AIService();
    this.uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  }

  /**
   * Fetches and parses official cabinet members from presidency.gov.gh
   */
  async fetchOfficialCabinet(): Promise<OfficialCabinetMember[]> {
    console.log(`[PresidencyHarvester] Fetching ${PRESIDENCY_CABINET_URL}...`);
    let html = '';

    try {
      const response = await fetch(PRESIDENCY_CABINET_URL, {
        headers: {
          'User-Agent': DEFAULT_USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      if (response.ok) {
        html = await response.text();
      } else {
        console.warn(`[PresidencyHarvester] Remote returned HTTP ${response.status} (WAF protection). Using cached official data/presidency-cabinet.html...`);
      }
    } catch {
      console.warn('[PresidencyHarvester] Remote fetch error. Using cached official data/presidency-cabinet.html...');
    }

    if (!html) {
      const cachePath = path.join(process.cwd(), 'data', 'presidency-cabinet.html');
      if (fs.existsSync(cachePath)) {
        html = fs.readFileSync(cachePath, 'utf-8');
      } else {
        throw new Error('Could not fetch presidency.gov.gh and no local cache available');
      }
    }

    return this.parseCabinetHtml(html);
  }

  /**
   * Parses HTML from the presidency members grid
   */
  parseCabinetHtml(html: string): OfficialCabinetMember[] {
    const members: OfficialCabinetMember[] = [];

    // Split HTML by grid items
    const items = html.split('<div class="grid-item">');

    for (let i = 1; i < items.length; i++) {
      const itemChunk = items[i];

      // Extract Name
      const nameMatch = itemChunk.match(/<h3 class="h6">([^<]+)(?:<br\s*\/?>)?<\/h3>/i);
      if (!nameMatch) continue;
      const rawName = nameMatch[1].replace(/<[^>]+>/g, '').trim();

      // Extract Portfolio
      const portfolioMatch = itemChunk.match(/<div class="subtitle">\s*<p>([^<]+)<\/p>/i);
      let portfolio = portfolioMatch ? portfolioMatch[1].trim() : '';
      portfolio = portfolio.replace(/[.]+$/, '').trim(); // clean trailing dots

      // Extract Image URL
      const imgMatch = itemChunk.match(/<div class="image">\s*<img src="([^"]+)"/i);
      const photoUrl = imgMatch ? imgMatch[1].trim() : '';

      // Extract Bio
      const bioMatch = itemChunk.match(/<div class="content-condensed">\s*<p>(.*?)<\/p>/is);
      let bio = '';
      if (bioMatch) {
        bio = bioMatch[1]
          .replace(/<a\s+[^>]*>.*?<\/a>/gi, '') // remove SEE MORE link
          .replace(/<[^>]+>/g, '') // remove any remaining HTML tags
          .replace(/&#8217;/g, "'")
          .replace(/&#8220;/g, '"')
          .replace(/&#8221;/g, '"')
          .replace(/\s+/g, ' ')
          .trim();
      }

      if (rawName && portfolio) {
        members.push({
          fullName: rawName,
          portfolio,
          photoUrl,
          bio,
          sourceUrl: PRESIDENCY_CABINET_URL
        });
      }
    }

    return members;
  }

  /**
   * Downloads portrait without creating duplicate filenames
   */
  async downloadOfficialPhoto(fullName: string, remoteUrl: string): Promise<string | null> {
    if (!remoteUrl) return null;

    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }

    // Canonical slug based on clean name
    const slug = fullName
      .toLowerCase()
      .trim()
      .replace(/\s*\(mp\)\s*/gi, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    const ext = remoteUrl.toLowerCase().endsWith('.png') ? '.png' : '.jpg';
    const filename = `${slug}${ext}`;
    const targetPath = path.join(this.uploadsDir, filename);

    try {
      const res = await fetch(remoteUrl, {
        headers: { 'User-Agent': DEFAULT_USER_AGENT }
      });

      if (!res.ok) return null;

      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length > 1000) {
        await fs.promises.writeFile(targetPath, buffer);
        return `/uploads/${filename}`;
      }
    } catch (err) {
      console.warn(`[PresidencyHarvester] Could not download photo for ${fullName}:`, err);
    }

    return null;
  }

  /**
   * Syncs official cabinet members into the database, strictly deduplicating records
   */
  async sync(): Promise<PresidencySyncResult> {
    const officials = await this.fetchOfficialCabinet();
    const liveMinisters = await this.prisma.minister.findMany();

    const result: PresidencySyncResult = {
      totalOfficial: officials.length,
      matchedCount: 0,
      updatedCount: 0,
      unmatchedCount: 0,
      details: []
    };

    for (const official of officials) {
      // Find matching live minister using multi-token matcher
      const match = NameMatcher.findBestMatch(
        official.fullName,
        official.portfolio,
        liveMinisters,
        0.65
      );

      if (match) {
        const live = match.matchedItem;
        result.matchedCount++;

        // Download official high-resolution photo with canonical naming
        const localPhoto = await this.downloadOfficialPhoto(live.fullName, official.photoUrl);

        // Classify sector for the official portfolio
        const sector = this.aiService.classifySector(official.portfolio);

        // Update minister record in-place
        await this.prisma.minister.update({
          where: { id: live.id },
          data: {
            portfolio: official.portfolio, // exact official government title
            sector,
            bio: official.bio || live.bio,  // official biography
            photoUrl: localPhoto || live.photoUrl
          }
        });

        result.updatedCount++;
        result.details.push({
          officialName: official.fullName,
          matchedMinisterId: live.id,
          matchedLiveName: live.fullName,
          portfolio: official.portfolio,
          photoSavedAs: localPhoto || undefined,
          action: 'updated',
          confidence: match.confidence
        });
      } else {
        result.unmatchedCount++;
        result.details.push({
          officialName: official.fullName,
          portfolio: official.portfolio,
          action: 'unmatched'
        });
      }
    }

    return result;
  }
}
