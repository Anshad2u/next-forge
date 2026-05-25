import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { models } from "@repo/ai/lib/models";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
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

  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "AI is not configured. Set OPENAI_API_KEY in your environment variables." },
      { status: 503 }
    );
  }

  try {
    const result = streamText({
      model: models.chat,
      system:
        "You are a helpful assistant for a SaaS application. Be concise and helpful.",
      messages,
      onFinish: async (event) => {
        // Save assistant response to DB
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
      {
        error:
          "AI is not configured. Set OPENAI_API_KEY in your environment variables.",
      },
      { status: 500 }
    );
  }
}
