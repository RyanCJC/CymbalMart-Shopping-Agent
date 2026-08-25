import { DietaryNeeds, PartyConfig, ItemCategory, ShoppingItem, StoreType } from '../types';

export interface CateringEstimate {
  proteinLbs: number;
  sidesLbs: number;
  appetizerPieces: number;
  alcoholicDrinks: number;
  nonAlcoholicDrinks: number;
  wineBottles: number;
  beerCans: number;
  spiritBottles: number;
  mixersLiters: number;
  iceLbs: number;
  platesCount: number;
  cupsCount: number;
  napkinsCount: number;
  dessertServings: number;
}

export function calculateCateringNeeds(
  adults: number,
  kids: number,
  toddlers: number,
  durationHours: number,
  mealType: PartyConfig['mealType']
): CateringEstimate {
  const effectiveAdults = Math.max(0, adults);
  const effectiveKids = Math.max(0, kids);
  const totalGuests = effectiveAdults + effectiveKids + Math.max(0, toddlers);
  const duration = Math.max(1, durationHours);

  // Protein calculation
  let proteinPerAdult = 0.5; // lbs
  let proteinPerKid = 0.25;
  if (mealType === 'bbq_cookout') {
    proteinPerAdult = 0.65;
    proteinPerKid = 0.35;
  } else if (mealType === 'heavy_appetizers') {
    proteinPerAdult = 0.3;
    proteinPerKid = 0.15;
  } else if (mealType === 'light_snacks' || mealType === 'drinks_dessert') {
    proteinPerAdult = 0.1;
    proteinPerKid = 0.05;
  }
  const proteinLbs = Math.round((effectiveAdults * proteinPerAdult + effectiveKids * proteinPerKid) * 10) / 10;

  // Sides calculation (approx 0.3 lb per guest)
  const sidesLbs = Math.round((totalGuests * 0.35) * 10) / 10;

  // Appetizers
  let appsPerPersonPerHour = 2;
  if (mealType === 'heavy_appetizers') appsPerPersonPerHour = 3.5;
  if (mealType === 'light_snacks') appsPerPersonPerHour = 2;
  if (mealType === 'full_meal' || mealType === 'bbq_cookout') appsPerPersonPerHour = 1.2;
  const appetizerPieces = Math.round(totalGuests * appsPerPersonPerHour * Math.min(duration, 3));

  // Drinks Calculation
  // Standard catering formula: 2 drinks for 1st hour, 1 drink each subsequent hour
  const drinksPerAdult = 2 + (duration - 1) * 1;
  const drinksPerKid = 1 + (duration - 1) * 0.75;
  
  const totalAdultDrinkUnits = Math.round(effectiveAdults * drinksPerAdult);
  const nonAlcoholicDrinks = Math.round(effectiveKids * drinksPerKid + effectiveAdults * (drinksPerAdult * 0.4));
  const alcoholicDrinks = Math.round(effectiveAdults * (drinksPerAdult * 0.75));

  // Alcohol breakdown recommendation (50% Beer, 30% Wine, 20% Spirits/Cocktails)
  const beerCans = Math.round(alcoholicDrinks * 0.5);
  const wineGlasses = alcoholicDrinks * 0.3;
  const wineBottles = Math.ceil(wineGlasses / 5); // 5 glasses per standard 750ml bottle
  const spiritDrinks = alcoholicDrinks * 0.2;
  const spiritBottles = Math.ceil(spiritDrinks / 16); // 16 1.5oz shots per 750ml bottle
  const mixersLiters = Math.ceil((spiritDrinks * 4) / 33.8); // 4oz mixer per drink

  // Ice: 1.5 lbs per person for chilling and drinks + cooler base
  const iceLbs = Math.max(10, Math.ceil(totalGuests * 1.5 + (mealType === 'bbq_cookout' ? 20 : 10)));

  // Tableware (buffer for lost cups / seconds)
  const platesCount = Math.ceil(totalGuests * (mealType === 'full_meal' || mealType === 'bbq_cookout' ? 1.75 : 1.3));
  const cupsCount = Math.ceil(totalGuests * (duration > 3 ? 3 : 2.2));
  const napkinsCount = Math.ceil(totalGuests * 3.5);
  const dessertServings = Math.ceil(totalGuests * 1.15);

  return {
    proteinLbs,
    sidesLbs,
    appetizerPieces,
    alcoholicDrinks,
    nonAlcoholicDrinks,
    wineBottles,
    beerCans,
    spiritBottles,
    mixersLiters,
    iceLbs,
    platesCount,
    cupsCount,
    napkinsCount,
    dessertServings
  };
}

export const CATEGORY_METADATA: Record<ItemCategory, { label: string; iconName: string; color: string }> = {
  protein_main: { label: 'Proteins & Mains', iconName: 'Drumstick', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  produce_sides: { label: 'Produce & Sides', iconName: 'Salad', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  bakery_snacks: { label: 'Bakery & Snacks', iconName: 'Croissant', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  drinks_alcohol: { label: 'Alcohol & Bar', iconName: 'Wine', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  drinks_non_alcohol: { label: 'Beverages & Soft Drinks', iconName: 'GlassWater', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  desserts: { label: 'Desserts & Sweets', iconName: 'Cake', color: 'bg-pink-500/10 text-pink-400 border-pink-500/30' },
  tableware_disposables: { label: 'Tableware & Disposables', iconName: 'Utensils', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  decorations: { label: 'Decor & Theme', iconName: 'Sparkles', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  ice_logistics: { label: 'Ice, Coolers & Extras', iconName: 'Snowflake', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' }
};

export const STORE_BADGES: Record<StoreType, { bg: string; text: string }> = {
  'Costco / Wholesale': { bg: 'bg-blue-950/70 border-blue-600/40 text-blue-300', text: 'Costco / Wholesale' },
  'Supermarket / Grocery': { bg: 'bg-emerald-950/70 border-emerald-600/40 text-emerald-300', text: 'Supermarket' },
  'Trader Joe\'s / Specialty': { bg: 'bg-red-950/70 border-red-600/40 text-red-300', text: 'Trader Joe\'s' },
  'Liquor Store': { bg: 'bg-purple-950/70 border-purple-600/40 text-purple-300', text: 'Liquor Store' },
  'Target / Walmart': { bg: 'bg-amber-950/70 border-amber-600/40 text-amber-300', text: 'Target / Walmart' },
  'Party Store / Amazon': { bg: 'bg-fuchsia-950/70 border-fuchsia-600/40 text-fuchsia-300', text: 'Party Store' },
  'Bakery / Local Deli': { bg: 'bg-pink-950/70 border-pink-600/40 text-pink-300', text: 'Bakery / Deli' }
};

export function formatCurrency(amount: number, currency: string = '$'): string {
  return `${currency}${amount.toFixed(2)}`;
}
