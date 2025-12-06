'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProjectStore } from '@/store/projectStore';
import { createClient } from '@/lib/supabase/client';
import { AuthModal } from '@/components/auth/AuthModal';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export default function ChatInterface() {
  const { project, updateProject, addChatMessage } = useProjectStore();
  // Use messages from store, fallback to empty array if undefined
  const messages = project.data.chatHistory || [];
  
  // Initialize welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      addChatMessage({
        id: 'welcome',
        role: 'assistant',
        content: '¡Hola! Soy tu consultor virtual. Cuéntame, ¿qué idea tienes en mente para tu restaurante?',
        timestamp: Date.now()
      });
    }
  }, [messages, addChatMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setShowAuthModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    addChatMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          currentPhase: project.currentPhase,
          projectState: project.data
        })
      });

      const data = await response.json();

      if (data.message) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: Date.now()
        };
        addChatMessage(aiMessage);
      }

      if (data.navigate_to) {
        updateProject({ currentPhase: data.navigate_to });
      }

      if (data.updates && Object.keys(data.updates).length > 0) {
        const currentData = project.data;
        
        // Helper function for deep merge
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const deepMerge = (target: any, source: any) => {
          const output = { ...target };
          if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
              if (isObject(source[key])) {
                if (!(key in target)) {
                  Object.assign(output, { [key]: source[key] });
                } else {
                  output[key] = deepMerge(target[key], source[key]);
                }
              } else {
                Object.assign(output, { [key]: source[key] });
              }
            });
          }
          return output;
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isObject = (item: any) => {
          return (item && typeof item === 'object' && !Array.isArray(item));
        };

        const newData = deepMerge(currentData, data.updates);
        updateProject({ data: newData });
      }

    } catch (error) {
      console.error('Chat error:', error);
      addChatMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Lo siento, he tenido un problema al procesar tu mensaje. ¿Podrías repetirlo?',
        timestamp: Date.now()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
        <div className="p-2 bg-[#E8F5E9] rounded-lg text-[#1E4D3B]">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Consultor IA</h3>
          <p className="text-xs text-slate-500">Te ayudo a definir tu proyecto</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3 max-w-[90%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              msg.role === 'user' ? "bg-[#143328] text-white" : "bg-[#E8F5E9] text-[#1E4D3B]"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-[#143328] text-white rounded-tr-none" 
                : "bg-slate-100 text-slate-800 rounded-tl-none"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#1E4D3B] flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu idea..."
            className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C8E036] outline-none text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-[#1E4D3B] text-white rounded-xl hover:bg-[#143328] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        message="Inicia sesión para chatear con la IA y guardar tus conversaciones."
      />
    </div>
  );
}
