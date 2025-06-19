import { Lightbulb, Send } from "lucide-react";
import { useEffect, useRef } from "react";

interface Message {
  id: string;
  sender: "therapist" | "patient";
  content: string;
  timestamp: Date;
  sentiment?: number;
}

interface ChatInterfaceProps {
  messages: Message[];
  currentMessage: string;
  isLoading: boolean;
  showHints: boolean;
  currentHint: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onToggleHints: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  currentMessage,
  isLoading,
  showHints,
  currentHint,
  onMessageChange,
  onSendMessage,
  onToggleHints,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef   = useRef<HTMLTextAreaElement>(null);

  /* auto-scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* focus textarea when idle */
  useEffect(() => {
    if (!isLoading) textareaRef.current?.focus();
  }, [isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat log */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === "therapist" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 leading-relaxed
                ${m.sender === "therapist" ? "bg-blue-500 text-white" : "bg-white text-slate-800"}`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
              <p className="text-xs mt-2 opacity-70">
                {m.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:.1s]" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input / hint */}
      <div className="border-t border-slate-200 p-4 bg-white">
        {showHints && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">{currentHint}</p>
          </div>
        )}

        <div className="flex space-x-4">
          <textarea
            ref={textareaRef}
            value={currentMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message…"
            rows={2}
            disabled={isLoading}
            className="flex-1 resize-none rounded-lg border border-slate-300 p-3
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       text-slate-800 placeholder:text-slate-400"
          />

          <button
            onClick={onSendMessage}
            disabled={!currentMessage.trim() || isLoading}
            className={`px-4 rounded-lg flex items-center justify-center transition-colors
              ${currentMessage.trim() && !isLoading
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
