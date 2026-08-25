import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Layers, 
  Flame, 
  CreditCard, 
  ChevronRight, 
  AlertCircle,
  TrendingDown,
  ShoppingBag,
  Clock,
  ChefHat
} from 'lucide-react';
import { PartyPlan } from '../types';
import { formatCurrency } from '../utils/calculator';

interface CUJStepperBarProps {
  plan: PartyPlan;
  onOpenDefineEvent: () => void;
  onOpenReviewBudget: () => void;
  onOpenPortionMath: () => void;
  onOpenCostOptimizer: () => void;
  onOpenCheckout: () => void;
}

export const CUJStepperBar: React.FC<CUJStepperBarProps> = ({
  plan,
  onOpenDefineEvent,
  onOpenReviewBudget,
  onOpenPortionMath,
  onOpenCostOptimizer,
  onOpenCheckout,
}) => {
  const currency = plan.config.currency || '$';
  const totalCost = plan.items.reduce((s, it) => s + it.estimatedTotalPrice, 0);
  const targetBudget = plan.config.targetBudget;
  const isOverBudget = totalCost > targetBudget;
  const budgetDelta = Math.abs(targetBudget - totalCost);
  const purchasedCount = plan.items.filter(it => it.purchased).length;
  const isComplete = plan.items.length > 0 && purchasedCount === plan.items.length;

  return (
    <div className="w-full rounded-3xl bg-white border-2 border-[#EADFD3] p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0E6D8] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] flex items-center justify-center text-white shadow-xs">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF6B6B]">
              CymbalMart Host Workflow
            </span>
            <h3 className="font-display font-bold text-sm text-[#2D3436]">
              3-Step Event Planning & Budget Journey
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#636E72]">Host Goal:</span>
          <span className="font-bold text-[#2D3436] bg-[#FFF9F2] px-2.5 py-1 rounded-full border border-[#EADFD3]">
            Intent → Curated, Budget-Aligned Shopping List
          </span>
        </div>
      </div>

      {/* 3 Interactive Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Step 1: Define Event */}
        <div 
          id="cuj-task-define-event"
          onClick={onOpenDefineEvent}
          className="group cursor-pointer p-4 rounded-2xl bg-[#FFF9F2] hover:bg-[#FFF2EB] border-2 border-[#FFD9CE] transition-all hover:shadow-sm relative flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF6B6B] bg-white px-2 py-0.5 rounded-full border border-[#FFD3C4]">
                Task 1: Define Event
              </span>
              <span className="text-xs font-extrabold text-[#FF6B6B] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Edit <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <h4 className="font-display font-bold text-sm text-[#2D3436] group-hover:text-[#FF6B6B] transition-colors">
                {plan.config.title}
              </h4>
              <p className="text-[11px] text-[#636E72] line-clamp-1 mt-0.5">
                Theme: {plan.config.theme}
              </p>
            </div>

            {/* Quick Specs Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#EADFD3] text-[#2D3436] flex items-center gap-1">
                <Users className="w-3 h-3 text-[#0D9488]" />
                {plan.config.guestCount.total} Guests ({plan.config.guestCount.adults}A, {plan.config.guestCount.kids}K)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#EADFD3] text-[#2D3436] flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-[#FF6B6B]" />
                {formatCurrency(plan.config.targetBudget, currency)} Budget
              </span>
              {(plan.config.dietary.vegetarian > 0 || plan.config.dietary.vegan > 0 || plan.config.dietary.glutenFree > 0) && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8FAF7] border border-[#A8EDDF] text-[#0D9488] flex items-center gap-1">
                  <ChefHat className="w-3 h-3" />
                  Dietary Accommodated
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Review List */}
        <div 
          id="cuj-task-review-list"
          onClick={onOpenReviewBudget}
          className={`group cursor-pointer p-4 rounded-2xl transition-all hover:shadow-sm relative flex flex-col justify-between border-2 ${
            isOverBudget 
              ? 'bg-rose-50/50 hover:bg-rose-50 border-rose-200' 
              : 'bg-[#F0FAF7] hover:bg-[#E4F7F2] border-[#A8EDDF]'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-white ${
                isOverBudget ? 'text-rose-600 border-rose-200' : 'text-[#0D9488] border-[#A8EDDF]'
              }`}>
                Task 2: Review List
              </span>
              <span className="text-xs font-extrabold text-[#0D9488] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Analytics <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <h4 className="font-display font-bold text-sm text-[#2D3436]">
                  {plan.items.length} Items Total
                </h4>
                <span className={`text-xs font-extrabold ${isOverBudget ? 'text-rose-600' : 'text-[#0D9488]'}`}>
                  {formatCurrency(totalCost, currency)}
                </span>
              </div>
              <p className="text-[11px] text-[#636E72] mt-0.5">
                {isOverBudget ? (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    Over target by {formatCurrency(budgetDelta, currency)}
                  </span>
                ) : (
                  <span className="text-[#0D9488] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                    Aligned! Under budget by {formatCurrency(budgetDelta, currency)}
                  </span>
                )}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPortionMath();
                }}
                className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white border border-[#EADFD3] text-[#2D3436] hover:bg-[#FFF9F2] transition-colors"
              >
                Portion Math
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReviewBudget();
                }}
                className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white border border-[#EADFD3] text-[#2D3436] hover:bg-[#FFF9F2] transition-colors"
              >
                Store Splits
              </button>
            </div>
          </div>
        </div>

        {/* Step 3: Refine & Checkout */}
        <div 
          id="cuj-task-refine-checkout"
          onClick={onOpenCheckout}
          className="group cursor-pointer p-4 rounded-2xl bg-gradient-to-tr from-[#FFF0EB] via-[#FFF9F2] to-[#FFFDF9] hover:from-[#FFE6DF] border-2 border-[#FFD9CE] transition-all hover:shadow-sm relative flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF6B6B] bg-white px-2 py-0.5 rounded-full border border-[#FFD3C4]">
                Task 3: Refine & Checkout
              </span>
              <span className="text-xs font-extrabold text-[#FF6B6B] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Checkout <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <h4 className="font-display font-bold text-sm text-[#2D3436] group-hover:text-[#FF6B6B] transition-colors flex items-center justify-between">
                <span>Fulfillment Ready</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8FAF7] text-[#0D9488] border border-[#A8EDDF]">
                  Bay 4 Curbside
                </span>
              </h4>
              <p className="text-[11px] text-[#636E72] mt-0.5">
                Adjust constraints, swap store brands, or place order.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCostOptimizer();
                }}
                className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-white border border-[#FFD3C4] text-[#FF6B6B] hover:bg-[#FFF0EB] transition-colors flex items-center gap-1"
              >
                <Flame className="w-3 h-3 text-[#FF8A5B]" />
                Trim / Optimize
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCheckout();
                }}
                className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-[#FF6B6B] text-white hover:bg-[#ff5252] shadow-xs transition-colors flex items-center gap-1 ml-auto"
              >
                <CreditCard className="w-3 h-3" />
                Place Order
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
