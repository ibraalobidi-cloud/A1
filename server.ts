import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Shared Gemini client with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// In-memory LRU audio cache to avoid regenerating identical clips
const MAX_CACHE_ENTRIES = 120;
const ttsCache = new Map<string, Buffer>();

function getCachedAudio(key: string): Buffer | undefined {
  const existing = ttsCache.get(key);
  if (!existing) return undefined;
  // Refresh LRU recency
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

type VoiceTone = 'lesson' | 'encourage_correct' | 'encourage_retry' | 'term' | 'question';

function buildSpeechStyle(tone: VoiceTone): string {
  const basePersona =
    'Young friendly female teacher speaking clear Modern Standard Arabic with a gentle Saudi accent, warm natural human voice, moderate comfortable pacing with natural pauses between sentences';

  switch (tone) {
    case 'encourage_correct':
      return `${basePersona}, joyful, proud, enthusiastic cheering tone celebrating a student's correct answer`;
    case 'encourage_retry':
      return `${basePersona}, gentle, caring, uplifting and reassuring tone encouraging a student to try again`;
    case 'term':
      return `${basePersona}, crisp clear articulation for teaching Arabic and Korean Taekwondo terms with slight emphasis on pronunciation`;
    case 'question':
      return `${basePersona}, engaging, inquisitive teacher voice reading a quiz question clearly`;
    case 'lesson':
    default:
      return `${basePersona}, cheerful storytelling sports coach energy explaining movement skills clearly`;
  }
}

async function generateTtsWithRetry(text: string, style: string, attempts = 2): Promise<Buffer> {
  const configs: Array<{
    label: string;
    apiVersion?: string;
    model: string;
    withSpeechMetadata: boolean;
    withSpeechConfig: boolean;
  }> = [
    {
      label: '3.8-flash-lite-tts (v1beta + metadata)',
      apiVersion: 'v1beta',
      model: 'gemini-3.8-flash-lite-tts',
      withSpeechMetadata: true,
      withSpeechConfig: true
    },
    {
      label: '3.8-flash-lite-tts (v1alpha + metadata)',
      apiVersion: 'v1alpha',
      model: 'gemini-3.8-flash-lite-tts',
      withSpeechMetadata: true,
      withSpeechConfig: true
    },
    {
      label: '2.5-flash-preview-tts (v1beta + style prompt)',
      apiVersion: 'v1beta',
      model: 'gemini-2.5-flash-preview-tts',
      withSpeechMetadata: false,
      withSpeechConfig: true
    },
    {
      label: '3.8-flash-lite-tts (style prompt)',
      model: 'gemini-3.8-flash-lite-tts',
      withSpeechMetadata: false,
      withSpeechConfig: true
    }
  ];

  let lastError: unknown;
  for (const cfg of configs) {
    const client = cfg.apiVersion
      ? new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          apiVersion: cfg.apiVersion,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        })
      : ai;

    for (let i = 0; i < attempts; i++) {
      try {
        const promptText = cfg.withSpeechMetadata
          ? text
          : `[Style: ${style}]\n${text}`;

        const part: Record<string, unknown> = { text: promptText };
        if (cfg.withSpeechMetadata) {
          part.speechMetadata = { style };
        }

        const genConfig: Record<string, unknown> = {
          responseModalities: ['AUDIO']
        };
        if (cfg.withSpeechConfig) {
          genConfig.speechConfig = {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }
            }
          };
        }

        const response = await client.models.generateContent({
          model: cfg.model,
          contents: [{ role: 'user', parts: [part] }],
          config: genConfig
        });

        const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
        const base64Audio = inlineData?.data;
        if (!base64Audio) {
          throw new Error('لم يتم استلام بيانات صوتية من الخادم.');
        }

        console.log(`TTS succeeded via ${cfg.label}, mimeType=${inlineData?.mimeType}`);
        return Buffer.from(base64Audio, 'base64');
      } catch (err) {
        lastError = err;
        console.warn(`TTS attempt failed (${cfg.label}):`, err instanceof Error ? err.message.slice(0, 180) : err);
        // On 400 invalid argument, immediately try next config
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

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.post('/api/tts', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        res.status(503).json({
          error: 'مفتاح Gemini API غير مهيأ في الخادم. يرجى التحقق من إعدادات الأسرار (Secrets).'
        });
        return;
      }

      const rawText = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
      const rawTone = req.body?.tone;
      const tone: VoiceTone =
        rawTone === 'encourage_correct' ||
        rawTone === 'encourage_retry' ||
        rawTone === 'term' ||
        rawTone === 'question'
          ? rawTone
          : 'lesson';

      if (!rawText) {
        res.status(400).json({ error: 'النص المطلوب تحويله إلى صوت فارغ.' });
        return;
      }

      const clippedText = rawText.slice(0, 1200);
      const cacheKey = `${tone}::${clippedText}`;

      const cached = getCachedAudio(cacheKey);
      if (cached) {
        res.setHeader('Content-Type', 'audio/wav');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('X-TTS-Cache', 'HIT');
        res.send(cached);
        return;
      }

      const style = buildSpeechStyle(tone);
      const wavBuffer = await generateTtsWithRetry(clippedText, style);
      setCachedAudio(cacheKey, wavBuffer);

      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('X-TTS-Cache', 'MISS');
      res.send(wavBuffer);
    } catch (error) {
      console.error('Gemini TTS generation error:', error);
      const message =
        error instanceof Error ? error.message : 'تعذر توليد التعليق الصوتي حالياً.';
      res.status(500).json({ error: message });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Taekwondo Academy server listening on http://0.0.0.0:${PORT}`);
  });
}

createServer();
