import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

/* Use cases */
import { basicPromptUseCase } from './use-cases';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // use cases

  async basicPrompt(prompt: string) {
    return await basicPromptUseCase(this.openai, { prompt });
  }
}
