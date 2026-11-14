import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { synthesizeArabicSpeech } from './lib/ttsService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

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
      if (!rawText) {
        res.status(400).json({ error: 'النص المطلوب تحويله إلى صوت فارغ.' });
        return;
      }

      const { buffer, cacheHit } = await synthesizeArabicSpeech(rawText, req.body?.tone);

      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('X-TTS-Cache', cacheHit ? 'HIT' : 'MISS');
      res.send(buffer);
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
