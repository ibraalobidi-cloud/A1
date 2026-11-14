import { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle
} from 'lucide-react';
import {
  subscribeSpeechState,
  togglePauseVoiceover,
  replayVoiceover,
  stopArabicSpeech,
  setVoiceoverVolume,
  toggleMuteVoiceover,
  VoiceoverState
} from '../utils/speech';

export function AudioControlBar() {
  const [speechState, setSpeechState] = useState<VoiceoverState | null>(null);

  useEffect(() => {
    return subscribeSpeechState(setSpeechState);
  }, []);

  if (!speechState || (speechState.status === 'idle' && !speechState.errorMessage)) {
    return null;
  }

  const isLoading = speechState.status === 'loading';
  const isPlaying = speechState.status === 'playing';
  const isPaused = speechState.status === 'paused';
  const isError = speechState.status === 'error';

  return (
    <aside
      aria-label="شريط التحكم بالتعليق الصوتي"
      className="no-print fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-[440px] z-50 bg-[#0B1D3A] text-white rounded-xl border border-amber-400/40 shadow-lg px-4 py-3"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Status & Active Clip Title */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
            ) : isError ? (
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" aria-hidden="true" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            )}
            <span className="truncate">
              {isLoading
                ? 'جاري تجهيز صوت المعلمة...'
                : isError
                  ? 'تنبيه الصوت'
                  : isPaused
                    ? `متوقف مؤقتاً · ${speechState.title}`
                    : speechState.title}
            </span>
          </div>
          {isError && speechState.errorMessage && (
            <p className="text-[11px] text-red-200 mt-0.5 truncate">{speechState.errorMessage}</p>
          )}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={togglePauseVoiceover}
              aria-label={isPlaying ? 'إيقاف مؤقت' : 'متابعة التشغيل'}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-700 hover:bg-blue-600 text-white cursor-pointer transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}

          <button
            type="button"
            onClick={replayVoiceover}
            aria-label="إعادة الاستماع"
            title="إعادة الاستماع"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={stopArabicSpeech}
            aria-label="إغلاق الصوت"
            title="إيقاف"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-600/80 hover:bg-red-600 text-white cursor-pointer transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>

      {/* Volume Slider Row */}
      <div className="mt-2 pt-2 border-t border-white/15 flex items-center gap-2.5">
        <button
          type="button"
          onClick={toggleMuteVoiceover}
          aria-label={speechState.muted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
          className="text-slate-300 hover:text-white cursor-pointer"
        >
          {speechState.muted || speechState.volume === 0 ? (
            <VolumeX className="w-4 h-4 text-red-300" />
          ) : (
            <Volume2 className="w-4 h-4 text-amber-300" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={speechState.muted ? 0 : speechState.volume}
          onChange={(e) => setVoiceoverVolume(Number(e.target.value))}
          aria-label="مستوى الصوت"
          className="w-full h-1.5 accent-amber-400 cursor-pointer"
        />
        <span className="font-mono text-[11px] text-slate-300 w-9 text-left tabular-nums">
          {Math.round((speechState.muted ? 0 : speechState.volume) * 100)}%
        </span>
      </div>
    </aside>
  );
}
