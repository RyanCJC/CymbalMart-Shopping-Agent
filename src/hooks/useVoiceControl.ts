import { useState, useEffect, useRef, useCallback } from 'react';
import { VoiceCommandResult, VoiceIntentType, ShoppingItem, PartyPlan } from '../types';

interface UseVoiceControlOptions {
  currentPlan: PartyPlan;
  activeModal: string;
  onExecuteCommand: (result: VoiceCommandResult) => void;
}

export function useVoiceControl({
  currentPlan,
  activeModal,
  onExecuteCommand,
}: UseVoiceControlOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isContinuous, setIsContinuous] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [lastReply, setLastReply] = useState('');
  const [voiceAudioEnabled, setVoiceAudioEnabled] = useState(true);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isContinuousRef = useRef(isContinuous);
  isContinuousRef.current = isContinuous;

  const activeModalRef = useRef(activeModal);
  activeModalRef.current = activeModal;

  const currentPlanRef = useRef(currentPlan);
  currentPlanRef.current = currentPlan;

  // Speak a message using Text-to-Speech
  const speakReply = useCallback((text: string) => {
    if (!voiceAudioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Select a natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Daniel')))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // If continuous mode is enabled and recognition was paused, restart listening
        if (isContinuousRef.current && recognitionRef.current && !isListening) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // ignore if already started
          }
        }
      };
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  }, [voiceAudioEnabled, isListening]);

  // Fast Client-Side Rule Matcher for instant response
  const tryLocalRuleMatch = useCallback((text: string): VoiceCommandResult | null => {
    const clean = text.toLowerCase().trim();

    // 1. Navigation / Modal commands
    if (/^(open |go to |show )?(checkout|cart|pay)/i.test(clean)) {
      return {
        intent: 'CHECKOUT',
        speechReply: 'Opening your cart checkout.',
        data: { modalName: 'checkout' },
      };
    }
    if (/^(open |show |calculate )?(portion|portions|catering portion|drink ratio|drink math)/i.test(clean)) {
      return {
        intent: 'NAVIGATE',
        speechReply: 'Opening the portion & catering calculator.',
        data: { modalName: 'portions' },
      };
    }
    if (/^(open |show |view )?(timeline|prep schedule|prep timeline|checklist schedule)/i.test(clean)) {
      return {
        intent: 'NAVIGATE',
        speechReply: 'Opening your party prep timeline.',
        data: { modalName: 'timeline' },
      };
    }
    if (/^(open |show )?(optimizer|cost optimizer|trim budget|budget optimizer|save money)/i.test(clean)) {
      return {
        intent: 'NAVIGATE',
        speechReply: 'Opening the cost & wholesale savings optimizer.',
        data: { modalName: 'cost_optimizer' },
      };
    }
    if (/^(open |show |view )?(export|print|share list|printable list)/i.test(clean)) {
      return {
        intent: 'NAVIGATE',
        speechReply: 'Opening export and printable checklist.',
        data: { modalName: 'export' },
      };
    }
    if (/^(open |start |create |plan )?(new party|setup party|party setup)/i.test(clean)) {
      return {
        intent: 'NAVIGATE',
        speechReply: 'Opening party setup wizard.',
        data: { modalName: 'setup' },
      };
    }
    if (/^(open |ask |talk to )?(assistant|chatbot|copilot|cymbalmart assistant)/i.test(clean)) {
      return {
        intent: 'NAVIGATE',
        speechReply: 'Opening CymbalMart Assistant chat drawer.',
        data: { modalName: 'chat' },
      };
    }
    if (/^(close|cancel|dismiss|go back|back to list|exit)/i.test(clean)) {
      return {
        intent: 'CLOSE_MODAL',
        speechReply: 'Closing dialog and returning to your shopping list.',
        data: { modalName: 'none' },
      };
    }

    // 2. Fulfillment selection (hands-free in checkout)
    if (/curbside|pickup|pick up/i.test(clean)) {
      return {
        intent: 'SELECT_FULFILLMENT',
        speechReply: 'Selected CymbalMart Curbside Pickup.',
        data: { fulfillmentType: 'pickup' },
      };
    }
    if (/express delivery|delivery|deliver/i.test(clean)) {
      return {
        intent: 'SELECT_FULFILLMENT',
        speechReply: 'Selected Express 1-Hour Delivery.',
        data: { fulfillmentType: 'delivery' },
      };
    }
    if (/in store|aisle map|in-store/i.test(clean)) {
      return {
        intent: 'SELECT_FULFILLMENT',
        speechReply: 'Selected In-Store Aisle Navigation.',
        data: { fulfillmentType: 'instore' },
      };
    }
    if (/^(confirm|place order|submit order|finish order|complete purchase)/i.test(clean)) {
      return {
        intent: 'CONFIRM_ORDER',
        speechReply: 'Placing your CymbalMart order now! Order confirmed.',
      };
    }

    // 3. Store filter shortcuts
    if (/^(filter|show|only) (costco|wholesale)/i.test(clean)) {
      return {
        intent: 'NAVIGATE',
        speechReply: 'Filtering for Costco Wholesale items.',
        data: { filterStore: 'Costco / Wholesale' },
      };
    }
    if (/^(filter|show|only) (supermarket|grocery)/i.test(clean)) {
      return {
        intent: 'NAVIGATE',
        speechReply: 'Filtering for Supermarket items.',
        data: { filterStore: 'Supermarket / Grocery' },
      };
    }
    if (/^(show all|clear filter|all stores|all items|reset filter)/i.test(clean)) {
      return {
        intent: 'NAVIGATE',
        speechReply: 'Showing all items across all stores.',
        data: { filterStore: 'all', filterCategory: 'all', searchQuery: '' },
      };
    }

    // 4. Set budget shortcut: "set budget to 350", "budget 200"
    const budgetMatch = clean.match(/(?:set|change|update)?\s*budget\s*(?:to)?\s*\$?(\d+)/i);
    if (budgetMatch && budgetMatch[1]) {
      const budgetNum = parseInt(budgetMatch[1], 10);
      if (!isNaN(budgetNum) && budgetNum > 0) {
        return {
          intent: 'SET_BUDGET',
          speechReply: `Updated your target party budget to $${budgetNum}. Totals recalculated.`,
          data: { budget: budgetNum },
        };
      }
    }

    // 5. Mark item purchased: "check off [item]", "mark [item] as bought", "bought [item]"
    const markMatch = clean.match(/(?:check off|mark|bought|purchase|purchased)\s+(?:the\s+)?(.+?)(?:\s+as\s+purchased|\s+as\s+bought|\s+off)?$/i);
    if (markMatch && markMatch[1]) {
      const target = markMatch[1].trim();
      if (target.length > 1 && !['all', 'it', 'them', 'order', 'budget'].includes(target)) {
        return {
          intent: 'MARK_PURCHASED',
          speechReply: `Marked "${target}" as purchased in your cart.`,
          data: { targetItemName: target },
        };
      }
    }

    // 6. Delete / Remove item: "remove [item]", "delete [item]"
    const removeMatch = clean.match(/(?:remove|delete|drop|take off)\s+(?:the\s+)?(.+?)(?:\s+from\s+(?:the\s+|my\s+)?list)?$/i);
    if (removeMatch && removeMatch[1]) {
      const target = removeMatch[1].trim();
      if (target.length > 1 && !['all', 'it', 'them', 'modal', 'filter'].includes(target)) {
        return {
          intent: 'REMOVE_ITEM',
          speechReply: `Removed "${target}" from your shopping list.`,
          data: { targetItemName: target },
        };
      }
    }

    return null;
  }, []);

  // Process raw speech text through local matcher or AI backend
  const processVoiceCommand = useCallback(async (spokenText: string) => {
    if (!spokenText.trim()) return;

    setLastCommand(spokenText);
    setIsProcessing(true);

    try {
      // 1. Try instant local rule match
      const localResult = tryLocalRuleMatch(spokenText);
      if (localResult) {
        setLastReply(localResult.speechReply);
        onExecuteCommand(localResult);
        speakReply(localResult.speechReply);
        setIsProcessing(false);
        return;
      }

      // 2. Call server-side Gemini Intent Parser
      const res = await fetch('/api/voice-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speechText: spokenText,
          currentPlan: currentPlanRef.current,
          currentContext: {
            activeModal: activeModalRef.current,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Voice command failed: ${res.statusText}`);
      }

      const parsedResult: VoiceCommandResult = await res.json();
      setLastReply(parsedResult.speechReply || 'Command executed.');
      onExecuteCommand(parsedResult);
      speakReply(parsedResult.speechReply || 'Command executed.');
    } catch (err: any) {
      console.error('Error processing voice command:', err);
      const fallbackReply = `Heard: "${spokenText}". Let me know what to update.`;
      setLastReply(fallbackReply);
      speakReply(fallbackReply);
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  }, [tryLocalRuleMatch, onExecuteCommand, speakReply]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let currentInterim = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }

      const activeText = finalTranscript || currentInterim;
      setTranscript(activeText);

      if (finalTranscript) {
        processVoiceCommand(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setError(`Microphone error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart if continuous listening is on and not currently speaking
      if (isContinuousRef.current && !isSpeaking) {
        try {
          recognition.start();
        } catch (e) {
          // ignore
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
    };
  }, [processVoiceCommand, isSpeaking]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop talking while user is speaking
      }
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Recognition start warning:', e);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const toggleContinuous = useCallback(() => {
    setIsContinuous(prev => {
      const next = !prev;
      if (next && !isListening) {
        startListening();
      } else if (!next && isListening) {
        stopListening();
      }
      return next;
    });
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isContinuous,
    isProcessing,
    isSpeaking,
    transcript,
    lastCommand,
    lastReply,
    voiceAudioEnabled,
    setVoiceAudioEnabled,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
    toggleContinuous,
    processVoiceCommand,
    speakReply,
  };
}
