import React from 'react';
import { 
  X, 
  PieChart, 
  DollarSign, 
  TrendingUp, 
  Store, 
  Sparkles, 
  Layers, 
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ShoppingItem, PartyConfig, ItemCategory, StoreType } from '../types';
import { CATEGORY_METADATA, STORE_BADGES, formatCurrency } from '../utils/calculator';

interface BudgetAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingItem[];
  config: PartyConfig;
  cateringHighlights?: {
    foodPortionSummary: string;
    drinkPortionSummary: string;
    budgetHealth: string;
    topSavingsTip: string;
  };
  onOpenCostOptimizer: () => void;
}

export const BudgetAnalyticsModal: React.FC<BudgetAnalyticsModalProps> = ({
  isOpen,
  onClose,
  items,
  config,
  cateringHighlights,
  onOpenCostOptimizer,
}) => {
  if (!isOpen) return null;

  const currency = config.currency || '$';
  const targetBudget = config.targetBudget;
  const totalEstimated = items.reduce((sum, it) => sum + it.estimatedTotalPrice, 0);
  const totalPurchased = items.filter(it => it.purchased).reduce((sum, it) => sum + (it.actualPrice || it.estimatedTotalPrice), 0);
  const remaining = targetBudget - totalEstimated;
  const isOverBudget = totalEstimated > targetBudget;

  // Category breakdown
  const categoryTotals: Partial<Record<ItemCategory, { count: number; total: number }>> = {};
  items.forEach(it => {
    if (!categoryTotals[it.category]) {
      categoryTotals[it.category] = { count: 0, total: 0 };
    }
    categoryTotals[it.category]!.count += 1;
    categoryTotals[it.category]!.total += it.estimatedTotalPrice;
  });

  // Store breakdown
  const storeTotals: Partial<Record<StoreType, { count: number; total: number }>> = {};
  items.forEach(it => {
    if (!storeTotals[it.recommendedStore]) {
      storeTotals[it.recommendedStore] = { count: 0, total: 0 };
    }
    storeTotals[it.recommendedStore]!.count += 1;
    storeTotals[it.recommendedStore]!.total += it.estimatedTotalPrice;
  });

  const sortedCategories = (Object.keys(categoryTotals) as ItemCategory[]).sort((a, b) => {
    return (categoryTotals[b]?.total || 0) - (categoryTotals[a]?.total || 0);
  });

  const sortedStores = (Object.keys(storeTotals) as StoreType[]).sort((a, b) => {
    return (storeTotals[b]?.total || 0) - (storeTotals[a]?.total || 0);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border-2 border-[#FFD9CE] shadow-2xl p-6 sm:p-8 text-[#2D3436] my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          id="close-budget-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF0EB] text-[#636E72] hover:text-[#2D3436] transition-colors border border-[#EADFD3]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] flex items-center justify-center text-white font-bold shadow-md shadow-[#FF6B6B]/20">
            <PieChart className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B] bg-[#FFF0EB] px-2.5 py-0.5 rounded-full border border-[#FFD3C4]">
                Step 2: Review List
              </span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-[#2D3436]">
              Party Budget & Store Run Analytics
            </h2>
            <p className="text-xs sm:text-sm text-[#636E72]">
              Detailed cost distributions across grocery stores and culinary categories.
            </p>
          </div>
        </div>

        {/* Top Summary Barometer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          
          <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3]">
            <span className="text-xs font-bold text-[#636E72] uppercase tracking-wider block mb-1">
              Target Budget
            </span>
            <span className="text-2xl font-extrabold text-[#2D3436] font-display">
              {formatCurrency(targetBudget, currency)}
            </span>
            <p className="text-[11px] text-[#636E72] mt-1 font-medium">
              For {config.guestCount.total} guests ({formatCurrency(targetBudget / (config.guestCount.total || 1), currency)}/guest)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3]">
            <span className="text-xs font-bold text-[#636E72] uppercase tracking-wider block mb-1">
              Estimated Total Cost
            </span>
            <span className="text-2xl font-extrabold text-[#FF6B6B] font-display">
              {formatCurrency(totalEstimated, currency)}
            </span>
            <p className="text-[11px] text-[#636E72] mt-1 font-medium">
              {items.length} total items in shopping plan
            </p>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isOverBudget ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <span className={`text-xs font-extrabold uppercase tracking-wider block mb-1 ${
              isOverBudget ? 'text-rose-700' : 'text-emerald-700'
            }`}>
              {isOverBudget ? 'Budget Overrun' : 'Remaining Savings Buffer'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-extrabold font-display ${
                isOverBudget ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {formatCurrency(Math.abs(remaining), currency)}
              </span>
              <span className="text-xs opacity-80 font-bold">{isOverBudget ? 'over target' : 'under target'}</span>
            </div>
            {isOverBudget && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCostOptimizer();
                }}
                className="mt-2 text-xs font-extrabold text-[#FF6B6B] hover:text-[#ff5252] underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Launch AI Cost Optimizer
              </button>
            )}
          </div>

        </div>

        {/* AI Health Assessment */}
        {cateringHighlights && (
          <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] mb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#FF6B6B] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Agent Catering Health Assessment
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-[#EADFD3]">
                <span className="font-bold text-[#2D3436] block mb-1">Portioning Strategy:</span>
                <p className="text-[#636E72]">{cateringHighlights.foodPortionSummary}</p>
                <p className="text-[#636E72] mt-1">{cateringHighlights.drinkPortionSummary}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#EADFD3]">
                <span className="font-bold text-[#2D3436] block mb-1">Top Money Saver:</span>
                <p className="text-[#636E72]">{cateringHighlights.topSavingsTip}</p>
              </div>
            </div>
          </div>
        )}

        {/* Two Columns: Store Run Breakdown vs Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Store Breakdown */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0D9488] uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-4 h-4" /> Spend by Retailer / Store
              </span>
              <span className="text-xs text-[#636E72] font-semibold">{sortedStores.length} Stores</span>
            </div>

            <div className="space-y-3 pt-1">
              {sortedStores.map(storeName => {
                const data = storeTotals[storeName]!;
                const percentage = totalEstimated > 0 ? Math.round((data.total / totalEstimated) * 100) : 0;
                const badge = STORE_BADGES[storeName] || { bg: 'bg-neutral-100', text: storeName };

                return (
                  <div key={storeName} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#2D3436]">{badge.text}</span>
                      <span className="font-extrabold text-[#2D3436]">
                        {formatCurrency(data.total, currency)} <span className="text-[10px] text-[#636E72] font-normal">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F0E6D8] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#0D9488] rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#FF6B6B] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Spend by Category
              </span>
              <span className="text-xs text-[#636E72] font-semibold">{sortedCategories.length} Categories</span>
            </div>

            <div className="space-y-3 pt-1">
              {sortedCategories.map(catKey => {
                const data = categoryTotals[catKey]!;
                const meta = CATEGORY_METADATA[catKey];
                const percentage = totalEstimated > 0 ? Math.round((data.total / totalEstimated) * 100) : 0;

                return (
                  <div key={catKey} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#2D3436]">{meta?.label || catKey}</span>
                      <span className="font-extrabold text-[#2D3436]">
                        {formatCurrency(data.total, currency)} <span className="text-[10px] text-[#636E72] font-normal">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F0E6D8] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF8A5B] to-[#FF6B6B] rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#EADFD3]">
          <button
            onClick={() => {
              onClose();
              onOpenCostOptimizer();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            AI Cost Optimizer
          </button>
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
