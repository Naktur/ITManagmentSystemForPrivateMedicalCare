import ChatBox from "../components/ChatBox";

export default function ChatPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Chat z asystentem</h1>
      <div className="h-[70vh]">
        <ChatBox />
      </div>
    </div>
  );
}
