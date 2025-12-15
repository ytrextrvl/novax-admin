'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, X, ShieldAlert, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  type?: 'info' | 'warning' | 'error';
}

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: 'Hello! I am your Super Admin Copilot. I can help you manage the system, configure settings, or guide you through complex tasks. How can I assist you today?'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/copilot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ prompt: userMsg.text })
      });

      const data = await response.json();

      if (response.ok) {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: data.data.message,
          type: data.status === 'warning' ? 'warning' : 'info'
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        // Handle permission errors or other failures
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: data.message || 'I encountered an error processing your request.',
          type: 'error'
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (error) {
      toast.error('Failed to connect to Copilot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <Card className="w-80 md:w-96 h-[500px] shadow-2xl border-blue-500/20 mb-4 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl p-4 flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-base">Admin Copilot</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={() => setIsOpen(false)}>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                    }
                    ${msg.type === 'warning' ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30' : ''}
                    ${msg.type === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-950/30' : ''}
                  `}
                >
                  {msg.type === 'warning' && (
                    <div className="flex items-center gap-2 text-amber-600 font-bold mb-1">
                      <ShieldAlert className="h-4 w-4" /> Safety Alert
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-b-xl">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={`
          rounded-full h-14 w-14 shadow-xl transition-all duration-300
          ${isOpen ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-110'}
        `}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-8 w-8" />}
      </Button>
    </div>
  );
}
