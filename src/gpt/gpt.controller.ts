import { Body, Controller, Post } from '@nestjs/common';

/* Services */
import { GptService } from './gpt.service';

/* Dtos */
import { BasicPromptDto, ImproveResumeDto } from './dtos';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('basic-prompt')
  async basicPrompt(@Body() basicPromptDto: BasicPromptDto) {
    return await this.gptService.basicPrompt(basicPromptDto.prompt);
  }

  @Post('improve-resume')
  async improveResume(@Body() improveResumeDto: ImproveResumeDto) {
    const { cv, form = '', goal } = improveResumeDto;
    return await this.gptService.improveResume(cv, form, goal);
  }
}
