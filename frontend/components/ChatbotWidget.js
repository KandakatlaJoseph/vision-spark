import { useState, useRef, useEffect } from 'react';
import { COMPANY_INFO } from '../lib/coursesData';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId] = useState(() => 'vs-' + Math.random().toString(36).substr(2, 9));
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `👋 **Hello! Welcome to Vision Spark Solutions.**\n\nI am your AI Career & Technology Counselor. You can ask me anything about programming, AI, career guidance, or our courses and syllabi!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "What is Artificial Intelligence?",
    "Which course should I take?",
    "Tell me about Full Stack MERN",
    "Where is your center located?",
    "Do you offer placement support?"
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage = {
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query.trim(), conversationId })
      });

      const data = await res.json();
      const botMessage = {
        sender: 'bot',
        text: data.reply || "I'm sorry, I couldn't process that right now. Please connect with our team on WhatsApp!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `⚠️ Temporary connection issue. You can call our counselor directly at **${COMPANY_INFO.phone}** or click the WhatsApp icon above!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      let content = line;
      const parts = content.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-[#01155C]">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={lIdx} className="block mb-1 last:mb-0">
          {renderedLine}
        </span>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* ChatGPT-Style Professional AI Chatbot Drawer */}
      {isOpen && (
        <div className="mb-4 w-[92vw] sm:w-[420px] h-[520px] max-h-[78vh] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all animate-fade-in">
          
          {/* Professional Header with Company Logo & Clear Top-Right Close (✕) Button */}
          <div className="bg-[#01155C] text-white px-5 py-3.5 flex items-center justify-between shadow-md relative z-10 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-sm flex-shrink-0">
                <img
                  src="/logo_transparent.png"
                  alt="Vision Spark Solutions"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-sm font-display flex items-center gap-1.5 text-white">
                  <span>Vision Spark AI</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[11px] text-slate-300">ChatGPT-Powered Career Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* WhatsApp Direct Chat Link inside Header */}
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent('Hello Vision Spark Solutions! I have a query about your courses.')}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp (+91 7815981081)"
                className="w-8 h-8 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/40 text-[#25D366] flex items-center justify-center transition-colors"
              >
                <svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor">
                  <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.688 4.612 1.876 6.49L4 29l7.702-1.85A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.628 3 16.001 3zm0 21.818c-1.96 0-3.79-.55-5.35-1.505l-.384-.228-4.573 1.099 1.122-4.457-.25-.396A9.77 9.77 0 0 1 5.182 15c0-5.965 4.854-10.818 10.819-10.818S26.818 9.035 26.818 15 21.966 24.818 16.001 24.818zm5.99-8.14c-.328-.164-1.94-.957-2.241-1.066-.301-.11-.52-.164-.739.164-.219.328-.848 1.066-1.04 1.285-.191.219-.383.246-.71.082-.328-.164-1.386-.51-2.64-1.628-.976-.87-1.635-1.946-1.827-2.274-.191-.328-.02-.505.144-.668.148-.147.328-.383.492-.575.164-.191.219-.328.328-.547.109-.219.055-.41-.027-.574-.082-.164-.739-1.782-1.013-2.44-.267-.64-.538-.553-.739-.563l-.63-.011c-.219 0-.574.082-.875.41-.301.328-1.148 1.122-1.148 2.738 0 1.615 1.176 3.176 1.34 3.395.164.219 2.316 3.537 5.61 4.96.784.339 1.396.54 1.873.692.787.25 1.503.215 2.07.13.631-.094 1.94-.793 2.213-1.559.273-.766.273-1.422.191-1.559-.082-.137-.301-.219-.629-.383z" />
                </svg>
              </a>

              {/* Clear Top-Right Close (✕) Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center font-bold text-sm transition-all"
                aria-label="Close Chat"
                title="Close Chat Window"
              >
                ✕
              </button>
            </div>
          </div>

          {/* ChatGPT-Style Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
                    <img
                      src="/logo_transparent.png"
                      alt="VS"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[84%] p-3.5 rounded-2xl leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-vsOrange text-white font-medium rounded-tr-none'
                      : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  {formatText(msg.text)}
                  <span
                    className={`text-[9px] block text-right mt-1.5 ${
                      msg.sender === 'user' ? 'text-white/80' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-[#01155C] text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs mt-0.5">
                    👤
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs flex-shrink-0">
                  <img
                    src="/logo_transparent.png"
                    alt="VS"
                    className="w-full h-full object-contain animate-pulse"
                  />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none text-slate-500 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-vsOrange animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-vsOrange animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-vsOrange animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-medium ml-1">Vision Spark AI is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-vsOrange/10 hover:text-vsOrange border border-slate-200 text-[10px] font-semibold text-slate-700 whitespace-nowrap transition-colors flex-shrink-0"
              >
                💡 {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (programming, AI, courses)..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-vsOrange focus:bg-white transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 rounded-xl bg-vsOrange hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-vsOrange/20 transition-all flex items-center gap-1"
            >
              <span>Send</span>
              <span>⚡</span>
            </button>
          </form>

        </div>
      )}

      {/* Floating Controls with Company Logo on Buttons & WhatsApp Logo ON TOP */}
      <div className="flex flex-col items-end gap-3.5">
        
        {/* 1. Direct WhatsApp Logo Button (ON TOP OF CHATBOT) */}
        <a
          href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent('Hello Vision Spark Solutions! I would like to enquire about your training courses.')}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Direct WhatsApp Chat"
          title="Direct WhatsApp Chat (+91 7815981081)"
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:scale-110 transition-transform border-2 border-white cursor-pointer"
        >
          <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor">
            <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.688 4.612 1.876 6.49L4 29l7.702-1.85A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.628 3 16.001 3zm0 21.818c-1.96 0-3.79-.55-5.35-1.505l-.384-.228-4.573 1.099 1.122-4.457-.25-.396A9.77 9.77 0 0 1 5.182 15c0-5.965 4.854-10.818 10.819-10.818S26.818 9.035 26.818 15 21.966 24.818 16.001 24.818zm5.99-8.14c-.328-.164-1.94-.957-2.241-1.066-.301-.11-.52-.164-.739.164-.219.328-.848 1.066-1.04 1.285-.191.219-.383.246-.71.082-.328-.164-1.386-.51-2.64-1.628-.976-.87-1.635-1.946-1.827-2.274-.191-.328-.02-.505.144-.668.148-.147.328-.383.492-.575.164-.191.219-.328.328-.547.109-.219.055-.41-.027-.574-.082-.164-.739-1.782-1.013-2.44-.267-.64-.538-.553-.739-.563l-.63-.011c-.219 0-.574.082-.875.41-.301.328-1.148 1.122-1.148 2.738 0 1.615 1.176 3.176 1.34 3.395.164.219 2.316 3.537 5.61 4.96.784.339 1.396.54 1.873.692.787.25 1.503.215 2.07.13.631-.094 1.94-.793 2.213-1.559.273-.766.273-1.422.191-1.559-.082-.137-.301-.219-.629-.383z" />
          </svg>
        </a>

        {/* 2. AI Chatbot Trigger Button WITH COMPANY LOGO */}
        <div className="flex items-center gap-2">
          {!isOpen && (
            <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[#01155C] text-xs font-bold shadow-md animate-pulse font-display">
              🤖 Ask AI Counselor
            </span>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Open AI Assistant"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-vsOrange text-[#01155C] font-bold shadow-2xl shadow-vsOrange/30 hover:scale-105 transition-all flex items-center justify-center p-2.5 cursor-pointer relative"
          >
            {isOpen ? (
              <span className="text-xl font-extrabold text-[#01155C]">✕</span>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src="/logo_transparent.png"
                  alt="Vision Spark Solutions"
                  className="w-full h-full object-contain"
                />
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
              </div>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
