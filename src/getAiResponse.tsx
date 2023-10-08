import OpenAI from "openai";
import { Stream } from "openai/streaming";
import { systemPrompt } from "./systemPrompt";

async function getAiResponse_(
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
      content: query,
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
    await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate some delay
  }
}
export async function getAiResponse(query: string) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const fullResponse = `When you're feeling bored, it can be helpful to engage in a breath that brings energy and focus. Try this breathing exercise:\n\nSit up straight and close your eyes. Take a deep breath in through your nose, feeling the air fill your lungs and expand your chest. Hold the breath for a moment, and then exhale fully through your mouth, releasing any tension or boredom with the breath.\n\nNow, take a quick inhale through your nose, as if you're sniffing something exciting or interesting. Exhale forcefully throu…w and exhaling out any boredom or monotony.\n\nAs you continue this breath, allow your mind to focus on the sensation of each inhale and exhale. Notice how your body feels more awake and your mind becomes more alert. Embrace the energy that flows through you with each breath, and let it spark your creativity and curiosity.\n\nRemember, boredom can often be a sign that you're craving something new or different. Allow this breath to inspire you to seek out new experiences and find joy in the present moment.`;
  const stream = mockStream(fullResponse);
  return stream;
}
