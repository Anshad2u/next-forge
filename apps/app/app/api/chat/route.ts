import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if AI is enabled
  let aiEnabled = true;
  try {
    const setting = await database.setting.findUnique({ where: { key: "AI_CHAT_ENABLED" } });
    if (setting && setting.value === "false") aiEnabled = false;
  } catch { /* default enabled */ }

  if (!aiEnabled) {
    return Response.json({ error: "AI chat is not available. Contact your admin." }, { status: 503 });
  }

  // Read AI config from DB settings
  let apiKey = process.env.OPENAI_API_KEY || "";
  let endpoint = "https://api.openai.com/v1";
  let model = "gpt-4o-mini";
  let systemPrompt = "You are a helpful assistant for a SaaS application. Be concise and helpful.";

  try {
    const keys = ["AI_API_KEY", "AI_ENDPOINT", "AI_MODEL", "AI_SYSTEM_PROMPT"];
    const dbSettings = await database.setting.findMany({ where: { key: { in: keys } } });
    for (const s of dbSettings) {
      if (s.key === "AI_API_KEY" && s.value) apiKey = s.value;
      if (s.key === "AI_ENDPOINT" && s.value) endpoint = s.value;
      if (s.key === "AI_MODEL" && s.value) model = s.value;
      if (s.key === "AI_SYSTEM_PROMPT" && s.value) systemPrompt = s.value;
    }
  } catch { /* use defaults */ }

  if (!apiKey) {
    return Response.json({ error: "AI is not configured. Set an API key in Admin → Chat Settings." }, { status: 503 });
  }

  const { messages, conversationId } = await req.json();
  const lastUserMessage = messages[messages.length - 1];

  // Ensure conversation exists
  let activeConversationId = conversationId;
  if (!activeConversationId && lastUserMessage) {
    const conversation = await database.conversation.create({
      data: { userId, title: lastUserMessage.content.slice(0, 100) },
    });
    activeConversationId = conversation.id;
  }

  // Save user message
  if (lastUserMessage && activeConversationId) {
    await database.message.create({
      data: { role: lastUserMessage.role, content: lastUserMessage.content, conversationId: activeConversationId },
    });
  }

  try {
    const provider = createOpenAI({ apiKey, baseURL: endpoint });
    const aiModel = provider(model);

    const result = streamText({
      model: aiModel,
      system: systemPrompt,
      messages,
      onFinish: async (event) => {
        if (activeConversationId && event.text) {
          await database.message.create({
            data: { role: "assistant", content: event.text, model, conversationId: activeConversationId },
          });
        }
      },
    });

    return result.toDataStreamResponse({
      headers: { "x-conversation-id": activeConversationId || "" },
    });
  } catch {
    return Response.json({ error: "AI request failed. Check your API key and endpoint." }, { status: 500 });
  }
}
