import React from 'react';
import { 
  X, 
  Mic, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  ShoppingBag, 
  ArrowRight,
  Calculator,
  Calendar,
  Layers,
  CreditCard
} from 'lucide-react';

interface VoiceCommandsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunTestCommand?: (phrase: string) => void;
  voiceAudioEnabled: boolean;
  onToggleVoiceAudio: () => void;
}

export const VoiceCommandsHelpModal: React.FC<VoiceCommandsHelpModalProps> = ({
  isOpen,
  onClose,
  onRunTestCommand,
  voiceAudioEnabled,
  onToggleVoiceAudio,
}) => {
  if (!isOpen) return null;

  const categories = [
    {
      title: 'Party Setup & Planning',
      icon: Sparkles,
      color: 'text-[#FF6B6B]',
      bg: 'bg-[#FFF0EB]',
      commands: [
        '“Plan a Taco Night for 15 adults and 5 kids with budget 250”',
        '“Create a Summer BBQ party for 30 people”',
        '“Plan a formal cocktail evening for 12 guests”',
      ],
    },
    {
      title: 'Shopping List & Cart Updates',
      icon: ShoppingBag,
      color: 'text-[#0D9488]',
      bg: 'bg-[#E8FAF7]',
      commands: [
        '“Add 4 bags of tortilla chips for 12 dollars at Supermarket”',
        '“Check off Ground Beef” (or “I bought the salsa”)',
        '“Remove paper plates from my list”',
        '“Change beer quantity to 3 packs”',
        '“Set price of chicken to 15 dollars”',
      ],
    },
    {
      title: 'Budgeting & Store Filters',
      icon: Layers,
      color: 'text-[#7C3AED]',
      bg: 'bg-[#F3E8FF]',
      commands: [
        '“Set budget to 350 dollars”',
        '“Filter by Costco Wholesale”',
        '“Show only drinks”',
        '“Show all items across stores”',
      ],
    },
    {
      title: 'Navigation & Hands-Free Modals',
      icon: Calculator,
      color: 'text-[#E67E22]',
      bg: 'bg-[#FDF2E9]',
      commands: [
        '“Open portion calculator” (or “Show drink math”)',
        '“Open prep timeline”',
        '“Open cost optimizer” (or “Trim my budget”)',
        '“Open export and printable list”',
        '“Ask CymbalMart Assistant”',
        '“Close dialog” (or “Go back”)',
      ],
    },
    {
      title: 'Fulfillment & Hands-Free Checkout',
      icon: CreditCard,
      color: 'text-[#2D3436]',
      bg: 'bg-[#F5F6F7]',
      commands: [
        '“Proceed to checkout”',
        '“Select Curbside Pickup”',
        '“Select Express Delivery”',
        '“Confirm and place order”',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border-2 border-[#FFD9CE] shadow-2xl p-6 sm:p-8 text-[#2D3436] my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF0EB] text-[#636E72] hover:text-[#2D3436] transition-colors border border-[#EADFD3]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] flex items-center justify-center text-white font-bold shadow-md shadow-[#FF6B6B]/20">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B] bg-[#FFF0EB] px-2.5 py-0.5 rounded-full border border-[#FFD3C4]">
                Hands-Free Voice Control
              </span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-[#2D3436]">
              Voice Command Cheat Sheet
            </h2>
            <p className="text-xs sm:text-sm text-[#636E72]">
              Complete your party planning and shopping hands-free with natural speech.
            </p>
          </div>
        </div>

        {/* Voice Audio Setting Toggle */}
        <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white text-[#0D9488] border border-[#EADFD3]">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2D3436]">Text-to-Speech Verbal Feedback</p>
              <p className="text-[11px] text-[#636E72]">CymbalMart speaks confirmation replies out loud after every action</p>
            </div>
          </div>
          <button
            onClick={onToggleVoiceAudio}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              voiceAudioEnabled
                ? 'bg-[#E8FAF7] text-[#0D9488] border-[#A8EDDF]'
                : 'bg-white text-[#636E72] border-[#EADFD3]'
            }`}
          >
            {voiceAudioEnabled ? 'Voice Audio: ON' : 'Voice Audio: MUTED'}
          </button>
        </div>

        {/* Command Grid */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-[#EADFD3] space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${cat.bg} ${cat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-[#2D3436]">{cat.title}</h3>
                </div>

                <div className="space-y-1.5">
                  {cat.commands.map((cmd, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-[#FCFBF8] border border-[#F0E6D8] hover:bg-[#FFF9F2] transition-colors"
                    >
                      <span className="font-medium text-[#2D3436] italic">{cmd}</span>
                      {onRunTestCommand && (
                        <button
                          onClick={() => {
                            const cleaned = cmd.replace(/^[“"]|[”"]$/g, '');
                            onRunTestCommand(cleaned);
                            onClose();
                          }}
                          className="text-[11px] font-bold text-[#FF6B6B] hover:text-[#ff5252] flex items-center gap-1 ml-2"
                        >
                          <span>Test</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-[#EADFD3] mt-5">
          <p className="text-[11px] text-[#636E72]">
            💡 <strong>Tip:</strong> Toggle <strong>Continuous Mode</strong> in the bottom voice bar for uninterrupted hands-free interaction.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#2D3436] hover:bg-[#1E272C] text-white font-bold text-xs transition-colors"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
