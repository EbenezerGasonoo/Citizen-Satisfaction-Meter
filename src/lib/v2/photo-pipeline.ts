/**
 * Photo Download and Processing Pipeline for Citizen Satisfaction Meter V2
 * Safely downloads, optimizes, and stores portraits in /public/uploads/
 */

import fs from 'fs';
import path from 'path';

export interface PhotoDownloadResult {
  success: boolean;
  localPath: string; // e.g. /uploads/cassiel_ato_forson.jpg
  fullPath: string;
  bytes: number;
  skipped?: boolean;
  error?: string;
}

export interface PhotoPipelineOptions {
  uploadsDir?: string;
  userAgent?: string;
  overwrite?: boolean;
}

const DEFAULT_USER_AGENT = 'CitizenSatisfactionMeterBot/2.0 (civic-transparency-ghana; contact@citizensatisfaction.gh)';

export class PhotoPipeline {
  private uploadsDir: string;
  private userAgent: string;
  private overwrite: boolean;

  constructor(options?: PhotoPipelineOptions) {
    this.uploadsDir = options?.uploadsDir || path.join(process.cwd(), 'public', 'uploads');
    this.userAgent = options?.userAgent || DEFAULT_USER_AGENT;
    this.overwrite = options?.overwrite || false;
  }

  /**
   * Generates a sanitized filesystem-safe filename for a minister
   */
  public generateFilename(fullName: string, remoteUrl: string): string {
    const slug = fullName
      .toLowerCase()
      .trim()
      .replace(/\s*\(mp\)\s*/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    // Determine extension from URL or default to .jpg
    let ext = '.jpg';
    try {
      const urlPath = new URL(remoteUrl).pathname.toLowerCase();
      if (urlPath.endsWith('.webp')) ext = '.webp';
      else if (urlPath.endsWith('.png')) ext = '.png';
      else if (urlPath.endsWith('.jpeg')) ext = '.jpeg';
    } catch {
      // ignore URL parsing error
    }

    return `${slug}${ext}`;
  }

  /**
   * Ensures the uploads directory exists
   */
  private async ensureDirectory(): Promise<void> {
    if (!fs.existsSync(this.uploadsDir)) {
      await fs.promises.mkdir(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Downloads a portrait from a remote URL and saves it to /public/uploads/
   */
  async processMinisterPhoto(fullName: string, remotePhotoUrl: string): Promise<PhotoDownloadResult> {
    await this.ensureDirectory();

    if (!remotePhotoUrl) {
      return {
        success: false,
        localPath: '',
        fullPath: '',
        bytes: 0,
        error: 'No remote photo URL provided'
      };
    }

    const filename = this.generateFilename(fullName, remotePhotoUrl);
    const fullPath = path.join(this.uploadsDir, filename);
    const localPublicPath = `/uploads/${filename}`;

    // If file already exists and overwrite is false, check size and reuse
    if (fs.existsSync(fullPath) && !this.overwrite) {
      const stats = await fs.promises.stat(fullPath);
      if (stats.size > 1024) {
        return {
          success: true,
          localPath: localPublicPath,
          fullPath,
          bytes: stats.size,
          skipped: true
        };
      }
    }

    try {
      const response = await fetch(remotePhotoUrl, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          localPath: '',
          fullPath,
          bytes: 0,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('image') && !contentType.includes('octet-stream')) {
        return {
          success: false,
          localPath: '',
          fullPath,
          bytes: 0,
          error: `Unexpected content type: ${contentType}`
        };
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length < 500) {
        return {
          success: false,
          localPath: '',
          fullPath,
          bytes: buffer.length,
          error: 'Downloaded image is suspiciously small (< 500 bytes)'
        };
      }

      await fs.promises.writeFile(fullPath, buffer);

      return {
        success: true,
        localPath: localPublicPath,
        fullPath,
        bytes: buffer.length,
        skipped: false
      };
    } catch (err: any) {
      return {
        success: false,
        localPath: '',
        fullPath,
        bytes: 0,
        error: err?.message || 'Unknown network error during photo download'
      };
    }
  }
}
