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
            const payload = [...messages, { role: 'user', content: userMessage }];
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
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[40] gradient-warm text-white p-3 sm:p-4 rounded-full shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all flex items-center justify-center border-2 sm:border-[3px] border-white ring-2 sm:ring-4 ring-brand-amber/20 tap-target focus-brand"
                aria-label="Ask Ally"
                title="Chat with Ally (AI Assistant)"
            >
                <Bot className="w-5 h-5 sm:w-7 sm:h-7" />
            </button>

            {isOpen && (
                <div className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 z-[50] w-full sm:w-[400px] h-[100dvh] sm:h-[500px] sm:max-h-[75vh] bg-ivory sm:rounded-2xl shadow-2xl border border-brand-amber/10 flex flex-col overflow-hidden animate-fade-up">

                    {/* Header */}
                    <div className="gradient-warm text-white px-5 py-4 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-heading font-bold">Ally Assistant</h3>
                                <p className="text-xs text-white/80 font-body font-medium">English & Pidgin support</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 hover:bg-white/20 rounded-full transition-colors tap-target"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Messages Log */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-5 pb-2 bg-ivory-100 flex flex-col gap-4 scroll-smooth"
                    >
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                            >
                                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-brand-green text-white' : 'gradient-warm text-white'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>

                                <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm font-body ${msg.role === 'user'
                                    ? 'bg-brand-green text-white rounded-tr-sm'
                                    : 'bg-white text-charcoal border border-brand-amber/10 rounded-tl-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3 max-w-[85%] self-start">
                                <div className="shrink-0 w-8 h-8 gradient-warm rounded-full flex items-center justify-center shadow-sm text-white">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="p-4 bg-white border border-brand-amber/10 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-brand-amber/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-brand-amber/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-brand-amber/40 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}

                        <div className="h-2 w-full shrink-0"></div>
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-ivory border-t border-brand-amber/10 shadow-[0_-4px_15px_rgba(0,0,0,0.02)]">
                        <form
                            onSubmit={handleSend}
                            className="flex items-center gap-2 bg-ivory-200 p-1.5 rounded-full border border-brand-amber/10 focus-within:border-brand-amber focus-within:ring-1 focus-within:ring-brand-amber transition-all"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask Ally a question..."
                                className="flex-1 bg-transparent px-4 text-sm focus:outline-none text-charcoal placeholder:text-charcoal/40 font-body"
                                autoComplete="off"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className={`p-2.5 rounded-full transition-colors flex items-center justify-center tap-target ${input.trim() && !isLoading
                                    ? 'gradient-warm text-white hover:shadow-lg shadow'
                                    : 'bg-charcoal/10 text-charcoal/30 cursor-not-allowed'
                                    }`}
                            >
                                <Send className="w-4 h-4 ml-[1px] mt-[1px]" />
                            </button>
                        </form>
                        <div className="text-center mt-2 mb-1">
                            <span className="text-[10px] text-charcoal/40 font-body font-medium">Powered by LLaMA 3 &amp; Groq AI</span>
                        </div>
                    </div>

                </div>
            )}
        </>
    );
}
