/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Home,
  GraduationCap,
  MessageSquare,
  BookOpen,
  UserCheck,
  FileCheck2,
  ListOrdered,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Header } from './components/Header';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { QuickActionButtons } from './components/QuickActionButtons';
import { VoiceAssistantHero } from './components/VoiceAssistantHero';
import { ChatView } from './components/ChatView';
import { SchemeOverviewView } from './components/SchemeOverviewView';
import { EligibilityCheckerView } from './components/EligibilityCheckerView';
import { DocumentsChecklistView } from './components/DocumentsChecklistView';
import { ApplicationStepsView } from './components/ApplicationStepsView';
import { SupportOfficialView } from './components/SupportOfficialView';
import { InteractiveTutorialView } from './components/InteractiveTutorialView';
import { PersistentAssistantBar } from './components/PersistentAssistantBar';
import { LanguageSelectionCards } from './components/LanguageSelectionCards';
import { SiraguLogo } from './components/SiraguLogo';
import { ActivePage, ChatMessage, Language, SchemeKnowledge } from './types/scheme';
import { fetchSchemeInfo, sendChatMessage } from './services/api';
import { speechService } from './services/speech';
import { translations } from './data/translations';
import fallbackSchemeData from './data/scheme-knowledge.json';

const INITIAL_GREETINGS: Record<Language, string> = {
  ta: 'வணக்கம்! நான் உங்கள் சிறகு AI டிஜிட்டல் வழிகாட்டி. தமிழ்நாடு அரசின் புதுமைப் பெண் திட்டம் மூலம் மாதம் ₹1,000 உதவித்தொகை பெறுவது எப்படி என்று எளிய தமிழில் சொல்லித் தருகிறேன். திரையில் உள்ள பெரிய மைக் பொத்தானைத் தொட்டு நீங்கள் என்னுடன் பேசலாம்.',
  ml: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ സിറഗു AI ഡിജിറ്റൽ സഹായി. തമിഴ്നാട് സർക്കാരിന്റെ പുതുമൈ പെൺ പദ്ധതിയിലൂടെ മാസം ₹1,000 സഹായധനം എങ്ങനെ നേടാമെന്ന് ഞാൻ ലളിതമായി പറഞ്ഞുതരാം. മൈക്രോഫോൺ ബട്ടൺ അമർത്തി എന്നോട് സംസാരിക്കാം.',
  te: 'నమస్కారం! నేను మీ సిరగు AI డిజిటల్ గైడ్. తమిళనాడు ప్రభుత్వ పుదుమై పెణ్ పథకం ద్వారా నెలకు ₹1,000 సహాయం ఎలా పొందాలో సులభంగా తెలియజేస్తాను. మైక్రోఫోన్ బటన్‌ను నొక్కి నాతో మాట్లాడవచ్చు.',
  kn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸಿರೆಗು AI ಡಿಜಿಟಲ್ ಮಾರ್ಗದರ್ಶಿ. ತಮಿಳುನಾಡು ಸರ್ಕಾರದ ಪುದುಮೈ ಪೆಣ್ ಯೋಜನೆಯಡಿ ತಿಂಗಳಿಗೆ ₹1,000 ಆರ್ಥಿಕ ನೆರವು ಪಡೆಯುವುದು ಹೇಗೆಂದು ಸರಳವಾಗಿ ವಿವರಿಸುತ್ತೇನೆ. ಮೈಕ್ ಬಟನ್ ಒತ್ತಿ ನನ್ನೊಂದಿಗೆ ಮಾತನಾಡಬಹುದು.',
  hi: 'नमस्ते! मैं आपकी सिरगु AI डिजिटल साथी हूँ। तमिलनाडु सरकार की पुधुमई पेण्ण योजना के तहत हर महीने ₹1,000 की उच्च शिक्षा सहायता कैसे प्राप्त करें, यह मैं आपको सरल भाषा में समझाऊँगी। माइक बटन दबाकर आप मुझसे बात कर सकती हैं।',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<ActivePage>('welcome');
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('siragu_language') as Language;
      if (saved && ['ta', 'ml', 'te', 'kn', 'hi'].includes(saved)) {
        return saved;
      }
    }
    return 'ta';
  });

  const [hasSelectedInitialLanguage, setHasSelectedInitialLanguage] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(localStorage.getItem('siragu_lang_selected'));
    }
    return false;
  });

  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);
  const [isLargeText, setIsLargeText] = useState<boolean>(false);
  const [schemeData, setSchemeData] = useState<SchemeKnowledge>(
    fallbackSchemeData as unknown as SchemeKnowledge
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: INITIAL_GREETINGS.ta,
      timestamp: new Date(),
    },
  ]);

  const t = translations[currentLanguage];

  // Load verified scheme info on mount
  useEffect(() => {
    fetchSchemeInfo()
      .then((data) => {
        if (data) setSchemeData(data);
      })
      .catch((err) => {
        console.warn('Using local scheme data fallback:', err);
      });
  }, []);

  // Update language in speech service & document title
  useEffect(() => {
    speechService.setLanguage(currentLanguage);
    if (typeof document !== 'undefined') {
      document.title = `SIRAGU AI (${t.nativeName}) - ${t.tagline} | Pudhumai Penn`;
    }
  }, [currentLanguage, t.nativeName, t.tagline]);

  const handleLanguageSelect = (newLang: Language) => {
    setCurrentLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('siragu_language', newLang);
    }
    speechService.setLanguage(newLang);

    // Update welcome message if still at initial greeting
    if (messages.length === 1 && messages[0].id.startsWith('msg-welcome')) {
      setMessages([
        {
          id: `msg-welcome-${Date.now()}`,
          role: 'assistant',
          content: INITIAL_GREETINGS[newLang] || INITIAL_GREETINGS.ta,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleConfirmInitialLanguage = () => {
    setHasSelectedInitialLanguage(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('siragu_lang_selected', 'true');
      localStorage.setItem('siragu_language', currentLanguage);
    }

    // Auto-play the spoken welcome greeting in the chosen language
    const greeting = INITIAL_GREETINGS[currentLanguage] || INITIAL_GREETINGS.ta;
    speechService.speakText(greeting, { lang: currentLanguage });
  };

  const handleSendMessage = async (text: string, isVoice: boolean) => {
    if (!text.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
      isVoiceInput: isVoice,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsProcessing(true);

    // If on another page, navigate to assistant so conversation is visible
    if (currentPage !== 'assistant' && currentPage !== 'welcome') {
      setCurrentPage('assistant');
    }

    try {
      const history = newMessages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendChatMessage(text.trim(), history, currentLanguage);
      const fallbackReply =
        currentLanguage === 'ta'
          ? 'மன்னிக்கவும், தகவலைப் பெறுவதில் தாமதம். சிறிது நேரத்தில் மீண்டும் கேட்கவும்.'
          : currentLanguage === 'ml'
          ? 'ക്ഷമിക്കണം, താൽക്കാലിക തടസ്സമുണ്ടായി. ദയവായി അല്പം കഴിഞ്ഞ് ചോദിക്കുക.'
          : currentLanguage === 'te'
          ? 'క్షమించండి, సమాచారం పొందడంలో ఆలస్యం. దయచేసి కాసేపటి తర్వాత అడగండి.'
          : currentLanguage === 'kn'
          ? 'ಕ್ಷಮಿಸಿ, ಮಾಹಿತಿ ಪಡೆಯಲು ವಿಳಂಬವಾಯಿತು. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಕೇಳಿ.'
          : 'क्षमा करें, जानकारी प्राप्त करने में देरी हुई। कृपया थोड़ी देर बाद पुनः पूछें।';

      const replyContent = res.reply || fallbackReply;

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If user used voice, speak the response aloud
      if (isVoice) {
        speechService.speakText(replyContent, { lang: currentLanguage });
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorFallback =
        currentLanguage === 'ta'
          ? 'மன்னிக்கவும், தகவலைப் பெறுவதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் கேட்கவும்.'
          : currentLanguage === 'ml'
          ? 'ക്ഷമിക്കണം, തകരാറുണ്ടായി. ദയവായി വീണ്ടും ശ്രമിക്കുക.'
          : currentLanguage === 'te'
          ? 'సమస్య ఎదురైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.'
          : currentLanguage === 'kn'
          ? 'ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
          : 'तकनीकी समस्या आई। कृपया पुनः प्रयास करें।';

      const errorMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: errorFallback,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetChat = () => {
    speechService.stopSpeaking();
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        role: 'assistant',
        content: INITIAL_GREETINGS[currentLanguage] || INITIAL_GREETINGS.ta,
        timestamp: new Date(),
      },
    ]);
  };

  const latestAssistantReply = messages
    .filter((m) => m.role === 'assistant')
    .slice(-1)[0]?.content;

  // FIRST-TIME EXPERIENCE: Show 5 Illustrated Regional Language Cards before entering
  if (!hasSelectedInitialLanguage) {
    return (
      <div className="min-h-screen bg-[#FAF9FF] flex flex-col justify-center items-center p-4">
        <LanguageSelectionCards
          currentLanguage={currentLanguage}
          onSelectLanguage={handleLanguageSelect}
          onConfirm={handleConfirmInitialLanguage}
          isModal={false}
          isLargeText={isLargeText}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#FAF9FF] text-[#1E293B] ${
        isLargeText ? 'text-lg' : 'text-base'
      }`}
    >
      {/* Top Header */}
      <Header
        currentLanguage={currentLanguage}
        onOpenLanguageSelector={() => setShowLanguageModal(true)}
        isLargeText={isLargeText}
        setIsLargeText={setIsLargeText}
        activePage={currentPage}
        onNavigate={setCurrentPage}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 sm:py-6 space-y-5">
        {/* Informational Disclaimer Banner */}
        <DisclaimerBanner currentLanguage={currentLanguage} />

        {/* 8-Tab Navigation Bar */}
        <nav
          aria-label={t.navHome}
          className="bg-white border-2 border-[#F3EDFF] rounded-2xl p-1.5 shadow-2xs flex items-center overflow-x-auto gap-1 scrollbar-none"
        >
          <button
            onClick={() => setCurrentPage('welcome')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              currentPage === 'welcome'
                ? 'bg-[#6D28D9] text-white shadow-xs'
                : 'text-[#1E293B] hover:bg-[#F3EDFF]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{t.navHome}</span>
          </button>

          <button
            onClick={() => setCurrentPage('tutorial')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              currentPage === 'tutorial'
                ? 'bg-[#6D28D9] text-white shadow-xs'
                : 'text-[#1E293B] hover:bg-[#F3EDFF]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{t.navTutorial}</span>
          </button>

          <button
            onClick={() => setCurrentPage('assistant')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              currentPage === 'assistant'
                ? 'bg-[#6D28D9] text-white shadow-xs'
                : 'text-[#1E293B] hover:bg-[#F3EDFF]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.navAssistant}</span>
          </button>

          <button
            onClick={() => setCurrentPage('scheme_info')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              currentPage === 'scheme_info'
                ? 'bg-[#6D28D9] text-white shadow-xs'
                : 'text-[#1E293B] hover:bg-[#F3EDFF]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.navScheme}</span>
          </button>

          <button
            onClick={() => setCurrentPage('eligibility')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              currentPage === 'eligibility'
                ? 'bg-[#6D28D9] text-white shadow-xs'
                : 'text-[#1E293B] hover:bg-[#F3EDFF]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{t.navEligibility}</span>
          </button>

          <button
            onClick={() => setCurrentPage('documents')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              currentPage === 'documents'
                ? 'bg-[#6D28D9] text-white shadow-xs'
                : 'text-[#1E293B] hover:bg-[#F3EDFF]'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{t.navDocuments}</span>
          </button>

          <button
            onClick={() => setCurrentPage('application_steps')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              currentPage === 'application_steps'
                ? 'bg-[#6D28D9] text-white shadow-xs'
                : 'text-[#1E293B] hover:bg-[#F3EDFF]'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>{t.navSteps}</span>
          </button>

          <button
            onClick={() => setCurrentPage('support')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              currentPage === 'support'
                ? 'bg-[#6D28D9] text-white shadow-xs'
                : 'text-[#1E293B] hover:bg-[#F3EDFF]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t.navSupport}</span>
          </button>
        </nav>

        {/* PAGE 1: WELCOME SCREEN (Mobile-First Hero & 3 Quick Action Buttons) */}
        {currentPage === 'welcome' && (
          <div className="space-y-6">
            <VoiceAssistantHero
              currentLanguage={currentLanguage}
              onSendMessage={handleSendMessage}
              onNavigate={setCurrentPage}
              latestReply={latestAssistantReply}
              isProcessing={isProcessing}
              isLargeText={isLargeText}
            />

            <QuickActionButtons
              currentLanguage={currentLanguage}
              onSelectTab={setCurrentPage}
              onAskQuestion={(q) => {
                setCurrentPage('assistant');
                handleSendMessage(q, false);
              }}
              isLargeText={isLargeText}
            />
          </div>
        )}

        {/* PAGE 2: INTERACTIVE TUTORIAL FOR FIRST-TIME USERS */}
        {currentPage === 'tutorial' && (
          <InteractiveTutorialView
            currentLanguage={currentLanguage}
            onNavigate={setCurrentPage}
            isLargeText={isLargeText}
          />
        )}

        {/* PAGE 3: FULL AI VOICE & TEXT CONVERSATION */}
        {currentPage === 'assistant' && (
          <div className="space-y-5">
            <VoiceAssistantHero
              currentLanguage={currentLanguage}
              onSendMessage={handleSendMessage}
              onNavigate={setCurrentPage}
              latestReply={latestAssistantReply}
              isProcessing={isProcessing}
              isLargeText={isLargeText}
            />

            <ChatView
              currentLanguage={currentLanguage}
              messages={messages}
              onSelectSuggestion={(q) => handleSendMessage(q, false)}
              onResetChat={handleResetChat}
              isProcessing={isProcessing}
              isLargeText={isLargeText}
            />
          </div>
        )}

        {/* PAGE 4: SCHEME OVERVIEW */}
        {currentPage === 'scheme_info' && (
          <SchemeOverviewView
            currentLanguage={currentLanguage}
            schemeData={schemeData}
            onAskQuestion={(q) => {
              setCurrentPage('assistant');
              handleSendMessage(q, false);
            }}
            isLargeText={isLargeText}
          />
        )}

        {/* PAGE 5: 3-QUESTION ELIGIBILITY CHECKER */}
        {currentPage === 'eligibility' && (
          <EligibilityCheckerView
            currentLanguage={currentLanguage}
            onGoToSteps={() => setCurrentPage('application_steps')}
            onGoToAssistant={(q) => {
              setCurrentPage('assistant');
              handleSendMessage(q, false);
            }}
            isLargeText={isLargeText}
          />
        )}

        {/* PAGE 6: 5 REQUIRED DOCUMENTS CHECKLIST */}
        {currentPage === 'documents' && (
          <DocumentsChecklistView
            currentLanguage={currentLanguage}
            documents={schemeData.required_documents}
            onAskQuestion={(q) => {
              setCurrentPage('assistant');
              handleSendMessage(q, false);
            }}
            isLargeText={isLargeText}
          />
        )}

        {/* PAGE 7: STEP-BY-STEP APPLICATION GUIDANCE */}
        {currentPage === 'application_steps' && (
          <ApplicationStepsView
            currentLanguage={currentLanguage}
            schemeData={schemeData}
            onAskQuestion={(q) => {
              setCurrentPage('assistant');
              handleSendMessage(q, false);
            }}
            isLargeText={isLargeText}
          />
        )}

        {/* PAGE 8: HELP AND SUPPORT */}
        {currentPage === 'support' && (
          <SupportOfficialView
            currentLanguage={currentLanguage}
            schemeData={schemeData}
            onNavigate={setCurrentPage}
            onAskQuestion={(q) => {
              setCurrentPage('assistant');
              handleSendMessage(q, false);
            }}
            isLargeText={isLargeText}
          />
        )}
      </main>

      {/* Persistent AI Help on Every Page */}
      <PersistentAssistantBar
        currentPage={currentPage}
        currentLanguage={currentLanguage}
        onNavigate={setCurrentPage}
        onOpenVoiceAssistant={() => setCurrentPage('assistant')}
        isLargeText={isLargeText}
      />

      {/* Language Switcher Modal (accessible from Header Globe button anywhere) */}
      {showLanguageModal && (
        <LanguageSelectionCards
          currentLanguage={currentLanguage}
          onSelectLanguage={handleLanguageSelect}
          onConfirm={() => setShowLanguageModal(false)}
          isModal={true}
          onClose={() => setShowLanguageModal(false)}
          isLargeText={isLargeText}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-[#F3EDFF] py-6 px-4 text-center text-xs text-[#64748B] space-y-2">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-black text-[#1E293B]">
            <SiraguLogo size={24} animate={false} />
            <span>SIRAGU AI ({t.nativeName}) - {t.tagline}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <a
              href="https://pudhumaipenn.tn.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6D28D9] hover:underline flex items-center gap-1"
            >
              <span>pudhumaipenn.tn.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-[#A78BFA]">•</span>
            <a href="tel:181" className="text-[#0D9488] hover:underline">
              {t.womenHelpline}
            </a>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 max-w-2xl mx-auto pt-2 border-t border-[#F3EDFF]">
          PromptWars X Hackathon MVP • "The Invisible Woman" Challenge • Built with Google Gemini API & Web Speech API.
        </p>
      </footer>
    </div>
  );
}
