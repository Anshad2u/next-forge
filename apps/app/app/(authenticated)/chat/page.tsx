"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import { SendIcon, BotIcon, PlusIcon, TrashIcon, MessageSquareIcon, UserIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getConversations, getMessages, deleteConversation } from "./actions";

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
  const [chatError, setChatError] = useState<string | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } =
    useChat({
      api: "/api/chat",
      body: { conversationId: activeConversationId || undefined },
      onFinish: () => {
        loadConversations();
        setChatError(null);
      },
      onError: (err) => {
        setChatError(err.message || "Something went wrong.");
      },
    });

  const loadConversations = useCallback(async () => {
    try {
      const convs = await getConversations();
      setConversations(convs as Conversation[]);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const loadConversation = useCallback(async (conversationId: string) => {
    setActiveConversationId(conversationId);
    setLoadingHistory(true);
    try {
      const history = await getMessages(conversationId);
      const formatted = history
        .filter((m) => m.content != null)
        .map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content ?? "",
          createdAt: m.createdAt,
        }));
      setMessages(formatted);
    } catch { /* ignore */ }
    finally { setLoadingHistory(false); }
  }, [setMessages]);

  const handleNewChat = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
    setChatError(null);
  }, [setMessages]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteConversation(id);
      if (activeConversationId === id) {
        setActiveConversationId(null);
        setMessages([]);
      }
      loadConversations();
    } catch { /* ignore */ }
  }, [activeConversationId, setMessages, loadConversations]);

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-6">
      {/* Sidebar */}
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
                <span className="flex-1 truncate">{conv.title || "Untitled"}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); handleDelete(conv.id); }}
                >
                  <TrashIcon className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {conversations.length === 0 && (
              <p className="px-3 py-8 text-center text-xs text-muted-foreground">No conversations yet</p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat */}
      <Card className="flex flex-1 flex-col">
        <CardHeader className="shrink-0">
          <div className="flex items-center gap-2">
            <BotIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{activeConversationId ? "Conversation" : "New Chat"}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto pb-4">
            {messages.length === 0 && !loadingHistory && (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <BotIcon className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="font-medium">How can I help you today?</p>
                  <p className="text-sm text-muted-foreground">
                    Ask me anything about your account, billing, or features.
                  </p>
                </div>
                {chatError && (
                  <p className="mt-2 max-w-md rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {chatError}
                  </p>
                )}
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <BotIcon className="h-8 w-8 shrink-0 rounded-full bg-muted p-1.5" />
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content || ""}</p>
                </div>
                {message.role === "user" && (
                  <UserIcon className="h-8 w-8 shrink-0 rounded-full bg-primary p-1.5 text-primary-foreground" />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <BotIcon className="h-8 w-8 shrink-0 rounded-full bg-muted p-1.5" />
                <div className="rounded-lg bg-muted px-4 py-2">
                  <p className="text-sm animate-pulse">Thinking...</p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex shrink-0 items-center gap-2 border-t pt-4">
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
