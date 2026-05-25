"use client";

import { useChat } from "@ai-sdk/react";
import { Message } from "@repo/ai/components/message";
import { Thread } from "@repo/ai/components/thread";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import { SendIcon, BotIcon, PlusIcon, TrashIcon, MessageSquareIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getConversations, getMessages, deleteConversation } from "./actions";
import type { Message as AIMessage } from "ai";

interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
  _count: { messages: number };
}

const ChatPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } =
    useChat({
      api: "/api/chat",
      body: { conversationId: activeConversationId },
      onFinish: () => {
        loadConversations();
        setError(null);
      },
      onError: (err) => {
        setError(err.message || "Something went wrong. AI may not be configured.");
      },
    });

  const loadConversations = useCallback(async () => {
    try {
      const convs = await getConversations();
      setConversations(convs as Conversation[]);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const loadConversation = useCallback(async (conversationId: string) => {
    setActiveConversationId(conversationId);
    setLoadingHistory(true);
    try {
      const history = await getMessages(conversationId);
      const formatted: AIMessage[] = history.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        createdAt: m.createdAt,
      }));
      setMessages(formatted);
    } catch {
      // ignore
    } finally {
      setLoadingHistory(false);
    }
  }, [setMessages]);

  const handleNewChat = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
  }, [setMessages]);

  const handleDelete = useCallback(async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setMessages([]);
      }
      loadConversations();
    } catch {
      // ignore
    }
  }, [activeConversationId, setMessages, loadConversations]);

  const onFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      handleSubmit(e);
    },
    [handleSubmit]
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-6">
      {/* Conversation sidebar */}
      <div className="hidden w-64 shrink-0 flex-col md:flex">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">Conversations</h2>
          <Button variant="ghost" size="sm" onClick={handleNewChat}>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${
                  activeConversationId === conv.id ? "bg-muted" : ""
                }`}
                onClick={() => loadConversation(conv.id)}
              >
                <MessageSquareIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate">{conv.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(conv.id);
                  }}
                >
                  <TrashIcon className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {conversations.length === 0 && (
              <p className="px-3 py-8 text-center text-xs text-muted-foreground">
                No conversations yet
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat area */}
      <Card className="flex flex-1 flex-col">
        <CardHeader className="shrink-0">
          <div className="flex items-center gap-2">
            <BotIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>
              {activeConversationId ? "Conversation" : "New Chat"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col overflow-hidden">
          <Thread className="flex-1 overflow-y-auto">
            {messages.length === 0 && !loadingHistory && (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <BotIcon className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="font-medium">How can I help you today?</p>
                  <p className="text-sm text-muted-foreground">
                    Ask me anything about your account, billing, or features.
                  </p>
                </div>
                {error && (
                  <p className="mt-2 max-w-md rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </p>
                )}
              </div>
            )}
            {messages.map((message) => (
              <Message key={message.id} data={message} />
            ))}
          </Thread>

          <form
            onSubmit={onFormSubmit}
            className="flex shrink-0 items-center gap-2 border-t pt-4"
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading || loadingHistory}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || loadingHistory || !input.trim()}>
              <SendIcon className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
