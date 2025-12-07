import { Body, Controller, Post } from '@nestjs/common';

/* Services */
import { GptService } from './gpt.service';

/* Dtos */
import { BasicPromptDto } from './dtos';

/* Validators */

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('basic-prompt')
  basicPrompt(@Body() basicPromptDto: BasicPromptDto) {
    return this.gptService.basicPrompt(basicPromptDto.prompt);
  }
}
