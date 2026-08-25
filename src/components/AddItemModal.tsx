import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  ShoppingBag, 
  DollarSign, 
  Store, 
  Tag, 
  Layers 
} from 'lucide-react';
import { ShoppingItem, ItemCategory, StoreType, PriorityLevel } from '../types';
import { CATEGORY_METADATA } from '../utils/calculator';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: ShoppingItem) => void;
  currency: string;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  currency,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('protein_main');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pack');
  const [unitPrice, setUnitPrice] = useState(5.99);
  const [store, setStore] = useState<StoreType>('Costco / Wholesale');
  const [priority, setPriority] = useState<PriorityLevel>('must-have');
  const [rationale, setRationale] = useState('');
  const [shoppingTip, setShoppingTip] = useState('');
  const [dietaryTag, setDietaryTag] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const totalPrice = Math.round(quantity * unitPrice * 100) / 100;
    const newItem: ShoppingItem = {
      id: `custom-item-${Date.now()}`,
      name: name.trim(),
      category,
      quantity,
      unit,
      estimatedUnitPrice: unitPrice,
      estimatedTotalPrice: totalPrice,
      purchased: false,
      priority,
      recommendedStore: store,
      portionRationale: rationale.trim() || undefined,
      shoppingTip: shoppingTip.trim() || undefined,
      dietaryTags: dietaryTag.trim() ? [dietaryTag.trim()] : undefined,
    };

    onAddItem(newItem);
    onClose();
    // Reset form
    setName('');
    setQuantity(1);
    setUnitPrice(5.99);
    setRationale('');
    setShoppingTip('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border-2 border-[#FFD9CE] shadow-2xl p-6 sm:p-8 text-[#2D3436] my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          id="close-add-item-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF0EB] text-[#636E72] hover:text-[#2D3436] transition-colors border border-[#EADFD3]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] flex items-center justify-center text-white font-bold shadow-md shadow-[#FF6B6B]/20">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B] bg-[#FFF0EB] px-2.5 py-0.5 rounded-full border border-[#FFD3C4]">
                Custom Item
              </span>
            </div>
            <h2 className="font-display font-extrabold text-xl text-[#2D3436]">
              Add Shopping Item
            </h2>
            <p className="text-xs text-[#636E72]">
              Add any custom grocery, beverage, tableware or decor item to your party list.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-[#636E72] uppercase tracking-wider mb-1">
              Item Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Organic Strawberries, Party Cups, Lime Wedges"
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] text-sm text-[#2D3436] focus:outline-none focus:border-[#FF6B6B] font-medium"
            />
          </div>

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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#636E72] mb-1">Quantity</label>
              <input
                type="number"
                min="0.1"
                step="0.5"
                required
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] text-xs font-extrabold text-[#2D3436] text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#636E72] mb-1">Unit</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="lbs, cans, pack"
                className="w-full px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] text-xs font-bold text-[#2D3436] text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#636E72] mb-1">Unit Price ({currency})</label>
              <input
                type="number"
                min="0"
                step="0.1"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] text-xs font-extrabold text-[#2D3436] text-center"
              />
            </div>
          </div>

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
              <label className="block text-xs font-bold text-[#636E72] mb-1">Dietary Tag (Optional)</label>
              <input
                type="text"
                value={dietaryTag}
                onChange={(e) => setDietaryTag(e.target.value)}
                placeholder="e.g. Vegan, Gluten-Free"
                className="w-full px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] text-xs font-medium text-[#2D3436]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#636E72] mb-1">Portion Rationale or Note</label>
            <input
              type="text"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="e.g. 2 per guest for dessert table"
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] text-xs text-[#2D3436]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EADFD3]">
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
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
