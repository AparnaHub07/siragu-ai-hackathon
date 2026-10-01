import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Language } from '../types/scheme';
import { translations } from '../data/translations';

interface DisclaimerBannerProps {
  currentLanguage: Language;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ currentLanguage }) => {
  const t = translations[currentLanguage];

  return (
    <div className="bg-gradient-to-r from-[#F3EDFF] via-[#FAF9FF] to-[#F3EDFF] border border-[#A78BFA]/40 rounded-2xl p-3.5 text-xs text-[#1E293B] shadow-2xs text-left">
      <div className="flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-[#6D28D9] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-[#1E293B]">
            {t.disclaimerTitle}
          </p>
          <p className="text-[#64748B] leading-relaxed font-medium">
            {t.disclaimerDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
