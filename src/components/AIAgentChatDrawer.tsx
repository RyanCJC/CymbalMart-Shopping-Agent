import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Loader2, 
  PlusCircle, 
  HelpCircle, 
  Wine, 
  DollarSign, 
  Clock, 
  CheckCheck,
  RefreshCw,
  Utensils
} from 'lucide-react';
import { PartyPlan, ShoppingItem, AIAgentMessage } from '../types';

interface AIAgentChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PartyPlan;
  onApplyItemModifications: (mods: { itemsToAdd?: any[]; itemNamesToRemove?: string[] }) => void;
}

export const AIAgentChatDrawer: React.FC<AIAgentChatDrawerProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onApplyItemModifications,
}) => {
  const [messages, setMessages] = useState<AIAgentMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I am your CymbalMart Assistant. I have full context on your **${currentPlan.config.title}** (${currentPlan.config.guestCount.total} guests, target budget ${currentPlan.config.currency}${currentPlan.config.targetBudget}).\n\nAsk me anything! I can calculate cocktail ratios, find cheaper bulk swaps at CymbalMart, suggest party prep schedules, or add dietary dishes to your shopping list.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: '💸 Cut $50 from budget', action: 'Cut $50 from my party shopping list without hurting guest satisfaction. Suggest specific ingredient swaps and wholesale store alternatives.' },
        { label: '🍹 Signature cocktail recipe & batch math', action: 'What is a great signature cocktail or punch recipe for this theme, and what exact ingredient quantities should I add to my cart?' },
        { label: '⏱️ Prep schedule & night-before checklist', action: 'What food and drink items can I prepare 24 hours in advance to save stress on party day?' },
        { label: '🌱 5 more vegan/GF guests RSVP\'d', action: '5 more vegan and gluten-free guests just RSVP\'d. Adjust my shopping list with delicious vegan mains and safe snacks.' },
      ],
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputPrompt).trim();
    if (!messageContent || isLoading) return;

    const userMessage: AIAgentMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          currentPlan,
          chatHistory: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await res.json();
      
      const assistantMessage: AIAgentMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.replyText || 'I have analyzed your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions || [],
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If the response returned structured list modifications, we can prompt the user to apply them
      if (data.itemModifications && (data.itemModifications.itemsToAdd?.length || data.itemModifications.itemNamesToRemove?.length)) {
        onApplyItemModifications(data.itemModifications);
      }

    } catch (err: any) {
      console.error('Agent chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an issue connecting to the AI server. Please make sure your Gemini API key is configured in settings.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white border-l-2 border-[#FFD9CE] shadow-2xl flex flex-col text-[#2D3436] animate-in slide-in-from-right duration-200">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#EADFD3] flex items-center justify-between bg-[#FFF9F2]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] flex items-center justify-center text-white font-bold shadow-md shadow-[#FF6B6B]/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-extrabold text-base text-[#2D3436]">CymbalMart Assistant</h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E8FAF7] text-[#0D9488] border border-[#A8EDDF]">
                Gemini Live
              </span>
            </div>
            <p className="text-xs text-[#636E72]">
              Active Plan: {currentPlan.config.title} ({currentPlan.items.length} items)
            </p>
          </div>
        </div>

        <button
          id="close-ai-chat-drawer-btn"
          onClick={onClose}
          className="p-2 rounded-xl bg-white hover:bg-[#FFF0EB] text-[#636E72] hover:text-[#2D3436] transition-colors border border-[#EADFD3]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FCFBF8]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="text-[10px] text-[#636E72] font-bold">
                {msg.role === 'user' ? 'You' : 'CymbalMart Assistant'}
              </span>
              <span className="text-[10px] text-[#A0AAB0]">• {msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[92%] text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#FF6B6B] text-white font-medium rounded-tr-none shadow-md shadow-[#FF6B6B]/20'
                  : 'bg-white border border-[#EADFD3] text-[#2D3436] rounded-tl-none space-y-2 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Action Suggestion Chips from AI */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#EADFD3] space-y-1.5">
                  <span className="text-[11px] font-extrabold text-[#FF6B6B] block">
                    Quick Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(action.action || action.label)}
                        className="px-2.5 py-1 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF0EB] text-[#2D3436] text-xs font-bold border border-[#EADFD3] transition-all text-left"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="p-3 rounded-2xl bg-white border border-[#EADFD3] text-xs text-[#636E72] flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-[#FF6B6B]" />
              <span className="font-medium">Analyzing shopping items & calculating...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area & Prompt Starter Bar */}
      <div className="p-4 border-t border-[#EADFD3] bg-[#FFF9F2] space-y-2.5">
        
        {/* Starter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-[11px]">
          <button
            onClick={() => handleSendMessage('Suggest 3 budget-friendly appetizers under $20 total that take 10 minutes to assemble.')}
            className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FFF0EB] text-[#2D3436] font-medium whitespace-nowrap border border-[#EADFD3]"
          >
            🥖 $20 Fast Appetizers
          </button>
          <button
            onClick={() => handleSendMessage('Give me the exact recipe ratios for a 20-person punch bowl.')}
            className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FFF0EB] text-[#2D3436] font-medium whitespace-nowrap border border-[#EADFD3]"
          >
            🍹 20-Person Punch Ratio
          </button>
          <button
            onClick={() => handleSendMessage('What are the top 3 items to buy at wholesale vs standard supermarket to save money?')}
            className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FFF0EB] text-[#2D3436] font-medium whitespace-nowrap border border-[#EADFD3]"
          >
            🛒 Wholesale vs Supermarket
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="ai-agent-input"
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask agent: 'Add 3 vegan sides', 'Cut $30', etc..."
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#EADFD3] text-xs sm:text-sm text-[#2D3436] focus:outline-none focus:border-[#FF6B6B] placeholder:text-[#A0AAB0] disabled:opacity-50"
          />
          <button
            id="ai-agent-send-btn"
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="p-2.5 rounded-xl bg-[#FF6B6B] hover:bg-[#ff5252] disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-[#FF6B6B]/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
