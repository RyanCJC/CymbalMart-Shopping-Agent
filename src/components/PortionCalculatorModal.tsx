import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  Users, 
  Clock, 
  Wine, 
  GlassWater, 
  Utensils, 
  Snowflake, 
  Cake, 
  Flame, 
  Sparkles,
  Info,
  Layers
} from 'lucide-react';
import { PartyConfig } from '../types';
import { calculateCateringNeeds } from '../utils/calculator';

interface PortionCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PartyConfig;
  onApplyPortions?: (calculated: ReturnType<typeof calculateCateringNeeds>) => void;
}

export const PortionCalculatorModal: React.FC<PortionCalculatorModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [adults, setAdults] = useState(config.guestCount.adults || 16);
  const [kids, setKids] = useState(config.guestCount.kids || 4);
  const [toddlers, setToddlers] = useState(config.guestCount.toddlers || 0);
  const [duration, setDuration] = useState(config.durationHours || 4);
  const [mealType, setMealType] = useState<PartyConfig['mealType']>(config.mealType || 'full_meal');

  if (!isOpen) return null;

  const totalGuests = adults + kids + toddlers;
  const estimates = calculateCateringNeeds(adults, kids, toddlers, duration, mealType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border-2 border-[#FFD9CE] shadow-2xl p-6 sm:p-8 text-[#2D3436] my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          id="close-portion-calc-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF0EB] text-[#636E72] hover:text-[#2D3436] transition-colors border border-[#EADFD3]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] flex items-center justify-center text-white font-bold shadow-md shadow-[#FF6B6B]/20">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B] bg-[#FFF0EB] px-2.5 py-0.5 rounded-full border border-[#FFD3C4]">
                Catering Math Engine
              </span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-[#2D3436]">
              Interactive Catering Portion Calculator
            </h2>
            <p className="text-xs sm:text-sm text-[#636E72]">
              Industry standard catering rule-of-thumb formulas calibrated for your guest count and party duration.
            </p>
          </div>
        </div>

        {/* Sliders Workbench */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            <div>
              <div className="flex justify-between text-xs font-bold text-[#636E72] mb-1">
                <span>Adults (18+)</span>
                <span className="text-[#FF6B6B] font-extrabold">{adults}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adults}
                onChange={(e) => setAdults(parseInt(e.target.value) || 0)}
                className="w-full accent-[#FF6B6B] h-2 bg-[#F0E6D8] rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#636E72] mb-1">
                <span>Kids (4-17)</span>
                <span className="text-[#FF6B6B] font-extrabold">{kids}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={kids}
                onChange={(e) => setKids(parseInt(e.target.value) || 0)}
                className="w-full accent-[#FF6B6B] h-2 bg-[#F0E6D8] rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#636E72] mb-1">
                <span>Duration</span>
                <span className="text-[#FF6B6B] font-extrabold">{duration} hrs</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value) || 1)}
                className="w-full accent-[#FF6B6B] h-2 bg-[#F0E6D8] rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#636E72] mb-1">Meal Style</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#EADFD3] text-xs font-bold text-[#2D3436]"
              >
                <option value="full_meal">Full Meal</option>
                <option value="bbq_cookout">BBQ / Grill</option>
                <option value="heavy_appetizers">Heavy Appetizers</option>
                <option value="light_snacks">Light Snacks</option>
                <option value="drinks_dessert">Drinks & Dessert</option>
              </select>
            </div>

          </div>
        </div>

        {/* Calculated Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          
          {/* Card 1: Food & Protein Math */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] space-y-3">
            <div className="flex items-center gap-2 text-[#FF6B6B] font-extrabold text-sm">
              <Utensils className="w-4 h-4" />
              <span>Food & Protein Yield</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#EADFD3]">
                <span className="text-[#636E72]">Total Meat / Protein:</span>
                <span className="font-extrabold text-[#2D3436] text-sm">{estimates.proteinLbs} lbs</span>
              </div>
              <p className="text-[11px] text-[#636E72] leading-tight font-medium">
                Formula: ~0.5 lb (8 oz) raw weight per adult, ~0.25 lb per kid.
              </p>

              <div className="flex justify-between items-center py-1 border-b border-[#EADFD3] pt-2">
                <span className="text-[#636E72]">Sides & Salads:</span>
                <span className="font-extrabold text-[#2D3436] text-sm">{estimates.sidesLbs} lbs</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#EADFD3] pt-2">
                <span className="text-[#636E72]">Appetizers (Total):</span>
                <span className="font-extrabold text-[#2D3436] text-sm">{estimates.appetizerPieces} pieces</span>
              </div>
              <p className="text-[11px] text-[#636E72] leading-tight font-medium">
                Formula: 4-6 pieces per guest for pre-dinner, 10-12 for cocktail party.
              </p>

              <div className="flex justify-between items-center py-1 pt-2">
                <span className="text-[#636E72]">Dessert / Cake Servings:</span>
                <span className="font-extrabold text-[#2D3436] text-sm">{estimates.dessertServings} servings</span>
              </div>
            </div>
          </div>

          {/* Card 2: Beverages & Bar Station */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] space-y-3">
            <div className="flex items-center gap-2 text-[#7C3AED] font-extrabold text-sm">
              <Wine className="w-4 h-4" />
              <span>Bar & Drink Ratios</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#EADFD3]">
                <span className="text-[#636E72]">Alcoholic Drinks:</span>
                <span className="font-extrabold text-[#2D3436] text-sm">{estimates.alcoholicDrinks} drinks</span>
              </div>
              <p className="text-[11px] text-[#636E72] leading-tight font-medium">
                Rule: 2 drinks 1st hour + 1 drink each following hour per adult.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2 rounded-xl bg-white border border-[#EADFD3] text-center">
                  <span className="text-[10px] text-[#636E72] block font-semibold">Beer Cans</span>
                  <span className="font-extrabold text-[#2D3436]">{estimates.beerCans}</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#EADFD3] text-center">
                  <span className="text-[10px] text-[#636E72] block font-semibold">Wine (750ml)</span>
                  <span className="font-extrabold text-[#2D3436]">{estimates.wineBottles} btls</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#EADFD3] text-center">
                  <span className="text-[10px] text-[#636E72] block font-semibold">Spirits</span>
                  <span className="font-extrabold text-[#2D3436]">{estimates.spiritBottles} btls</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#EADFD3] pt-2">
                <span className="text-[#636E72]">Non-Alcoholic Drinks:</span>
                <span className="font-extrabold text-[#2D3436] text-sm">{estimates.nonAlcoholicDrinks} cans/cups</span>
              </div>

              <div className="flex justify-between items-center py-1 pt-1">
                <span className="text-[#636E72]">Cocktail Mixers:</span>
                <span className="font-extrabold text-[#2D3436]">{estimates.mixersLiters} Liters</span>
              </div>
            </div>
          </div>

          {/* Card 3: Ice & Tableware Logistics */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] space-y-3">
            <div className="flex items-center gap-2 text-[#0284C7] font-extrabold text-sm">
              <Snowflake className="w-4 h-4" />
              <span>Ice & Disposables Buffer</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#EADFD3]">
                <span className="text-[#636E72]">Ice Required:</span>
                <span className="font-extrabold text-[#0284C7] text-sm">{estimates.iceLbs} lbs ({Math.ceil(estimates.iceLbs / 20)} x 20lb bags)</span>
              </div>
              <p className="text-[11px] text-[#636E72] leading-tight font-medium">
                Formula: 1.5 lbs per person for glasses + 10-20 lbs per cooler.
              </p>

              <div className="flex justify-between items-center py-1 border-b border-[#EADFD3] pt-2">
                <span className="text-[#636E72]">Plates Count (Buffer):</span>
                <span className="font-extrabold text-[#2D3436] text-sm">{estimates.platesCount} plates</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#EADFD3] pt-2">
                <span className="text-[#636E72]">Drink Cups (Buffer):</span>
                <span className="font-extrabold text-[#2D3436] text-sm">{estimates.cupsCount} cups</span>
              </div>
              <p className="text-[11px] text-[#636E72] leading-tight font-medium">
                Tip: Guests misplace 2-3 cups per event. Always buy 2.5x cups!
              </p>

              <div className="flex justify-between items-center py-1 pt-2">
                <span className="text-[#636E72]">Paper Napkins:</span>
                <span className="font-extrabold text-[#2D3436] text-sm">{estimates.napkinsCount} napkins</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#EADFD3]">
          <span className="text-xs text-[#636E72] flex items-center gap-1.5 font-medium">
            <Info className="w-3.5 h-3.5 text-[#FF6B6B]" />
            Quantities automatically update in real-time as you adjust sliders.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#2D3436] hover:bg-[#1E272C] text-white font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
