import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  User,
  Clock,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { ChatMessage, Language } from '../types/scheme';
import { speechService } from '../services/speech';
import { SiraguLogo } from './SiraguLogo';
import { translations } from '../data/translations';

interface ChatViewProps {
  currentLanguage: Language;
  messages: ChatMessage[];
  onSelectSuggestion: (question: string) => void;
  onResetChat: () => void;
  isProcessing: boolean;
  isLargeText?: boolean;
}

const REGIONAL_COMMON_QUESTIONS: Record<Language, string[]> = {
  ta: [
    'நான் தனியார் பள்ளியில் படித்தேன், எனக்கு ₹1000 கிடைக்குமா?',
    'கல்லூரியில் யாரிடம் சென்று விண்ணப்பிக்க வேண்டும்?',
    'விண்ணப்பிக்க என்னென்ன ஆவணங்கள் தேவை?',
    'வங்கி கணக்கு யாருடைய பெயரில் இருக்க வேண்டும்?',
    'இத்திட்டத்தில் சேர ஏதேனும் கட்டணம் செலுத்த வேண்டுமா?',
    'ஏற்கனவே வேறு ஸ்காலர்ஷிப் பெற்றால் இது கிடைக்குமா?',
  ],
  ml: [
    'സ്വകാര്യ സ്കൂളിൽ പഠിച്ചവർക്ക് ഈ തുക ലഭിക്കുമോ?',
    'കോളേജിൽ ആരെയാണ് സമീപിക്കേണ്ടത്?',
    'അപേക്ഷിക്കാൻ എന്തൊക്കെ രേഖകൾ വേണം?',
    'ബാങ്ക് അക്കൗണ്ട് ആരുടെ പേരിലായിരിക്കണം?',
    'അപേക്ഷിക്കാൻ ഫീസ് നൽകേണ്ടതുണ്ടോ?',
    'മറ്റ് സ്കോളർഷിപ്പ് ഉണ്ടെങ്കിൽ ഇത് ലഭിക്കുമോ?',
  ],
  te: [
    'ప్రైవేట్ పాఠశాలలో చదివిన వారికి ₹1000 వస్తుందా?',
    'కాలేజీలో ఎవరిని కలిసి దరఖాస్తు చేయాలి?',
    'దరఖాస్తుకు ఏ పత్రాలు అవసరం?',
    'బ్యాంక్ ఖాతా ఎవరి పేరు మీద ఉండాలి?',
    'దరఖాస్తు చేసుకోవడానికి రుసుము ఉందా?',
    'ఇతర స్కాలర్‌షిప్‌లు ఉంటే ఇది వర్తిస్తుందా?',
  ],
  kn: [
    'ಖಾಸಗಿ ಶಾಲೆಯಲ್ಲಿ ಓದಿದವರಿಗೆ ₹1000 ಸಿಗುತ್ತದೆಯೇ?',
    'ಕಾಲೇಜಿನಲ್ಲಿ ಯಾರನ್ನು ಸಂಪರ್ಕಿಸಬೇಕು?',
    'ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?',
    'ಬ್ಯಾಂಕ್ ಖಾತೆ ಯಾರ ಹೆಸರಿನಲ್ಲಿರಬೇಕು?',
    'ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಶುಲ್ಕವಿದೆಯೇ?',
    'ಬೇರೆ ಸ್ಕಾಲರ್‌ಶಿಪ್ ಇದ್ದರೆ ಇದು ಸಿಗುತ್ತದೆಯೇ?',
  ],
  hi: [
    'क्या प्राइवेट स्कूल में पढ़ने वाली छात्रा को ₹1000 मिलेंगे?',
    'कॉलेज में किससे मिलकर आवेदन करना होगा?',
    'आवेदन के लिए कौन से दस्तावेज़ चाहिए?',
    'बैंक खाता किसके नाम पर होना चाहिए?',
    'क्या आवेदन करने के लिए कोई फ़ीस देनी होगी?',
    'यदि अन्य छात्रवृत्ति मिल रही हो तो क्या यह मिलेगी?',
  ],
};

const UI_TEXTS: Record<
  Language,
  {
    faqTitle: string;
    resetChatBtn: string;
    listenAloud: string;
    stopAudio: string;
    speakingNotice: string;
    userLabel: string;
  }
> = {
  ta: {
    faqTitle: 'அடிக்கடி கேட்கப்படும் முக்கிய கேள்விகள் (தட்டவும்):',
    resetChatBtn: 'புதிய அரட்டை',
    listenAloud: 'குரலில் கேட்க',
    stopAudio: 'நிறுத்து',
    speakingNotice: 'குரல் ஒலிக்கிறது...',
    userLabel: 'நீங்கள்',
  },
  ml: {
    faqTitle: 'പ്രധാന ചോദ്യങ്ങൾ (ചോദിക്കാൻ തൊടുക):',
    resetChatBtn: 'പുതിയ ചാറ്റ്',
    listenAloud: 'ശബ്ദത്തിൽ കേൾക്കുക',
    stopAudio: 'നിർത്തുക',
    speakingNotice: 'സിറഗു സംസാരിക്കുന്നു...',
    userLabel: 'നിങ്ങൾ',
  },
  te: {
    faqTitle: 'తరచుగా అడిగే ప్రశ్నలు (అడగడానికి తాకండి):',
    resetChatBtn: 'కొత్త సంభాషణ',
    listenAloud: 'వినండి',
    stopAudio: 'ఆపండి',
    speakingNotice: 'సిరగు మాట్లాడుతోంది...',
    userLabel: 'మీరు',
  },
  kn: {
    faqTitle: 'ಪ್ರಮುಖ ಪ್ರಶ್ನೆಗಳು (ಕೇಳಲು ಮುಟ್ಟಿ):',
    resetChatBtn: 'ಹೊಸ ಸಂಭಾಷಣೆ',
    listenAloud: 'ಆಲಿಸಿ',
    stopAudio: 'ನಿಲ್ಲಿಸಿ',
    speakingNotice: 'ಧ್ವನಿ ಪ್ಲೇ ಆಗುತ್ತಿದೆ...',
    userLabel: 'ನೀವು',
  },
  hi: {
    faqTitle: 'अक्सर पूछे जाने वाले सवाल (पूछने के लिए दबाएं):',
    resetChatBtn: 'नई बातचीत',
    listenAloud: 'बोलकर सुनें',
    stopAudio: 'रोकें',
    speakingNotice: 'सिरगु बोल रही है...',
    userLabel: 'आप',
  },
};

export const ChatView: React.FC<ChatViewProps> = ({
  currentLanguage,
  messages,
  onSelectSuggestion,
  onResetChat,
  isProcessing,
  isLargeText = false,
}) => {
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const t = translations[currentLanguage];
  const ui = UI_TEXTS[currentLanguage] || UI_TEXTS.ta;
  const suggestions = REGIONAL_COMMON_QUESTIONS[currentLanguage] || REGIONAL_COMMON_QUESTIONS.ta;

  const handleSpeak = (msg: ChatMessage) => {
    if (playingMessageId === msg.id) {
      speechService.stopSpeaking();
      setPlayingMessageId(null);
      return;
    }

    setPlayingMessageId(msg.id);
    speechService.speakText(msg.content, {
      lang: currentLanguage,
      onStart: () => setPlayingMessageId(msg.id),
      onEnd: () => setPlayingMessageId(null),
      onError: () => setPlayingMessageId(null),
    });
  };

  return (
    <div className="space-y-4 text-left">
      {/* Suggestions and Reset Bar */}
      <div className="bg-[#FAF9FF] border-2 border-[#F3EDFF] rounded-2xl p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-[#1E293B] font-bold text-xs sm:text-sm">
            <HelpCircle className="w-4 h-4 text-[#6D28D9]" />
            <span>{ui.faqTitle}</span>
          </div>

          <button
            onClick={onResetChat}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6D28D9] hover:bg-[#F3EDFF] px-2.5 py-1 rounded-lg transition-colors border border-[#A78BFA]/30"
            title={ui.resetChatBtn}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{ui.resetChatBtn}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestions.map((q, idx) => (
            <button
              key={idx}
              disabled={isProcessing}
              onClick={() => onSelectSuggestion(q)}
              className="text-left bg-white hover:bg-[#F3EDFF] text-[#1E293B] border border-[#A78BFA]/30 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 shadow-2xs"
            >
              💬 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Timeline */}
      <div className="space-y-3.5">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          const isPlaying = playingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                isAssistant ? 'justify-start' : 'justify-end'
              }`}
            >
              {isAssistant && (
                <div className="shrink-0 mt-1">
                  <SiraguLogo size={32} animate={isPlaying} />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-xs ${
                  isAssistant
                    ? 'bg-white border-2 border-[#F3EDFF] text-[#1E293B]'
                    : 'bg-[#6D28D9] text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span
                    className={`text-[11px] font-bold ${
                      isAssistant ? 'text-[#6D28D9]' : 'text-purple-200'
                    }`}
                  >
                    {isAssistant ? `SIRAGU AI (${t.nativeName})` : ui.userLabel}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] opacity-60">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Message Content */}
                <p
                  className={`leading-relaxed whitespace-pre-wrap font-medium ${
                    isLargeText ? 'text-base sm:text-lg' : 'text-sm'
                  }`}
                >
                  {msg.content}
                </p>

                {/* Assistant Audio Action Button */}
                {isAssistant && (
                  <div className="mt-3 pt-2.5 border-t border-[#F3EDFF] flex items-center justify-between">
                    <button
                      onClick={() => handleSpeak(msg)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        isPlaying
                          ? 'bg-amber-600 text-white'
                          : 'bg-[#F3EDFF] text-[#6D28D9] hover:bg-[#F3EDFF]/80 border border-[#A78BFA]/30'
                      }`}
                      aria-label={isPlaying ? ui.stopAudio : ui.listenAloud}
                    >
                      {isPlaying ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>{ui.stopAudio}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-[#6D28D9]" />
                          <span>{ui.listenAloud}</span>
                        </>
                      )}
                    </button>
                    {isPlaying && (
                      <span className="text-[11px] font-semibold text-amber-700 animate-pulse">
                        {ui.speakingNotice}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!isAssistant && (
                <div className="w-8 h-8 rounded-xl bg-[#F3EDFF] text-[#6D28D9] flex items-center justify-center shrink-0 mt-1 border border-[#A78BFA]/30">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
