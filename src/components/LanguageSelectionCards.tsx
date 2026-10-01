import React, { useState } from 'react';
import { Volume2, CheckCircle2, ArrowRight, Globe, Sparkles, X } from 'lucide-react';
import { Language, SUPPORTED_LANGUAGES, LanguageMeta } from '../types/scheme';
import { speechService } from '../services/speech';
import { SiraguLogo } from './SiraguLogo';

interface LanguageSelectionCardsProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onConfirm: () => void;
  isModal?: boolean;
  onClose?: () => void;
  isLargeText?: boolean;
}

export const LanguageSelectionCards: React.FC<LanguageSelectionCardsProps> = ({
  currentLanguage,
  onSelectLanguage,
  onConfirm,
  isModal = false,
  onClose,
  isLargeText = false,
}) => {
  const [selectedLang, setSelectedLang] = useState<Language>(currentLanguage);
  const [speakingCode, setSpeakingCode] = useState<string | null>(null);

  const handlePronounce = (langMeta: LanguageMeta, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpeakingCode(langMeta.code);

    // Speak the native name using speech synthesis
    speechService.speakText(langMeta.pronounceText, {
      lang: langMeta.code,
      onStart: () => setSpeakingCode(langMeta.code),
      onEnd: () => setSpeakingCode(null),
      onError: () => setSpeakingCode(null),
    });
  };

  const handleCardClick = (code: Language) => {
    setSelectedLang(code);
    onSelectLanguage(code);

    const meta = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (meta) {
      setSpeakingCode(code);
      speechService.speakText(meta.pronounceText, {
        lang: code,
        onStart: () => setSpeakingCode(code),
        onEnd: () => setSpeakingCode(null),
        onError: () => setSpeakingCode(null),
      });
    }
  };

  // Localized Continue labels in each native language
  const continueLabels: Record<Language, string> = {
    ta: 'தொடரவும்',
    ml: 'തുടരുക',
    te: 'కొనసాగించండి',
    kn: 'ಮುಂದುವರಿಯಿರಿ',
    hi: 'आगे बढ़ें',
  };

  const titleLabels: Record<Language, string> = {
    ta: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    ml: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക',
    te: 'మీ భాషను ఎంచుకోండి',
    kn: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    hi: 'अपनी भाषा चुनें',
  };

  const subtitleLabels: Record<Language, string> = {
    ta: 'ஒலிபெருக்கியைத் தொட்டு கேட்கலாம். விருப்பமான மொழியைத் தொடவும்.',
    ml: 'കേൾക്കാൻ സ്പീക്കർ ചിഹ്നം തൊടുക. ഭാഷ തിരഞ്ഞെടുക്കുക.',
    te: 'వినడానికి స్పీకర్ గుర్తును తాకండి. మీకు కావలసిన భాషను ఎంచుకోండి.',
    kn: 'ಕೇಳಲು ಧ್ವನಿವರ್ಧಕ ಗುರುತನ್ನು ಮುಟ್ಟಿ. ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    hi: 'सुनने के लिए स्पीकर बटन दबाएं। अपनी पसंदीदा भाषा चुनें।',
  };

  return (
    <div className={isModal ? 'fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto' : 'w-full my-6'}>
      <div className={`bg-white rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-[#F3EDFF] text-left max-w-2xl w-full relative ${isModal ? 'animate-in fade-in zoom-in-95 duration-200' : ''}`}>
        {/* Header & Logo */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <SiraguLogo size={42} animate={false} />
            <div>
              <h2 className={`font-black text-[#1E293B] ${isLargeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                {titleLabels[selectedLang]}
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium mt-0.5">
                {subtitleLabels[selectedLang]}
              </p>
            </div>
          </div>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="மூடுக"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 5 Large Regional Language Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
          {SUPPORTED_LANGUAGES.map((langMeta) => {
            const isSelected = selectedLang === langMeta.code;
            const isSpeakingThis = speakingCode === langMeta.code;

            return (
              <div
                key={langMeta.code}
                onClick={() => handleCardClick(langMeta.code)}
                className={`cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all flex flex-col justify-between active:scale-[0.98] ${
                  isSelected
                    ? 'bg-[#F3EDFF] border-[#6D28D9] shadow-md ring-2 ring-[#6D28D9]/30'
                    : 'bg-white border-[#F3EDFF] hover:border-[#A78BFA] hover:shadow-2xs'
                }`}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(langMeta.code);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`text-xl sm:text-2xl font-black ${isSelected ? 'text-[#6D28D9]' : 'text-[#1E293B]'}`}>
                    {langMeta.nameNative}
                  </span>

                  {/* Speaker Button to Pronounce Language Name */}
                  <button
                    onClick={(e) => handlePronounce(langMeta, e)}
                    className={`p-2 rounded-xl transition-all shadow-2xs ${
                      isSpeakingThis
                        ? 'bg-amber-500 text-white animate-pulse'
                        : isSelected
                        ? 'bg-[#6D28D9] text-white hover:bg-[#5B21B6]'
                        : 'bg-[#F3EDFF] text-[#6D28D9] hover:bg-[#A78BFA]/30'
                    }`}
                    title={`${langMeta.nameNative} கேட்க`}
                    aria-label={`${langMeta.nameNative} கேட்க`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F3EDFF]">
                  <span className="text-[11px] font-bold text-[#64748B]">
                    {langMeta.locale}
                  </span>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#6D28D9]">
                      <CheckCircle2 className="w-4 h-4 text-[#6D28D9]" />
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300 font-bold">•</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Large Intuitive Continue Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              speechService.stopSpeaking();
              onConfirm();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
          >
            <span>{continueLabels[selectedLang]}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
