export type ItemCategory = 
  | 'protein_main'
  | 'produce_sides'
  | 'bakery_snacks'
  | 'drinks_alcohol'
  | 'drinks_non_alcohol'
  | 'desserts'
  | 'tableware_disposables'
  | 'decorations'
  | 'ice_logistics';

export type StoreType = 
  | 'Costco / Wholesale'
  | 'Supermarket / Grocery'
  | 'Trader Joe\'s / Specialty'
  | 'Liquor Store'
  | 'Target / Walmart'
  | 'Party Store / Amazon'
  | 'Bakery / Local Deli';

export type PriorityLevel = 'must-have' | 'recommended' | 'optional';

export interface ShoppingItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  estimatedTotalPrice: number;
  actualPrice?: number;
  purchased: boolean;
  priority: PriorityLevel;
  recommendedStore: StoreType;
  dietaryTags?: string[];
  portionRationale?: string;
  substitutes?: string[];
  shoppingTip?: string;
  notes?: string;
}

export interface DietaryNeeds {
  vegetarian: number;
  vegan: number;
  glutenFree: number;
  nutFree: number;
  dairyFree: number;
  halal: number;
  kosher: number;
  otherNotes?: string;
}

export interface PartyConfig {
  id: string;
  title: string;
  theme: string;
  partyType: string;
  guestCount: {
    adults: number;
    kids: number;
    toddlers: number;
    total: number;
  };
  durationHours: number;
  mealType: 'full_meal' | 'heavy_appetizers' | 'light_snacks' | 'drinks_dessert' | 'bbq_cookout';
  vibe: 'casual' | 'festive' | 'formal' | 'kids_playful' | 'budget_friendly' | 'gourmet';
  targetBudget: number;
  currency: string;
  dietary: DietaryNeeds;
  equipment: {
    hasGrill: boolean;
    hasOven: boolean;
    hasBlender: boolean;
    hasCoolers: boolean;
    hasChafingDishes: boolean;
    needsDisposableTableware: boolean;
    indoorOutdoor: 'indoor' | 'outdoor' | 'both';
  };
  eventDate?: string;
  notes?: string;
}

export interface TimelineStep {
  id: string;
  timeframe: '1_week_before' | '3_days_before' | '1_day_before' | 'party_morning' | '2_hours_before' | 'during_party';
  title: string;
  description: string;
  tasks: { id: string; text: string; completed: boolean }[];
}

export interface AIAgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    action: string;
    payload?: any;
  }[];
}

export interface PartyPlan {
  config: PartyConfig;
  items: ShoppingItem[];
  timeline: TimelineStep[];
  aiSummary: string;
  cateringHighlights: {
    foodPortionSummary: string;
    drinkPortionSummary: string;
    budgetHealth: string;
    topSavingsTip: string;
  };
}

export type VoiceIntentType = 
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'MARK_PURCHASED'
  | 'UNMARK_PURCHASED'
  | 'UPDATE_QUANTITY'
  | 'UPDATE_PRICE'
  | 'SET_BUDGET'
  | 'NAVIGATE'
  | 'CHECKOUT'
  | 'SELECT_FULFILLMENT'
  | 'CONFIRM_ORDER'
  | 'CLOSE_MODAL'
  | 'CREATE_PLAN'
  | 'OPTIMIZE_BUDGET'
  | 'ANSWER_QUESTION'
  | 'UNKNOWN';

export interface VoiceCommandResult {
  intent: VoiceIntentType;
  speechReply: string;
  data?: {
    targetItemName?: string;
    quantity?: number;
    unit?: string;
    price?: number;
    budget?: number;
    modalName?: 'setup' | 'portions' | 'timeline' | 'cost_optimizer' | 'export' | 'checkout' | 'chat' | 'none';
    filterStore?: string;
    filterCategory?: string;
    searchQuery?: string;
    fulfillmentType?: 'pickup' | 'delivery' | 'instore';
    planDetails?: {
      title?: string;
      theme?: string;
      adults?: number;
      kids?: number;
      budget?: number;
      mealType?: string;
    };
    newItem?: {
      name: string;
      category: ItemCategory;
      quantity: number;
      unit: string;
      estimatedUnitPrice: number;
      estimatedTotalPrice: number;
      priority: PriorityLevel;
      recommendedStore: StoreType;
      portionRationale?: string;
      shoppingTip?: string;
    };
    answer?: string;
  };
}

