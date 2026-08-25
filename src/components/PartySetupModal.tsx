import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Users, 
  DollarSign, 
  Clock, 
  Utensils, 
  AlertCircle, 
  Flame, 
  Loader2,
  Calendar,
  ChefHat
} from 'lucide-react';
import { PartyConfig, PartyPlan } from '../types';

interface PartySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: (plan: PartyPlan) => void;
  initialConfig?: PartyConfig;
}

export const PartySetupModal: React.FC<PartySetupModalProps> = ({
  isOpen,
  onClose,
  onPlanGenerated,
  initialConfig,
}) => {
  const [title, setTitle] = useState(initialConfig?.title || 'Summer Birthday Splash');
  const [theme, setTheme] = useState(initialConfig?.theme || 'Tropical Island & Cocktail Lounge');
  const [partyType, setPartyType] = useState(initialConfig?.partyType || 'Birthday Celebration');
  const [adults, setAdults] = useState(initialConfig?.guestCount.adults || 16);
  const [kids, setKids] = useState(initialConfig?.guestCount.kids || 4);
  const [toddlers, setToddlers] = useState(initialConfig?.guestCount.toddlers || 0);
  const [durationHours, setDurationHours] = useState(initialConfig?.durationHours || 4);
  const [mealType, setMealType] = useState<PartyConfig['mealType']>(initialConfig?.mealType || 'full_meal');
  const [vibe, setVibe] = useState<PartyConfig['vibe']>(initialConfig?.vibe || 'festive');
  const [targetBudget, setTargetBudget] = useState(initialConfig?.targetBudget || 250);
  const [currency, setCurrency] = useState(initialConfig?.currency || '$');
  
  // Dietary
  const [vegetarian, setVegetarian] = useState(initialConfig?.dietary.vegetarian || 2);
  const [vegan, setVegan] = useState(initialConfig?.dietary.vegan || 1);
  const [glutenFree, setGlutenFree] = useState(initialConfig?.dietary.glutenFree || 2);
  const [nutFree, setNutFree] = useState(initialConfig?.dietary.nutFree || 0);
  const [dairyFree, setDairyFree] = useState(initialConfig?.dietary.dairyFree || 2);
  const [halal, setHalal] = useState(initialConfig?.dietary.halal || 0);
  const [dietaryNotes, setDietaryNotes] = useState(initialConfig?.dietary.otherNotes || '');

  // Equipment
  const [hasGrill, setHasGrill] = useState(initialConfig?.equipment?.hasGrill ?? true);
  const [hasOven, setHasOven] = useState(initialConfig?.equipment?.hasOven ?? true);
  const [hasBlender, setHasBlender] = useState(initialConfig?.equipment?.hasBlender ?? true);
  const [hasCoolers, setHasCoolers] = useState(initialConfig?.equipment?.hasCoolers ?? true);
  const [needsDisposableTableware, setNeedsDisposableTableware] = useState(initialConfig?.equipment?.needsDisposableTableware ?? true);
  const [indoorOutdoor, setIndoorOutdoor] = useState<'indoor' | 'outdoor' | 'both'>(initialConfig?.equipment?.indoorOutdoor || 'both');

  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalGuests = adults + kids + toddlers;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const config: PartyConfig = {
      id: `party-${Date.now()}`,
      title,
      theme,
      partyType,
      guestCount: {
        adults,
        kids,
        toddlers,
        total: totalGuests,
      },
      durationHours,
      mealType,
      vibe,
      targetBudget,
      currency,
      dietary: {
        vegetarian,
        vegan,
        glutenFree,
        nutFree,
        dairyFree,
        halal,
        kosher: 0,
        otherNotes: dietaryNotes,
      },
      equipment: {
        hasGrill,
        hasOven,
        hasBlender,
        hasCoolers,
        hasChafingDishes: false,
        needsDisposableTableware,
        indoorOutdoor,
      },
      notes: customPrompt,
    };

    try {
      const res = await fetch('/api/plan-party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partyConfig: config, customPrompt }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const newPlan: PartyPlan = {
        config,
        items: data.items || [],
        timeline: data.timeline || [],
        aiSummary: data.aiSummary || 'AI Generated Party Plan and Smart Shopping List.',
        cateringHighlights: data.cateringHighlights || {
          foodPortionSummary: `Calculated for ${totalGuests} guests.`,
          drinkPortionSummary: `${durationHours} hours hydration plan.`,
          budgetHealth: `Target: ${currency}${targetBudget}`,
          topSavingsTip: 'Purchase proteins and drinks at wholesale club.',
        },
      };

      onPlanGenerated(newPlan);
      onClose();
    } catch (err: any) {
      console.error('Failed to generate plan:', err);
      setError(err.message || 'Failed to generate party shopping plan. Please check server and API key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border-2 border-[#FFD9CE] shadow-2xl p-6 sm:p-8 text-[#2D3436] my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          id="close-party-setup-btn"
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
                Step 1: Define Event
              </span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-[#2D3436]">
              Plan Event & Shopping List
            </h2>
            <p className="text-xs sm:text-sm text-[#636E72]">
              Set party type, theme, budget, guest count & special requests for CymbalMart.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
            <div>
              <span className="font-bold">Planning Error: </span>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-5">
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#636E72] uppercase tracking-wider mb-1.5">
                Party Title / Occasion
              </label>
              <input
                id="party-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Leo's 30th Birthday Fiesta"
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] text-[#2D3436] focus:outline-none focus:border-[#FF6B6B] text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#636E72] uppercase tracking-wider mb-1.5">
                Theme / Cuisine Focus
              </label>
              <input
                id="party-theme-input"
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. Street Tacos & Margarita Lounge, Luau BBQ"
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] text-[#2D3436] focus:outline-none focus:border-[#FF6B6B] text-xs font-medium"
              />
            </div>
          </div>

          {/* Guest Breakdown & Duration */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#2D3436] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#4ECDC4]" /> Guest Count & Portions ({totalGuests} Total)
              </span>
              <span className="text-[11px] text-[#636E72]">
                Catering formulas scale quantities
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#636E72] mb-1">Adults (18+)</label>
                <input
                  id="guest-adults-input"
                  type="number"
                  min="1"
                  max="200"
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADFD3] text-[#2D3436] text-center font-extrabold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#636E72] mb-1">Kids (4-17)</label>
                <input
                  id="guest-kids-input"
                  type="number"
                  min="0"
                  max="100"
                  value={kids}
                  onChange={(e) => setKids(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADFD3] text-[#2D3436] text-center font-extrabold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#636E72] mb-1">Toddlers (0-3)</label>
                <input
                  id="guest-toddlers-input"
                  type="number"
                  min="0"
                  max="50"
                  value={toddlers}
                  onChange={(e) => setToddlers(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADFD3] text-[#2D3436] text-center font-extrabold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#636E72] mb-1">Duration (Hours)</label>
                <input
                  id="party-duration-input"
                  type="number"
                  min="1"
                  max="12"
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADFD3] text-[#2D3436] text-center font-extrabold"
                />
              </div>
            </div>
          </div>

          {/* Meal Style & Target Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#636E72] uppercase tracking-wider mb-1.5">
                Meal & Food Style
              </label>
              <select
                id="meal-type-select"
                value={mealType}
                onChange={(e) => setMealType(e.target.value as PartyConfig['mealType'])}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] text-[#2D3436] focus:outline-none focus:border-[#FF6B6B] text-xs font-bold"
              >
                <option value="full_meal">Full Meal / Main Course Buffet</option>
                <option value="bbq_cookout">Backyard BBQ / Smokeout Grill</option>
                <option value="heavy_appetizers">Heavy Appetizers & Grazing Tapas</option>
                <option value="light_snacks">Light Snacks & Finger Foods</option>
                <option value="drinks_dessert">Drinks, Cocktails & Dessert Bar</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#636E72] uppercase tracking-wider">
                  Target Budget
                </label>
                <span className="text-xs font-extrabold text-[#FF6B6B]">${targetBudget}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="budget-range-input"
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(parseInt(e.target.value))}
                  className="w-full accent-[#FF6B6B] h-2 bg-[#F0E6D8] rounded-lg cursor-pointer"
                />
                <div className="relative w-24">
                  <span className="absolute left-2.5 top-2 text-[#636E72] text-xs font-bold">$</span>
                  <input
                    id="budget-number-input"
                    type="number"
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(parseInt(e.target.value) || 0)}
                    className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-white border border-[#EADFD3] text-[#2D3436] text-xs font-extrabold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dietary Restrictions Matrix */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] space-y-3">
            <span className="text-xs font-extrabold text-[#0D9488] uppercase tracking-wider flex items-center gap-1.5">
              <ChefHat className="w-4 h-4" /> Dietary Preferences & Allergy Breakdown
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#636E72] mb-1">Vegetarian</label>
                <input
                  id="diet-veg-input"
                  type="number"
                  min="0"
                  max={totalGuests}
                  value={vegetarian}
                  onChange={(e) => setVegetarian(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#EADFD3] text-center text-xs font-bold text-[#2D3436]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#636E72] mb-1">Vegan</label>
                <input
                  id="diet-vegan-input"
                  type="number"
                  min="0"
                  max={totalGuests}
                  value={vegan}
                  onChange={(e) => setVegan(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#EADFD3] text-center text-xs font-bold text-[#2D3436]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#636E72] mb-1">Gluten-Free</label>
                <input
                  id="diet-gf-input"
                  type="number"
                  min="0"
                  max={totalGuests}
                  value={glutenFree}
                  onChange={(e) => setGlutenFree(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#EADFD3] text-center text-xs font-bold text-[#2D3436]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#636E72] mb-1">Dairy-Free</label>
                <input
                  id="diet-df-input"
                  type="number"
                  min="0"
                  max={totalGuests}
                  value={dairyFree}
                  onChange={(e) => setDairyFree(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#EADFD3] text-center text-xs font-bold text-[#2D3436]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#636E72] mb-1">Halal / Other</label>
                <input
                  id="diet-halal-input"
                  type="number"
                  min="0"
                  max={totalGuests}
                  value={halal}
                  onChange={(e) => setHalal(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#EADFD3] text-center text-xs font-bold text-[#2D3436]"
                />
              </div>
            </div>
            <div>
              <input
                id="dietary-notes-input"
                type="text"
                value={dietaryNotes}
                onChange={(e) => setDietaryNotes(e.target.value)}
                placeholder="Specific allergy notes (e.g. Peanut allergy for 1 child, keep nuts off table)"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADFD3] text-xs text-[#2D3436] placeholder-[#A0AAB0]"
              />
            </div>
          </div>

          {/* Equipment & Venue Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] cursor-pointer hover:bg-[#FFF2E8] transition-colors">
              <input
                type="checkbox"
                checked={hasGrill}
                onChange={(e) => setHasGrill(e.target.checked)}
                className="rounded accent-[#FF6B6B]"
              />
              <span className="font-semibold text-[#2D3436]">Has BBQ Grill</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] cursor-pointer hover:bg-[#FFF2E8] transition-colors">
              <input
                type="checkbox"
                checked={hasBlender}
                onChange={(e) => setHasBlender(e.target.checked)}
                className="rounded accent-[#FF6B6B]"
              />
              <span className="font-semibold text-[#2D3436]">Has Blender</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] cursor-pointer hover:bg-[#FFF2E8] transition-colors">
              <input
                type="checkbox"
                checked={hasCoolers}
                onChange={(e) => setHasCoolers(e.target.checked)}
                className="rounded accent-[#FF6B6B]"
              />
              <span className="font-semibold text-[#2D3436]">Has Coolers</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] cursor-pointer hover:bg-[#FFF2E8] transition-colors">
              <input
                type="checkbox"
                checked={needsDisposableTableware}
                onChange={(e) => setNeedsDisposableTableware(e.target.checked)}
                className="rounded accent-[#FF6B6B]"
              />
              <span className="font-semibold text-[#2D3436]">Needs Disposables</span>
            </label>
          </div>

          {/* Custom Host Wishes */}
          <div>
            <label className="block text-xs font-bold text-[#636E72] uppercase tracking-wider mb-1.5">
              Specific Requests / Special Requests
            </label>
            <textarea
              id="custom-wishes-input"
              rows={2}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Include signature passionfruit spritz, chocolate cupcakes, and prioritize CymbalMart bulk club packs."
              className="w-full px-3.5 py-2 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] text-[#2D3436] focus:outline-none focus:border-[#FF6B6B] text-xs"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              id="cancel-party-setup-btn"
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF4EB] border border-[#EADFD3] text-[#636E72] text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              id="generate-plan-submit-btn"
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6B6B] via-[#FF8A5B] to-[#FFE66D] hover:opacity-95 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#FF6B6B]/25 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Agent Planning & Calculating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Generate Shopping Plan</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
