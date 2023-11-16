import OpenAI from "openai";
import { Stream } from "openai/streaming";
import { systemPrompt } from "./systemPrompt";

async function getAiResponse(
  query: string
): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
  const token = localStorage.getItem("openai-token") || "";
  const openai = new OpenAI({ apiKey: token, dangerouslyAllowBrowser: true });

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      content: systemPrompt,
      role: "system",
    },
    {
      content: "I feel:" + query,
      role: "user",
    },
  ];

  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages,
    stream: true,
  });

  return stream;
}

async function* mockStream(input: string) {
  for (let i = 0; i < input.length; i++) {
    yield {
      choices: [
        {
          delta: {
            content: input[i],
          },
        },
      ],
    };
    await new Promise((resolve) => setTimeout(resolve, 10)); // Simulate some delay
  }
}

async function getAiResponse_(query: string) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const fullResponse = `When you're feeling bored, it can be helpful to engage in a breath that brings energy and focus. Try this breathing exercise:\n\nSit up straight and close your eyes. Take a deep breath in through your nose, feeling the air fill your lungs and expand your chest.`;
  const stream = mockStream(fullResponse);
  return stream;
}

export default getAiResponse;
