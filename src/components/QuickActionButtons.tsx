import React from 'react';
import { BookOpen, UserCheck, FileText, ArrowRight } from 'lucide-react';
import { ActivePage, Language } from '../types/scheme';
import { translations } from '../data/translations';

interface QuickActionButtonsProps {
  currentLanguage: Language;
  onSelectTab: (tab: ActivePage) => void;
  onAskQuestion: (question: string) => void;
  isLargeText?: boolean;
}

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  currentLanguage,
  onSelectTab,
  onAskQuestion,
  isLargeText = false,
}) => {
  const t = translations[currentLanguage];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-4">
      {/* 1. திட்டம் பற்றி – About the scheme */}
      <button
        onClick={() => onSelectTab('scheme_info')}
        className="group text-left bg-white hover:bg-[#F3EDFF]/50 p-4 sm:p-5 rounded-2xl border-2 border-[#F3EDFF] hover:border-[#6D28D9] shadow-2xs hover:shadow-md transition-all active:scale-[0.98] flex flex-col justify-between"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-xl bg-[#F3EDFF] text-[#6D28D9] flex items-center justify-center group-hover:bg-[#6D28D9] group-hover:text-white transition-colors">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-[#6D28D9] bg-[#F3EDFF] px-2.5 py-1 rounded-lg border border-[#A78BFA]/30">
            {t.quickAction1Badge}
          </span>
        </div>
        <div>
          <h2
            className={`font-black text-[#1E293B] mb-1 flex items-center justify-between ${
              isLargeText ? 'text-xl' : 'text-lg'
            }`}
          >
            {t.quickAction1Title}
            <ArrowRight className="w-4 h-4 text-[#A78BFA] group-hover:text-[#6D28D9] group-hover:translate-x-1 transition-all" />
          </h2>
          <p className="text-xs text-[#64748B] leading-relaxed font-medium">
            {t.quickAction1Desc}
          </p>
        </div>
      </button>

      {/* 2. தகுதி – Eligibility */}
      <button
        onClick={() => onSelectTab('eligibility')}
        className="group text-left bg-white hover:bg-[#F3EDFF]/50 p-4 sm:p-5 rounded-2xl border-2 border-[#F3EDFF] hover:border-[#6D28D9] shadow-2xs hover:shadow-md transition-all active:scale-[0.98] flex flex-col justify-between"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-xl bg-[#0D9488]/10 text-[#0D9488] flex items-center justify-center group-hover:bg-[#0D9488] group-hover:text-white transition-colors">
            <UserCheck className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-[#0D9488] bg-[#0D9488]/10 px-2.5 py-1 rounded-lg border border-[#0D9488]/20">
            {t.quickAction2Badge}
          </span>
        </div>
        <div>
          <h2
            className={`font-black text-[#1E293B] mb-1 flex items-center justify-between ${
              isLargeText ? 'text-xl' : 'text-lg'
            }`}
          >
            {t.quickAction2Title}
            <ArrowRight className="w-4 h-4 text-[#A78BFA] group-hover:text-[#6D28D9] group-hover:translate-x-1 transition-all" />
          </h2>
          <p className="text-xs text-[#64748B] leading-relaxed font-medium">
            {t.quickAction2Desc}
          </p>
        </div>
      </button>

      {/* 3. விண்ணப்பிக்கும் முறை – How to apply */}
      <button
        onClick={() => onSelectTab('application_steps')}
        className="group text-left bg-white hover:bg-[#F3EDFF]/50 p-4 sm:p-5 rounded-2xl border-2 border-[#F3EDFF] hover:border-[#6D28D9] shadow-2xs hover:shadow-md transition-all active:scale-[0.98] flex flex-col justify-between"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-700 group-hover:text-white transition-colors">
            <FileText className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
            {t.quickAction3Badge}
          </span>
        </div>
        <div>
          <h2
            className={`font-black text-[#1E293B] mb-1 flex items-center justify-between ${
              isLargeText ? 'text-xl' : 'text-lg'
            }`}
          >
            {t.quickAction3Title}
            <ArrowRight className="w-4 h-4 text-[#A78BFA] group-hover:text-[#6D28D9] group-hover:translate-x-1 transition-all" />
          </h2>
          <p className="text-xs text-[#64748B] leading-relaxed font-medium">
            {t.quickAction3Desc}
          </p>
        </div>
      </button>
    </div>
  );
};
