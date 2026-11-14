export type VoiceTone = 'lesson' | 'encourage_correct' | 'encourage_retry' | 'term' | 'question';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface VoiceoverState {
  activeId: string | null;
  title: string;
  status: PlaybackStatus;
  volume: number;
  muted: boolean;
  errorMessage: string | null;
}

type SpeechListener = (state: VoiceoverState) => void;

const VOLUME_STORAGE_KEY = 'taekwondo_voice_volume_v1';

// 1-sample silent WAV to unlock mobile/tablet Safari & Chrome audio inside a user tap gesture
const SILENT_WAV_DATA_URI =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

function loadSavedVolume(): number {
  if (typeof window === 'undefined') return 0.9;
  try {
    const raw = window.localStorage.getItem(VOLUME_STORAGE_KEY);
    if (!raw) return 0.9;
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) return parsed;
  } catch {
    // Ignore storage error
  }
  return 0.9;
}

let state: VoiceoverState = {
  activeId: null,
  title: '',
  status: 'idle',
  volume: loadSavedVolume(),
  muted: false,
  errorMessage: null
};

const listeners = new Set<SpeechListener>();
const audioCache = new Map<string, string>(); // key: `${tone}::${text}` -> blob URL
let activeAbortController: AbortController | null = null;
let sharedAudio: HTMLAudioElement | null = null;
let audioUnlocked = false;
let usingBrowserFallback = false;
let lastRequest: { text: string; id: string; tone: VoiceTone; title: string } | null = null;

function getAudioElement(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = 'auto';
    sharedAudio.volume = state.muted ? 0 : state.volume;

    sharedAudio.addEventListener('ended', () => {
      updateState({ status: 'idle', activeId: null, errorMessage: null });
    });

    sharedAudio.addEventListener('pause', () => {
      if (sharedAudio && !sharedAudio.ended && state.status === 'playing' && !usingBrowserFallback) {
        updateState({ status: 'paused' });
      }
    });

    sharedAudio.addEventListener('play', () => {
      if (state.activeId && !usingBrowserFallback) {
        updateState({ status: 'playing', errorMessage: null });
      }
    });

    sharedAudio.addEventListener('error', () => {
      if (state.activeId && !usingBrowserFallback) {
        updateState({
          status: 'error',
          errorMessage: 'تعذر تشغيل المقطع الصوتي على هذا الجهاز.'
        });
      }
    });
  }
  return sharedAudio;
}

function unlockAudioOnGesture() {
  const audio = getAudioElement();
  if (!audio || audioUnlocked) return;
  try {
    audio.src = SILENT_WAV_DATA_URI;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audioUnlocked = true;
        })
        .catch(() => {
          // Will unlock on subsequent user play action
        });
    }
  } catch {
    // Ignore unlock failure
  }
}

function notifyListeners() {
  const snapshot = { ...state };
  listeners.forEach((fn) => fn(snapshot));
}

function updateState(patch: Partial<VoiceoverState>) {
  state = { ...state, ...patch };
  notifyListeners();
}

export function subscribeSpeechState(listener: SpeechListener): () => void {
  listeners.add(listener);
  listener({ ...state });
  return () => {
    listeners.delete(listener);
  };
}

function stopBrowserFallback() {
  usingBrowserFallback = false;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

function speakWithBrowserFallback(text: string, id: string, title: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    stopBrowserFallback();
    usingBrowserFallback = true;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const arabicFemaleVoice =
      voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('ar') &&
          /zariyah|salma|laila|amira|mariam|female|woman/i.test(v.name)
      ) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('ar-sa')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('ar')) ||
      null;

    if (arabicFemaleVoice) {
      utterance.voice = arabicFemaleVoice;
    }
    utterance.lang = 'ar-SA';
    utterance.rate = 0.96;
    utterance.volume = state.muted ? 0 : state.volume;

    updateState({
      activeId: id,
      title,
      status: 'playing',
      errorMessage: null
    });

    utterance.onend = () => {
      usingBrowserFallback = false;
      if (state.activeId === id) {
        updateState({ status: 'idle', activeId: null, errorMessage: null });
      }
    };

    utterance.onerror = () => {
      usingBrowserFallback = false;
      if (state.activeId === id) {
        updateState({
          status: 'error',
          errorMessage: 'تعذر تشغيل الصوت. تأكد من إضافة GEMINI_API_KEY في إعدادات النشر.'
        });
      }
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    usingBrowserFallback = false;
    return false;
  }
}

export function stopArabicSpeech() {
  if (activeAbortController) {
    activeAbortController.abort();
    activeAbortController = null;
  }
  if (sharedAudio) {
    sharedAudio.pause();
    sharedAudio.currentTime = 0;
  }
  stopBrowserFallback();
  updateState({
    activeId: null,
    status: 'idle',
    errorMessage: null
  });
}

export function togglePauseVoiceover() {
  if (usingBrowserFallback && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    if (state.status === 'playing') {
      window.speechSynthesis.pause();
      updateState({ status: 'paused' });
    } else if (state.status === 'paused') {
      window.speechSynthesis.resume();
      updateState({ status: 'playing' });
    }
    return;
  }

  const audio = getAudioElement();
  if (!audio || !state.activeId) return;
  if (state.status === 'playing') {
    audio.pause();
    updateState({ status: 'paused' });
  } else if (state.status === 'paused') {
    audio.play().catch(() => {
      updateState({ status: 'error', errorMessage: 'اضغط إعادة الاستماع لتشغيل الصوت.' });
    });
  }
}

export function replayVoiceover() {
  if (!lastRequest) return;
  const { text, id, tone, title } = lastRequest;
  void speakArabic(text, id, { tone, title, forceReplay: true });
}

export function setVoiceoverVolume(volume: number) {
  const clamped = Math.max(0, Math.min(1, volume));
  try {
    window.localStorage.setItem(VOLUME_STORAGE_KEY, String(clamped));
  } catch {
    // Ignore storage error
  }
  const audio = getAudioElement();
  if (audio) {
    audio.volume = clamped;
  }
  updateState({
    volume: clamped,
    muted: clamped === 0
  });
}

export function toggleMuteVoiceover() {
  const nextMuted = !state.muted;
  const audio = getAudioElement();
  if (audio) {
    audio.volume = nextMuted ? 0 : state.volume || 0.9;
  }
  updateState({
    muted: nextMuted,
    volume: !nextMuted && state.volume === 0 ? 0.9 : state.volume
  });
}

export interface SpeakOptions {
  tone?: VoiceTone;
  title?: string;
  forceReplay?: boolean;
}

export async function speakArabic(text: string, id: string, options: SpeakOptions = {}) {
  if (typeof window === 'undefined') return;

  const tone: VoiceTone = options.tone ?? 'lesson';
  const title = options.title ?? 'التعليق الصوتي للمعلمة';
  const forceReplay = Boolean(options.forceReplay);

  // If clicking the currently active button while playing/loading (and not explicit replay), stop it
  if (!forceReplay && state.activeId === id && (state.status === 'playing' || state.status === 'loading')) {
    stopArabicSpeech();
    return;
  }

  // If currently paused on this exact clip, resume smoothly
  if (!forceReplay && state.activeId === id && state.status === 'paused') {
    if (usingBrowserFallback && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      updateState({ status: 'playing', errorMessage: null });
      return;
    }
    if (sharedAudio) {
      try {
        await sharedAudio.play();
        updateState({ status: 'playing', errorMessage: null });
        return;
      } catch {
        // Fall through to fresh playback
      }
    }
  }

  // Prevent overlapping clips: abort any in-flight request and stop previous audio
  if (activeAbortController) {
    activeAbortController.abort();
    activeAbortController = null;
  }
  stopBrowserFallback();
  const audio = getAudioElement();
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }

  unlockAudioOnGesture();
  lastRequest = { text, id, tone, title };

  const cacheKey = `${tone}::${text.trim()}`;
  const cachedUrl = audioCache.get(cacheKey);
  if (cachedUrl && audio) {
    updateState({
      activeId: id,
      title,
      status: 'playing',
      errorMessage: null
    });
    audio.src = cachedUrl;
    audio.volume = state.muted ? 0 : state.volume;
    try {
      await audio.play();
    } catch {
      updateState({
        status: 'paused',
        errorMessage: 'اضغط تشغيل للاستماع إلى المقطع.'
      });
    }
    return;
  }

  const controller = new AbortController();
  activeAbortController = controller;

  updateState({
    activeId: id,
    title,
    status: 'loading',
    errorMessage: null
  });

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, tone }),
      signal: controller.signal
    });

    const contentType = response.headers.get('content-type') || '';

    if (!response.ok || !contentType.includes('audio/')) {
      let errMsg = 'تعذر توليد الصوت من الخادم.';
      if (contentType.includes('application/json')) {
        try {
          const errData = (await response.json()) as { error?: string };
          if (errData?.error) errMsg = errData.error;
        } catch {
          // Ignore JSON parse error
        }
      }
      throw new Error(errMsg);
    }

    const blob = await response.blob();
    if (controller.signal.aborted) return;

    const blobUrl = URL.createObjectURL(blob);
    audioCache.set(cacheKey, blobUrl);

    if (!audio) return;
    audio.src = blobUrl;
    audio.volume = state.muted ? 0 : state.volume;
    await audio.play();
    updateState({
      activeId: id,
      title,
      status: 'playing',
      errorMessage: null
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return;
    }

    // Emergency fallback to device Arabic voice if serverless endpoint / key isn't configured yet
    const fallbackStarted = speakWithBrowserFallback(text, id, title);
    if (!fallbackStarted) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء تشغيل التعليق الصوتي.';
      updateState({
        status: 'error',
        errorMessage: message
      });
    }
  } finally {
    if (activeAbortController === controller) {
      activeAbortController = null;
    }
  }
}
