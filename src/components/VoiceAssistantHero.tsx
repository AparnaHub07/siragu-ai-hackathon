import React, { useState, useEffect } from 'react';
import {
  Mic,
  Send,
  Square,
  Volume2,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { speechService } from '../services/speech';
import { Language, ActivePage } from '../types/scheme';
import { SiraguLogo } from './SiraguLogo';
import { translations } from '../data/translations';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

interface VoiceAssistantHeroProps {
  currentLanguage: Language;
  onSendMessage: (text: string, isVoice: boolean) => Promise<void>;
  onNavigate: (page: ActivePage) => void;
  latestReply?: string;
  isProcessing: boolean;
  isLargeText?: boolean;
}

export const VoiceAssistantHero: React.FC<VoiceAssistantHeroProps> = ({
  currentLanguage,
  onSendMessage,
  onNavigate,
  latestReply,
  isProcessing,
  isLargeText = false,
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMicSupported, setIsMicSupported] = useState<boolean>(true);
  const [showMicPermissionModal, setShowMicPermissionModal] = useState<boolean>(false);

  const t = translations[currentLanguage];

  useEffect(() => {
    setIsMicSupported(speechService.isRecognitionSupported());
  }, []);

  useEffect(() => {
    if (isProcessing) {
      setVoiceState('processing');
    } else if (voiceState === 'processing') {
      setVoiceState('idle');
    }
  }, [isProcessing]);

  // Handle Play Welcome Audio in native language
  const handlePlayWelcomeAudio = () => {
    const welcomeSpeeches: Record<Language, string> = {
      ta: 'வணக்கம்! நான் உங்கள் சிறகு AI. தமிழ்நாடு அரசின் புதுமைப் பெண் திட்டம் மூலம் மாதம் ₹1,000 உதவித்தொகை பெறுவது எப்படி என்று எளிய தமிழில் சொல்லித் தருகிறேன். திரையில் உள்ள பெரிய மைக் பொத்தானைத் தொட்டு நீங்கள் என்னுடன் பேசலாம்.',
      ml: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ സിറഗു AI. തമിഴ്നാട് സർക്കാരിന്റെ പുതുമൈ പെൺ പദ്ധതിയിലൂടെ പ്രതിമാസം ₹1,000 സഹായധനം നേടുന്നത് എങ്ങനെയെന്ന് ലളിതമായി പറഞ്ഞുതരാം. മൈക്ക് അമർത്തി എന്നോട് സംസാരിക്കാം.',
      te: 'నమస్కారం! నేను మీ సిరగు AI. తమిళనాడు ప్రభుత్వ పుదుమై పెణ్ పథకం ద్వారా నెలకు ₹1,000 ఎలా పొందాలో సులభంగా వివరిస్తాను. మైక్ బటన్ నొక్కి నాతో మాట్లాడవచ్చు.',
      kn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸಿರೆಗು AI. ತಮಿಳುನಾಡು ಸರಕಾರದ ಪುದುಮೈ ಪೆಣ್ ಯೋಜನೆಯ ಮೂಲಕ ತಿಂಗಳಿಗೆ ₹1,000 ಹೇಗೆ ಪಡೆಯಬೇಕೆಂದು ಸರಳವಾಗಿ ತಿಳಿಸಿಕೊಡುತ್ತೇನೆ. ಮೈಕ್ ಒತ್ತಿ ನನ್ನೊಂದಿಗೆ ಮಾತನಾಡಿ.',
      hi: 'नमस्ते! मैं आपकी सिरगु AI हूँ। तमिलनाडु सरकार की पुधुमई पेण्ण योजना के तहत हर महीने ₹1,000 की सहायता राशि कैसे पाएं, यह आसान भाषा में समझाऊंगी। माइक दबाकर मुझसे बात करें।',
    };

    const welcomeSpeech = welcomeSpeeches[currentLanguage] || welcomeSpeeches.ta;

    setVoiceState('speaking');
    speechService.speakText(welcomeSpeech, {
      lang: currentLanguage,
      onStart: () => setVoiceState('speaking'),
      onEnd: () => setVoiceState('idle'),
      onError: () => setVoiceState('idle'),
    });
  };

  // Handle start/stop speech recognition
  const handleToggleListening = () => {
    setErrorMessage(null);

    // If currently speaking, stop it
    if (voiceState === 'speaking') {
      speechService.stopSpeaking();
      setVoiceState('idle');
      return;
    }

    if (voiceState === 'listening') {
      speechService.stopListening();
      setVoiceState('idle');
      return;
    }

    if (!isMicSupported) {
      setErrorMessage(t.unsupportedVoiceNotice);
      return;
    }

    setTranscript('');
    setVoiceState('listening');

    speechService.startListening({
      lang: currentLanguage,
      onStart: () => {
        setVoiceState('listening');
      },
      onResult: (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim()) {
          handleVoiceQuerySubmit(text.trim());
        }
      },
      onError: (msg) => {
        setErrorMessage(msg);
        setVoiceState('error');
        // If permission error, show permission educational popup
        if (
          msg.includes('அனுமதி') ||
          msg.includes('അനുമതി') ||
          msg.includes('అనుమతి') ||
          msg.includes('ಅನುಮತಿ') ||
          msg.includes('अनुमति') ||
          msg.includes('permission')
        ) {
          setShowMicPermissionModal(true);
        }
      },
      onEnd: () => {
        setVoiceState((current) => (current === 'listening' ? 'idle' : current));
      },
    });
  };

  const handleVoiceQuerySubmit = async (queryText: string) => {
    speechService.stopListening();
    setVoiceState('processing');
    try {
      await onSendMessage(queryText, true);
    } catch {
      setVoiceState('error');
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || isProcessing) return;

    const query = textInput.trim();
    setTextInput('');
    setErrorMessage(null);
    setTranscript(query);
    await onSendMessage(query, false);
  };

  // Replay latest assistant response
  const handleReplayLatest = () => {
    if (!latestReply) return;
    setVoiceState('speaking');
    speechService.speakText(latestReply, {
      lang: currentLanguage,
      onStart: () => setVoiceState('speaking'),
      onEnd: () => setVoiceState('idle'),
      onError: () => setVoiceState('idle'),
    });
  };

  // Stop speaking
  const handleStopSpeaking = () => {
    speechService.stopSpeaking();
    setVoiceState('idle');
  };

  // Modal localized strings
  const modalTexts: Record<
    Language,
    {
      learnPerm: string;
      title: string;
      desc: string;
      fallbackNote: string;
      closeBtn: string;
    }
  > = {
    ta: {
      learnPerm: 'மைக் அனுமதி பெறுவது எப்படி என்று பார்க்கவும்',
      title: 'மைக்ரோஃபோன் அனுமதி விளக்கம்',
      desc: 'உங்கள் உலாவியில் முகவரி பட்டைக்கு அருகில் (Address Bar) உள்ள பூட்டு (Lock) அல்லது மைக்ரோஃபோன் ஐகானைத் தொட்டு "Allow" அல்லது "அனுமதி" என்பதை இயக்கவும்.',
      fallbackNote: 'அனுமதி வழங்க முடியாவிட்டாலும் பரவாயில்லை; நீங்கள் கீழே உள்ள தட்டச்சு கட்டத்தைப் பயன்படுத்தி தொடர்ந்து கேள்விகள் கேட்கலாம்.',
      closeBtn: 'புரிந்தது, மூடுக',
    },
    ml: {
      learnPerm: 'മൈക്ക് അനുമതി എങ്ങനെ നൽകണമെന്ന് അറിയുക',
      title: 'മൈക്രോഫോൺ അനുമതി നിർദ്ദേശങ്ങൾ',
      desc: 'ബ്രൗസറിലെ അഡ്രസ് ബാറിലുള്ള ലോക്ക് അല്ലെങ്കിൽ മൈക്ക് ചിഹ്നത്തിൽ തൊട്ട് "Allow" നൽകുക.',
      fallbackNote: 'വോയ്‌സ് സാധ്യമല്ലെങ്കിലും താഴെയുള്ള ബോക്സിൽ ചോദ്യങ്ങൾ ടൈപ്പ് ചെയ്യാം.',
      closeBtn: 'മനസ്സിലായി, അടയ്ക്കുക',
    },
    te: {
      learnPerm: 'మైక్రోఫోన్ అనుమతి ఎలా ఇవ్వాలో చూడండి',
      title: 'మైక్రోఫోన్ అనుమతి వివరణ',
      desc: 'బ్రౌజర్ అడ్రస్ బార్ వద్ద ఉన్న లాక్ లేదా మైక్ గుర్తును నొక్కి "Allow" ఎంచుకోండి.',
      fallbackNote: 'వాయిస్ రాకపోయినా మీరు క్రింది పెట్టెలో టైప్ చేసి ప్రశ్నలు అడగవచ్చు.',
      closeBtn: 'అర్థమైంది, మూసివేయండి',
    },
    kn: {
      learnPerm: 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ಹೇಗೆ ಪಡೆಯುವುದು ಎಂದು ತಿಳಿಯಿರಿ',
      title: 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ವಿವರಣೆ',
      desc: 'ಬ್ರೌಸರ್ ವಿಳಾಸ ಪಟ್ಟಿಯ ಲಾಕ್ ಅಥವಾ ಮೈಕ್ ಐಕಾನ್ ಮುಟ್ಟಿ "Allow" ಆಯ್ಕೆಮಾಡಿ.',
      fallbackNote: 'ಧ್ವನಿ ಇಲ್ಲದಿದ್ದರೂ ಕೆಳಗಿನ ಪೆಟ್ಟಿಗೆಯಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು.',
      closeBtn: 'ತಿಳಿಯಿತು, ಮುಚ್ಚಿ',
    },
    hi: {
      learnPerm: 'माइक की अनुमति कैसे दें, जानें',
      title: 'माइक्रोफ़ोन अनुमति मार्गदर्शिका',
      desc: 'ब्राउज़र के एड्रेस बार में लॉक अथवा माइक आइकन को छूकर "Allow" चुनें।',
      fallbackNote: 'यदि माइक न चल पाए, तब भी आप नीचे लिखकर प्रश्न पूछ सकती हैं।',
      closeBtn: 'समझ गई, बंद करें',
    },
  };

  const modal = modalTexts[currentLanguage] || modalTexts.ta;

  return (
    <div className="bg-gradient-to-b from-[#F3EDFF] via-[#FAF9FF] to-white border-2 border-[#F3EDFF] rounded-3xl p-5 sm:p-7 shadow-xs text-center relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#A78BFA]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#EC4899]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Logo & Brand Identity */}
      <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto space-y-3 mb-5">
        <div className="animate-butterfly">
          <SiraguLogo size={68} animate={voiceState === 'listening' || voiceState === 'speaking'} />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EDFF] text-[#6D28D9] border border-[#A78BFA]/30 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#6D28D9]" />
            <span>{t.tagline}</span>
          </div>

          <h1
            className={`font-black text-[#1E293B] tracking-tight ${
              isLargeText ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            SIRAGU AI <span className="text-[#6D28D9]">({t.nativeName})</span>
          </h1>

          <p
            className={`text-[#64748B] font-medium leading-relaxed mt-1 max-w-lg mx-auto ${
              isLargeText ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            }`}
          >
            {t.subTagline}
          </p>
        </div>

        {/* 2 Primary Action Buttons: Hear Welcome Audio & Start Tutorial */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <button
            onClick={handlePlayWelcomeAudio}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#F3EDFF] text-[#6D28D9] border border-[#A78BFA]/40 font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95"
            aria-label={t.hearWelcomeBtn}
          >
            <Volume2 className="w-4 h-4 text-[#6D28D9]" />
            <span>{t.hearWelcomeBtn}</span>
          </button>

          <button
            onClick={() => onNavigate('tutorial')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95"
            aria-label={t.startTutorialBtn}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.startTutorialBtn}</span>
          </button>
        </div>
      </div>

      {/* Prominent Microphone Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center my-4 space-y-3">
        {/* Pulsating Animated Button */}
        <div className="relative flex items-center justify-center">
          {voiceState === 'listening' && (
            <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-red-500/30 animate-ping" />
          )}

          <button
            onClick={handleToggleListening}
            disabled={isProcessing}
            aria-label={
              voiceState === 'listening'
                ? t.stopSpeakingBtn
                : voiceState === 'speaking'
                ? t.stopSpeakingBtn
                : t.startSpeakingBtn
            }
            className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 focus:outline-hidden ${
              voiceState === 'listening'
                ? 'bg-red-600 text-white shadow-red-500/40 animate-pulse-ring scale-105'
                : voiceState === 'speaking'
                ? 'bg-amber-600 text-white shadow-amber-500/40'
                : isProcessing
                ? 'bg-[#A78BFA] text-white cursor-not-allowed'
                : 'bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#EC4899] text-white hover:from-[#5B21B6] hover:to-[#DB2777] shadow-[#6D28D9]/30 hover:scale-105 active:scale-95'
            }`}
          >
            {voiceState === 'listening' ? (
              <>
                <Square className="w-8 h-8 fill-current mb-1" />
                <span className="text-[11px] font-bold">{t.stopSpeakingBtn}</span>
              </>
            ) : voiceState === 'speaking' ? (
              <>
                <Square className="w-8 h-8 fill-current mb-1" />
                <span className="text-[11px] font-bold">{t.stopSpeakingBtn}</span>
              </>
            ) : isProcessing ? (
              <RefreshCw className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <Mic className="w-9 h-9 sm:w-10 sm:h-10 mb-1" />
                <span className="text-[11px] sm:text-xs font-bold tracking-wide">
                  {t.startSpeakingBtn}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Status Indicators & Audio Wave */}
        <div className="min-h-[50px] flex flex-col items-center justify-center">
          {voiceState === 'listening' && (
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center gap-1.5 h-7">
                <span className="w-1.5 bg-red-600 rounded-full voice-wave-bar" />
                <span className="w-1.5 bg-red-600 rounded-full voice-wave-bar" />
                <span className="w-1.5 bg-red-600 rounded-full voice-wave-bar" />
                <span className="w-1.5 bg-red-600 rounded-full voice-wave-bar" />
                <span className="w-1.5 bg-red-600 rounded-full voice-wave-bar" />
              </div>
              <p className="text-sm font-bold text-red-700 animate-pulse">
                {t.listeningText}
              </p>
            </div>
          )}

          {voiceState === 'processing' && (
            <div className="flex items-center gap-2 text-[#6D28D9] font-semibold text-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-[#6D28D9]" />
              <span>{t.thinkingText}</span>
            </div>
          )}

          {voiceState === 'speaking' && (
            <div className="flex items-center gap-2 text-amber-900 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 text-xs font-semibold">
              <Volume2 className="w-4 h-4 animate-bounce text-amber-700" />
              <span>{t.speakingText}</span>
              <button
                onClick={handleStopSpeaking}
                className="underline hover:text-amber-950 font-bold ml-1"
              >
                {t.stopSpeakingBtn}
              </button>
            </div>
          )}

          {voiceState === 'idle' && (
            <div className="flex items-center gap-2">
              <p
                className={`font-bold text-[#1E293B] ${
                  isLargeText ? 'text-base' : 'text-sm'
                }`}
              >
                {t.tapToSpeakPrompt}
              </p>
              {latestReply && (
                <button
                  onClick={handleReplayLatest}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#6D28D9] bg-[#F3EDFF] hover:bg-[#F3EDFF]/80 px-2.5 py-1 rounded-lg transition-colors border border-[#A78BFA]/30"
                  title={t.replayAnswer}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{t.replayAnswer}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Live Transcript Preview */}
        {transcript && (
          <div className="w-full max-w-lg bg-white/95 border border-[#A78BFA]/30 rounded-2xl p-3 text-xs sm:text-sm text-[#1E293B] shadow-xs">
            <span className="text-[11px] font-bold text-[#6D28D9] block mb-0.5">
              {t.youSpoke}
            </span>
            <p className="font-medium italic">"{transcript}"</p>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="w-full max-w-lg bg-red-50 border border-red-200 rounded-2xl p-3 text-xs sm:text-sm text-red-900 flex items-start gap-2 text-left">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>{errorMessage}</p>
              <button
                type="button"
                onClick={() => setShowMicPermissionModal(true)}
                className="text-[11px] font-bold text-red-700 underline"
              >
                {modal.learnPerm}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Alternative Text Input Form for users who cannot use voice */}
      <form
        onSubmit={handleTextSubmit}
        className="relative z-10 max-w-xl mx-auto mt-5 pt-4 border-t border-[#F3EDFF]"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={isProcessing}
            placeholder={t.typePlaceholder}
            className="w-full bg-white text-[#1E293B] placeholder:text-slate-400 text-xs sm:text-sm px-4 py-3 rounded-2xl border-2 border-[#F3EDFF] focus:border-[#6D28D9] focus:bg-white focus:outline-hidden transition-all shadow-2xs"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isProcessing}
            aria-label={t.askButton}
            className="shrink-0 bg-[#6D28D9] hover:bg-[#5B21B6] disabled:bg-slate-300 text-white font-bold px-4 py-3 rounded-2xl flex items-center gap-1.5 transition-all active:scale-95 shadow-xs text-xs sm:text-sm"
          >
            <span>{t.askButton}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Microphone Permission Modal Helper */}
      {showMicPermissionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-left space-y-4 shadow-xl border-2 border-[#F3EDFF]">
            <div className="flex items-center gap-2 text-[#6D28D9] font-bold text-base">
              <ShieldCheck className="w-6 h-6" />
              <h3>{modal.title}</h3>
            </div>

            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              {modal.desc}
            </p>

            <div className="bg-[#FAF9FF] p-3 rounded-xl border border-[#A78BFA]/30 text-xs text-[#1E293B] font-semibold">
              {modal.fallbackNote}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowMicPermissionModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#6D28D9] text-white font-bold text-xs shadow-xs"
              >
                {modal.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
