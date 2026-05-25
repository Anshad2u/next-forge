import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if AI is enabled via feature flag
  let aiEnabled = true;
  try {
    const setting = await database.setting.findUnique({ where: { key: "AI_CHAT_ENABLED" } });
    if (setting && setting.value === "false") {
      aiEnabled = false;
    }
  } catch {
    // default to enabled
  }

  if (!aiEnabled || !process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "AI chat is not available. Contact your admin to enable it." },
      { status: 503 }
    );
  }

  const { messages, conversationId } = await req.json();
  const lastUserMessage = messages[messages.length - 1];

  // Ensure conversation exists
  let activeConversationId = conversationId;
  if (!activeConversationId && lastUserMessage) {
    const conversation = await database.conversation.create({
      data: {
        userId,
        title: lastUserMessage.content.slice(0, 100),
      },
    });
    activeConversationId = conversation.id;
  }

  // Save user message to DB
  if (lastUserMessage && activeConversationId) {
    await database.message.create({
      data: {
        role: lastUserMessage.role,
        content: lastUserMessage.content,
        conversationId: activeConversationId,
      },
    });
  }

  try {
    // Lazy import to avoid crashing when OPENAI_API_KEY is missing
    const { models } = await import("@repo/ai/lib/models");

    const result = streamText({
      model: models.chat,
      system:
        "You are a helpful assistant for a SaaS application. Be concise and helpful.",
      messages,
      onFinish: async (event) => {
        if (activeConversationId && event.text) {
          await database.message.create({
            data: {
              role: "assistant",
              content: event.text,
              model: models.chat.modelId,
              conversationId: activeConversationId,
            },
          });
        }
      },
    });

    return result.toDataStreamResponse({
      headers: {
        "x-conversation-id": activeConversationId || "",
      },
    });
  } catch {
    return Response.json(
      { error: "AI is not configured. Set OPENAI_API_KEY in your environment variables." },
      { status: 500 }
    );
  }
}
