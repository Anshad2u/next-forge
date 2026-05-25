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
import { SendIcon, BotIcon } from "lucide-react";

const ChatPage = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">
          Chat with your AI assistant powered by OpenAI.
        </p>
      </div>

      <Card className="flex flex-1 flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BotIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Chat</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <Thread className="flex-1">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <BotIcon className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="font-medium">How can I help you today?</p>
                  <p className="text-sm text-muted-foreground">
                    Ask me anything about your account, billing, or features.
                  </p>
                </div>
              </div>
            )}
            {messages.map((message) => (
              <Message key={message.id} data={message} />
            ))}
          </Thread>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t pt-4"
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              <SendIcon className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
