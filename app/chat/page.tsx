"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  role: "user" | "agent";
  text: string;
  streaming?: boolean;
};

const SUGGESTIONS = [
  "What is my current balance?",
  "List my recent transactions",
  "What is my spend limit per transaction?",
  "Can you pay £10,000 to someone?",
  "How much have I paid out in total this month?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", text }]);
    setMessages((prev) => [...prev, { role: "agent", text: "", streaming: true }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    if (!res.body) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "agent", text: "No response from agent." };
        return next;
      });
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "agent",
          text: next[next.length - 1].text + chunk,
          streaming: true,
        };
        return next;
      });
    }

    setMessages((prev) => {
      const next = [...prev];
      next[next.length - 1] = { role: "agent", text: next[next.length - 1].text };
      return next;
    });

    setLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 px-4 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-gray-400 text-sm hover:text-white transition-colors">
          ← Dashboard
        </Link>
        <div>
          <h1 className="font-semibold">Ralio Agent</h1>
          <p className="text-xs text-gray-400">Ask about balances, transactions, payments</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-2xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm text-center">Try asking the Ralio agent:</p>
            <div className="grid gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-300 hover:border-gray-600 hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-white text-gray-950"
                  : "bg-gray-900 border border-gray-800 text-gray-100"
              }`}
            >
              {msg.text}
              {msg.streaming && (
                <span className="inline-block w-1.5 h-4 bg-gray-400 ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the Ralio agent anything..."
            disabled={loading}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-white text-gray-950 font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
