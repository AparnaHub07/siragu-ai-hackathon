import React from 'react';
import { PhoneCall, Type, Globe, Sparkles } from 'lucide-react';
import { SiraguLogo } from './SiraguLogo';
import { ActivePage, Language, SUPPORTED_LANGUAGES } from '../types/scheme';
import { translations } from '../data/translations';

interface HeaderProps {
  currentLanguage: Language;
  onOpenLanguageSelector: () => void;
  isLargeText: boolean;
  setIsLargeText: (val: boolean | ((prev: boolean) => boolean)) => void;
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onOpenLanguageSelector,
  isLargeText,
  setIsLargeText,
  activePage,
  onNavigate,
}) => {
  const t = translations[currentLanguage];
  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F3EDFF] shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand & Logo */}
        <button
          onClick={() => onNavigate('welcome')}
          className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          aria-label="SIRAGU AI முகப்பு"
        >
          <div className="relative">
            <SiraguLogo size={42} animate={false} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif]">
                SIRAGU AI
              </span>
              <span className="text-xs font-bold text-[#6D28D9] bg-[#F3EDFF] px-2 py-0.5 rounded-full border border-[#A78BFA]/30">
                {t.nativeName}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-[#64748B] hidden xs:block">
              {t.tagline}
            </p>
          </div>
        </button>

        {/* Action Controls: Regional Language, Text Size, 181 Call */}
        <div className="flex items-center gap-2">
          {/* Regional Language Switcher Button (opens 5-card selector) */}
          <button
            onClick={onOpenLanguageSelector}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F3EDFF] hover:bg-[#F3EDFF]/80 text-[#6D28D9] border border-[#A78BFA]/40 flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
            title={t.switchLanguageBtn}
            aria-label={t.switchLanguageBtn}
          >
            <Globe className="w-3.5 h-3.5 text-[#6D28D9]" />
            <span className="font-bold">{currentLangMeta?.nameNative || 'தமிழ்'}</span>
          </button>

          {/* Large Text Accessibility Toggle */}
          <button
            onClick={() => setIsLargeText((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all border ${
              isLargeText
                ? 'bg-[#6D28D9] text-white border-[#5B21B6] shadow-inner'
                : 'bg-white text-[#1E293B] border-slate-200 hover:bg-[#F3EDFF]'
            }`}
            title="எழுத்து அளவை மாற்றுக"
            aria-label="Toggle Large Text"
          >
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isLargeText ? t.largeTextOn : t.largeTextOff}
            </span>
          </button>

          {/* 181 Women Helpline Call */}
          <a
            href="tel:181"
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0D9488] hover:bg-[#0F766E] text-white flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            title="181 மகளிர் உதவி எண்"
            aria-label="181 மகளிர் உதவி எண்"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">181</span>
            <span>{t.womenHelpline.split(' ')[1] || 'உதவி'}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
