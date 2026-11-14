import type { IncomingMessage, ServerResponse } from 'node:http';
import { synthesizeArabicSpeech } from '../lib/ttsService.ts';

interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

interface VercelResponse extends ServerResponse {
  status?: (code: number) => VercelResponse;
  json?: (data: unknown) => void;
  send?: (body: unknown) => void;
}

async function readJsonBody(req: VercelRequest): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, unknown>;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : (chunk as Buffer));
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function sendJson(res: VercelResponse, statusCode: number, payload: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      sendJson(res, 503, {
        error: 'مفتاح GEMINI_API_KEY غير مضاف في إعدادات البيئة على الخادم.'
      });
      return;
    }

    const body = await readJsonBody(req);
    const rawText = typeof body.text === 'string' ? body.text.trim() : '';
    if (!rawText) {
      sendJson(res, 400, { error: 'النص المطلوب تحويله إلى صوت فارغ.' });
      return;
    }

    const { buffer, cacheHit } = await synthesizeArabicSpeech(rawText, body.tone);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('X-TTS-Cache', cacheHit ? 'HIT' : 'MISS');
    res.end(buffer);
  } catch (error) {
    console.error('Vercel TTS function error:', error);
    const message = error instanceof Error ? error.message : 'تعذر توليد التعليق الصوتي حالياً.';
    sendJson(res, 500, { error: message });
  }
}
