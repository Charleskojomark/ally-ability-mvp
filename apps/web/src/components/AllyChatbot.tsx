'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function AllyChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I be Ally, your learning assistant here. How far? Wetin you wan learn today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Build the message payload minus the system prompt (backend adds it)
            const payload = [...messages, { role: 'user', content: userMessage }];

            // Get auth
            const { data: { session } } = await supabase.auth.getSession();

            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };

            if (session) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const res = await fetch(`${API_BASE_URL}/chat/message`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ messages: payload })
            });

            if (!res.ok) throw new Error('API Error');
            const response = await res.json();

            if (response && response.reply) {
                setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
            } else {
                throw new Error('Invalid response');
            }

        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-[40] bg-primary text-primary-foreground p-4 rounded-full shadow-2xl hover:bg-primary/90 hover:-translate-y-1 transition-all flex items-center justify-center border-[3px] border-white ring-4 ring-primary/20"
                aria-label="Ask Ally"
                title="Chat with Ally (AI Assistant)"
            >
                <Bot className="w-7 h-7" />
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 z-[50] w-[350px] sm:w-[400px] h-[500px] max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">

                    {/* Header */}
                    <div className="bg-primary text-primary-foreground px-5 py-4 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold">Ally Assistant</h3>
                                <p className="text-xs text-primary-foreground/80 font-medium">Always here to help you</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Messages Log */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-5 pb-2 bg-slate-50 flex flex-col gap-4 scroll-smooth"
                    >
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                            >
                                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-primary text-white'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>

                                <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-sm'
                                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3 max-w-[85%] self-start">
                                <div className="shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-sm text-white">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="p-4 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}

                        {/* Invis spacer so bottom message isn't kissing input bar immediately */}
                        <div className="h-2 w-full shrink-0"></div>
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-slate-100 shadow-[0_-4px_15px_rgba(0,0,0,0.02)]">
                        <form
                            onSubmit={handleSend}
                            className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask Ally a question..."
                                className="flex-1 bg-transparent px-4 text-sm focus:outline-none text-slate-800 placeholder:text-slate-500"
                                autoComplete="off"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className={`p-2.5 rounded-full transition-colors flex items-center justify-center ${input.trim() && !isLoading
                                    ? 'bg-primary text-white hover:bg-primary/90 shadow'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                <Send className="w-4 h-4 ml-[1px] mt-[1px]" />
                            </button>
                        </form>
                        <div className="text-center mt-2 mb-1">
                            <span className="text-[10px] text-slate-400 font-medium">Powered by LLaMA 3 & Groq AI</span>
                        </div>
                    </div>

                </div>
            )}
        </>
    );
}
