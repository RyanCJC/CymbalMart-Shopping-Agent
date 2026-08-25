import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Sparkles, 
  Bot, 
  PlusCircle, 
  Calculator, 
  PieChart, 
  Clock, 
  Download, 
  PartyPopper,
  Flame,
  CheckCircle,
  X,
  Users,
  Store,
  Layers,
  Mic,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PartyPlan, ShoppingItem, TimelineStep, VoiceCommandResult, ItemCategory, StoreType, PriorityLevel } from './types';
import { PRESET_PARTIES } from './data/presets';
import { Navbar } from './components/Navbar';
import { ShoppingListDashboard } from './components/ShoppingListDashboard';
import { PartySetupModal } from './components/PartySetupModal';
import { PortionCalculatorModal } from './components/PortionCalculatorModal';
import { BudgetAnalyticsModal } from './components/BudgetAnalyticsModal';
import { TimelineModal } from './components/TimelineModal';
import { CostOptimizerModal } from './components/CostOptimizerModal';
import { AddItemModal } from './components/AddItemModal';
import { ExportModal } from './components/ExportModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AIAgentChatDrawer } from './components/AIAgentChatDrawer';
import { VoiceControlFloatingHUD } from './components/VoiceControlFloatingHUD';
import { VoiceCommandsHelpModal } from './components/VoiceCommandsHelpModal';
import { CUJStepperBar } from './components/CUJStepperBar';
import { useVoiceControl } from './hooks/useVoiceControl';

const LOCAL_STORAGE_KEY = 'party_planner_agent_active_plan';

export default function App() {
  const [currentPlan, setCurrentPlan] = useState<PartyPlan>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse local storage plan', e);
    }
    return PRESET_PARTIES[0];
  });

  // Modal open/close states
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [isCostOptimizerOpen, setIsCostOptimizerOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isVoiceHelpOpen, setIsVoiceHelpOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Compute active modal name for voice context
  const activeModalName = useMemo(() => {
    if (isCheckoutModalOpen) return 'checkout';
    if (isSetupModalOpen) return 'setup';
    if (isCalculatorModalOpen) return 'portions';
    if (isTimelineModalOpen) return 'timeline';
    if (isCostOptimizerOpen) return 'cost_optimizer';
    if (isExportModalOpen) return 'export';
    if (isAiChatOpen) return 'chat';
    return 'dashboard';
  }, [
    isCheckoutModalOpen,
    isSetupModalOpen,
    isCalculatorModalOpen,
    isTimelineModalOpen,
    isCostOptimizerOpen,
    isExportModalOpen,
    isAiChatOpen,
  ]);

  // Handler: Select preset
  const handleSelectPreset = (preset: PartyPlan) => {
    setCurrentPlan(preset);
    showToast(`Loaded preset: "${preset.config.title}"`);
  };

  // Handler: Generated AI plan
  const handlePlanGenerated = (newPlan: PartyPlan) => {
    setCurrentPlan(newPlan);
    showToast(`AI generated: "${newPlan.config.title}" with ${newPlan.items.length} items!`);
  };

  // Handler: Update an individual item
  const handleUpdateItem = (updatedItem: ShoppingItem) => {
    setCurrentPlan(prev => ({
      ...prev,
      items: prev.items.map(it => (it.id === updatedItem.id ? updatedItem : it))
    }));
  };

  // Handler: Delete an individual item
  const handleDeleteItem = (itemId: string) => {
    setCurrentPlan(prev => ({
      ...prev,
      items: prev.items.filter(it => it.id !== itemId)
    }));
    showToast('Item removed from shopping list');
  };

  // Handler: Add custom item
  const handleAddItem = (newItem: ShoppingItem) => {
    setCurrentPlan(prev => ({
      ...prev,
      items: [newItem, ...prev.items]
    }));
    showToast(`Added "${newItem.name}" to shopping list`);
  };

  // Handler: Apply optimized plan from Cost Optimizer
  const handleApplyOptimizedPlan = (newItems: ShoppingItem[]) => {
    setCurrentPlan(prev => ({
      ...prev,
      items: newItems
    }));
    showToast('Applied AI cost optimizations to shopping list!');
  };

  // Handler: Update timeline tasks
  const handleUpdateTimeline = (newTimeline: TimelineStep[]) => {
    setCurrentPlan(prev => ({
      ...prev,
      timeline: newTimeline
    }));
  };

  // Handler: Apply item modifications from AI Chat
  const handleApplyItemModifications = (mods: { itemsToAdd?: any[]; itemNamesToRemove?: string[] }) => {
    setCurrentPlan(prev => {
      let updatedItems = [...prev.items];
      
      if (mods.itemNamesToRemove && mods.itemNamesToRemove.length > 0) {
        const removeSet = new Set(mods.itemNamesToRemove.map(n => n.toLowerCase()));
        updatedItems = updatedItems.filter(it => !removeSet.has(it.name.toLowerCase()));
      }

      if (mods.itemsToAdd && mods.itemsToAdd.length > 0) {
        const formattedNew = mods.itemsToAdd.map((it, idx) => ({
          ...it,
          id: `ai-mod-${Date.now()}-${idx}`,
          purchased: false,
        }));
        updatedItems = [...formattedNew, ...updatedItems];
      }

      return { ...prev, items: updatedItems };
    });

    const addedCount = mods.itemsToAdd?.length || 0;
    const removedCount = mods.itemNamesToRemove?.length || 0;
    showToast(`AI updated list: +${addedCount} items added, -${removedCount} removed`);
  };

  // Handler: Mark all purchased (e.g. on order checkout)
  const handleMarkAllPurchased = useCallback(() => {
    setCurrentPlan(prev => ({
      ...prev,
      items: prev.items.map(it => ({
        ...it,
        purchased: true,
        actualPrice: it.actualPrice || it.estimatedTotalPrice,
      })),
    }));
    showToast('All shopping items marked as purchased & scheduled!');
  }, [showToast]);

  // Central Hands-Free Voice Command Executor
  const handleExecuteVoiceCommand = useCallback((result: VoiceCommandResult) => {
    const { intent, data } = result;

    switch (intent) {
      case 'CHECKOUT': {
        setIsCheckoutModalOpen(true);
        showToast('Hands-Free: Opened Cart & Fulfillment Checkout');
        break;
      }

      case 'CONFIRM_ORDER': {
        handleMarkAllPurchased();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
        showToast('Hands-Free: Order Confirmed & Placed!');
        break;
      }

      case 'SELECT_FULFILLMENT': {
        setIsCheckoutModalOpen(true);
        showToast(`Hands-Free: Selected ${data?.fulfillmentType || 'fulfillment'} option`);
        break;
      }

      case 'CLOSE_MODAL': {
        setIsSetupModalOpen(false);
        setIsCalculatorModalOpen(false);
        setIsBudgetModalOpen(false);
        setIsTimelineModalOpen(false);
        setIsCostOptimizerOpen(false);
        setIsAddItemModalOpen(false);
        setIsExportModalOpen(false);
        setIsCheckoutModalOpen(false);
        setIsAiChatOpen(false);
        setIsVoiceHelpOpen(false);
        showToast('Hands-Free: Returned to Shopping Dashboard');
        break;
      }

      case 'NAVIGATE': {
        if (data?.modalName === 'portions') setIsCalculatorModalOpen(true);
        else if (data?.modalName === 'timeline') setIsTimelineModalOpen(true);
        else if (data?.modalName === 'cost_optimizer') setIsCostOptimizerOpen(true);
        else if (data?.modalName === 'export') setIsExportModalOpen(true);
        else if (data?.modalName === 'setup') setIsSetupModalOpen(true);
        else if (data?.modalName === 'chat') setIsAiChatOpen(true);
        else if (data?.modalName === 'checkout') setIsCheckoutModalOpen(true);
        else if (data?.modalName === 'none') {
          setIsSetupModalOpen(false);
          setIsCalculatorModalOpen(false);
          setIsBudgetModalOpen(false);
          setIsTimelineModalOpen(false);
          setIsCostOptimizerOpen(false);
          setIsAddItemModalOpen(false);
          setIsExportModalOpen(false);
          setIsCheckoutModalOpen(false);
          setIsAiChatOpen(false);
        }
        break;
      }

      case 'OPTIMIZE_BUDGET': {
        setIsCostOptimizerOpen(true);
        showToast('Hands-Free: Opened Cost Optimizer');
        break;
      }

      case 'SET_BUDGET': {
        if (data?.budget && data.budget > 0) {
          const newBudget = data.budget;
          setCurrentPlan(prev => ({
            ...prev,
            config: {
              ...prev.config,
              targetBudget: newBudget,
            },
          }));
          showToast(`Hands-Free: Target budget updated to $${newBudget}`);
        }
        break;
      }

      case 'ADD_ITEM': {
        if (data?.newItem) {
          const itemToAdd: ShoppingItem = {
            id: `voice-add-${Date.now()}`,
            name: data.newItem.name,
            category: (data.newItem.category as ItemCategory) || 'bakery_snacks',
            quantity: data.newItem.quantity || 1,
            unit: data.newItem.unit || 'pack',
            estimatedUnitPrice: data.newItem.estimatedUnitPrice || 5,
            estimatedTotalPrice: data.newItem.estimatedTotalPrice || 5,
            purchased: false,
            priority: (data.newItem.priority as PriorityLevel) || 'recommended',
            recommendedStore: (data.newItem.recommendedStore as StoreType) || 'Supermarket / Grocery',
            portionRationale: data.newItem.portionRationale || 'Added via Voice Command',
            shoppingTip: data.newItem.shoppingTip || 'Voice assistant auto-entry',
          };
          setCurrentPlan(prev => ({
            ...prev,
            items: [itemToAdd, ...prev.items],
          }));
          showToast(`Hands-Free: Added "${itemToAdd.name}" to shopping list`);
        } else if (data?.targetItemName) {
          const qty = data.quantity || 1;
          const price = data.price || 8;
          const fallbackItem: ShoppingItem = {
            id: `voice-add-${Date.now()}`,
            name: data.targetItemName,
            category: 'bakery_snacks',
            quantity: qty,
            unit: data.unit || 'pack',
            estimatedUnitPrice: Math.round((price / qty) * 100) / 100,
            estimatedTotalPrice: price,
            purchased: false,
            priority: 'recommended',
            recommendedStore: 'Supermarket / Grocery',
            portionRationale: 'Added via Voice Control',
          };
          setCurrentPlan(prev => ({
            ...prev,
            items: [fallbackItem, ...prev.items],
          }));
          showToast(`Hands-Free: Added "${fallbackItem.name}" to shopping list`);
        }
        break;
      }

      case 'REMOVE_ITEM': {
        const target = (data?.targetItemName || '').toLowerCase().trim();
        if (target) {
          setCurrentPlan(prev => {
            const filtered = prev.items.filter(it => !it.name.toLowerCase().includes(target));
            return { ...prev, items: filtered };
          });
          showToast(`Hands-Free: Removed "${data?.targetItemName}"`);
        }
        break;
      }

      case 'MARK_PURCHASED': {
        const target = (data?.targetItemName || '').toLowerCase().trim();
        if (target) {
          setCurrentPlan(prev => ({
            ...prev,
            items: prev.items.map(it => {
              if (it.name.toLowerCase().includes(target)) {
                return {
                  ...it,
                  purchased: true,
                  actualPrice: it.actualPrice || it.estimatedTotalPrice,
                };
              }
              return it;
            }),
          }));
          showToast(`Hands-Free: Marked "${data?.targetItemName}" as purchased`);
        }
        break;
      }

      case 'UNMARK_PURCHASED': {
        const target = (data?.targetItemName || '').toLowerCase().trim();
        if (target) {
          setCurrentPlan(prev => ({
            ...prev,
            items: prev.items.map(it => {
              if (it.name.toLowerCase().includes(target)) {
                return {
                  ...it,
                  purchased: false,
                };
              }
              return it;
            }),
          }));
          showToast(`Hands-Free: Unchecked "${data?.targetItemName}"`);
        }
        break;
      }

      case 'UPDATE_QUANTITY': {
        const target = (data?.targetItemName || '').toLowerCase().trim();
        const newQty = data?.quantity;
        if (target && newQty && newQty > 0) {
          setCurrentPlan(prev => ({
            ...prev,
            items: prev.items.map(it => {
              if (it.name.toLowerCase().includes(target)) {
                const total = Math.round(newQty * it.estimatedUnitPrice * 100) / 100;
                return {
                  ...it,
                  quantity: newQty,
                  estimatedTotalPrice: total,
                };
              }
              return it;
            }),
          }));
          showToast(`Hands-Free: Updated quantity of "${data?.targetItemName}" to ${newQty}`);
        }
        break;
      }

      case 'UPDATE_PRICE': {
        const target = (data?.targetItemName || '').toLowerCase().trim();
        const newPrice = data?.price;
        if (target && newPrice && newPrice > 0) {
          setCurrentPlan(prev => ({
            ...prev,
            items: prev.items.map(it => {
              if (it.name.toLowerCase().includes(target)) {
                const unitPrice = Math.round((newPrice / (it.quantity || 1)) * 100) / 100;
                return {
                  ...it,
                  estimatedUnitPrice: unitPrice,
                  estimatedTotalPrice: newPrice,
                };
              }
              return it;
            }),
          }));
          showToast(`Hands-Free: Updated price of "${data?.targetItemName}" to $${newPrice}`);
        }
        break;
      }

      case 'CREATE_PLAN': {
        if (data?.planDetails) {
          const details = data.planDetails;
          const updatedConfig = {
            ...currentPlan.config,
            title: details.title || currentPlan.config.title,
            theme: details.theme || currentPlan.config.theme,
            targetBudget: details.budget || currentPlan.config.targetBudget,
            guestCount: {
              ...currentPlan.config.guestCount,
              adults: details.adults || currentPlan.config.guestCount.adults,
              kids: details.kids || currentPlan.config.guestCount.kids,
              total: (details.adults || currentPlan.config.guestCount.adults) + (details.kids || currentPlan.config.guestCount.kids),
            },
          };
          setCurrentPlan(prev => ({
            ...prev,
            config: updatedConfig,
          }));
          setIsSetupModalOpen(true);
          showToast(`Hands-Free: Configured party details for "${updatedConfig.title}"`);
        } else {
          setIsSetupModalOpen(true);
        }
        break;
      }

      case 'ANSWER_QUESTION': {
        setIsAiChatOpen(true);
        break;
      }

      default:
        break;
    }
  }, [handleMarkAllPurchased, currentPlan.config, showToast]);

  // Voice Control Hook
  const voiceControl = useVoiceControl({
    currentPlan,
    activeModal: activeModalName,
    onExecuteCommand: handleExecuteVoiceCommand,
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentPlan));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [currentPlan]);

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#333333] flex flex-col font-sans selection:bg-[#FF6B6B]/25 selection:text-[#FF6B6B] pb-24">
      
      {/* Top Navbar */}
      <Navbar
        currentPlan={currentPlan}
        onSelectPreset={handleSelectPreset}
        onOpenNewPartyModal={() => setIsSetupModalOpen(true)}
        onOpenCalculatorModal={() => setIsCalculatorModalOpen(true)}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenTimelineModal={() => setIsTimelineModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenCheckoutModal={() => setIsCheckoutModalOpen(true)}
        onToggleAiChat={() => setIsAiChatOpen(!isAiChatOpen)}
        isAiChatOpen={isAiChatOpen}
        onToggleVoiceListening={voiceControl.toggleListening}
        isVoiceListening={voiceControl.isListening}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 p-4 rounded-2xl bg-white border-2 border-[#FFE66D] text-[#2D3436] text-xs font-semibold shadow-2xl shadow-[#FF6B6B]/15 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="w-6 h-6 rounded-full bg-[#FFE66D] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-neutral-700 p-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Hero Party Summary Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-[#FFF0EB] via-[#FFF9F2] to-[#FFFDF9] border-2 border-[#FFD9CE] shadow-sm relative overflow-hidden">
          
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#FFE66D]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-[#FF6B6B]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B] bg-[#FFF0EB] px-3 py-1 rounded-full border border-[#FFD3C4]">
                  {currentPlan.config.theme || 'Party Theme'}
                </span>
                <span className="text-xs font-bold text-[#636E72] flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-[#EADFD3]">
                  <Users className="w-3.5 h-3.5 text-[#0D9488]" />
                  {currentPlan.config.guestCount.total} Guests ({currentPlan.config.guestCount.adults} Adults, {currentPlan.config.guestCount.kids} Kids)
                </span>
                <span className="text-xs font-bold text-[#636E72] flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-[#EADFD3]">
                  <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                  {currentPlan.config.durationHours} Hours • {currentPlan.config.mealType.replace('_', ' ')}
                </span>
                <button
                  onClick={voiceControl.toggleListening}
                  className={`text-xs font-extrabold px-3 py-1 rounded-full border flex items-center gap-1.5 transition-all shadow-xs ${
                    voiceControl.isListening
                      ? 'bg-[#FF6B6B] text-white border-[#FF6B6B] animate-pulse'
                      : 'bg-white hover:bg-[#FFF0EB] text-[#FF6B6B] border-[#FFD3C4]'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span>{voiceControl.isListening ? 'Voice Active' : 'Hands-Free Ready'}</span>
                </button>
              </div>

              <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#2D3436] tracking-tight">
                {currentPlan.config.title}
              </h1>

              <p className="text-xs sm:text-sm text-[#636E72] leading-relaxed">
                {currentPlan.aiSummary || 'AI-optimized party shopping plan calibrated with portion mathematics, multi-store pricing, and grocery logistics.'}
              </p>
            </div>

            {/* Quick Hero Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              
              <button
                id="hero-open-checkout-btn"
                onClick={() => setIsCheckoutModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#FF6B6B]/25 hover:shadow-lg transition-all"
              >
                <CreditCard className="w-4 h-4" />
                <span>Fulfillment & Checkout</span>
              </button>

              <button
                id="hero-open-calculator-btn"
                onClick={() => setIsCalculatorModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-white hover:bg-[#E8FAF7] text-[#2D3436] font-bold text-xs flex items-center justify-center gap-2 border border-[#EADFD3] transition-colors shadow-sm"
              >
                <Calculator className="w-4 h-4 text-[#4ECDC4]" />
                <span>Portion Math</span>
              </button>

              <button
                id="hero-open-optimizer-btn"
                onClick={() => setIsCostOptimizerOpen(true)}
                className="px-4 py-2 rounded-2xl bg-white hover:bg-[#FFF4E6] text-[#2D3436] font-bold text-xs flex items-center justify-center gap-2 border border-[#EADFD3] transition-colors shadow-sm"
              >
                <Flame className="w-4 h-4 text-[#FF8A5B]" />
                <span>Trim Budget</span>
              </button>

              <button
                id="hero-open-timeline-btn"
                onClick={() => setIsTimelineModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-white hover:bg-[#E8FAF7] text-[#2D3436] font-bold text-xs flex items-center justify-center gap-2 border border-[#EADFD3] transition-colors shadow-sm"
              >
                <Clock className="w-4 h-4 text-[#0D9488]" />
                <span>Prep Schedule</span>
              </button>

            </div>

          </div>

        </div>

        {/* 3-Step CUJ Journey Progress Stepper */}
        <CUJStepperBar
          plan={currentPlan}
          onOpenDefineEvent={() => setIsSetupModalOpen(true)}
          onOpenReviewBudget={() => setIsBudgetModalOpen(true)}
          onOpenPortionMath={() => setIsCalculatorModalOpen(true)}
          onOpenCostOptimizer={() => setIsCostOptimizerOpen(true)}
          onOpenCheckout={() => setIsCheckoutModalOpen(true)}
        />

        {/* Shopping Items Dashboard */}
        <ShoppingListDashboard
          items={currentPlan.items}
          currency={currentPlan.config.currency || '$'}
          targetBudget={currentPlan.config.targetBudget}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onAddItem={handleAddItem}
          onOpenCostOptimizer={() => setIsCostOptimizerOpen(true)}
          onOpenAddItemModal={() => setIsAddItemModalOpen(true)}
          onOpenCheckout={() => setIsCheckoutModalOpen(true)}
          onUpdateTargetBudget={(newBudget) => setCurrentPlan(prev => ({ ...prev, config: { ...prev.config, targetBudget: newBudget } }))}
          topSavingsTip={currentPlan.cateringHighlights?.topSavingsTip}
        />

      </main>

      {/* Floating AI Chat Trigger (when drawer is closed) */}
      {!isAiChatOpen && (
        <button
          id="floating-ai-agent-btn"
          onClick={() => setIsAiChatOpen(true)}
          className="fixed bottom-24 right-6 z-30 p-4 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] via-[#FF8A5B] to-[#FFE66D] text-slate-950 font-extrabold shadow-2xl shadow-[#FF6B6B]/30 flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all group"
        >
          <Bot className="w-5 h-5 text-slate-900" />
          <span className="text-xs font-extrabold pr-1 text-slate-900">Ask CymbalMart Assistant</span>
          <Sparkles className="w-3.5 h-3.5 text-slate-900 animate-pulse" />
        </button>
      )}

      {/* Persistent Floating Voice Control HUD */}
      <VoiceControlFloatingHUD
        isListening={voiceControl.isListening}
        isContinuous={voiceControl.isContinuous}
        isProcessing={voiceControl.isProcessing}
        isSpeaking={voiceControl.isSpeaking}
        transcript={voiceControl.transcript}
        lastCommand={voiceControl.lastCommand}
        lastReply={voiceControl.lastReply}
        voiceAudioEnabled={voiceControl.voiceAudioEnabled}
        isSupported={voiceControl.isSupported}
        error={voiceControl.error}
        onToggleListening={voiceControl.toggleListening}
        onToggleContinuous={voiceControl.toggleContinuous}
        onToggleVoiceAudio={() => voiceControl.setVoiceAudioEnabled(!voiceControl.voiceAudioEnabled)}
        onOpenHelp={() => setIsVoiceHelpOpen(true)}
        onRunManualCommand={voiceControl.processVoiceCommand}
      />

      {/* Modals & Drawers */}
      <PartySetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onPlanGenerated={handlePlanGenerated}
        initialConfig={currentPlan.config}
      />

      <PortionCalculatorModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
        config={currentPlan.config}
      />

      <BudgetAnalyticsModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        items={currentPlan.items}
        config={currentPlan.config}
        cateringHighlights={currentPlan.cateringHighlights}
        onOpenCostOptimizer={() => setIsCostOptimizerOpen(true)}
      />

      <TimelineModal
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
        timeline={currentPlan.timeline}
        partyTitle={currentPlan.config.title}
        onUpdateTimeline={handleUpdateTimeline}
      />

      <CostOptimizerModal
        isOpen={isCostOptimizerOpen}
        onClose={() => setIsCostOptimizerOpen(false)}
        currentPlan={currentPlan}
        onApplyOptimizedPlan={handleApplyOptimizedPlan}
      />

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onAddItem={handleAddItem}
        currency={currentPlan.config.currency || '$'}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        plan={currentPlan}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        plan={currentPlan}
        onMarkAllPurchased={handleMarkAllPurchased}
      />

      <AIAgentChatDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        currentPlan={currentPlan}
        onApplyItemModifications={handleApplyItemModifications}
      />

      <VoiceCommandsHelpModal
        isOpen={isVoiceHelpOpen}
        onClose={() => setIsVoiceHelpOpen(false)}
        onRunTestCommand={voiceControl.processVoiceCommand}
        voiceAudioEnabled={voiceControl.voiceAudioEnabled}
        onToggleVoiceAudio={() => voiceControl.setVoiceAudioEnabled(!voiceControl.voiceAudioEnabled)}
      />

    </div>
  );
}
