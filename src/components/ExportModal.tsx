import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Share2, 
  Store, 
  Download,
  Upload
} from 'lucide-react';
import { PartyPlan, StoreType } from '../types';
import { formatCurrency, CATEGORY_METADATA } from '../utils/calculator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan;
  onImportPlan?: (importedPlan: PartyPlan) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  plan,
  onImportPlan,
}) => {
  const [copiedType, setCopiedType] = useState<'text' | 'json' | null>(null);

  if (!isOpen) return null;

  const currency = plan.config.currency || '$';
  const totalCost = plan.items.reduce((s, it) => s + it.estimatedTotalPrice, 0);

  // Group items by store for easy shopping trips
  const storeGroups: Record<string, typeof plan.items> = {};
  plan.items.forEach(it => {
    if (!storeGroups[it.recommendedStore]) storeGroups[it.recommendedStore] = [];
    storeGroups[it.recommendedStore].push(it);
  });

  // Generate plain text formatted list for SMS/WhatsApp
  const generateTextMessage = () => {
    let text = `🎉 ${plan.config.title} - Shopping List\n`;
    text += `👥 Guests: ${plan.config.guestCount.total} (${plan.config.guestCount.adults} Adults, ${plan.config.guestCount.kids} Kids) | Budget: ${formatCurrency(plan.config.targetBudget, currency)}\n`;
    text += `💰 Estimated Total: ${formatCurrency(totalCost, currency)}\n\n`;

    Object.keys(storeGroups).forEach(storeName => {
      const items = storeGroups[storeName];
      const storeTotal = items.reduce((s, it) => s + it.estimatedTotalPrice, 0);
      text += `📍 ${storeName.toUpperCase()} (${formatCurrency(storeTotal, currency)})\n`;
      items.forEach(it => {
        text += `  [ ] ${it.name} - ${it.quantity} ${it.unit} (~${formatCurrency(it.estimatedTotalPrice, currency)})\n`;
      });
      text += `\n`;
    });

    return text;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateTextMessage());
      setCopiedType('text');
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(plan, null, 2));
      setCopiedType('json');
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border-2 border-[#FFD9CE] shadow-2xl p-6 sm:p-8 text-[#2D3436] my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          id="close-export-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF0EB] text-[#636E72] hover:text-[#2D3436] transition-colors border border-[#EADFD3] no-print"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 no-print">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] flex items-center justify-center text-white font-bold shadow-md shadow-[#FF6B6B]/20">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B] bg-[#FFF0EB] px-2.5 py-0.5 rounded-full border border-[#FFD3C4]">
                Share & Export
              </span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-[#2D3436]">
              Export & Print Shopping List
            </h2>
            <p className="text-xs sm:text-sm text-[#636E72]">
              Copy organized SMS/WhatsApp checklists or print a physical store checklist.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-6 no-print">
          <button
            id="copy-sms-checklist-btn"
            onClick={handleCopyText}
            className="px-4 py-2.5 rounded-xl bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#FF6B6B]/20"
          >
            {copiedType === 'text' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedType === 'text' ? 'Copied to Clipboard!' : 'Copy Formatted Text (SMS/WhatsApp)'}</span>
          </button>

          <button
            id="print-checklist-btn"
            onClick={handleTriggerPrint}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFF9F2] text-[#2D3436] font-bold text-xs flex items-center gap-2 border border-[#EADFD3] transition-colors"
          >
            <Printer className="w-4 h-4 text-[#0D9488]" />
            <span>Print Physical Checklist</span>
          </button>

          <button
            id="copy-json-btn"
            onClick={handleCopyJSON}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFF9F2] text-[#2D3436] font-bold text-xs flex items-center gap-2 border border-[#EADFD3] transition-colors"
          >
            <Download className="w-4 h-4 text-[#7C3AED]" />
            <span>{copiedType === 'json' ? 'JSON Copied!' : 'Export JSON'}</span>
          </button>
        </div>

        {/* Printable/Formatted Preview */}
        <div className="p-5 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] text-[#2D3436] max-h-96 overflow-y-auto font-mono text-xs leading-relaxed space-y-4">
          
          <div className="border-b border-[#EADFD3] pb-3">
            <h3 className="font-bold text-base text-[#2D3436] font-sans">
              {plan.config.title}
            </h3>
            <p className="text-[#636E72] font-sans text-xs mt-0.5">
              Theme: {plan.config.theme} • {plan.config.guestCount.total} Guests • Budget: {formatCurrency(plan.config.targetBudget, currency)} • Est. Total: {formatCurrency(totalCost, currency)}
            </p>
          </div>

          {Object.keys(storeGroups).map(storeName => {
            const items = storeGroups[storeName];
            const storeSubtotal = items.reduce((s, it) => s + it.estimatedTotalPrice, 0);

            return (
              <div key={storeName} className="space-y-1.5 pt-2">
                <div className="font-extrabold text-[#FF6B6B] font-sans flex items-center justify-between border-b border-[#EADFD3] pb-1">
                  <span>📍 {storeName.toUpperCase()}</span>
                  <span>{formatCurrency(storeSubtotal, currency)}</span>
                </div>
                <div className="space-y-1 pl-2 text-[#2D3436]">
                  {items.map(it => (
                    <div key={it.id} className="flex items-center justify-between">
                      <span>[ ] {it.name} ({it.quantity} {it.unit})</span>
                      <span className="text-[#636E72] font-medium">{formatCurrency(it.estimatedTotalPrice, currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#EADFD3] mt-6 no-print">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#2D3436] hover:bg-[#1E272C] text-white font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
