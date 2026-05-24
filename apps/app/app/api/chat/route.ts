import { models } from "@repo/ai/lib/models";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: models.chat,
    system: `You are a helpful AI assistant for a SaaS application. You can help users with:
- Account and billing questions
- Feature explanations
- General productivity advice
- Technical support

Be concise, helpful, and professional.`,
    messages,
  });

  return result.toDataStreamResponse();
}
