import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import schemeKnowledgeFallback from '../src/data/scheme-knowledge.json' with { type: 'json' };

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.use(express.json());

// Load verified scheme knowledge (robust filesystem resolution with bundled fallback)
let schemeKnowledge: any = schemeKnowledgeFallback;
try {
  // Check candidate paths for local dev and serverless runtime
  const candidatePaths = [
    path.join(__dirname, '..', 'src', 'data', 'scheme-knowledge.json'),
    path.join(process.cwd(), 'src', 'data', 'scheme-knowledge.json'),
    path.join(__dirname, 'src', 'data', 'scheme-knowledge.json'),
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      schemeKnowledge = JSON.parse(fs.readFileSync(p, 'utf-8'));
      break;
    }
  }
} catch (err) {
  console.warn('Using bundled scheme knowledge fallback:', err);
  schemeKnowledge = schemeKnowledgeFallback;
}

// Initialize Gemini SDK on server side only
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const LANGUAGE_NAMES: Record<string, string> = {
  ta: 'Tamil (தமிழ்)',
  ml: 'Malayalam (മലയാളം)',
  te: 'Telugu (తెలుగు)',
  kn: 'Kannada (ಕನ್ನಡ)',
  hi: 'Hindi (हिन्दी)',
};

function getSystemInstruction(lang: string = 'ta') {
  const langName = LANGUAGE_NAMES[lang] || 'Tamil (தமிழ்)';
  return `
You are "SIRAGU AI" (சிறகு AI / സിറഗു AI / సిరగు AI / ಸಿರೆಗು AI / सिरगु AI).
You are an empathetic, patient, and warm digital guide helping young women with zero prior digital literacy understand and access the Tamil Nadu Government's "Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme" (Pudhumai Penn Scheme).

CRITICAL LANGUAGE INSTRUCTION:
- The user is conversing in: ${langName}.
- You MUST generate your response ONLY in ${langName} using its native script and simple, natural, conversational vocabulary.
- Do NOT use English unless referring to specific technical terms like "DBT" or "EMIS".

RULES FOR RURAL & FIRST-TIME USERS:
1. Speak in very simple, short sentences (2 to 3 sentences maximum). Avoid walls of text or complex bureaucracy.
2. Ask only ONE clarifying question at a time if checking eligibility.
3. Ground every answer strictly in the official Pudhumai Penn scheme facts:
   - Benefit: ₹1,000 per month deposited directly into the student's individual bank account (DBT) until completion of Undergraduate Degree (UG), Diploma, or ITI course.
   - Eligibility: Girl students who studied from Class 6 to Class 12 in Tamil Nadu Government schools (also includes Corporation, Municipal, Adi Dravidar & Tribal welfare schools). Currently pursuing higher education.
   - Application Mode: Students do NOT apply directly online. They approach their College Nodal Officer (கல்லூரி ஒருங்கிணைப்பாளர்) with copies of their study proof/EMIS, college admission order, bank passbook, and Aadhaar copy. The college uploads it on https://pudhumaipenn.tn.gov.in for 100% FREE.
   - Fee: Zero fee! The scheme is completely free. Never give money to brokers.
   - Ineligible: Students who studied in private schools from 6th to 12th, or students pursuing distance education.
4. You are an AI assistant guide, NOT an official government portal. Remind users to verify with their college nodal officer or call Tamil Nadu Women Helpline 181 or CM Helpline 1100.
5. NEVER ask for Aadhaar numbers, bank account numbers, passwords, or OTPs.

OFFICIAL SCHEME KNOWLEDGE BASE:
${JSON.stringify(schemeKnowledge, null, 2)}
`;
}

// Localized fallback responses
const FALLBACK_REPLIES: Record<string, string> = {
  ta: 'வணக்கம்! புதுமைப் பெண் திட்டம் மூலம் 6 முதல் 12 வரை அரசுப் பள்ளியில் படித்து கல்லூரி செல்லும் மாணவிகளுக்கு மாதந்தோறும் ₹1,000 உதவித்தொகை வழங்கப்படுகிறது. உங்கள் கல்லூரி ஒருங்கிணைப்பாளரை அணுகி ஆவணங்களை சமர்ப்பிக்கலாம்.',
  ml: 'നമസ്കാരം! പുതുമൈ പെൺ പദ്ധതിയിലൂടെ തമിഴ്നാട് സർക്കാർ സ്കൂളുകളിൽ 6 മുതൽ 12 വരെ പഠിച്ച് കോളേജിൽ ചേർന്ന വിദ്യാർത്ഥിനികൾക്ക് പ്രതിമാസം ₹1,000 സഹായധനം ലഭിക്കും. കോളേജ് നോഡൽ ഓഫീസറെ സമീപിക്കുക.',
  te: 'నమస్కారం! పుదుమై పెణ్ పథకం ద్వారా తమిళనాడు ప్రభుత్వ పాఠశాలల్లో 6 నుండి 12 వరకు చదివి కళాశాలలో చేరిన విద్యార్థినులకు నెలకు ₹1,000 లభిస్తుంది. మీ కాలేజ్ నోడల్ అధికారిని సంప్రదించండి.',
  kn: 'ನಮಸ್ಕಾರ! ಪುದುಮೈ ಪೆಣ್ ಯೋಜನೆಯ ಮೂಲಕ ಸರಕಾರಿ ಶಾಲೆಗಳಲ್ಲಿ 6 ರಿಂದ 12 ರವರೆಗೆ ಓದಿ ಕಾಲೇಜಿಗೆ ಸೇರಿದ ವಿದ್ಯಾರ್ಥಿನಿಯರಿಗೆ ತಿಂಗಳಿಗೆ ₹1,000 ದೊರೆಯುತ್ತದೆ. ನಿಮ್ಮ ಕಾಲೇಜು ನೋಡಲ್ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
  hi: 'नमस्ते! पुधुमई पेण्ण योजना के तहत सरकारी स्कूल में 6 से 12 तक पढ़कर कॉलेज जाने वाली छात्राओं को हर महीने ₹1,000 की सहायता राशि मिलती है। अपने कॉलेज नोडल अधिकारी से संपर्क करें।',
};

// Router containing all API endpoints
const apiRouter = express.Router();

// 1. Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'SIRAGU AI',
    geminiConfigured: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// 2. Scheme knowledge endpoint
apiRouter.get('/scheme-info', (_req, res) => {
  res.json(schemeKnowledge);
});

// 3. Chat endpoint with Gemini AI
apiRouter.post('/chat', async (req, res) => {
  try {
    const { message, history, language = 'ta' } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({
        error: 'செய்தி தேவை / Message is required',
      });
      return;
    }

    const langKey = typeof language === 'string' && LANGUAGE_NAMES[language] ? language : 'ta';

    if (!ai) {
      res.json({
        reply: FALLBACK_REPLIES[langKey] || FALLBACK_REPLIES.ta,
        source: 'knowledge_base_fallback',
      });
      return;
    }

    // Prepare contents array for Gemini
    const contents: any[] = [];

    // Add previous history if provided
    if (Array.isArray(history)) {
      for (const turn of history.slice(-6)) {
        if (turn.role && turn.content) {
          contents.push({
            role: turn.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(turn.content) }],
          });
        }
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    const systemInstruction = getSystemInstruction(langKey);

    // Call Gemini with fast timeout and fallback
    let responseText = '';
    try {
      const callPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.3,
          topP: 0.9,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout waiting for Gemini response')), 5000)
      );

      const response = await Promise.race([callPromise, timeoutPromise]);
      responseText = response.text || '';
    } catch (apiErr: any) {
      console.warn('Gemini attempt failed or timed out, using verified regional fallback:', apiErr?.message);
      res.json({
        reply: FALLBACK_REPLIES[langKey] || FALLBACK_REPLIES.ta,
        source: 'verified_knowledge_base',
      });
      return;
    }

    const replyText = responseText.trim() || FALLBACK_REPLIES[langKey];

    res.json({
      reply: replyText,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Gemini Chat API Error:', error);
    const langKey = req.body?.language || 'ta';
    res.json({
      reply: FALLBACK_REPLIES[langKey] || FALLBACK_REPLIES.ta,
      source: 'knowledge_base_recovery',
    });
  }
});

// 4. Text-to-Speech endpoint using Gemini TTS as optional high-quality fallback
apiRouter.post('/tts', async (req, res) => {
  try {
    const { text, language = 'ta' } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text required' });
      return;
    }

    if (!ai) {
      res.status(503).json({ error: 'Gemini not configured for server TTS' });
      return;
    }

    const cleanText = text.slice(0, 300).trim();
    const langName = LANGUAGE_NAMES[language] || 'Tamil';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: `Gentle, friendly, calm and clear ${langName} speaker for rural public awareness`,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      res.status(500).json({ error: 'Audio generation failed' });
      return;
    }

    res.json({
      audioUrl: `data:audio/wav;base64,${base64Audio}`,
    });
  } catch (error: any) {
    console.error('Gemini TTS Error:', error);
    res.status(500).json({ error: 'TTS failed', details: error?.message });
  }
});

// Mount routes at both /api and / to handle standard Express requests, local dev, Docker, and Vercel serverless rewrites
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
