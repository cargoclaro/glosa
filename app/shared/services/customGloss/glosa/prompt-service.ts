import { Langfuse } from 'langfuse';
import { env } from '~/lib/env/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export class PromptService {
  private langfuse: Langfuse;
  private cache: Map<string, { prompt: string; timestamp: number }> = new Map();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes cache
  private useLocalFiles = false; // Toggle for local vs Langfuse

  constructor() {
    this.langfuse = new Langfuse({
      baseUrl: env.LANGFUSE_BASEURL,
      publicKey: env.LANGFUSE_PUBLIC_KEY,
      secretKey: env.LANGFUSE_SECRET_KEY,
    });
  }

  async getPrompt(
    promptName: string,
    label: string = 'production'
  ): Promise<string> {
    const cacheKey = `${promptName}:${label}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.prompt;
    }

    try {
      let promptContent: string;
      
      if (this.useLocalFiles) {
        // Read from local files for now
        const promptPath = join(process.cwd(), 'prompts', `${promptName}.txt`);
        promptContent = await readFile(promptPath, 'utf-8');
      } else {
        // Fetch from Langfuse
        const promptData = await this.langfuse.getPrompt(promptName, undefined, {
          label,
        });
        
        if (!promptData) {
          throw new Error(`Prompt not found: ${promptName}`);
        }

        promptContent = promptData.prompt;
      }
      
      // Cache the prompt
      this.cache.set(cacheKey, {
        prompt: promptContent,
        timestamp: Date.now(),
      });

      return promptContent;
    } catch (error) {
      console.error(`Error fetching prompt ${promptName}:`, error);
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

// Singleton instance
export const promptService = new PromptService();