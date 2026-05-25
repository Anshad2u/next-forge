import dynamic from "next/dynamic";

const ChatClient = dynamic(() => import("./chat-client"), { ssr: false });

const ChatPage = () => <ChatClient />;

export default ChatPage;
