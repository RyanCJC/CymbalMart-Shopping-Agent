import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Store, 
  CheckCircle2, 
  Circle, 
  Layers, 
  TrendingDown, 
  ShoppingBag,
  Info,
  DollarSign,
  Tag,
  ArrowUpDown,
  SlidersHorizontal,
  Flame,
  Pencil,
  Copy,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { ShoppingItem, ItemCategory, StoreType, PriorityLevel } from '../types';
import { CATEGORY_METADATA, STORE_BADGES, formatCurrency } from '../utils/calculator';
import { EditItemModal } from './EditItemModal';

interface ShoppingListDashboardProps {
  items: ShoppingItem[];
  currency: string;
  targetBudget: number;
  onUpdateItem: (item: ShoppingItem) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (item: ShoppingItem) => void;
  onOpenCostOptimizer: () => void;
  onOpenAddItemModal: () => void;
  onOpenCheckout?: () => void;
  onUpdateTargetBudget?: (newBudget: number) => void;
  topSavingsTip?: string;
}

export const ShoppingListDashboard: React.FC<ShoppingListDashboardProps> = ({
  items,
  currency,
  targetBudget,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onOpenCostOptimizer,
  onOpenAddItemModal,
  onOpenCheckout,
  onUpdateTargetBudget,
  topSavingsTip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreType | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'ALL'>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unpurchased' | 'purchased'>('all');
  const [sortBy, setSortBy] = useState<'category' | 'price_desc' | 'price_asc' | 'store' | 'priority'>('category');
  const [expandedItemIds, setExpandedItemIds] = useState<Set<string>>(new Set());

  // Edit item modal state
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [isEditingTargetBudget, setIsEditingTargetBudget] = useState(false);
  const [targetBudgetInput, setTargetBudgetInput] = useState(targetBudget.toString());

  // Toggle item expanded state for viewing portion math and tips
  const toggleExpand = (id: string) => {
    setExpandedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleTogglePurchased = (item: ShoppingItem) => {
    const nextPurchased = !item.purchased;
    onUpdateItem({
      ...item,
      purchased: nextPurchased,
      actualPrice: nextPurchased ? (item.actualPrice || item.estimatedTotalPrice) : undefined
    });

    // Check if list or store completed to fire confetti
    const remainingAfter = items.filter(it => it.id !== item.id && !it.purchased);
    if (nextPurchased && remainingAfter.length === 0) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleQuantityChange = (item: ShoppingItem, delta: number) => {
    const newQty = Math.max(0.1, Math.round((item.quantity + delta) * 10) / 10);
    const newTotal = Math.round(newQty * item.estimatedUnitPrice * 100) / 100;
    onUpdateItem({
      ...item,
      quantity: newQty,
      estimatedTotalPrice: newTotal,
      actualPrice: item.purchased ? newTotal : item.actualPrice
    });
  };

  const handleSetExactQuantity = (item: ShoppingItem, exactQty: number) => {
    const validQty = Math.max(0.1, Math.round(exactQty * 10) / 10);
    const newTotal = Math.round(validQty * item.estimatedUnitPrice * 100) / 100;
    onUpdateItem({
      ...item,
      quantity: validQty,
      estimatedTotalPrice: newTotal,
      actualPrice: item.purchased ? newTotal : item.actualPrice
    });
  };

  const handlePriceChange = (item: ShoppingItem, newPrice: number) => {
    const validPrice = Math.max(0, newPrice);
    const newUnit = item.quantity > 0 ? Math.round((validPrice / item.quantity) * 100) / 100 : item.estimatedUnitPrice;
    onUpdateItem({
      ...item,
      estimatedUnitPrice: newUnit,
      estimatedTotalPrice: validPrice,
      actualPrice: item.purchased ? validPrice : item.actualPrice
    });
  };

  const handleDuplicateItem = (item: ShoppingItem) => {
    const duplicate: ShoppingItem = {
      ...item,
      id: `custom-copy-${Date.now()}`,
      name: `${item.name} (Copy)`,
      purchased: false,
      actualPrice: undefined,
    };
    onAddItem(duplicate);
  };

  const handleSaveTargetBudget = () => {
    setIsEditingTargetBudget(false);
    const parsed = parseFloat(targetBudgetInput);
    if (!isNaN(parsed) && parsed > 0 && onUpdateTargetBudget) {
      onUpdateTargetBudget(parsed);
    } else {
      setTargetBudgetInput(targetBudget.toString());
    }
  };

  // Metrics
  const totalItemsCount = items.length;
  const purchasedItemsCount = items.filter(it => it.purchased).length;
  const totalEstimatedCost = items.reduce((sum, it) => sum + it.estimatedTotalPrice, 0);
  const totalPurchasedCost = items.filter(it => it.purchased).reduce((sum, it) => sum + (it.actualPrice || it.estimatedTotalPrice), 0);
  const progressPercent = totalItemsCount > 0 ? Math.round((purchasedItemsCount / totalItemsCount) * 100) : 0;
  const remainingBudget = targetBudget - totalEstimatedCost;

  // Stores breakdown
  const storeCounts = useMemo(() => {
    const counts: Record<string, { count: number; total: number }> = {};
    items.forEach(it => {
      if (!counts[it.recommendedStore]) {
        counts[it.recommendedStore] = { count: 0, total: 0 };
      }
      counts[it.recommendedStore].count += 1;
      counts[it.recommendedStore].total += it.estimatedTotalPrice;
    });
    return counts;
  }, [items]);

  // Categories breakdown
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ItemCategory, number>> = {};
    items.forEach(it => {
      counts[it.category] = (counts[it.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    return items.filter(it => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = it.name.toLowerCase().includes(q);
        const matchStore = it.recommendedStore.toLowerCase().includes(q);
        const matchNotes = (it.shoppingTip || '').toLowerCase().includes(q);
        if (!matchName && !matchStore && !matchNotes) return false;
      }
      if (selectedStore !== 'ALL' && it.recommendedStore !== selectedStore) return false;
      if (selectedCategory !== 'ALL' && it.category !== selectedCategory) return false;
      if (selectedPriority !== 'ALL' && it.priority !== selectedPriority) return false;
      if (filterStatus === 'purchased' && !it.purchased) return false;
      if (filterStatus === 'unpurchased' && it.purchased) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_desc') return b.estimatedTotalPrice - a.estimatedTotalPrice;
      if (sortBy === 'price_asc') return a.estimatedTotalPrice - b.estimatedTotalPrice;
      if (sortBy === 'store') return a.recommendedStore.localeCompare(b.recommendedStore);
      if (sortBy === 'priority') {
        const pOrder: Record<PriorityLevel, number> = { 'must-have': 1, 'recommended': 2, 'optional': 3 };
        return pOrder[a.priority] - pOrder[b.priority];
      }
      // default: category
      return a.category.localeCompare(b.category);
    });
  }, [items, searchQuery, selectedStore, selectedCategory, selectedPriority, filterStatus, sortBy]);

  // Group items by category when sorting by category
  const groupedByCategory = useMemo(() => {
    if (sortBy !== 'category') return null;
    const groups: Partial<Record<ItemCategory, ShoppingItem[]>> = {};
    filteredItems.forEach(it => {
      if (!groups[it.category]) groups[it.category] = [];
      groups[it.category]!.push(it);
    });
    return groups;
  }, [filteredItems, sortBy]);

  const uniqueStores = Object.keys(storeCounts) as StoreType[];

  return (
    <div className="space-y-6">
      
      {/* 1. Header KPI Cards & Savings Tip */}
      <div className="space-y-3">
        {/* Live Auto-Recalculation Status Banner */}
        <div className="flex items-center justify-between text-xs px-4 py-2 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] text-[#636E72]">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-ping" />
            <span className="font-bold text-[#2D3436]">⚡ Live Budget Engine:</span>
            <span>All quantities, price adjustments, and item modifications automatically recalculate totals and store splits.</span>
          </div>
          <span className="text-[11px] font-bold text-[#0D9488] bg-[#E8FAF7] px-2.5 py-0.5 rounded-full border border-[#A8EDDF] hidden sm:inline-block">
            Auto-Sync Active
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#F0E6D8] relative overflow-hidden shadow-xs">
            <div className="flex items-center justify-between text-[#636E72] mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Cart Completion</span>
              <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2D3436] font-display">
                {progressPercent}%
              </span>
              <span className="text-xs text-[#636E72] font-semibold">
                ({purchasedItemsCount}/{totalItemsCount} items)
              </span>
            </div>
            <div className="w-full h-2 bg-[#FFF0EB] rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#F0E6D8] shadow-xs relative">
            <div className="flex items-center justify-between text-[#636E72] mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Estimated Total</span>
              <ShoppingBag className="w-4 h-4 text-[#FF6B6B]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2D3436] font-display">
                {formatCurrency(totalEstimatedCost, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#636E72] mt-1 font-medium">
              {isEditingTargetBudget ? (
                <div className="flex items-center gap-1 mt-1 w-full">
                  <span className="text-[10px] font-bold">Target:</span>
                  <input
                    type="number"
                    value={targetBudgetInput}
                    onChange={(e) => setTargetBudgetInput(e.target.value)}
                    onBlur={handleSaveTargetBudget}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTargetBudget()}
                    autoFocus
                    className="w-20 px-1.5 py-0.5 rounded-md bg-[#FFF9F2] border border-[#FF6B6B] text-xs font-bold text-[#2D3436]"
                  />
                  <button onClick={handleSaveTargetBudget} className="text-[10px] text-[#FF6B6B] font-bold underline">Save</button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 w-full justify-between">
                  <span>Target Budget: <strong className="text-[#2D3436]">{formatCurrency(targetBudget, currency)}</strong></span>
                  {onUpdateTargetBudget && (
                    <button
                      onClick={() => {
                        setTargetBudgetInput(targetBudget.toString());
                        setIsEditingTargetBudget(true);
                      }}
                      className="p-1 rounded-md text-[#636E72] hover:text-[#FF6B6B] hover:bg-[#FFF0EB] transition-colors"
                      title="Edit Target Budget"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#F0E6D8] shadow-xs">
            <div className="flex items-center justify-between text-[#636E72] mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Spent So Far</span>
              <DollarSign className="w-4 h-4 text-[#0D9488]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0D9488] font-display">
                {formatCurrency(totalPurchasedCost, currency)}
              </span>
            </div>
            <p className="text-[11px] text-[#636E72] mt-1 font-medium">
              From {purchasedItemsCount} purchased items
            </p>
          </div>

          <div className={`p-4 sm:p-5 rounded-3xl border-2 transition-all shadow-xs ${
            remainingBudget >= 0 
              ? 'bg-[#E6FAF7] border-[#A8EDDF]' 
              : 'bg-[#FFEAEA] border-[#FFC9C9]'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-extrabold uppercase tracking-wider ${
                remainingBudget >= 0 ? 'text-[#0D9488]' : 'text-[#D9383A]'
              }`}>
                {remainingBudget >= 0 ? 'Budget Buffer' : 'Budget Deficit'}
              </span>
              <TrendingDown className={`w-4 h-4 ${remainingBudget >= 0 ? 'text-[#0D9488]' : 'text-[#D9383A]'}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-extrabold font-display ${
                remainingBudget >= 0 ? 'text-[#0D9488]' : 'text-[#D9383A]'
              }`}>
                {formatCurrency(Math.abs(remainingBudget), currency)}
              </span>
              <span className="text-xs font-bold opacity-80">
                {remainingBudget >= 0 ? 'remaining' : 'over budget'}
              </span>
            </div>
            {remainingBudget < 0 && (
              <button
                id="quick-cost-optimize-btn"
                onClick={onOpenCostOptimizer}
                className="mt-2 text-[11px] font-extrabold text-[#D9383A] hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Auto-trim $ to fit budget
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Top Savings Tip Callout */}
      {topSavingsTip && (
        <div className="p-4 rounded-2xl bg-[#FFF9DB] border-2 border-[#FFE066] flex items-center justify-between gap-3 text-xs text-[#92400E] shadow-xs">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-[#D97706] flex-shrink-0" />
            <span className="font-medium leading-relaxed">
              <strong className="font-extrabold text-[#78350F]">Agent Smart Shopping Tip:</strong> {topSavingsTip}
            </span>
          </div>
          <button
            onClick={onOpenCostOptimizer}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FF6B6B] text-white font-bold text-xs hover:bg-[#ff5252] transition-colors flex-shrink-0 shadow-sm shadow-[#FF6B6B]/25"
          >
            <Sparkles className="w-3 h-3 text-[#FFE66D]" /> Optimize Cost
          </button>
        </div>
      )}

      {/* 2. Store Splitter Tabs */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#636E72] uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-4 h-4 text-[#FF6B6B]" /> Filter By Store Run
          </span>
          <span className="text-xs text-[#636E72] font-medium hidden sm:inline">
            Split into dedicated grocery runs to save money
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            id="store-tab-all"
            onClick={() => setSelectedStore('ALL')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all border ${
              selectedStore === 'ALL'
                ? 'bg-[#FF6B6B] text-white border-[#FF6B6B] shadow-md shadow-[#FF6B6B]/25'
                : 'bg-white text-[#2D3436] border-[#EADFD3] hover:bg-[#FFF9F2]'
            }`}
          >
            <span>All Stores</span>
            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
              selectedStore === 'ALL' ? 'bg-white/25 text-white' : 'bg-[#FFF0EB] text-[#FF6B6B]'
            }`}>
              {items.length}
            </span>
          </button>

          {uniqueStores.map(storeName => {
            const data = storeCounts[storeName] || { count: 0, total: 0 };
            const badge = STORE_BADGES[storeName] || { bg: 'bg-[#FFF9F2] text-[#2D3436] border-[#EADFD3]', text: storeName };
            const isSelected = selectedStore === storeName;

            return (
              <button
                key={storeName}
                id={`store-tab-${storeName.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedStore(storeName)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#2D3436] text-white border-[#2D3436] shadow-sm font-bold'
                    : 'bg-white text-[#2D3436] border-[#EADFD3] hover:bg-[#FFF9F2]'
                }`}
              >
                <span>{badge.text}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#F0E6D8]/60 text-[#636E72]'
                }`}>
                  {data.count} • {formatCurrency(data.total, currency)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Search & Category Filters Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#F0E6D8] space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#636E72]" />
            <input
              id="search-items-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items, ingredients, notes..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] text-xs text-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] placeholder:text-[#999999] font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#636E72] hover:text-[#2D3436] text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Actions & Sort */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            
            {/* Status Filter */}
            <div className="flex items-center rounded-xl bg-[#FFF9F2] p-1 border border-[#EADFD3] text-xs">
              <button
                id="filter-status-all"
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  filterStatus === 'all' ? 'bg-white text-[#2D3436] shadow-xs' : 'text-[#636E72] hover:text-[#2D3436]'
                }`}
              >
                All
              </button>
              <button
                id="filter-status-unpurchased"
                onClick={() => setFilterStatus('unpurchased')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  filterStatus === 'unpurchased' ? 'bg-[#FFEAEA] text-[#D9383A]' : 'text-[#636E72] hover:text-[#2D3436]'
                }`}
              >
                To Buy ({items.filter(i => !i.purchased).length})
              </button>
              <button
                id="filter-status-purchased"
                onClick={() => setFilterStatus('purchased')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  filterStatus === 'purchased' ? 'bg-[#E6FAF7] text-[#0D9488]' : 'text-[#636E72] hover:text-[#2D3436]'
                }`}
              >
                Purchased ({purchasedItemsCount})
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#636E72] bg-[#FFF9F2] px-3 py-1.5 rounded-xl border border-[#EADFD3]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#636E72]" />
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#2D3436] focus:outline-none cursor-pointer font-bold"
              >
                <option value="category">Category</option>
                <option value="price_desc">Highest Price</option>
                <option value="price_asc">Lowest Price</option>
                <option value="store">Store</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            {/* Add Custom Item Button */}
            <button
              id="add-custom-item-btn"
              onClick={onOpenAddItemModal}
              className="px-3.5 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#FF6B6B]/20"
            >
              <Plus className="w-3.5 h-3.5 text-white stroke-[3]" />
              <span>Add Item</span>
            </button>

          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-[#FF6B6B] text-white shadow-xs'
                : 'bg-[#FFF9F2] text-[#636E72] hover:text-[#2D3436] hover:bg-[#FFF0EB] border border-[#EADFD3]'
            }`}
          >
            All Categories
          </button>
          
          {(Object.keys(CATEGORY_METADATA) as ItemCategory[]).map(catKey => {
            const meta = CATEGORY_METADATA[catKey];
            const count = categoryCounts[catKey] || 0;
            if (count === 0 && selectedCategory !== catKey) return null;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all border ${
                  isSelected
                    ? 'bg-[#2D3436] text-white border-[#2D3436] shadow-xs'
                    : 'bg-[#FFF9F2] text-[#636E72] hover:text-[#2D3436] hover:bg-[#FFF0EB] border-[#EADFD3]'
                }`}
              >
                <span>{meta.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* 4. Shopping Items List / Table */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#F0E6D8] text-[#636E72] space-y-3 shadow-xs">
          <ShoppingBag className="w-12 h-12 text-[#FF6B6B]/40 mx-auto" />
          <h3 className="font-bold text-lg text-[#2D3436]">No items match your filter</h3>
          <p className="text-xs max-w-sm mx-auto">
            Try adjusting your search keywords, store tab, or category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStore('ALL');
              setSelectedCategory('ALL');
              setFilterStatus('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#FFF0EB] hover:bg-[#FFE6CC] text-[#FF6B6B] text-xs font-bold transition-colors border border-[#FFD3C4]"
          >
            Reset Filters
          </button>
        </div>
      ) : sortBy === 'category' && groupedByCategory ? (
        
        // Grouped by Category View
        <div className="space-y-6">
          {(Object.keys(groupedByCategory) as ItemCategory[]).map(catKey => {
            const catItems = groupedByCategory[catKey] || [];
            if (catItems.length === 0) return null;
            const meta = CATEGORY_METADATA[catKey];
            const catTotal = catItems.reduce((s, it) => s + it.estimatedTotalPrice, 0);

            return (
              <div key={catKey} className="rounded-3xl bg-white border border-[#F0E6D8] overflow-hidden shadow-xs">
                
                {/* Category Header */}
                <div className="px-6 py-3.5 bg-[#FFF9F2] border-b border-[#F0E6D8] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="text-xs text-[#636E72] font-semibold">
                      {catItems.length} items
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-[#2D3436]">
                    Subtotal: {formatCurrency(catTotal, currency)}
                  </span>
                </div>

                {/* Items in this category */}
                <div className="divide-y divide-[#F0E6D8]">
                  {catItems.map(item => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      currency={currency}
                      isExpanded={expandedItemIds.has(item.id)}
                      onToggleExpand={() => toggleExpand(item.id)}
                      onTogglePurchased={() => handleTogglePurchased(item)}
                      onQuantityChange={(delta) => handleQuantityChange(item, delta)}
                      onSetExactQuantity={(qty) => handleSetExactQuantity(item, qty)}
                      onPriceChange={(price) => handlePriceChange(item, price)}
                      onEditItem={() => setEditingItem(item)}
                      onDuplicate={() => handleDuplicateItem(item)}
                      onDelete={() => onDeleteItem(item.id)}
                    />
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      ) : (

        // Flat List View
        <div className="rounded-3xl bg-white border border-[#F0E6D8] overflow-hidden divide-y divide-[#F0E6D8] shadow-xs">
          {filteredItems.map(item => (
            <ItemRow
              key={item.id}
              item={item}
              currency={currency}
              isExpanded={expandedItemIds.has(item.id)}
              onToggleExpand={() => toggleExpand(item.id)}
              onTogglePurchased={() => handleTogglePurchased(item)}
              onQuantityChange={(delta) => handleQuantityChange(item, delta)}
              onSetExactQuantity={(qty) => handleSetExactQuantity(item, qty)}
              onPriceChange={(price) => handlePriceChange(item, price)}
              onEditItem={() => setEditingItem(item)}
              onDuplicate={() => handleDuplicateItem(item)}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))}
        </div>

      )}

      {/* Fast Fulfillment & Checkout Banner */}
      {onOpenCheckout && items.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#FFF0EB] via-[#FFF9F2] to-[#E8FAF7] border-2 border-[#FFD9CE] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#FFD3C4] flex items-center justify-center text-[#FF6B6B] shadow-xs">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B]">
                  Ready to Order
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8FAF7] text-[#0D9488] border border-[#A8EDDF]">
                  Hands-Free Voice Supported
                </span>
              </div>
              <h4 className="font-display font-extrabold text-lg text-[#2D3436]">
                {items.length} Items Total • {formatCurrency(totalEstimatedCost, currency)}
              </h4>
              <p className="text-xs text-[#636E72]">
                Choose CymbalMart Curbside Pickup (Bay 4), Express 1-Hour Delivery, or In-Store Aisle Walk.
              </p>
            </div>
          </div>

          <button
            id="dashboard-proceed-checkout-btn"
            onClick={onOpenCheckout}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B6B]/25 hover:shadow-xl transition-all"
          >
            <span>Proceed to Fulfillment & Checkout</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Edit Item Modal for full updates & automatic budget recalculations */}
      <EditItemModal
        isOpen={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onUpdateItem={(updated) => {
          onUpdateItem(updated);
          setEditingItem(null);
        }}
        onDeleteItem={(id) => {
          onDeleteItem(id);
          setEditingItem(null);
        }}
        currency={currency}
      />

    </div>
  );
};

// Sub-component for individual item row
interface ItemRowProps {
  item: ShoppingItem;
  currency: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onTogglePurchased: () => void;
  onQuantityChange: (delta: number) => void;
  onSetExactQuantity: (qty: number) => void;
  onPriceChange: (price: number) => void;
  onEditItem: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const ItemRow: React.FC<ItemRowProps> = ({
  item,
  currency,
  isExpanded,
  onToggleExpand,
  onTogglePurchased,
  onQuantityChange,
  onSetExactQuantity,
  onPriceChange,
  onEditItem,
  onDuplicate,
  onDelete,
}) => {
  const storeBadge = STORE_BADGES[item.recommendedStore] || { bg: 'bg-[#FFF9F2] text-[#2D3436] border-[#EADFD3]', text: item.recommendedStore };
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState(item.estimatedTotalPrice.toString());
  const [isEditingQty, setIsEditingQty] = useState(false);
  const [qtyInput, setQtyInput] = useState(item.quantity.toString());

  const handlePriceBlur = () => {
    setIsEditingPrice(false);
    const parsed = parseFloat(priceInput);
    if (!isNaN(parsed) && parsed >= 0) {
      onPriceChange(parsed);
    } else {
      setPriceInput(item.estimatedTotalPrice.toString());
    }
  };

  const handleQtyBlur = () => {
    setIsEditingQty(false);
    const parsed = parseFloat(qtyInput);
    if (!isNaN(parsed) && parsed > 0) {
      onSetExactQuantity(parsed);
    } else {
      setQtyInput(item.quantity.toString());
    }
  };

  return (
    <div className={`p-4 sm:p-4.5 transition-colors ${item.purchased ? 'bg-[#FAFAF9]/80 opacity-75' : 'hover:bg-[#FFFDFB]'}`}>
      
      <div className="flex items-start sm:items-center justify-between gap-3">
        
        {/* Checkbox & Item Main Name */}
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          <button
            id={`toggle-item-${item.id}`}
            onClick={onTogglePurchased}
            className={`w-6 h-6 mt-0.5 sm:mt-0 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
              item.purchased
                ? 'bg-[#0D9488] text-white shadow-sm shadow-[#0D9488]/30'
                : 'border-2 border-[#D1C7BC] hover:border-[#FF6B6B] bg-white'
            }`}
          >
            {item.purchased && <Check className="w-4 h-4 stroke-[3]" />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onEditItem}
                className={`font-bold text-sm sm:text-base text-left hover:text-[#FF6B6B] transition-colors flex items-center gap-1.5 group ${
                  item.purchased ? 'line-through text-[#999999]' : 'text-[#2D3436]'
                }`}
                title="Click to edit item"
              >
                <span>{item.name}</span>
                <Pencil className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#FF6B6B] transition-opacity" />
              </button>

              {/* Store Tag */}
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${storeBadge.bg}`}>
                {storeBadge.text}
              </span>

              {/* Priority Tag */}
              {item.priority === 'must-have' && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-[#FFEAEA] text-[#D9383A] border border-[#FFC9C9]">
                  Must Have
                </span>
              )}
              {item.priority === 'optional' && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#FFF9F2] text-[#636E72] border border-[#EADFD3]">
                  Optional
                </span>
              )}

              {/* Dietary Tags */}
              {item.dietaryTags?.map(dt => (
                <span key={dt} className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#E6FAF7] text-[#0D9488] border border-[#A8EDDF]">
                  {dt}
                </span>
              ))}
            </div>

            {/* Quick Portion Rationale subtitle */}
            {item.portionRationale && !isExpanded && (
              <p className="text-xs text-[#636E72] mt-0.5 truncate">
                {item.portionRationale}
              </p>
            )}
          </div>
        </div>

        {/* Quantity Controls & Price */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Quantity Stepper & Direct Editable Input */}
          <div className="flex items-center rounded-xl bg-[#FFF9F2] border border-[#EADFD3] p-0.5 shadow-xs">
            <button
              onClick={() => onQuantityChange(-1)}
              className="w-6 h-6 flex items-center justify-center text-[#636E72] hover:text-[#2D3436] rounded-lg hover:bg-[#FFE6CC] text-xs font-bold transition-colors"
              title="Decrease quantity"
            >
              -
            </button>

            {isEditingQty ? (
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={qtyInput}
                onChange={(e) => setQtyInput(e.target.value)}
                onBlur={handleQtyBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleQtyBlur()}
                autoFocus
                className="w-12 px-1 text-center text-xs font-extrabold bg-white border border-[#FF6B6B] rounded-md text-[#2D3436]"
              />
            ) : (
              <button
                onClick={() => {
                  setQtyInput(item.quantity.toString());
                  setIsEditingQty(true);
                }}
                title="Click to type exact quantity"
                className="px-1.5 text-xs font-extrabold text-[#2D3436] min-w-[38px] text-center hover:text-[#FF6B6B] transition-colors"
              >
                {item.quantity} <span className="text-[10px] text-[#636E72] font-semibold">{item.unit}</span>
              </button>
            )}

            <button
              onClick={() => onQuantityChange(1)}
              className="w-6 h-6 flex items-center justify-center text-[#636E72] hover:text-[#2D3436] rounded-lg hover:bg-[#FFE6CC] text-xs font-bold transition-colors"
              title="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Editable Price */}
          <div className="text-right min-w-[70px]">
            {isEditingPrice ? (
              <input
                type="number"
                step="0.1"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                onBlur={handlePriceBlur}
                onKeyDown={(e) => e.key === 'Enter' && handlePriceBlur()}
                autoFocus
                className="w-16 px-1.5 py-0.5 rounded-lg bg-white border-2 border-[#FF6B6B] text-right text-xs font-extrabold text-[#2D3436]"
              />
            ) : (
              <button
                onClick={() => {
                  setPriceInput(item.estimatedTotalPrice.toString());
                  setIsEditingPrice(true);
                }}
                title="Click to edit price"
                className="group flex flex-col items-end text-right"
              >
                <span className="text-sm font-extrabold text-[#2D3436] group-hover:text-[#FF6B6B] transition-colors">
                  {formatCurrency(item.estimatedTotalPrice, currency)}
                </span>
                <span className="text-[10px] text-[#636E72] group-hover:text-[#2D3436] font-medium">
                  {formatCurrency(item.estimatedUnitPrice, currency)}/{item.unit}
                </span>
              </button>
            )}
          </div>

          {/* Edit Full Item Button */}
          <button
            onClick={onEditItem}
            className="p-1.5 rounded-xl text-[#636E72] hover:text-[#FF6B6B] hover:bg-[#FFF0EB] border border-transparent hover:border-[#FFD3C4] transition-colors"
            title="Edit Item Details"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Duplicate Item Button */}
          <button
            onClick={onDuplicate}
            className="p-1.5 rounded-xl text-[#636E72] hover:text-[#0D9488] hover:bg-[#E8FAF7] border border-transparent hover:border-[#A8EDDF] transition-colors"
            title="Duplicate item"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Expand Details Trigger */}
          <button
            onClick={onToggleExpand}
            className="p-1.5 rounded-xl text-[#636E72] hover:text-[#2D3436] hover:bg-[#FFF9F2] border border-transparent hover:border-[#EADFD3] transition-colors"
            title="View portion formula, tips, and substitutes"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Delete */}
          <button
            onClick={onDelete}
            className="p-1.5 rounded-xl text-[#999999] hover:text-[#D9383A] hover:bg-[#FFEAEA] border border-transparent hover:border-[#FFC9C9] transition-colors"
            title="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Expanded Accordion: Portion Math, Shopping Tips, and Substitutes */}
      {isExpanded && (
        <div className="mt-3.5 pt-3.5 border-t border-[#F0E6D8] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          {item.portionRationale && (
            <div className="p-3 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3]">
              <span className="font-extrabold text-[#FF6B6B] block mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Portion Calculation
              </span>
              <p className="text-[#333333] leading-relaxed font-medium">{item.portionRationale}</p>
            </div>
          )}

          {item.shoppingTip && (
            <div className="p-3 rounded-2xl bg-[#E6FAF7] border border-[#A8EDDF]">
              <span className="font-extrabold text-[#0D9488] block mb-1 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" /> Pro Shopping Tip
              </span>
              <p className="text-[#333333] leading-relaxed font-medium">{item.shoppingTip}</p>
            </div>
          )}

          {item.substitutes && item.substitutes.length > 0 && (
            <div className="p-3 rounded-2xl bg-[#F5EEFF] border border-[#DDD0F5]">
              <span className="font-extrabold text-[#7E22CE] block mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Cheaper / Alternative Swaps
              </span>
              <ul className="list-disc list-inside text-[#333333] space-y-1 font-medium">
                {item.substitutes.map((sub, i) => (
                  <li key={i}>{sub}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
