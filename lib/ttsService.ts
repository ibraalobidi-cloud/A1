import { GoogleGenAI } from '@google/genai';

export type VoiceTone = 'lesson' | 'encourage_correct' | 'encourage_retry' | 'term' | 'question';

const MAX_CACHE_ENTRIES = 120;
const ttsCache = new Map<string, Buffer>();

function getCachedAudio(key: string): Buffer | undefined {
  const existing = ttsCache.get(key);
  if (!existing) return undefined;
  ttsCache.delete(key);
  ttsCache.set(key, existing);
  return existing;
}

function setCachedAudio(key: string, buffer: Buffer) {
  if (ttsCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = ttsCache.keys().next().value;
    if (oldestKey) ttsCache.delete(oldestKey);
  }
  ttsCache.set(key, buffer);
}

export function normalizeVoiceTone(rawTone: unknown): VoiceTone {
  if (
    rawTone === 'encourage_correct' ||
    rawTone === 'encourage_retry' ||
    rawTone === 'term' ||
    rawTone === 'question'
  ) {
    return rawTone;
  }
  return 'lesson';
}

function buildSpeechStyle(tone: VoiceTone): string {
  const basePersona =
    'Young friendly female teacher speaking clear Modern Standard Arabic with a gentle Saudi accent, warm natural human voice, moderate comfortable pacing with natural pauses between sentences';

  switch (tone) {
    case 'encourage_correct':
      return `${basePersona}, joyful, proud, enthusiastic cheering tone celebrating a student's correct answer`;
    case 'encourage_retry':
      return `${basePersona}, gentle, caring, uplifting and reassuring tone encouraging a student to try again`;
    case 'term':
      return `${basePersona}, crisp clear articulation for teaching Arabic Taekwondo terms with slight emphasis on pronunciation`;
    case 'question':
      return `${basePersona}, engaging, inquisitive teacher voice reading a quiz question clearly`;
    case 'lesson':
    default:
      return `${basePersona}, cheerful storytelling sports coach energy explaining movement skills clearly`;
  }
}

function ensureWavBuffer(rawBuffer: Buffer): Buffer {
  // Gemini 3.8 unary TTS already returns a complete RIFF WAV file; wrap raw PCM only if needed
  if (rawBuffer.length >= 4 && rawBuffer.subarray(0, 4).toString('ascii') === 'RIFF') {
    return rawBuffer;
  }
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = rawBuffer.length;

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, rawBuffer]);
}

async function generateTtsWithRetry(text: string, style: string, attempts = 2): Promise<Buffer> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const defaultClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  const configs: Array<{
    label: string;
    apiVersion?: string;
    model: string;
    withSpeechMetadata: boolean;
  }> = [
    {
      label: '3.8-flash-lite-tts (v1beta + metadata)',
      apiVersion: 'v1beta',
      model: 'gemini-3.8-flash-lite-tts',
      withSpeechMetadata: true
    },
    {
      label: '3.8-flash-lite-tts (v1alpha + metadata)',
      apiVersion: 'v1alpha',
      model: 'gemini-3.8-flash-lite-tts',
      withSpeechMetadata: true
    },
    {
      label: '2.5-flash-preview-tts (v1beta + style prompt)',
      apiVersion: 'v1beta',
      model: 'gemini-2.5-flash-preview-tts',
      withSpeechMetadata: false
    },
    {
      label: '3.8-flash-lite-tts (style prompt)',
      model: 'gemini-3.8-flash-lite-tts',
      withSpeechMetadata: false
    }
  ];

  let lastError: unknown;
  for (const cfg of configs) {
    const client = cfg.apiVersion
      ? new GoogleGenAI({
          apiKey,
          apiVersion: cfg.apiVersion,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        })
      : defaultClient;

    for (let i = 0; i < attempts; i++) {
      try {
        const promptText = cfg.withSpeechMetadata ? text : `[Style: ${style}]\n${text}`;
        const part: Record<string, unknown> = { text: promptText };
        if (cfg.withSpeechMetadata) {
          part.speechMetadata = { style };
        }

        const response = await client.models.generateContent({
          model: cfg.model,
          contents: [{ role: 'user', parts: [part] }],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' }
              }
            }
          }
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
          throw new Error('لم يتم استلام بيانات صوتية من الخادم.');
        }

        return ensureWavBuffer(Buffer.from(base64Audio, 'base64'));
      } catch (err) {
        lastError = err;
        if (err instanceof Error && err.message.includes('400')) {
          break;
        }
        if (i < attempts - 1) {
          await new Promise((r) => setTimeout(r, 350 * (i + 1)));
        }
      }
    }
  }
  throw lastError;
}

export async function synthesizeArabicSpeech(
  rawText: string,
  rawTone: unknown
): Promise<{ buffer: Buffer; cacheHit: boolean }> {
  const clippedText = rawText.trim().slice(0, 1200);
  const tone = normalizeVoiceTone(rawTone);
  const cacheKey = `${tone}::${clippedText}`;

  const cached = getCachedAudio(cacheKey);
  if (cached) {
    return { buffer: cached, cacheHit: true };
  }

  const style = buildSpeechStyle(tone);
  const wavBuffer = await generateTtsWithRetry(clippedText, style);
  setCachedAudio(cacheKey, wavBuffer);

  return { buffer: wavBuffer, cacheHit: false };
}
