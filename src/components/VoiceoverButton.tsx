import { Volume2, Pause, Play, Loader2, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  speakArabic,
  replayVoiceover,
  subscribeSpeechState,
  VoiceoverState,
  VoiceTone
} from '../utils/speech';

interface VoiceoverButtonProps {
  id: string;
  text: string;
  label?: string;
  title?: string;
  tone?: VoiceTone;
  variant?: 'navy' | 'outline' | 'subtle';
}

export function VoiceoverButton({
  id,
  text,
  label = 'استمع للشرح الصوتي',
  title,
  tone = 'lesson',
  variant = 'outline'
}: VoiceoverButtonProps) {
  const [speechState, setSpeechState] = useState<VoiceoverState | null>(null);

  useEffect(() => {
    return subscribeSpeechState(setSpeechState);
  }, []);

  const isCurrent = speechState?.activeId === id;
  const status = isCurrent ? speechState.status : 'idle';
  const isLoading = status === 'loading';
  const isPlaying = status === 'playing';
  const isPaused = status === 'paused';

  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer min-h-[40px]';

  const variantStyles =
    variant === 'navy'
      ? isPlaying
        ? 'bg-red-700 text-white hover:bg-red-800'
        : 'bg-[#0B1D3A] text-white hover:bg-[#132C54]'
      : variant === 'subtle'
        ? isPlaying
          ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
          : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200'
        : isPlaying
          ? 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-100'
          : 'bg-white text-[#0B1D3A] border border-slate-300 hover:bg-slate-50';

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={() =>
          void speakArabic(text, id, {
            tone,
            title: title ?? label
          })
        }
        className={`${baseStyles} ${variantStyles}`}
        aria-pressed={isPlaying}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>جاري التحضير...</span>
          </>
        ) : isPlaying ? (
          <>
            <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>إيقاف مؤقت</span>
          </>
        ) : isPaused ? (
          <>
            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>متابعة الصوت</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" aria-hidden="true" />
            <span>{label}</span>
          </>
        )}
      </button>

      {(isPlaying || isPaused) && (
        <button
          type="button"
          onClick={() => replayVoiceover()}
          aria-label="إعادة الاستماع من البداية"
          title="إعادة الاستماع"
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 bg-white text-[#0B1D3A] hover:bg-slate-100 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
