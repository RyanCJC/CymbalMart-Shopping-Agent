import React from 'react';
import { 
  Sparkles, 
  PlusCircle, 
  Download, 
  Bot, 
  Calculator, 
  Clock, 
  PieChart, 
  ChevronDown,
  ShoppingBag,
  PartyPopper,
  Mic,
  Radio,
  CreditCard
} from 'lucide-react';
import { PartyPlan } from '../types';
import { PRESET_PARTIES } from '../data/presets';
import { formatCurrency } from '../utils/calculator';

interface NavbarProps {
  currentPlan: PartyPlan;
  onSelectPreset: (preset: PartyPlan) => void;
  onOpenNewPartyModal: () => void;
  onOpenCalculatorModal: () => void;
  onOpenBudgetModal: () => void;
  onOpenTimelineModal: () => void;
  onOpenExportModal: () => void;
  onOpenCheckoutModal?: () => void;
  onToggleAiChat: () => void;
  isAiChatOpen: boolean;
  onToggleVoiceListening?: () => void;
  isVoiceListening?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPlan,
  onSelectPreset,
  onOpenNewPartyModal,
  onOpenCalculatorModal,
  onOpenBudgetModal,
  onOpenTimelineModal,
  onOpenExportModal,
  onOpenCheckoutModal,
  onToggleAiChat,
  isAiChatOpen,
  onToggleVoiceListening,
  isVoiceListening,
}) => {
  const [isPresetsDropdownOpen, setIsPresetsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsPresetsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalEstimated = currentPlan.items.reduce((sum, it) => sum + it.estimatedTotalPrice, 0);
  const totalPurchased = currentPlan.items.filter(it => it.purchased).reduce((sum, it) => sum + (it.actualPrice || it.estimatedTotalPrice), 0);
  const targetBudget = currentPlan.config.targetBudget;
  const isOverBudget = totalEstimated > targetBudget;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F0E6D8] text-[#333333] transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] flex items-center justify-center shadow-md shadow-[#FF6B6B]/20 text-white font-bold">
              <PartyPopper className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg tracking-tight text-[#2D3436] flex items-center gap-1.5">
                  CymbalMart <span className="text-[#FF6B6B] font-bold text-xs px-2.5 py-0.5 rounded-full bg-[#FFF0EB] border border-[#FFD3C4]">Shopping Agent</span>
                </span>
              </div>
              <p className="text-xs text-[#636E72] hidden sm:block">
                AI Catering Math, Wholesale Splits & Budget Optimization
              </p>
            </div>
          </div>

          {/* Center: Active Party Selector & Presets */}
          <div className="hidden md:flex items-center gap-2" ref={dropdownRef}>
            <div className="relative">
              <button
                id="party-preset-dropdown-btn"
                onClick={() => setIsPresetsDropdownOpen(!isPresetsDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF4E6] border border-[#EADFD3] text-sm font-semibold text-[#2D3436] transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-[#FF6B6B]" />
                <span className="max-w-[180px] truncate">{currentPlan.config.title}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#636E72]" />
              </button>

              {isPresetsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white border border-[#EADFD3] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-xs font-bold text-[#636E72] uppercase tracking-wider">
                    Quick Preset Themes
                  </div>
                  {PRESET_PARTIES.map((preset) => (
                    <button
                      key={preset.config.id}
                      id={`select-preset-${preset.config.id}`}
                      onClick={() => {
                        onSelectPreset(preset);
                        setIsPresetsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex flex-col gap-0.5 ${
                        currentPlan.config.id === preset.config.id
                          ? 'bg-[#FFEAEA] text-[#D9383A] font-bold'
                          : 'text-[#333333] hover:bg-[#FFF9F2]'
                      }`}
                    >
                      <span className="font-semibold">{preset.config.title}</span>
                      <span className="text-xs text-[#636E72]">
                        {preset.config.guestCount.total} Guests • Budget {formatCurrency(preset.config.targetBudget)}
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-[#F0E6D8] mt-1.5 pt-1.5">
                    <button
                      id="dropdown-new-party-btn"
                      onClick={() => {
                        setIsPresetsDropdownOpen(false);
                        onOpenNewPartyModal();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm text-[#FF6B6B] hover:bg-[#FFF0EB] font-bold flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4 text-[#FF6B6B]" />
                      Create Custom Plan with AI...
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Budget Health Pill */}
            <button
              id="navbar-budget-pill-btn"
              onClick={onOpenBudgetModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                isOverBudget
                  ? 'bg-[#FFF0F0] border-[#FFCCD2] text-[#D32F2F] hover:bg-[#FFE5E5]'
                  : 'bg-[#E6FAF7] border-[#A8EDDF] text-[#0D9488] hover:bg-[#D4F7F2]'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>
                {formatCurrency(totalEstimated)} / {formatCurrency(targetBudget)}
              </span>
              <span className="text-[10px] opacity-90 uppercase px-1.5 py-0.2 rounded-md bg-white/70">
                {isOverBudget ? 'Over' : 'On Track'}
              </span>
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="nav-portion-calc-btn"
              onClick={onOpenCalculatorModal}
              title="Catering Portion Calculator"
              className="p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF4E6] text-[#2D3436] hover:text-[#FF6B6B] border border-[#EADFD3] transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs"
            >
              <Calculator className="w-4 h-4 text-[#4ECDC4]" />
              <span className="hidden lg:inline">Portions</span>
            </button>

            <button
              id="nav-timeline-btn"
              onClick={onOpenTimelineModal}
              title="Prep & Shopping Timeline"
              className="p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF4E6] text-[#2D3436] hover:text-[#FF6B6B] border border-[#EADFD3] transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs"
            >
              <Clock className="w-4 h-4 text-[#0D9488]" />
              <span className="hidden lg:inline">Timeline</span>
            </button>

            <button
              id="nav-export-btn"
              onClick={onOpenExportModal}
              title="Export & Print Checklist"
              className="p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF4E6] text-[#2D3436] hover:text-[#FF6B6B] border border-[#EADFD3] transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs"
            >
              <Download className="w-4 h-4 text-[#7E22CE]" />
              <span className="hidden lg:inline">Export</span>
            </button>

            {onOpenCheckoutModal && (
              <button
                id="nav-checkout-btn"
                onClick={onOpenCheckoutModal}
                title="Proceed to Fulfillment & Checkout"
                className="px-3 py-1.5 rounded-xl bg-[#E8FAF7] hover:bg-[#D4F7F2] text-[#0D9488] border border-[#A8EDDF] text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all"
              >
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Checkout</span>
              </button>
            )}

            {/* Voice Control Top Bar Button */}
            {onToggleVoiceListening && (
              <button
                id="nav-voice-control-btn"
                onClick={onToggleVoiceListening}
                title={isVoiceListening ? 'Listening hands-free...' : 'Activate Voice Control'}
                className={`p-2 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs ${
                  isVoiceListening
                    ? 'bg-[#FF6B6B] text-white border-[#FF6B6B] animate-pulse ring-2 ring-[#FF6B6B]/40'
                    : 'bg-[#FFF9F2] hover:bg-[#FFF0EB] text-[#FF6B6B] border-[#FFD3C4]'
                }`}
              >
                {isVoiceListening ? (
                  <>
                    <Radio className="w-4 h-4 animate-spin text-white" />
                    <span className="hidden xl:inline text-white">Voice Active</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-[#FF6B6B]" />
                    <span className="hidden xl:inline">Voice</span>
                  </>
                )}
              </button>
            )}

            <button
              id="nav-new-plan-btn"
              onClick={onOpenNewPartyModal}
              className="px-3 py-1.5 rounded-xl bg-[#FFF4E6] hover:bg-[#FFE6CC] text-[#D97706] border border-[#FDE68A] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <PlusCircle className="w-4 h-4 text-[#D97706]" />
              <span className="hidden sm:inline">New Party</span>
            </button>

            {/* AI Assistant Drawer Trigger */}
            <button
              id="nav-ai-chat-btn"
              onClick={onToggleAiChat}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md ${
                isAiChatOpen
                  ? 'bg-[#FF6B6B] text-white shadow-[#FF6B6B]/30 ring-2 ring-[#FF6B6B]/40'
                  : 'bg-gradient-to-r from-[#FF6B6B] via-[#FF8A5B] to-[#FFE66D] text-slate-950 hover:opacity-95 shadow-[#FF6B6B]/20'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Agent</span>
              <Sparkles className="w-3 h-3 animate-pulse" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
