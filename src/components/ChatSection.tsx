import React, { useState, useRef, useEffect, useTransition } from "react";
import { MatchSession, UserProfile, Message } from "../types";
import { Send, ArrowLeft, GraduationCap, Sparkles, MessageCircle, AlertCircle, RefreshCw } from "lucide-react";

interface ChatSectionProps {
  userProfile: UserProfile;
  session: MatchSession;
  onSendMessage: (messageText: string) => void;
  onBack: () => void;
}

export default function ChatSection({
  userProfile,
  session,
  onSendMessage,
  onBack,
}: ChatSectionProps) {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [, startTransition] = useTransition();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    // Synchronously clear input & send message upwards
    setInputText("");
    onSendMessage(text);
    setIsTyping(true);
    setError(null);

    // Call Gemini API server side to generate a Turks student persona response
    try {
      // Gather current message history
      const messageHistory = [
        ...session.messages,
        { id: "temp-user", sender: "user" as const, text: text, timestamp: new Date().toLocaleTimeString() }
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userProfile: userProfile,
          matchUser: session.matchUser,
          messages: messageHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Sunucu yanıt vermedi.");
      }

      const data = await response.json();
      
      startTransition(() => {
        // Feed reply down
        const responseText = data.text || "Pardon, vizeler yüzünden kafam biraz doluydu. Ne diyorduk? :)";
        session.messages.push({
          id: Math.random().toString(),
          sender: "match",
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        session.unread = false;
        setIsTyping(false);
      });
    } catch (err: any) {
      console.error(err);
      setError("Bağlantı hatası! Vizeler sebebiyle sunucuda yoğunluk yaşanıyor olabilir.");
      setIsTyping(false);
    }
  };

  // Scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages, isTyping]);

  return (
    <div id="chat-section-container" className="flex flex-col h-[580px] bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden relative z-10">
      
      {/* CHAT HEADER */}
      <div className="bg-neutral-950/60 border-b border-white/10 px-5 py-4 flex items-center gap-4">
        {/* Back Arrow button */}
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 cursor-pointer md:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Match Avatar */}
        <div className="relative">
          <div className="w-11 h-11 rounded-full overflow-hidden border border-white/20">
            <img
              src={session.matchUser.avatar}
              alt={session.matchUser.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-neutral-950 rounded-full" title="Çevrimiçi" />
        </div>

        {/* Match Name & Uni details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-black italic tracking-wide text-white truncate">
              {session.matchUser.name}
            </h4>
            <span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 text-[9px] font-black uppercase tracking-wider rounded">
              {session.matchUser.university.split(" ")[0]}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 truncate flex items-center gap-0.5">
            <GraduationCap className="w-3 h-3 inline text-gray-500" />
            {session.matchUser.major} • {session.matchUser.year}
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[9px] font-bold uppercase text-gray-500 tracking-widest block">
            KİŞİLİK TARZI
          </span>
          <span className="text-[10px] text-pink-300 font-semibold italic">
            {session.matchUser.personality}
          </span>
        </div>
      </div>

      {/* MESSAGES BODY */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
        
        {/* Intro match message info */}
        <div className="text-center pb-4 border-b border-white/5 max-w-xs mx-auto">
          <div className="w-10 h-10 bg-pink-500/10 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-2 border border-pink-500/20">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>
          <p className="text-[10px] text-gray-400">
            Bu sohbet bütünüyle <strong>{session.matchUser.name}</strong> karakterine sahip bir üniversiteli akıllı chat robotudur. Samimi sorular sorarak muhabbeti ilerletebilirsin!
          </p>
        </div>

        {session.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10">
            <MessageCircle className="w-12 h-12 text-gray-600 mb-2" />
            <p className="text-xs font-semibold uppercase tracking-wider">Henüz Mesajlaşma Yok</p>
            <p className="text-[10px] text-gray-400 max-w-xs mt-1">
              "Selam, naber ya :)" veya "{session.matchUser.name}, vizeler nasıl gidiyor?" diyerek ilk adımı atabilirsin.
            </p>
          </div>
        ) : (
          session.messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed transition-all ${
                    isUser
                      ? "bg-pink-500 text-white rounded-tr-none shadow-md shadow-pink-500/10"
                      : "bg-[#1C1C1E] text-gray-150 rounded-tl-none border border-white/5"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="block text-[8px] text-white/50 text-right mt-1.5 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Typing placeholder animation */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#1C1C1E] text-gray-450 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 text-xs text-neutral-400">
              <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              <span className="ml-1.5 text-[9px] text-gray-500 italic uppercase font-black tracking-widest">
                {session.matchUser.name} yazıyor...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl max-w-xs mx-auto gap-2 items-center">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-[10px] leading-tight">{error}</p>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* CHAT INPUT AREA */}
      <form onSubmit={handleSend} className="bg-neutral-950/40 p-4 border-t border-white/10 flex items-center gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Mesajını yaz... (${session.matchUser.name} ile konuşuyorsun)`}
          className="flex-1 bg-neutral-900 border border-white/10 rounded-full px-5 py-3 text-xs text-white focus:outline-none focus:border-pink-500 font-medium placeholder:text-gray-500"
        />
        
        <button
          type="submit"
          className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-pink-500/10"
          title="Gönder"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
