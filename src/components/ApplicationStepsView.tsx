import React, { useState } from 'react';
import {
  Building2,
  FileCheck,
  Laptop,
  CreditCard,
  ExternalLink,
  Volume2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { SchemeKnowledge, Language } from '../types/scheme';
import { speechService } from '../services/speech';
import { translations } from '../data/translations';

interface ApplicationStepsViewProps {
  currentLanguage: Language;
  schemeData: SchemeKnowledge;
  onAskQuestion: (q: string) => void;
  isLargeText?: boolean;
}

export const ApplicationStepsView: React.FC<ApplicationStepsViewProps> = ({
  currentLanguage,
  schemeData,
  onAskQuestion,
  isLargeText = false,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

  const t = translations[currentLanguage];
  const steps = schemeData.application_steps;
  const currentStep = steps[activeStepIndex];

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'building':
        return <Building2 className="w-7 h-7 text-[#6D28D9]" />;
      case 'file-check':
        return <FileCheck className="w-7 h-7 text-[#6D28D9]" />;
      case 'laptop':
        return <Laptop className="w-7 h-7 text-[#6D28D9]" />;
      case 'credit-card':
        return <CreditCard className="w-7 h-7 text-[#6D28D9]" />;
      default:
        return <Building2 className="w-7 h-7 text-[#6D28D9]" />;
    }
  };

  const getLocalizedTitle = (step: (typeof steps)[0]) => {
    return step.title[currentLanguage] || step.title.ta || '';
  };

  const getLocalizedDesc = (step: (typeof steps)[0]) => {
    return step.description[currentLanguage] || step.description.ta || '';
  };

  const handleReadStep = (stepNumber: number) => {
    const step = steps[stepNumber - 1];
    if (!step) return;

    const stepLabel: Record<Language, string> = {
      ta: 'படி',
      ml: 'ഘട്ടം',
      te: 'దశ',
      kn: 'ಹಂತ',
      hi: 'चरण',
    };

    const text = `${stepLabel[currentLanguage] || 'படி'} ${step.step_number}: ${getLocalizedTitle(step)}. ${getLocalizedDesc(step)}`;
    speechService.speakText(text, { lang: currentLanguage });
  };

  const fullRoadmapAudio: Record<Language, string> = {
    ta: 'விண்ணப்பிக்கும் நான்கு எளிய படிகள்: படி ஒன்று, கல்லூரியில் உள்ள புதுமைப் பெண் திட்ட ஒருங்கிணைப்பாளரை அணுகவும். படி இரண்டு, பள்ளி படிப்பு சான்று, கல்லூரி அடையாள அட்டை, ஆதார் மற்றும் வங்கி புத்தக நகல்களை ஒப்படைக்கவும். படி மூன்று, கல்லூரி நிர்வாகமே அதிகாரப்பூர்வ இணையதளத்தில் உங்கள் தகவல்களை இலவசமாக பதிவு செய்யும். படி நான்கு, அரசு சரிபார்ப்பிற்கு பின் மாதந்தோறும் ₹1,000 உங்கள் வங்கிக் கணக்கில் நேரடியாக வரவு வைக்கப்படும்.',
    ml: 'അപേക്ഷിക്കുന്നതിനുള്ള 4 ഘട്ടങ്ങൾ: ഘട്ടം 1, കോളേജ് നോഡൽ ഓഫീസറെ കാണുക. ഘട്ടം 2, പഠന സർട്ടിഫിക്കറ്റ്, പ്രവേശന രേഖ, ബാങ്ക് പാസ്സ്ബുക്ക്, ആധാർ പകർപ്പുകൾ നൽകുക. ഘട്ടം 3, കോളേജ് അധികൃതർ വെബ്‌സൈറ്റിൽ സൗജന്യമായി രജിസ്റ്റർ ചെയ്യും. ഘട്ടം 4, പ്രതിമാസം ₹1,000 അക്കൗണ്ടിൽ ലഭിക്കും.',
    te: 'దరఖాస్తు చేసుకోవడానికి 4 దశలు: మొదటి దశ, కాలేజీ నోడల్ అధికారిని కలవండి. రెండవ దశ, పాఠశాల ధృవీకరణ పత్రం, ప్రవేశ పత్రం, బ్యాంక్ పాస్‌బుక్, ఆధార్ జిరాక్స్ ఇవ్వండి. మూడవ దశ, కళాశాల యాజమాన్యమే పోర్టల్‌లో ఉచితంగా నమోదు చేస్తుంది. నాల్గవ దశ, ప్రతి నెలా ₹1,000 మీ ఖాతాలో నేరుగా జమ అవుతుంది.',
    kn: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಲು 4 ಹಂತಗಳು: ಹಂತ 1, ಕಾಲೇಜಿನ ನೋಡಲ್ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ. ಹಂತ 2, ಶಾಲಾ ಪ್ರಮಾಣಪತ್ರ, ಪ್ರವೇಶ ಪತ್ರ, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ ಮತ್ತು ಆಧಾರ್ ಪ್ರತಿಗಳನ್ನು ಸಲ್ಲಿಸಿ. ಹಂತ 3, ಕಾಲೇಜು ಉಚಿತವಾಗಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸುತ್ತದೆ. ಹಂತ 4, ತಿಂಗಳಿಗೆ ₹1,000 ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.',
    hi: 'आवेदन के 4 आसान चरण: पहला चरण, कॉलेज नोडल अधिकारी से मिलें। दूसरा चरण, स्कूल अध्ययन प्रमाण पत्र, कॉलेज प्रवेश पत्र, बैंक पासबुक और आधार की फोटोकॉपी जमा करें। तीसरा चरण, कॉलेज प्रबंधन आधिकारिक पोर्टल पर निःशुल्क पंजीकरण करेगा। चौथा चरण, हर महीने ₹1,000 सीधे आपके बैंक खाते में आएंगे।',
  };

  const handleReadFullRoadmap = () => {
    const text = fullRoadmapAudio[currentLanguage] || fullRoadmapAudio.ta;
    speechService.speakText(text, { lang: currentLanguage });
  };

  const uiLabels: Record<
    Language,
    {
      badge: string;
      heading: string;
      subheading: string;
      listenAllBtn: string;
      stepByStepTab: string;
      allStepsTab: string;
      stepWord: string;
      prevBtn: string;
      nextBtn: string;
      askSiraguBtn: string;
      officialPortalBadge: string;
      officialPortalDesc: string;
      visitPortalBtn: string;
      unverifiedTitle: string;
      askQuery: string;
    }
  > = {
    ta: {
      badge: 'அரசு அதிகாரப்பூர்வ விண்ணப்ப வழிமுறை',
      heading: 'விண்ணப்பிக்கும் 4 எளிய படிகள்',
      subheading: 'மாணவிகள் இணையதளத்தில் சுயமாக விண்ணப்பிக்க தேவையில்லை; கல்லூரியே இலவசமாக பதிவு செய்யும்.',
      listenAllBtn: 'முழு வழிகாட்டலை குரலில் கேட்க',
      stepByStepTab: 'படி படியாக பார்க்க',
      allStepsTab: 'அனைத்து படிகளும்',
      stepWord: 'படி',
      prevBtn: 'முந்தைய படி',
      nextBtn: 'அடுத்த படி',
      askSiraguBtn: 'சிறகுவிடம் கேட்க',
      officialPortalBadge: 'அதிகாரப்பூர்வ தமிழ்நாடு அரசு போர்டல்',
      officialPortalDesc: 'அரசு சுற்றறிக்கைகள், கல்லூரி ஒருங்கிணைப்பாளர் வழிகாட்டுதல்கள் மற்றும் அதிகாரப்பூர்வ அறிவிப்புகள்.',
      visitPortalBtn: 'அரசு இணையதளத்தைப் பார்க்க',
      unverifiedTitle: 'அதிகாரப்பூர்வ சரிபார்ப்பு தேவைப்படும் விவரங்கள்:',
      askQuery: 'விண்ணப்பிப்பது பற்றிய சந்தேகம்',
    },
    ml: {
      badge: 'ഔദ്യോഗിക അപേക്ഷാ രീതി',
      heading: 'അപേക്ഷിക്കുന്നതിനുള്ള 4 ലളിതമായ ഘട്ടങ്ങൾ',
      subheading: 'വിദ്യാർത്ഥിനികൾ നേരിട്ട് ഓൺലൈനിൽ അപേക്ഷിക്കേണ്ടതില്ല; കോളേജ് അധികൃതർ സൗജന്യമായി രജിസ്റ്റർ ചെയ്യും.',
      listenAllBtn: 'പൂർണ്ണ വിവരങ്ങൾ കേൾക്കുക',
      stepByStepTab: 'ഘട്ടം ഘട്ടമായി',
      allStepsTab: 'എല്ലാ ഘട്ടങ്ങളും',
      stepWord: 'ഘട്ടം',
      prevBtn: 'മുമ്പത്തെ ഘട്ടം',
      nextBtn: 'അടുത്ത ഘട്ടം',
      askSiraguBtn: 'സിറഗുവിനോട് ചോദിക്കുക',
      officialPortalBadge: 'തമിഴ്നാട് സർക്കാർ പോർട്ടൽ',
      officialPortalDesc: 'ഔദ്യോഗിക അറിയിപ്പുകളും കോളേജ് നോഡൽ ഓഫീസർ മാർഗ്ഗനിർദ്ദേശങ്ങളും.',
      visitPortalBtn: 'ഔദ്യോഗിക വെബ്‌സൈറ്റ് സന്ദർശിക്കുക',
      unverifiedTitle: 'ഔദ്യോഗിക സ്ഥിരീകരണം ആവശ്യമായ വിവരങ്ങൾ:',
      askQuery: 'അപേക്ഷിക്കുന്നതിനെക്കുറിച്ചുള്ള സംശയം',
    },
    te: {
      badge: 'అధికారిక దరఖాస్తు విధానం',
      heading: 'దరఖాస్తుకు 4 సులభమైన దశలు',
      subheading: 'విద్యార్థినులు ఆన్‌లైన్‌లో స్వయంగా దరఖాస్తు చేయనవసరం లేదు; కళాశాల వారే ఉచితంగా నమోదు చేస్తారు.',
      listenAllBtn: 'పూర్తి వివరాలు వినండి',
      stepByStepTab: 'దశలవారీగా',
      allStepsTab: 'అన్ని దశలు',
      stepWord: 'దశ',
      prevBtn: 'మునుపటి దశ',
      nextBtn: 'తదుపరి దశ',
      askSiraguBtn: 'సిరగును అడగండి',
      officialPortalBadge: 'తమిళనాడు ప్రభుత్వ అధికారిక పోర్టల్',
      officialPortalDesc: 'ప్రభుత్వ ఉత్తర్వులు మరియు కళాశాల నోడల్ అధికారి మార్గదర్శకాలు.',
      visitPortalBtn: 'పోర్టల్ చూడండి',
      unverifiedTitle: 'అధికారిక నిర్ధారణ అవసరమైన అంశాలు:',
      askQuery: 'దరఖాస్తు విధానంపై సందేహం',
    },
    kn: {
      badge: 'ಅಧಿಕೃತ ಅರ್ಜಿ ವಿಧಾನ',
      heading: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಲು 4 ಸರಳ ಹಂತಗಳು',
      subheading: 'ವಿದ್ಯಾರ್ಥಿನಿಯರು ಸ್ವತಃ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕಾಗಿಲ್ಲ; ಕಾಲೇಜು ಉಚಿತವಾಗಿ ನೋಂದಾಯಿಸುತ್ತದೆ.',
      listenAllBtn: 'ವಿವರಗಳನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ',
      stepByStepTab: 'ಹಂತ ಹಂತವಾಗಿ',
      allStepsTab: 'ಎಲ್ಲಾ ಹಂತಗಳು',
      stepWord: 'ಹಂತ',
      prevBtn: 'ಹಿಂದಿನ ಹಂತ',
      nextBtn: 'ಮುಂದಿನ ಹಂತ',
      askSiraguBtn: 'ಸಿರೆಗುವನ್ನು ಕೇಳಿ',
      officialPortalBadge: 'ತಮಿಳುನಾಡು ಸರಕಾರಿ ಅಧಿಕೃತ ಪೋರ್ಟಲ್',
      officialPortalDesc: 'ಸರಕಾರಿ ಆದೇಶಗಳು ಮತ್ತು ನೋಡಲ್ ಅಧಿಕಾರಿ ಮಾರ್ಗಸೂಚಿಗಳು.',
      visitPortalBtn: 'ಅಧಿಕೃತ ತಾಣಕ್ಕೆ ಭೇಟಿ ನೀಡಿ',
      unverifiedTitle: 'ಅಧಿಕೃತ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿರುವ ವಿವರಗಳು:',
      askQuery: 'ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಬಗ್ಗೆ ಸಂದೇಹ',
    },
    hi: {
      badge: 'आधिकारिक आवेदन प्रक्रिया',
      heading: 'आवेदन के 4 आसान चरण',
      subheading: 'छात्राओं को ऑनलाइन खुद आवेदन करने की आवश्यकता नहीं है; कॉलेज ही 100% निःशुल्क पंजीकरण करता है।',
      listenAllBtn: 'पूरी प्रक्रिया सुनें',
      stepByStepTab: 'चरण-दर-चरण',
      allStepsTab: 'सभी चरण',
      stepWord: 'चरण',
      prevBtn: 'पिछला चरण',
      nextBtn: 'अगला चरण',
      askSiraguBtn: 'सिरगु से पूछें',
      officialPortalBadge: 'तमिलनाडु सरकार का आधिकारिक पोर्टल',
      officialPortalDesc: 'सरकारी परिपत्र, नोडल अधिकारी दिशानिर्देश एवं आधिकारिक सूचनाएं।',
      visitPortalBtn: 'सरकारी पोर्टल देखें',
      unverifiedTitle: 'आधिकारिक पुष्टि योग्य विवरण:',
      askQuery: 'आवेदन प्रक्रिया पर प्रश्न',
    },
  };

  const ui = uiLabels[currentLanguage] || uiLabels.ta;

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left">
      {/* Header */}
      <div className="bg-white border-2 border-[#F3EDFF] rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-bold text-[#6D28D9] bg-[#F3EDFF] px-2.5 py-1 rounded-full border border-[#A78BFA]/30">
              {ui.badge}
            </span>
            <h2
              className={`font-black text-[#1E293B] mt-2 ${
                isLargeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
              }`}
            >
              {ui.heading}
            </h2>
          </div>

          <button
            onClick={handleReadFullRoadmap}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F3EDFF] text-[#6D28D9] hover:bg-[#F3EDFF]/80 transition-all border border-[#A78BFA]/30 shadow-2xs self-start sm:self-auto"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#6D28D9]" />
            <span>{ui.listenAllBtn}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-medium">
          {ui.subheading}
        </p>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => setViewMode('single')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'single'
                ? 'bg-[#6D28D9] text-white shadow-2xs'
                : 'text-[#64748B] hover:bg-[#F3EDFF]'
            }`}
          >
            {ui.stepByStepTab}
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'all'
                ? 'bg-[#6D28D9] text-white shadow-2xs'
                : 'text-[#64748B] hover:bg-[#F3EDFF]'
            }`}
          >
            {ui.allStepsTab}
          </button>
        </div>
      </div>

      {/* SINGLE STEP INTERACTIVE VIEW */}
      {viewMode === 'single' && currentStep && (
        <div className="bg-white border-2 border-[#6D28D9]/40 rounded-3xl p-6 shadow-sm space-y-5">
          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-between gap-1 mb-2">
            {steps.map((s, idx) => (
              <div
                key={s.step_number}
                onClick={() => setActiveStepIndex(idx)}
                className={`cursor-pointer flex-1 h-2 rounded-full transition-all ${
                  idx === activeStepIndex
                    ? 'bg-[#6D28D9]'
                    : idx < activeStepIndex
                    ? 'bg-emerald-500'
                    : 'bg-[#F3EDFF]'
                }`}
                title={`${ui.stepWord} ${s.step_number}`}
              />
            ))}
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F3EDFF] border border-[#A78BFA]/30 flex items-center justify-center shrink-0">
              {getStepIcon(currentStep.icon)}
            </div>

            <div className="space-y-1.5 flex-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#6D28D9] bg-[#F3EDFF] px-2.5 py-0.5 rounded-full inline-block">
                {ui.stepWord} {currentStep.step_number} / {steps.length}
              </span>
              <h3
                className={`font-black text-[#1E293B] ${
                  isLargeText ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
                }`}
              >
                {getLocalizedTitle(currentStep)}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-medium pt-1">
                {getLocalizedDesc(currentStep)}
              </p>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeStepIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#1E293B] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{ui.prevBtn}</span>
            </button>

            {activeStepIndex < steps.length - 1 ? (
              <button
                onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-xs"
              >
                <span>{ui.nextBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onAskQuestion(ui.askQuery)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0D9488] text-white shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{ui.askSiraguBtn}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ALL STEPS VIEW */}
      {viewMode === 'all' && (
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.step_number}
              className="bg-white border-2 border-[#F3EDFF] rounded-2xl p-5 shadow-2xs flex items-start gap-4 hover:border-[#A78BFA] transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F3EDFF] border border-[#A78BFA]/30 flex items-center justify-center shrink-0">
                {getStepIcon(step.icon)}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold bg-[#6D28D9] text-white px-2 py-0.5 rounded-full">
                    {ui.stepWord} {step.step_number}
                  </span>
                  <button
                    onClick={() => handleReadStep(step.step_number)}
                    className="text-[#6D28D9] hover:bg-[#F3EDFF] p-1 rounded-lg"
                    title={t.replayAnswer}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <h3
                  className={`font-black text-[#1E293B] ${
                    isLargeText ? 'text-lg' : 'text-base'
                  }`}
                >
                  {getLocalizedTitle(step)}
                </h3>

                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-medium">
                  {getLocalizedDesc(step)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Official Government Portal Link */}
      <div className="bg-gradient-to-r from-[#6D28D9] to-[#9333EA] text-white rounded-3xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
              {ui.officialPortalBadge}
            </span>
            <h3
              className={`font-black text-white ${
                isLargeText ? 'text-xl' : 'text-lg'
              }`}
            >
              pudhumaipenn.tn.gov.in
            </h3>
            <p className="text-xs text-purple-100 leading-relaxed font-normal">
              {ui.officialPortalDesc}
            </p>
          </div>

          <a
            href={schemeData.official_portal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#6D28D9] font-black px-5 py-3 rounded-2xl text-xs hover:bg-[#F3EDFF] transition-all shadow-xs active:scale-95 shrink-0"
          >
            <span>{ui.visitPortalBtn}</span>
            <ExternalLink className="w-4 h-4 text-[#6D28D9]" />
          </a>
        </div>
      </div>

      {/* Unverified Placeholder Notice */}
      <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">{ui.unverifiedTitle}</p>
          <ul className="list-disc list-inside space-y-1 text-amber-900 font-medium">
            <li>
              {schemeData.unverified_placeholders.current_cycle_deadline[currentLanguage] ||
                schemeData.unverified_placeholders.current_cycle_deadline.ta}
            </li>
            <li>
              {schemeData.unverified_placeholders.district_nodal_directory[currentLanguage] ||
                schemeData.unverified_placeholders.district_nodal_directory.ta}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
