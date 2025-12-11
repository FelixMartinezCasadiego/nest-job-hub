import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import OpenAI from 'openai';

/* Use cases */
import { basicPromptUseCase, improveResumeUseCase } from './use-cases';

@Injectable()
export class GptService {
  private openai: OpenAI;

  constructor() {
    // Validate that the API key exists
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    this.openai = new OpenAI({
      apiKey,
    });
  }

  // Use cases

  async basicPrompt(prompt: string) {
    try {
      if (!prompt || prompt.trim().length === 0) {
        throw new BadRequestException('Prompt cannot be empty');
      }

      return await basicPromptUseCase(this.openai, { prompt });
    } catch (error) {
      console.error('Error in basicPrompt:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Error processing the prompt');
    }
  }

  async improveResume(cv: string, form: string, goal: string) {
    try {
      if (!cv || cv.trim().length === 0) {
        throw new BadRequestException('CV cannot be empty');
      }

      if (!goal || goal.trim().length === 0) {
        throw new BadRequestException('Professional goal is required');
      }

      const MAX_CV_LENGTH = 15000;
      const MAX_FORM_LENGTH = 10000;

      if (cv.length > MAX_CV_LENGTH) {
        throw new BadRequestException(
          `CV exceeds the limit of ${MAX_CV_LENGTH} characters`,
        );
      }

      if (form && form.length > MAX_FORM_LENGTH) {
        throw new BadRequestException(
          `Form exceeds the limit of ${MAX_FORM_LENGTH} characters`,
        );
      }

      const result = await improveResumeUseCase(this.openai, {
        cv,
        form: form || '',
        goal,
      });

      return {
        success: true,
        improvedCV: result.improvedCV,
        metadata: {
          tokensUsed: result.tokensUsed,
          model: result.model,
        },
      };
    } catch (error) {
      console.error('Error in improveResume:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof OpenAI.APIError) {
        throw new InternalServerErrorException(
          `OpenAI error (${error.status}): ${error.message}`,
        );
      }

      throw new InternalServerErrorException(
        'Error improving the CV. Please try again.',
      );
    }
  }
}
