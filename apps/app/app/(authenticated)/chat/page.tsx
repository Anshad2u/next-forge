"use client";

import dynamic from "next/dynamic";

const ChatClient = dynamic(() => import("./chat-client"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <p className="text-muted-foreground animate-pulse">Loading chat...</p>
    </div>
  ),
});

export default function ChatPage() {
  return <ChatClient />;
}
