"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";

export const getConversations = async () => {
  const { userId } = await auth();
  if (!userId) return [];

  return database.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      _count: { select: { messages: true } },
    },
  });
};

export const getMessages = async (conversationId: string) => {
  const { userId } = await auth();
  if (!userId) return [];

  const conversation = await database.conversation.findFirst({
    where: { id: conversationId, userId },
  });
  if (!conversation) return [];

  return database.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
};

export const deleteConversation = async (conversationId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await database.conversation.deleteMany({
    where: { id: conversationId, userId },
  });
};

export const renameConversation = async (conversationId: string, title: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await database.conversation.updateMany({
    where: { id: conversationId, userId },
    data: { title },
  });
};
