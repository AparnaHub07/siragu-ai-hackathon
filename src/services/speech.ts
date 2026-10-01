import { generateServerAudio } from './api';
import { Language } from '../types/scheme';

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

const LANGUAGE_LOCALES: Record<Language, string> = {
  ta: 'ta-IN',
  ml: 'ml-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  hi: 'hi-IN',
};

const ERROR_MESSAGES: Record<Language, { unsupported: string; denied: string; noSpeech: string; network: string; generic: string }> = {
  ta: {
    unsupported: 'உங்கள் உலாவியில் குரல் உள்ளீடு வசதி இல்லை. கீழே உள்ள கட்டத்தில் தட்டச்சு செய்யலாம்.',
    denied: 'மைக்ரோஃபோன் அனுமதி தேவை. உலாவியில் மைக் அனுமதியை வழங்கிவிட்டு மீண்டும் முயற்சிக்கவும்.',
    noSpeech: 'குரல் கேட்கவில்லை. மைக்கை அருகில் வைத்து மீண்டும் பேசவும்.',
    network: 'இணையத் தொடர்பு மெதுவாக உள்ளது. மீண்டும் முயற்சிக்கவும் அல்லது தட்டச்சு செய்யவும்.',
    generic: 'மைக்கை இயக்குவதில் தாமதம். மீண்டும் ஒருமுறை அழுத்தவும்.',
  },
  ml: {
    unsupported: 'നിങ്ങളുടെ ബ്രൗസറിൽ വോയ്‌സ് ഇൻപുട്ട് ലഭ്യമല്ല. താഴെ ടൈപ്പ് ചെയ്യാം.',
    denied: 'മൈക്രോഫോൺ അനുമതി നൽകണം. ബ്രൗസറിൽ മൈക്ക് അനുവദിച്ച് വീണ്ടും ശ്രമിക്കുക.',
    noSpeech: 'ശബ്ദം വ്യക്തമായി കേട്ടില്ല. മൈക്ക് അടുപ്പിച്ച് സംസാരിക്കുക.',
    network: 'നെറ്റ്‌വർക്ക് കണക്ഷൻ തടസ്സപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യുക.',
    generic: 'മൈക്ക് പ്രവർത്തിക്കുന്നതിൽ തടസ്സം. വീണ്ടും അമർത്തുക.',
  },
  te: {
    unsupported: 'మీ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. క్రింద టైప్ చేయవచ్చు.',
    denied: 'మైక్రోఫోన్ అనుమతి అవసరం. బ్రౌజర్‌లో మైక్ అనుమతి ఇచ్చి మళ్ళీ ప్రయత్నించండి.',
    noSpeech: 'శబ్దం వినబడలేదు. మైక్ దగ్గరగా మాట్లాడండి.',
    network: 'నెట్‌వర్క్ నెమ్మదిగా ఉంది. మళ్ళీ ప్రయత్నించండి లేదా టైప్ చేయండి.',
    generic: 'మైక్ ప్రారంభించడంలో ఆలస్యం. మళ్ళీ నొక్కండి.',
  },
  kn: {
    unsupported: 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಲಭ್ಯವಿಲ್ಲ. ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಬಹುದು.',
    denied: 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ಅಗತ್ಯವಿದೆ. ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಅನುಮತಿ ನೀಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    noSpeech: 'ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ಮೈಕ್ ಹತ್ತಿರ ಮಾತನಾಡಿ.',
    network: 'ನೆಟ್‌ವರ್ಕ್ ಸಮಸ್ಯೆಯಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.',
    generic: 'ಮೈಕ್ ಪ್ರಾರಂಭಿಸಲು ತಡವಾಯಿತು. ಮತ್ತೆ ಒತ್ತಿರಿ.',
  },
  hi: {
    unsupported: 'आपके ब्राउज़र में वॉयस इनपुट उपलब्ध नहीं है। आप नीचे टाइप कर सकती हैं।',
    denied: 'माइक्रोफ़ोन की अनुमति चाहिए। कृपया ब्राउज़र में अनुमति देकर पुनः प्रयास करें।',
    noSpeech: 'आवाज़ सुनाई नहीं दी। माइक के पास आकर बोलें।',
    network: 'इंटरनेट धीमा है। पुनः प्रयास करें या लिखकर पूछें।',
    generic: 'माइक शुरू करने में देरी हुई। कृपया दोबारा दबाएं।',
  },
};

export class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  private currentLanguage: Language = 'ta';

  constructor() {
    const win = typeof window !== 'undefined' ? (window as unknown as IWindow) : null;
    const SpeechRecognitionClass = win?.SpeechRecognition || win?.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.lang = 'ta-IN';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
      }
    }
  }

  public setLanguage(lang: Language): void {
    this.currentLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = LANGUAGE_LOCALES[lang] || 'ta-IN';
    }
  }

  public getLanguage(): Language {
    return this.currentLanguage;
  }

  public isRecognitionSupported(): boolean {
    return Boolean(this.recognition);
  }

  public isSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public startListening(callbacks: {
    lang?: Language;
    onStart?: () => void;
    onResult: (transcript: string, isFinal: boolean) => void;
    onError: (errorMessage: string) => void;
    onEnd?: () => void;
  }): void {
    const lang = callbacks.lang || this.currentLanguage;
    this.setLanguage(lang);

    const errDict = ERROR_MESSAGES[lang] || ERROR_MESSAGES.ta;

    if (!this.recognition) {
      callbacks.onError(errDict.unsupported);
      return;
    }

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      callbacks.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      callbacks.onResult(text, Boolean(finalTranscript));
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      let errorMsg = errDict.generic;

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMsg = errDict.denied;
      } else if (event.error === 'no-speech') {
        errorMsg = errDict.noSpeech;
      } else if (event.error === 'network') {
        errorMsg = errDict.network;
      }

      callbacks.onError(errorMsg);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      callbacks.onEnd?.();
    };

    try {
      this.recognition.start();
    } catch {
      this.isListening = false;
      callbacks.onError(errDict.generic);
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.isListening = false;
    }
  }

  public async speakText(
    text: string,
    callbacks?: {
      lang?: Language;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): Promise<void> {
    this.stopSpeaking();
    const lang = callbacks?.lang || this.currentLanguage;
    const targetLocale = LANGUAGE_LOCALES[lang] || 'ta-IN';

    // Check if browser has speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();

      // Find matching voice for target language
      const targetVoice = voices.find((v) => {
        const l = v.lang.toLowerCase();
        const n = v.name.toLowerCase();
        if (lang === 'ta') return l.startsWith('ta') || n.includes('tamil');
        if (lang === 'ml') return l.startsWith('ml') || n.includes('malayalam');
        if (lang === 'te') return l.startsWith('te') || n.includes('telugu');
        if (lang === 'kn') return l.startsWith('kn') || n.includes('kannada');
        if (lang === 'hi') return l.startsWith('hi') || n.includes('hindi');
        return false;
      });

      if (targetVoice) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = targetVoice;
        utterance.lang = targetLocale;
        utterance.rate = 0.9; // Calm, respectful pace
        utterance.pitch = 1.0;

        utterance.onstart = () => callbacks?.onStart?.();
        utterance.onend = () => callbacks?.onEnd?.();
        utterance.onerror = () => callbacks?.onEnd?.();

        synth.speak(utterance);
        return;
      }
    }

    // Fallback: If no local voice installed on client OS, request server TTS audio
    try {
      callbacks?.onStart?.();
      const audioUrl = await generateServerAudio(text, lang);
      const audio = new Audio(audioUrl);
      this.currentAudioElement = audio;

      audio.onended = () => {
        this.currentAudioElement = null;
        callbacks?.onEnd?.();
      };
      audio.onerror = (err) => {
        this.currentAudioElement = null;
        callbacks?.onError?.(err);
        callbacks?.onEnd?.();
      };

      await audio.play();
    } catch {
      // Final attempt with generic browser voice if available
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLocale;
        utterance.rate = 0.88;
        utterance.onstart = () => callbacks?.onStart?.();
        utterance.onend = () => callbacks?.onEnd?.();
        utterance.onerror = () => callbacks?.onEnd?.();
        synth.speak(utterance);
      } else {
        callbacks?.onEnd?.();
      }
    }
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
  }
}

export const speechService = new SpeechService();
