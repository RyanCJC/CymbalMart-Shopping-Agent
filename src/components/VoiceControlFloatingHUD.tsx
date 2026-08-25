import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Sparkles, 
  Loader2, 
  Radio, 
  Check, 
  Send,
  Headphones
} from 'lucide-react';

interface VoiceControlFloatingHUDProps {
  isListening: boolean;
  isContinuous: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  transcript: string;
  lastCommand: string;
  lastReply: string;
  voiceAudioEnabled: boolean;
  isSupported: boolean;
  error: string | null;
  onToggleListening: () => void;
  onToggleContinuous: () => void;
  onToggleVoiceAudio: () => void;
  onOpenHelp: () => void;
  onRunManualCommand: (text: string) => void;
}

export const VoiceControlFloatingHUD: React.FC<VoiceControlFloatingHUDProps> = ({
  isListening,
  isContinuous,
  isProcessing,
  isSpeaking,
  transcript,
  lastCommand,
  lastReply,
  voiceAudioEnabled,
  isSupported,
  error,
  onToggleListening,
  onToggleContinuous,
  onToggleVoiceAudio,
  onOpenHelp,
  onRunManualCommand,
}) => {
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    onRunManualCommand(manualInput.trim());
    setManualInput('');
    setShowManualInput(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md border-2 border-[#FFD9CE] rounded-3xl shadow-2xl p-3 sm:p-3.5 transition-all duration-300">
        
        {/* Dynamic Status / Speech Feedback Line */}
        {(isListening || isProcessing || isSpeaking || transcript || lastReply || error) && (
          <div className="mb-2.5 px-3 py-2 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] text-xs flex items-center justify-between gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {isListening && (
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B] animate-ping" />
                  <span className="font-extrabold text-[#FF6B6B] whitespace-nowrap">Listening:</span>
                </div>
              )}

              {isProcessing && (
                <div className="flex items-center gap-1.5 text-[#0D9488]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="font-bold whitespace-nowrap">Recalculating...</span>
                </div>
              )}

              {isSpeaking && (
                <div className="flex items-center gap-1.5 text-[#7C3AED]">
                  <Headphones className="w-3.5 h-3.5 animate-bounce" />
                  <span className="font-bold whitespace-nowrap">Speaking:</span>
                </div>
              )}

              <p className="truncate text-[#2D3436] font-medium text-xs">
                {transcript ? `"${transcript}"` : (lastReply || lastCommand ? `${lastReply || lastCommand}` : 'Say a command like "Add 5 bags of chips" or "Proceed to checkout"')}
              </p>
            </div>

            {/* Audio waveform visualization */}
            {isListening && (
              <div className="flex items-center gap-0.5 h-3.5">
                <span className="w-1 bg-[#FF6B6B] h-3 animate-pulse rounded-full" />
                <span className="w-1 bg-[#FF8A5B] h-5 animate-pulse delay-75 rounded-full" />
                <span className="w-1 bg-[#FFE66D] h-2 animate-pulse delay-150 rounded-full" />
                <span className="w-1 bg-[#0D9488] h-4 animate-pulse delay-100 rounded-full" />
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
            {error}
          </div>
        )}

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Main Push-to-Talk / Listening Mic Button */}
          <button
            id="voice-control-mic-btn"
            onClick={onToggleListening}
            title={isListening ? 'Stop listening' : 'Start voice control (Click or speak)'}
            className={`px-3.5 sm:px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 ${
              isListening
                ? 'bg-[#FF6B6B] text-white shadow-[#FF6B6B]/30 ring-4 ring-[#FF6B6B]/20 animate-pulse'
                : 'bg-gradient-to-tr from-[#FF6B6B] to-[#FFE66D] text-white shadow-[#FF6B6B]/20 hover:scale-105'
            }`}
          >
            {isListening ? (
              <>
                <Radio className="w-4 h-4 animate-spin" />
                <span>Listening Hands-Free...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Voice Control</span>
              </>
            )}
          </button>

          {/* Hands-Free Continuous Mode Toggle */}
          <button
            id="voice-continuous-mode-btn"
            onClick={onToggleContinuous}
            title="Toggle Hands-Free Continuous Listening (Keeps mic open)"
            className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition-all ${
              isContinuous
                ? 'bg-[#E8FAF7] text-[#0D9488] border-[#A8EDDF] shadow-xs'
                : 'bg-[#FFF9F2] text-[#636E72] border-[#EADFD3] hover:text-[#2D3436]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isContinuous ? 'bg-[#0D9488] animate-ping' : 'bg-neutral-300'}`} />
            <span className="hidden sm:inline">Hands-Free Mode:</span>
            <span>{isContinuous ? 'ON' : 'OFF'}</span>
          </button>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            
            {/* Audio Speech Toggle */}
            <button
              onClick={onToggleVoiceAudio}
              title={voiceAudioEnabled ? 'Voice audio feedback enabled (click to mute)' : 'Voice audio muted (click to unmute)'}
              className={`p-2 rounded-xl border transition-colors ${
                voiceAudioEnabled
                  ? 'bg-[#FFF9F2] text-[#0D9488] border-[#EADFD3] hover:bg-[#E8FAF7]'
                  : 'bg-[#FFF9F2] text-[#A0AAB0] border-[#EADFD3]'
              }`}
            >
              {voiceAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Quick Command Help */}
            <button
              id="voice-commands-help-btn"
              onClick={onOpenHelp}
              title="View voice command cheat sheet"
              className="p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF0EB] text-[#FF6B6B] border border-[#EADFD3] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Text input fallback toggle */}
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              title="Type a voice command manually"
              className="p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF0EB] text-[#636E72] hover:text-[#2D3436] border border-[#EADFD3] transition-colors"
            >
              <Sparkles className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Optional Manual Voice Command Input */}
        {showManualInput && (
          <form onSubmit={handleManualSubmit} className="mt-2.5 pt-2.5 border-t border-[#EADFD3] flex items-center gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder='Type voice command: e.g. "Add 3 bottles of juice for $9", "Checkout"...'
              className="flex-1 px-3 py-1.5 rounded-xl bg-[#FFF9F2] border border-[#EADFD3] text-xs text-[#2D3436] focus:outline-none focus:border-[#FF6B6B]"
              autoFocus
            />
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="px-3 py-1.5 rounded-xl bg-[#FF6B6B] hover:bg-[#ff5252] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Run</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
