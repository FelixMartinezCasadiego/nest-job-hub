import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const basicPromptUseCase = async (openai: OpenAI, options: Options) => {
  const completions = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: options.prompt,
      },
    ],
    model: 'gpt-4.1-nano',
    max_tokens: 150,
  });

  return completions.choices[0].message.content;
};
