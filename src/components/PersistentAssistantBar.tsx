import React from 'react';
import {
  HelpCircle,
  Volume2,
  Mic,
  Home,
} from 'lucide-react';
import { ActivePage, Language } from '../types/scheme';
import { speechService } from '../services/speech';
import { translations } from '../data/translations';

interface PersistentAssistantBarProps {
  currentPage: ActivePage;
  currentLanguage: Language;
  onNavigate: (page: ActivePage) => void;
  onOpenVoiceAssistant: () => void;
  isLargeText?: boolean;
}

export const PersistentAssistantBar: React.FC<PersistentAssistantBarProps> = ({
  currentPage,
  currentLanguage,
  onNavigate,
  onOpenVoiceAssistant,
}) => {
  const t = translations[currentLanguage];

  // Simple spoken explanation for each page in all 5 languages
  const pageExplanations: Record<ActivePage, Record<Language, string>> = {
    welcome: {
      ta: 'இது சிறகு AI-ன் முகப்பு பக்கம். இங்குள்ள பெரிய மைக் பொத்தானைத் தொட்டு நீங்கள் தமிழில் பேசலாம், அல்லது பயிற்சியைத் தொடங்கலாம்.',
      ml: 'ഇത് സിറഗു AI-യുടെ പ്രധാന പേജാണ്. മൈക്ക് അമർത്തി സംസാരിക്കുകയോ പരിശീലനം ആരംഭിക്കുകയോ ചെയ്യാം.',
      te: 'ఇది సిరగు AI హోమ్ పేజీ. పెద్ద మైక్ బటన్ నొక్కి మాట్లాడవచ్చు లేదా ట్యుటోరియల్ ప్రారంభించవచ్చు.',
      kn: 'ಇದು ಸಿರೆಗು AI ಮುಖಪುಟ. ಮೈಕ್ ಬಟನ್ ಒತ್ತಿ ಮಾತನಾಡಬಹುದು ಅಥವಾ ತರಬೇತಿ ಆರಂಭಿಸಬಹುದು.',
      hi: 'यह सिरगु AI का मुख्य पृष्ठ है। यहाँ बड़े माइक बटन को दबाकर आप बोल सकती हैं या ट्यूटोरियल शुरू कर सकती हैं।',
    },
    tutorial: {
      ta: 'இந்தப் பக்கத்தில் செல்போன் பொத்தான்களைத் தொடுவது, மைக்ரோஃபோனைப் பயன்படுத்துவது எப்படி என்று எளிய பயிற்சி அளிக்கப்படுகிறது.',
      ml: 'ബട്ടണുകൾ അമർത്തുന്നതും മൈക്ക് ഉപയോഗിക്കുന്നതും എങ്ങനെയെന്ന് ഇവിടെ പഠിക്കാം.',
      te: 'బటన్లు నొక్కడం మరియు మైక్రోఫోన్ ఉపయోగించడం ఎలాగో ఈ పేజీలో నేర్చుకోవచ్చు.',
      kn: 'ಗುಂಡಿಗಳನ್ನು ಮುಟ್ಟುವುದು ಮತ್ತು ಮೈಕ್ರೊಫೋನ್ ಬಳಸುವುದು ಹೇಗೆಂದು ಇಲ್ಲಿ ಕಲಿಯಬಹುದು.',
      hi: 'इस पेज पर मोबाइल स्क्रीन के बटन छूना और माइक का उपयोग करना सिखाया जाता है।',
    },
    assistant: {
      ta: 'இது சிறகு AI குரல் அரட்டை பக்கம். பெரிய மைக்கை அழுத்தி புதுமைப் பெண் திட்டம் குறித்த உங்கள் எந்த கேள்வியையும் கேட்கலாம்.',
      ml: 'ഇത് വോയ്‌സ് ചാറ്റ് പേജാണ്. മൈക്ക് അമർത്തി നിങ്ങളുടെ സംശയങ്ങൾ ചോദിക്കാം.',
      te: 'ఇది వాయిస్ చాట్ పేజీ. మైక్ బటన్ నొక్కి పుదుమై పెణ్ పథకం గురించి ఏదైనా ప్రశ్న అడగండి.',
      kn: 'ಇದು ಧ್ವನಿ ಸಂಭಾಷಣೆ ಪುಟ. ಮೈಕ್ ಒತ್ತಿ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.',
      hi: 'यह वॉयस चैट पेज है। माइक दबाकर योजना से संबंधित कोई भी सवाल पूछें।',
    },
    scheme_info: {
      ta: 'இந்தப் பக்கத்தில் புதுமைப் பெண் திட்டத்தின் கீழ் மாதம் ₹1,000 உதவித்தொகை யாருக்கு கிடைக்கும், அதன் நன்மைகள் என்ன என்ற விவரங்கள் உள்ளன.',
      ml: 'പ്രതിമാസം ₹1,000 സഹായധനം ആർക്കൊക്കെ ലഭിക്കും, അതിന്റെ ആനുകൂല്യങ്ങൾ എന്തൊക്കെ എന്ന് ഇവിടെ കാണാം.',
      te: 'నెలకు ₹1,000 ఎవరికి లభిస్తుంది, పథకం ప్రయోజనాలు ఏమిటో ఇక్కడ తెలుసుకోవచ్చు.',
      kn: 'ತಿಂಗಳಿಗೆ ₹1,000 ಯಾರಿಗೆ ಸಿಗುತ್ತದೆ ಮತ್ತು ಯೋಜನೆಯ ಸೌಲಭ್ಯಗಳೇನು ಎಂದು ಇಲ್ಲಿ ತಿಳಿಯಬಹುದು.',
      hi: 'इस पेज पर योजना के तहत हर महीने ₹1,000 किन्हें मिलेगा और इसके क्या लाभ हैं, यह विवरण है।',
    },
    eligibility: {
      ta: 'இந்தப் பக்கத்தில் 3 எளிய கேள்விகளுக்கு ஆம் அல்லது இல்லை என்று பதிலளித்து உங்களுக்கு மாதம் ₹1,000 கிடைக்குமா என்று பார்க்கலாம்.',
      ml: '3 ലളിതമായ ചോദ്യങ്ങൾക്ക് അതെ അല്ലെങ്കിൽ അല്ല എന്ന് മറുപടി നൽകി അർഹത പരിശോധിക്കാം.',
      te: '3 సులభమైన ప్రశ్నలకు అవును లేదా కాదు అని సమాధానమిచ్చి మీ అర్హతను తనిఖీ చేసుకోండి.',
      kn: '3 ಸರಳ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ ನಿಮಗೆ ₹1,000 ಸಿಗುತ್ತದೆಯೇ ಎಂದು ಪರೀಕ್ಷಿಸಿ.',
      hi: 'यहाँ 3 आसान सवालों के उत्तर देकर आप जांच सकती हैं कि आप पात्र हैं या नहीं।',
    },
    documents: {
      ta: 'இந்தப் பக்கத்தில் கல்லூரிக்கு கொண்டுசெல்ல வேண்டிய 5 முக்கிய ஆவணங்களின் பட்டியல் உள்ளது. உங்களிடம் உள்ளவற்றை குறித்துக்கொள்ளலாம்.',
      ml: 'കോളേജിൽ നൽകേണ്ട 5 പ്രധാന രേഖകളുടെ പട്ടിക ഇവിടെയുണ്ട്.',
      te: 'కళాశాలలో సమర్పించాల్సిన 5 ముఖ్యమైన పత్రాల జాబితా ఇక్కడ ఉంది.',
      kn: 'ಕಾಲೇಜಿಗೆ ಸಲ್ಲಿಸಬೇಕಾದ 5 ಪ್ರಮುಖ ದಾಖಲೆಗಳ ಪಟ್ಟಿ ಇಲ್ಲಿದೆ.',
      hi: 'इस पेज पर कॉलेज ले जाने वाले 5 जरूरी दस्तावेजों की सूची है।',
    },
    application_steps: {
      ta: 'இந்தப் பக்கத்தில் கல்லூரியில் உள்ள ஒருங்கிணைப்பாளரிடம் சென்று இலவசமாக எப்படி விண்ணப்பிப்பது என்ற 4 படிகள் உள்ளன.',
      ml: 'കോളേജ് നോഡൽ ഓഫീസർ വഴി സൗജന്യമായി അപേക്ഷിക്കുന്നതിനുള്ള 4 ഘട്ടങ്ങൾ ഇവിടെയുണ്ട്.',
      te: 'కాలేజీ నోడల్ అధికారి ద్వారా ఉచితంగా ఎలా దరఖాస్తు చేసుకోవాలో 4 దశలు ఇక్కడ ఉన్నాయి.',
      kn: 'ಕಾಲೇಜು ನೋಡಲ್ ಅಧಿಕಾರಿ ಮೂಲಕ ಉಚಿತವಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸುವ 4 ಹಂತಗಳು ಇಲ್ಲಿವೆ.',
      hi: 'कॉलेज नोडल अधिकारी के माध्यम से निःशुल्क आवेदन करने के 4 चरण यहाँ दिए गए हैं।',
    },
    support: {
      ta: 'இந்தப் பக்கத்தில் தமிழ்நாடு மகளிர் உதவி எண் 181, முதல்வர் உதவி எண் 1100 மற்றும் பயன்பாட்டு உதவிகள் உள்ளன.',
      ml: 'വനിതാ ഹെൽപ്പ്‌ലൈൻ 181, സിഎം ഹെൽപ്പ്‌ലൈൻ 1100 വിവരങ്ങൾ ഇവിടെ ലഭ്യമാണ്.',
      te: 'మహిళా హెల్ప్‌లైన్ 181, సీఎం హెల్ప్‌లైన్ 1100 వివరాలు ఇక్కడ ఉన్నాయి.',
      kn: 'ಮಹಿಳಾ ಸಹಾಯವಾಣಿ 181, ಸಿಎಂ ಸಹಾಯವಾಣಿ 1100 ವಿವರಗಳು ಇಲ್ಲಿವೆ.',
      hi: 'महिला हेल्पलाइन 181 और सीएम हेल्पलाइन 1100 की जानकारी यहाँ उपलब्ध है।',
    },
  };

  const talkToSiraguLabels: Record<Language, string> = {
    ta: 'சிறகுவிடம் பேசுங்கள்',
    ml: 'സിറഗുവിനോട് സംസാരിക്കുക',
    te: 'సిరగుతో మాట్లాడండి',
    kn: 'ಸಿರೆಗು ಜೊತೆ ಮಾತನಾಡಿ',
    hi: 'सिरगु से बात करें',
  };

  const defaultGuidance: Record<Language, string> = {
    ta: 'உங்களுக்கு வழிகாட்ட சிறகு AI எப்போதும் தயார்.',
    ml: 'നിങ്ങളെ സഹായിക്കാൻ സിറഗു AI എപ്പോഴും സജ്ജമാണ്.',
    te: 'మీకు సహాయం చేయడానికి సిరగు AI ఎల్లప్పుడూ సిద్ధం.',
    kn: 'ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಲು ಸಿರೆಗು AI ಸದಾ ಸಿದ್ಧ.',
    hi: 'आपकी सहायता के लिए सिरगु AI सदैव तत्पर है।',
  };

  const dontUnderstandAudio: Record<Language, string> = {
    ta: 'கவலை வேண்டாம்! நீங்கள் எதையும் தட்டச்சு செய்யத் தேவையில்லை. "சிறகுவிடம் பேசுங்கள்" பொத்தானைத் தொட்டு உங்கள் கேள்வியை அமைதியாகப் பேசினால் போதும்.',
    ml: 'വിഷമിക്കേണ്ട! ഒന്നും ടൈപ്പ് ചെയ്യേണ്ടതില്ല. "സിറഗുവിനോട് സംസാരിക്കുക" ബട്ടൺ അമർത്തി സംസാരിച്ചാൽ മതി.',
    te: 'కంగారు పడకండి! ఏమీ టైప్ చేయనక్కర్లేదు. "సిరగుతో మాట్లాడండి" బటన్ నొక్కి మాట్లాడండి.',
    kn: 'ಚಿಂತಿಸಬೇಡಿ! ಏನನ್ನೂ ಟೈಪ್ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ. "ಸಿರೆಗು ಜೊತೆ ಮಾತನಾಡಿ" ಒತ್ತಿ ನಿಮ್ಮ ಮಾತನ್ನು ಹೇಳಿ.',
    hi: 'चिंता न करें! आपको कुछ भी टाइप करने की ज़रूरत नहीं है। "सिरगु से बात करें" बटन दबाकर आराम से बोलें।',
  };

  const handleExplainPage = () => {
    const text =
      pageExplanations[currentPage]?.[currentLanguage] ||
      pageExplanations[currentPage]?.ta ||
      defaultGuidance[currentLanguage] ||
      defaultGuidance.ta;
    speechService.speakText(text, { lang: currentLanguage });
  };

  const handleDontUnderstand = () => {
    const text = dontUnderstandAudio[currentLanguage] || dontUnderstandAudio.ta;
    speechService.speakText(text, { lang: currentLanguage });
  };

  return (
    <aside
      aria-label={t.explainThisPage}
      className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t-2 border-[#F3EDFF] p-2.5 sm:p-3 shadow-lg"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        {/* Navigation back / home */}
        <div className="flex items-center gap-1.5 shrink-0">
          {currentPage !== 'welcome' ? (
            <button
              onClick={() => onNavigate('welcome')}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#FAF9FF] hover:bg-[#F3EDFF] text-[#1E293B] border border-[#A78BFA]/30 flex items-center gap-1 transition-all active:scale-95"
              title={t.navHome}
              aria-label={t.navHome}
            >
              <Home className="w-3.5 h-3.5 text-[#6D28D9]" />
              <span className="hidden xs:inline">{t.navHome}</span>
            </button>
          ) : null}

          {/* Explain this page / Repeat audio */}
          <button
            onClick={handleExplainPage}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-[#F3EDFF] hover:bg-[#F3EDFF]/80 text-[#6D28D9] border border-[#A78BFA]/40 flex items-center gap-1.5 transition-all active:scale-95"
            title={t.explainThisPage}
            aria-label={t.explainThisPage}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{t.explainThisPage}</span>
          </button>
        </div>

        {/* Center: Talk to Siragu Voice Button */}
        <button
          onClick={onOpenVoiceAssistant}
          className="shrink-0 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-[#6D28D9] to-[#9333EA] text-white shadow-xs hover:shadow-md flex items-center gap-1.5 transition-all active:scale-95"
          aria-label={talkToSiraguLabels[currentLanguage] || talkToSiraguLabels.ta}
        >
          <Mic className="w-4 h-4" />
          <span>{talkToSiraguLabels[currentLanguage] || talkToSiraguLabels.ta}</span>
        </button>

        {/* "I don't understand" Easy Recovery Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleDontUnderstand}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5 transition-all active:scale-95"
            title={t.dontUnderstand}
            aria-label={t.dontUnderstand}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span className="whitespace-nowrap">{t.dontUnderstand}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
