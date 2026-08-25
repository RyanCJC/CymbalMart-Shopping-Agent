import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Check, 
  ShoppingBag, 
  Truck, 
  Store, 
  Clock, 
  MapPin, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2, 
  Navigation,
  DollarSign,
  Gift,
  ArrowRight
} from 'lucide-react';
import { PartyPlan, ShoppingItem } from '../types';
import { formatCurrency } from '../utils/calculator';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan;
  onMarkAllPurchased?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  onMarkAllPurchased,
}) => {
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery' | 'aisle_walk'>('pickup');
  const [pickupSlot, setPickupSlot] = useState('Today, 3:00 PM - 4:00 PM (Bay 4)');
  const [deliveryAddress, setDeliveryAddress] = useState('742 Evergreen Terrace, Springfield');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const currency = plan.config.currency || '$';
  const totalCost = plan.items.reduce((s, it) => s + it.estimatedTotalPrice, 0);
  const memberSavings = Math.round(totalCost * 0.12 * 100) / 100;
  const finalTotal = Math.max(0, Math.round((totalCost - memberSavings) * 100) / 100);

  const handlePlaceOrder = () => {
    const newOrderId = `CYM-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newOrderId);
    setOrderPlaced(true);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
    });
    if (onMarkAllPurchased) {
      onMarkAllPurchased();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border-2 border-[#FFD9CE] shadow-2xl p-6 sm:p-8 text-[#2D3436] my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          id="close-checkout-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF0EB] text-[#636E72] hover:text-[#2D3436] transition-colors border border-[#EADFD3]"
        >
          <X className="w-5 h-5" />
        </button>

        {!orderPlaced ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] flex items-center justify-center text-white font-bold shadow-md shadow-[#FF6B6B]/20">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B] bg-[#FFF0EB] px-2 py-0.5 rounded-full border border-[#FFD3C4]">
                    Step 3: Refine & Checkout
                  </span>
                </div>
                <h2 className="font-display font-extrabold text-2xl text-[#2D3436]">
                  CymbalMart Fast Fulfillment
                </h2>
                <p className="text-xs text-[#636E72]">
                  Finalize your {plan.items.length} party items with 1-click store fulfillment.
                </p>
              </div>
            </div>

            {/* Fulfillment Options */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#636E72] mb-2.5">
                Choose Fulfillment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Curbside Pickup */}
                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                    fulfillmentType === 'pickup'
                      ? 'border-[#FF6B6B] bg-[#FFF5F2] shadow-sm'
                      : 'border-[#EADFD3] bg-white hover:bg-[#FFFDFB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Store className={`w-5 h-5 ${fulfillmentType === 'pickup' ? 'text-[#FF6B6B]' : 'text-[#636E72]'}`} />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8FAF7] text-[#0D9488]">FREE</span>
                  </div>
                  <div className="font-bold text-sm text-[#2D3436]">Curbside Pickup</div>
                  <div className="text-[11px] text-[#636E72] mt-0.5">Ready in 1 Hour • Bay 4</div>
                </button>

                {/* Express Delivery */}
                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                    fulfillmentType === 'delivery'
                      ? 'border-[#FF6B6B] bg-[#FFF5F2] shadow-sm'
                      : 'border-[#EADFD3] bg-white hover:bg-[#FFFDFB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Truck className={`w-5 h-5 ${fulfillmentType === 'delivery' ? 'text-[#FF6B6B]' : 'text-[#636E72]'}`} />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF0EB] text-[#FF6B6B]">$4.99</span>
                  </div>
                  <div className="font-bold text-sm text-[#2D3436]">Express Delivery</div>
                  <div className="text-[11px] text-[#636E72] mt-0.5">Cold-chain insulated van</div>
                </button>

                {/* In-Store Navigator */}
                <button
                  type="button"
                  onClick={() => setFulfillmentType('aisle_walk')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                    fulfillmentType === 'aisle_walk'
                      ? 'border-[#FF6B6B] bg-[#FFF5F2] shadow-sm'
                      : 'border-[#EADFD3] bg-white hover:bg-[#FFFDFB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Navigation className={`w-5 h-5 ${fulfillmentType === 'aisle_walk' ? 'text-[#FF6B6B]' : 'text-[#636E72]'}`} />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7]">IN-STORE</span>
                  </div>
                  <div className="font-bold text-sm text-[#2D3436]">Aisle Walk Map</div>
                  <div className="text-[11px] text-[#636E72] mt-0.5">Sorted aisle-by-aisle</div>
                </button>

              </div>
            </div>

            {/* Method Details */}
            {fulfillmentType === 'pickup' && (
              <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-[#2D3436]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#FF6B6B]" />
                    Pickup Location: CymbalMart Supercenter #1042 (Springfield)
                  </span>
                  <span className="text-[#0D9488]">Open until 11 PM</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#636E72] mb-1">
                    Select Pickup Time Window
                  </label>
                  <select
                    value={pickupSlot}
                    onChange={(e) => setPickupSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADFD3] text-xs font-bold text-[#2D3436] focus:outline-none focus:border-[#FF6B6B]"
                  >
                    <option value="Today, 3:00 PM - 4:00 PM (Bay 4)">Today, 3:00 PM - 4:00 PM (Express Bay 4)</option>
                    <option value="Today, 5:00 PM - 6:00 PM (Bay 2)">Today, 5:00 PM - 6:00 PM (Bay 2)</option>
                    <option value="Tomorrow Morning, 9:00 AM - 10:00 AM">Tomorrow Morning, 9:00 AM - 10:00 AM</option>
                  </select>
                </div>
              </div>
            )}

            {fulfillmentType === 'delivery' && (
              <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] space-y-3 mb-6">
                <div>
                  <label className="block text-[11px] font-semibold text-[#636E72] mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADFD3] text-xs font-bold text-[#2D3436] focus:outline-none focus:border-[#FF6B6B]"
                    placeholder="Enter delivery address"
                  />
                </div>
                <p className="text-[11px] text-[#636E72]">
                  Includes insulated dry ice packaging for chilled drinks and ice bags.
                </p>
              </div>
            )}

            {fulfillmentType === 'aisle_walk' && (
              <div className="p-4 rounded-2xl bg-[#E8FAF7] border border-[#A8EDDF] text-xs text-[#00897B] space-y-1 mb-6">
                <div className="font-bold flex items-center gap-1.5 text-sm">
                  <Navigation className="w-4 h-4" />
                  Optimized CymbalMart In-Store Route
                </div>
                <p className="text-[11px] leading-relaxed text-[#2D3436]">
                  Items are pre-ordered and indexed by aisle (Produce Aisle 1 → Butcher Aisle 3 → Bakery Aisle 6 → Beverage Aisle 11 → Party Aisle 14).
                </p>
              </div>
            )}

            {/* Order Summary Breakdown */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDFB] border border-[#EADFD3] space-y-2.5 mb-6">
              <div className="flex items-center justify-between text-xs text-[#636E72]">
                <span>Party List Items ({plan.items.length} items)</span>
                <span className="font-semibold text-[#2D3436]">{formatCurrency(totalCost, currency)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#0D9488] font-bold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  CymbalMart Member Savings (12% Off)
                </span>
                <span>-{formatCurrency(memberSavings, currency)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#636E72]">
                <span>Fulfillment Fee</span>
                <span className="font-semibold text-[#2D3436]">
                  {fulfillmentType === 'delivery' ? '$4.99' : 'FREE'}
                </span>
              </div>
              <div className="border-t border-[#EADFD3] pt-2.5 flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#2D3436]">Final Total</span>
                <span className="font-extrabold text-xl text-[#FF6B6B] font-display">
                  {formatCurrency(fulfillmentType === 'delivery' ? finalTotal + 4.99 : finalTotal, currency)}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF4EB] border border-[#EADFD3] text-xs font-bold text-[#636E72] transition-colors"
              >
                Back to Review
              </button>
              <button
                id="confirm-place-order-btn"
                type="button"
                onClick={handlePlaceOrder}
                className="px-6 py-3 rounded-2xl bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#FF6B6B]/30 hover:shadow-xl transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Place CymbalMart Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Order Confirmation View */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E8FAF7] border-2 border-[#4ECDC4] flex items-center justify-center mx-auto text-[#0D9488] shadow-lg shadow-[#4ECDC4]/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0D9488] bg-[#E8FAF7] px-3 py-1 rounded-full border border-[#A8EDDF]">
                Order Confirmed!
              </span>
              <h2 className="font-display font-extrabold text-2xl text-[#2D3436] pt-2">
                Your Party Order is Locked In
              </h2>
              <p className="text-xs text-[#636E72] max-w-md mx-auto">
                Order ID: <strong className="text-[#2D3436]">{orderId}</strong> • {fulfillmentType === 'pickup' ? `Ready for pickup: ${pickupSlot}` : fulfillmentType === 'delivery' ? `Out for delivery to ${deliveryAddress}` : 'Aisle checklist synced to mobile'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] text-left max-w-md mx-auto text-xs space-y-2">
              <div className="font-bold text-[#2D3436] flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-[#FF6B6B]" />
                Host Checklist Synced:
              </div>
              <p className="text-[#636E72]">
                All {plan.items.length} items have been marked as scheduled. Your party prep timeline is available in the top bar.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-[#2D3436] hover:bg-[#1E272C] text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-[#FFE66D]" />
              <span>Done & Return to Dashboard</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
