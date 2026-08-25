import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Calendar, 
  ChevronRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { TimelineStep } from '../types';

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: TimelineStep[];
  partyTitle: string;
  onUpdateTimeline: (updatedTimeline: TimelineStep[]) => void;
}

export const TimelineModal: React.FC<TimelineModalProps> = ({
  isOpen,
  onClose,
  timeline,
  partyTitle,
  onUpdateTimeline,
}) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedPhaseId, setSelectedPhaseId] = useState(timeline[0]?.id || '');

  if (!isOpen) return null;

  const handleToggleTask = (phaseId: string, taskId: string) => {
    const updated = timeline.map(phase => {
      if (phase.id !== phaseId) return phase;
      return {
        ...phase,
        tasks: phase.tasks.map(t => {
          if (t.id !== taskId) return t;
          return { ...t, completed: !t.completed };
        })
      };
    });
    onUpdateTimeline(updated);
  };

  const handleAddTask = (phaseId: string) => {
    if (!newTaskText.trim()) return;
    const updated = timeline.map(phase => {
      if (phase.id !== phaseId) return phase;
      return {
        ...phase,
        tasks: [
          ...phase.tasks,
          { id: `task-${Date.now()}`, text: newTaskText.trim(), completed: false }
        ]
      };
    });
    onUpdateTimeline(updated);
    setNewTaskText('');
  };

  const totalTasks = timeline.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = timeline.reduce((sum, p) => sum + p.tasks.filter(t => t.completed).length, 0);
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border-2 border-[#FFD9CE] shadow-2xl p-6 sm:p-8 text-[#2D3436] my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          id="close-timeline-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF0EB] text-[#636E72] hover:text-[#2D3436] transition-colors border border-[#EADFD3]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-6 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4ECDC4] to-[#0D9488] flex items-center justify-center text-white font-bold shadow-md shadow-[#4ECDC4]/20">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0D9488] bg-[#E8FAF7] px-2.5 py-0.5 rounded-full border border-[#A8EDDF]">
                  Prep Timeline
                </span>
              </div>
              <h2 className="font-display font-extrabold text-2xl text-[#2D3436]">
                Party Prep & Shopping Timeline
              </h2>
              <p className="text-xs sm:text-sm text-[#636E72]">
                Chronological game plan for {partyTitle} ({completedTasks}/{totalTasks} tasks complete)
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F2] border border-[#EADFD3] mb-6 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold text-[#636E72] mb-1.5">
              <span>Overall Prep Readiness</span>
              <span className="text-[#0D9488] font-extrabold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#F0E6D8] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#0D9488] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Chronological Timeline Phases */}
        <div className="space-y-4">
          {timeline.map((phase, phaseIdx) => {
            const phaseComplete = phase.tasks.length > 0 && phase.tasks.every(t => t.completed);

            return (
              <div
                key={phase.id}
                className={`p-5 rounded-2xl border transition-all ${
                  phaseComplete
                    ? 'bg-[#F9FAF9] border-[#E2E8F0] opacity-85'
                    : 'bg-[#FFF9F2] border-[#EADFD3] shadow-sm'
                }`}
              >
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#EADFD3]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#FF6B6B] text-white text-xs font-extrabold flex items-center justify-center shadow-sm">
                      {phaseIdx + 1}
                    </span>
                    <h3 className="font-bold text-base text-[#2D3436] font-display">
                      {phase.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-[#636E72] border border-[#EADFD3]">
                    {phase.timeframe.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-[#636E72] mb-4 leading-relaxed font-medium">
                  {phase.description}
                </p>

                {/* Tasks List */}
                <div className="space-y-2">
                  {phase.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(phase.id, task.id)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                        task.completed
                          ? 'bg-white/60 text-[#A0AAB0] line-through border border-transparent'
                          : 'bg-white hover:bg-[#FFF5F0] text-[#2D3436] border border-[#EADFD3] shadow-sm'
                      }`}
                    >
                      <button
                        className={`mt-0.5 flex-shrink-0 ${task.completed ? 'text-[#0D9488]' : 'text-[#636E72] hover:text-[#FF6B6B]'}`}
                      >
                        {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      </button>
                      <span className="text-xs sm:text-sm leading-snug font-medium">{task.text}</span>
                    </div>
                  ))}
                </div>

                {/* Add Custom Task Form */}
                <div className="mt-3 pt-3 border-t border-[#EADFD3] flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add a custom prep task..."
                    value={selectedPhaseId === phase.id ? newTaskText : ''}
                    onFocus={() => setSelectedPhaseId(phase.id)}
                    onChange={(e) => {
                      setSelectedPhaseId(phase.id);
                      setNewTaskText(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTask(phase.id);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#EADFD3] text-xs text-[#2D3436] focus:outline-none focus:border-[#FF6B6B]"
                  />
                  <button
                    onClick={() => handleAddTask(phase.id)}
                    disabled={!newTaskText.trim() || selectedPhaseId !== phase.id}
                    className="px-3 py-1.5 rounded-xl bg-[#2D3436] hover:bg-[#FF6B6B] text-white font-bold text-xs transition-colors disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-6 border-t border-[#EADFD3] mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-[#2D3436] hover:bg-[#1E272C] text-white font-bold text-xs transition-colors"
          >
            Close Timeline
          </button>
        </div>

      </div>
    </div>
  );
};
