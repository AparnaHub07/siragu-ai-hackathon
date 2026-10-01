import { SchemeKnowledge, Language } from '../types/scheme';

export async function fetchSchemeInfo(): Promise<SchemeKnowledge> {
  const response = await fetch('/api/scheme-info');
  if (!response.ok) {
    throw new Error('திட்ட விபரங்களைப் பெறுவதில் பிழை ஏற்பட்டது');
  }
  return response.json();
}

export async function sendChatMessage(
  message: string,
  history: Array<{ role: string; content: string }>,
  language: Language = 'ta'
): Promise<{ reply: string; source?: string }> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, history, language }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'பதில் பெறுவதில் தாமதம் ஏற்பட்டுள்ளது. மீண்டும் முயற்சிக்கவும்.');
  }

  return response.json();
}

export async function generateServerAudio(text: string, language: Language = 'ta'): Promise<string> {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, language }),
  });

  if (!response.ok) {
    throw new Error('குரல் பதிவிறக்குவதில் பிழை');
  }

  const data = await response.json();
  return data.audioUrl;
}
