import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  DollarSign, 
  TrendingDown, 
  ArrowRight, 
  Check, 
  Loader2, 
  AlertCircle,
  ShoppingBag,
  Store,
  Layers
} from 'lucide-react';
import { PartyPlan, ShoppingItem } from '../types';
import { formatCurrency } from '../utils/calculator';

interface CostOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PartyPlan;
  onApplyOptimizedPlan: (newItems: ShoppingItem[]) => void;
}

export const CostOptimizerModal: React.FC<CostOptimizerModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onApplyOptimizedPlan,
}) => {
  const currentTotal = currentPlan.items.reduce((sum, it) => sum + it.estimatedTotalPrice, 0);
  const [targetBudgetInput, setTargetBudgetInput] = useState(
    Math.min(currentPlan.config.targetBudget, Math.round(currentTotal * 0.8))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<{
    savingsSummary: string;
    totalSavedAmount: number;
    newTotalEstimate: number;
    optimizationTips: string[];
    updatedItems: ShoppingItem[];
  } | null>(null);

  if (!isOpen) return null;

  const currency = currentPlan.config.currency || '$';

  const handleRunOptimizer = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/cost-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPlan,
          targetBudget: targetBudgetInput,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to run AI budget optimization');
      }

      const data = await res.json();
      setOptimizationResult(data);
    } catch (err: any) {
      console.error('Error optimizing budget:', err);
      setError(err.message || 'Optimization failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (optimizationResult?.updatedItems) {
      onApplyOptimizedPlan(optimizationResult.updatedItems);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border-2 border-[#FFD9CE] shadow-2xl p-6 sm:p-8 text-[#2D3436] my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          id="close-cost-optimizer-btn"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF0EB] text-[#636E72] hover:text-[#2D3436] transition-colors border border-[#EADFD3]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] flex items-center justify-center text-white font-bold shadow-md shadow-[#FF6B6B]/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B] bg-[#FFF0EB] px-2.5 py-0.5 rounded-full border border-[#FFD3C4]">
                Budget AI Tuning
              </span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-[#2D3436]">
              Budget Trimmer & Cost Optimizer
            </h2>
            <p className="text-xs sm:text-sm text-[#636E72]">
              Gemini analyzes your list to discover wholesale switches, ingredient swaps, and quantity refinements without lowering guest satisfaction.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Current vs Target Selector */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-3.5 rounded-xl bg-white border border-[#EADFD3]">
              <span className="text-xs text-[#636E72] font-bold uppercase block mb-1">
                Current Cart Total
              </span>
              <span className="text-2xl font-extrabold text-[#2D3436] font-display">
                {formatCurrency(currentTotal, currency)}
              </span>
              <p className="text-[11px] text-[#636E72] mt-0.5 font-medium">
                {currentPlan.items.length} items across {currentPlan.config.guestCount.total} guests
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border-2 border-[#FFD3C4]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#FF6B6B] font-extrabold uppercase">
                  Target Budget Goal
                </span>
                <span className="text-sm font-extrabold text-[#FF6B6B] font-display">
                  {formatCurrency(targetBudgetInput, currency)}
                </span>
              </div>
              <input
                type="range"
                min={Math.round(currentTotal * 0.4)}
                max={Math.round(currentTotal * 1.1)}
                step="10"
                value={targetBudgetInput}
                onChange={(e) => setTargetBudgetInput(parseInt(e.target.value))}
                className="w-full accent-[#FF6B6B] h-2 bg-[#F0E6D8] rounded-lg cursor-pointer my-2"
              />
              <span className="text-[10px] text-[#636E72] block font-medium">
                Potential Savings: {formatCurrency(Math.max(0, currentTotal - targetBudgetInput), currency)}
              </span>
            </div>

          </div>

          <div className="flex justify-end">
            <button
              id="run-ai-optimizer-btn"
              onClick={handleRunOptimizer}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-2xl bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-[#FF6B6B]/20 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Agent Finding Savings...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FFE66D]" />
                  <span>Optimize List to {formatCurrency(targetBudgetInput, currency)}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optimization Results */}
        {optimizationResult && (
          <div className="space-y-4 p-5 rounded-2xl bg-[#E8FAF7] border border-[#A8EDDF]">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#A8EDDF]">
              <div>
                <span className="text-xs font-extrabold text-[#0D9488] uppercase tracking-wider block">
                  Optimization Achieved!
                </span>
                <h3 className="text-lg font-extrabold text-[#2D3436] font-display">
                  Saved {formatCurrency(optimizationResult.totalSavedAmount, currency)} ({formatCurrency(currentTotal, currency)} → {formatCurrency(optimizationResult.newTotalEstimate, currency)})
                </h3>
              </div>
              <button
                id="apply-optimized-list-btn"
                onClick={handleApply}
                className="px-5 py-2 rounded-xl bg-[#0D9488] hover:bg-[#0f766e] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
              >
                <Check className="w-4 h-4" /> Apply Optimized List
              </button>
            </div>

            <p className="text-xs text-[#2D3436] leading-relaxed font-medium">
              {optimizationResult.savingsSummary}
            </p>

            {/* Savings Tips List */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-[#2D3436] block">Key Ingredient & Store Actions:</span>
              <ul className="space-y-1 text-xs text-[#636E72]">
                {optimizationResult.optimizationTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#FF6B6B] font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#EADFD3] mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF4EB] border border-[#EADFD3] text-[#636E72] font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
