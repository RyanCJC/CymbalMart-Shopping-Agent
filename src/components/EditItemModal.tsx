import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  ShoppingBag, 
  DollarSign, 
  Store, 
  Tag, 
  Layers,
  Calculator,
  Trash2
} from 'lucide-react';
import { ShoppingItem, ItemCategory, StoreType, PriorityLevel } from '../types';
import { CATEGORY_METADATA, formatCurrency } from '../utils/calculator';

interface EditItemModalProps {
  isOpen: boolean;
  item: ShoppingItem | null;
  onClose: () => void;
  onUpdateItem: (item: ShoppingItem) => void;
  onDeleteItem?: (id: string) => void;
  currency: string;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  item,
  onClose,
  onUpdateItem,
  onDeleteItem,
  currency,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('protein_main');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pack');
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [store, setStore] = useState<StoreType>('Supermarket / Grocery');
  const [priority, setPriority] = useState<PriorityLevel>('must-have');
  const [rationale, setRationale] = useState('');
  const [shoppingTip, setShoppingTip] = useState('');
  const [dietaryTags, setDietaryTags] = useState('');
  const [purchased, setPurchased] = useState(false);
  const [actualPrice, setActualPrice] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);
      setQuantity(item.quantity);
      setUnit(item.unit);
      setUnitPrice(item.estimatedUnitPrice);
      setTotalPrice(item.estimatedTotalPrice);
      setStore(item.recommendedStore);
      setPriority(item.priority);
      setRationale(item.portionRationale || '');
      setShoppingTip(item.shoppingTip || '');
      setDietaryTags((item.dietaryTags || []).join(', '));
      setPurchased(item.purchased);
      setActualPrice(item.actualPrice);
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  // Handle quantity change with automatic total recalculation
  const handleQuantityChange = (newQty: number) => {
    const validQty = Math.max(0.1, newQty);
    setQuantity(validQty);
    setTotalPrice(Math.round(validQty * unitPrice * 100) / 100);
  };

  // Handle unit price change with automatic total recalculation
  const handleUnitPriceChange = (newPrice: number) => {
    const validPrice = Math.max(0, newPrice);
    setUnitPrice(validPrice);
    setTotalPrice(Math.round(quantity * validPrice * 100) / 100);
  };

  // Handle total price direct edit with unit price recalculation
  const handleTotalPriceChange = (newTotal: number) => {
    const validTotal = Math.max(0, newTotal);
    setTotalPrice(validTotal);
    if (quantity > 0) {
      setUnitPrice(Math.round((validTotal / quantity) * 100) / 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedDietary = dietaryTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const updatedItem: ShoppingItem = {
      ...item,
      name: name.trim(),
      category,
      quantity,
      unit: unit.trim() || 'unit',
      estimatedUnitPrice: unitPrice,
      estimatedTotalPrice: totalPrice,
      purchased,
      actualPrice: purchased ? (actualPrice !== undefined ? actualPrice : totalPrice) : undefined,
      priority,
      recommendedStore: store,
      portionRationale: rationale.trim() || undefined,
      shoppingTip: shoppingTip.trim() || undefined,
      dietaryTags: parsedDietary.length > 0 ? parsedDietary : undefined,
    };

    onUpdateItem(updatedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border-2 border-[#FFD9CE] shadow-2xl p-6 sm:p-8 text-[#2D3436] my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF0EB] text-[#636E72] hover:text-[#2D3436] transition-colors border border-[#EADFD3]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] flex items-center justify-center text-white font-bold shadow-md shadow-[#FF6B6B]/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B] bg-[#FFF0EB] px-2.5 py-0.5 rounded-full border border-[#FFD3C4]">
                Shopping List Item
              </span>
            </div>
            <h2 className="font-display font-extrabold text-xl text-[#2D3436]">
              Update Item & Recalculate
            </h2>
            <p className="text-xs text-[#636E72]">
              Edit item details — total costs and budget metrics recalculate instantly.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-[#636E72] uppercase tracking-wider mb-1">
              Item Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Organic Strawberries, Party Cups, Ground Beef"
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] text-sm text-[#2D3436] focus:outline-none focus:border-[#FF6B6B] font-medium"
            />
          </div>

          {/* Category & Store */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#636E72] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] text-xs font-bold text-[#2D3436]"
              >
                {(Object.keys(CATEGORY_METADATA) as ItemCategory[]).map(catKey => (
                  <option key={catKey} value={catKey}>
                    {CATEGORY_METADATA[catKey].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#636E72] uppercase tracking-wider mb-1">
                Store Recommendation
              </label>
              <select
                value={store}
                onChange={(e) => setStore(e.target.value as StoreType)}
                className="w-full px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] text-xs font-bold text-[#2D3436]"
              >
                <option value="Costco / Wholesale">Costco / Wholesale</option>
                <option value="Supermarket / Grocery">Supermarket / Grocery</option>
                <option value="Trader Joe's / Specialty">Trader Joe's / Specialty</option>
                <option value="Liquor Store">Liquor Store</option>
                <option value="Target / Walmart">Target / Walmart</option>
                <option value="Party Store / Amazon">Party Store / Amazon</option>
                <option value="Bakery / Local Deli">Bakery / Local Deli</option>
              </select>
            </div>
          </div>

          {/* Quantity, Unit, Unit Price, Total Price with auto-calc */}
          <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#636E72]">
              <span className="flex items-center gap-1.5 text-[#2D3436]">
                <Calculator className="w-3.5 h-3.5 text-[#FF6B6B]" />
                Quantity & Auto-Calculated Price
              </span>
              <span className="text-[11px] text-[#0D9488] font-extrabold bg-[#E8FAF7] px-2 py-0.5 rounded-md border border-[#A8EDDF]">
                Line Total: {formatCurrency(totalPrice, currency)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#636E72] mb-1">Quantity</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseFloat(e.target.value) || 0.1)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#EADFD3] text-xs font-extrabold text-[#2D3436] text-center"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#636E72] mb-1">Unit</label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="lbs, cans, pack"
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#EADFD3] text-xs font-bold text-[#2D3436] text-center"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#636E72] mb-1">Unit Price ({currency})</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={unitPrice}
                  onChange={(e) => handleUnitPriceChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#EADFD3] text-xs font-extrabold text-[#2D3436] text-center"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] text-[#636E72] font-semibold mb-1">
                <span>Total Line Price Override:</span>
                <span className="font-mono">{quantity} × {formatCurrency(unitPrice, currency)} = {formatCurrency(totalPrice, currency)}</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={totalPrice}
                onChange={(e) => handleTotalPriceChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#EADFD3] text-xs font-extrabold text-[#2D3436]"
              />
            </div>
          </div>

          {/* Priority & Dietary Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#636E72] mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] text-xs font-bold text-[#2D3436]"
              >
                <option value="must-have">Must Have</option>
                <option value="recommended">Recommended</option>
                <option value="optional">Optional</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#636E72] mb-1">Dietary Tags (comma-separated)</label>
              <input
                type="text"
                value={dietaryTags}
                onChange={(e) => setDietaryTags(e.target.value)}
                placeholder="e.g. Vegan, Gluten-Free, Nut-Free"
                className="w-full px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] text-xs font-medium text-[#2D3436]"
              />
            </div>
          </div>

          {/* Portion Rationale or Note */}
          <div>
            <label className="block text-xs font-bold text-[#636E72] mb-1">Portion Rationale or Math Note</label>
            <input
              type="text"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="e.g. 0.5 lb raw weight per guest"
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] text-xs text-[#2D3436]"
            />
          </div>

          {/* Pro Shopping Tip */}
          <div>
            <label className="block text-xs font-bold text-[#636E72] mb-1">Shopping & Store Tip</label>
            <input
              type="text"
              value={shoppingTip}
              onChange={(e) => setShoppingTip(e.target.value)}
              placeholder="e.g. Buy Kirkland brand or 2-pack for best unit cost"
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] text-xs text-[#2D3436]"
            />
          </div>

          {/* Status Purchased Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2D3436]">
              <input
                type="checkbox"
                checked={purchased}
                onChange={(e) => setPurchased(e.target.checked)}
                className="w-4 h-4 rounded text-[#0D9488] accent-[#0D9488]"
              />
              <span>Mark as Purchased in Cart</span>
            </label>
            {purchased && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#636E72] font-semibold">Actual Paid:</span>
                <input
                  type="number"
                  step="0.01"
                  value={actualPrice !== undefined ? actualPrice : totalPrice}
                  onChange={(e) => setActualPrice(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 rounded-lg bg-white border border-[#EADFD3] text-xs font-bold text-center text-[#0D9488]"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#EADFD3]">
            {onDeleteItem ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Remove "${item.name}" from shopping list?`)) {
                    onDeleteItem(item.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#FFF0EB] text-[#636E72] font-bold text-xs border border-[#EADFD3] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-[#FF6B6B]/20"
              >
                <Save className="w-4 h-4" /> Save & Recalculate
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
