import React from 'react';
import {
  Award,
  Calendar,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { SchemeKnowledge, Language } from '../types/scheme';
import { speechService } from '../services/speech';

interface SchemeOverviewViewProps {
  currentLanguage: Language;
  schemeData: SchemeKnowledge;
  onAskQuestion: (q: string) => void;
  isLargeText?: boolean;
}

export const SchemeOverviewView: React.FC<SchemeOverviewViewProps> = ({
  currentLanguage,
  schemeData,
  onAskQuestion,
  isLargeText = false,
}) => {
  const isTa = currentLanguage === 'ta';

  const readAloudSummaries: Record<Language, string> = {
    ta: 'புதுமைப் பெண் திட்டம் என்பது தமிழக அரசுப் பள்ளிகளில் 6 முதல் 12 ஆம் வகுப்பு வரை படித்த மாணவிகளுக்கு மாதந்தோறும் ₹1,000 வழங்கும் தமிழ்நாடு அரசின் உயர்கல்வி திட்டமாகும். இது கல்லூரி படிப்பு முடியும் வரை நேரடியாக வங்கிக் கணக்கில் வரவு வைக்கப்படும்.',
    ml: 'പുതുമൈ പെൺ പദ്ധതി തമിഴ്നാട് സർക്കാർ സ്കൂളുകളിൽ 6 മുതൽ 12 വരെ പഠിച്ച വിദ്യാർത്ഥിനികൾക്ക് പ്രതിമാസം ₹1,000 നൽകുന്ന ഉന്നതവിദ്യാഭ്യാസ പദ്ധതിയാണ്. പഠനം പൂർത്തിയാകുന്നതുവരെ നേരിട്ട് ബാങ്കിൽ ലഭിക്കും.',
    te: 'పుదుమై పెణ్ పథకం తమిళనాడు ప్రభుత్వ పాఠశాలల్లో 6 నుండి 12 వరకు చదివిన విద్యార్థినులకు నెలకు ₹1,000 అందించే పథకం. చదువు పూర్తయ్యే వరకు నేరుగా బ్యాంక్ ఖాతాలో జమ అవుతుంది.',
    kn: 'ಪುದುಮೈ ಪೆಣ್ ಯೋಜನೆಯು ತಮಿಳುನಾಡು ಸರಕಾರಿ ಶಾಲೆಗಳಲ್ಲಿ 6 ರಿಂದ 12 ರವರೆಗೆ ಓದಿದ ವಿದ್ಯಾರ್ಥಿನಿಯರಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ₹1,000 ನೀಡುವ ಉನ್ನತ ಶಿಕ್ಷಣ ಯೋಜನೆಯಾಗಿದೆ. ಕಾಲೇಜು ಮುಗಿಯುವವರೆಗೆ ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.',
    hi: 'पुधुमई पेण्ण योजना तमिलनाडु के सरकारी स्कूलों में कक्षा 6 से 12 तक पढ़ी छात्राओं को हर महीने ₹1,000 प्रदान करने वाली उच्च शिक्षा योजना है। यह पढ़ाई पूरी होने तक सीधे बैंक खाते में दी जाती है।',
  };

  const handleReadAloud = () => {
    const text = readAloudSummaries[currentLanguage] || readAloudSummaries.ta;
    speechService.speakText(text, { lang: currentLanguage });
  };

  const labels: Record<
    Language,
    {
      govtSchemeBadge: string;
      bannerDesc: string;
      listenBtn: string;
      askSiraguBtn: string;
      pillar1Badge: string;
      pillar1Title: string;
      pillar2Badge: string;
      pillar2Title: string;
      pillar3Badge: string;
      pillar3Title: string;
      pillar4Badge: string;
      pillar4Title: string;
      faqHeading: string;
      askSampleQuery: string;
    }
  > = {
    ta: {
      govtSchemeBadge: 'தமிழ்நாடு அரசுத் திட்டம்',
      bannerDesc: 'அரசுப் பள்ளிகளில் பயின்று உயர்கல்விக்குச் செல்லும் மாணவிகளின் படிப்பை ஊக்குவிக்கவும், பெண் கல்வியை உறுதி செய்யவும் மாதந்தோறும் ₹1,000 வழங்கும் சிறப்புத் திட்டம்.',
      listenBtn: 'திட்ட விவரங்களை குரலில் கேட்க',
      askSiraguBtn: 'சிறகுவிடம் கேட்க',
      pillar1Badge: 'உதவித்தொகை அளவு',
      pillar1Title: 'மாதந்தோறும் ₹1,000',
      pillar2Badge: 'வழங்கப்படும் காலம்',
      pillar2Title: 'படிப்பு முடியும் வரை',
      pillar3Badge: 'அடிப்படைத் தகுதி',
      pillar3Title: '6 முதல் 12 அரசுப் பள்ளி',
      pillar4Badge: 'பதிவு முறை',
      pillar4Title: '100% இலவச சேவை',
      faqHeading: 'அதிகாரப்பூர்வ கேள்விகள் & பதில்கள் (FAQ)',
      askSampleQuery: 'புதுமைப் பெண் திட்டம் பற்றி முழு விளக்கம் சொல்லுங்கள்',
    },
    ml: {
      govtSchemeBadge: 'തമിഴ്നാട് സർക്കാർ പദ്ധതി',
      bannerDesc: 'സർക്കാർ സ്കൂളുകളിൽ പഠിച്ച് കോളേജിൽ ചേരുന്ന പെൺകുട്ടികൾക്ക് പ്രതിമാസം ₹1,000 നൽകുന്ന ഉന്നത വിദ്യാഭ്യാസ പദ്ധതി.',
      listenBtn: 'വിവരങ്ങൾ ശബ്ദത്തിൽ കേൾക്കുക',
      askSiraguBtn: 'സിറഗുവിനോട് ചോദിക്കുക',
      pillar1Badge: 'സഹായധന തുക',
      pillar1Title: 'പ്രതിമാസം ₹1,000',
      pillar2Badge: 'ലഭിക്കുന്ന കാലാവധി',
      pillar2Title: 'പഠനം കഴിയുന്നതുവരെ',
      pillar3Badge: 'അടിസ്ഥാന യോഗ്യത',
      pillar3Title: '6 മുതൽ 12 വരെ സർക്കാർ സ്കൂൾ',
      pillar4Badge: 'രജിസ്ട്രേഷൻ രീതി',
      pillar4Title: '100% സൗജന്യ സേവനം',
      faqHeading: 'പ്രധാന ചോദ്യോത്തരങ്ങൾ (FAQ)',
      askSampleQuery: 'പുതുമൈ പെൺ പദ്ധതിയെക്കുറിച്ച് വിശദീകരിക്കുക',
    },
    te: {
      govtSchemeBadge: 'తమిళనాడు ప్రభుత్వ పథకం',
      bannerDesc: 'ప్రభుత్వ పాఠశాలల్లో చదివి ఉన్నత విద్యను అభ్యసించే బాలికలకు నెలకు ₹1,000 అందించే ఉన్నత విద్యా పథకం.',
      listenBtn: 'వివరాలను వాయిస్‌లో వినండి',
      askSiraguBtn: 'సిరగును అడగండి',
      pillar1Badge: 'సహాయ మొత్తం',
      pillar1Title: 'నెలకు ₹1,000',
      pillar2Badge: 'అందించే కాలపరిమితి',
      pillar2Title: 'కోర్సు పూర్తయ్యే వరకు',
      pillar3Badge: 'ప్రాథమిక అర్హత',
      pillar3Title: '6 నుండి 12 ప్రభుత్వ పాఠశాల',
      pillar4Badge: 'నమోదు విధానం',
      pillar4Title: '100% ఉచిత సేవ',
      faqHeading: 'తరచుగా అడిగే ప్రశ్నలు (FAQ)',
      askSampleQuery: 'పుదుమై పెణ్ పథకం గురించి వివరించండి',
    },
    kn: {
      govtSchemeBadge: 'ತಮಿಳುನಾಡು ಸರಕಾರದ ಯೋಜನೆ',
      bannerDesc: 'ಸರಕಾರಿ ಶಾಲೆಗಳಲ್ಲಿ ಓದಿ ಕಾಲೇಜಿಗೆ ಸೇರುವ ಹೆಣ್ಣುಮಕ್ಕಳಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ₹1,000 ನೀಡುವ ಉನ್ನತ ಶಿಕ್ಷಣ ಯೋಜನೆ.',
      listenBtn: 'ಮಾಹಿತಿಯನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಆಲಿಸಿ',
      askSiraguBtn: 'ಸಿರೆಗು ಜೊತೆ ಕೇಳಿ',
      pillar1Badge: 'ಸಹಾಯಧನ ಮೊತ್ತ',
      pillar1Title: 'ತಿಂಗಳಿಗೆ ₹1,000',
      pillar2Badge: 'ನೀಡುವ ಅವಧಿ',
      pillar2Title: 'ಕೋರ್ಸ್ ಮುಗಿಯುವವರೆಗೆ',
      pillar3Badge: 'ಮೂಲ ಅರ್ಹತೆ',
      pillar3Title: '6 ರಿಂದ 12 ಸರಕಾರಿ ಶಾಲೆ',
      pillar4Badge: 'ನೋಂದಣಿ ವಿಧಾನ',
      pillar4Title: '100% ಉಚಿತ ಸೇವೆ',
      faqHeading: 'ಪ್ರಶ್ನೋತ್ತರಗಳು (FAQ)',
      askSampleQuery: 'ಪುದುಮೈ ಪೆಣ್ ಯೋಜನೆ ಬಗ್ಗೆ ವಿವರಿಸಿ',
    },
    hi: {
      govtSchemeBadge: 'तमिलनाडु सरकार की योजना',
      bannerDesc: 'सरकारी स्कूलों में पढ़कर कॉलेज जाने वाली छात्राओं को हर महीने ₹1,000 प्रदान करने वाली विशेष उच्च शिक्षा योजना।',
      listenBtn: 'योजना विवरण आवाज़ में सुनें',
      askSiraguBtn: 'सिरगु से पूछें',
      pillar1Badge: 'सहायता राशि',
      pillar1Title: 'हर महीने ₹1,000',
      pillar2Badge: 'सहायता अवधि',
      pillar2Title: 'पढ़ाई पूरी होने तक',
      pillar3Badge: 'मूल पात्रता',
      pillar3Title: '6 से 12 सरकारी स्कूल',
      pillar4Badge: 'पंजीकरण प्रक्रिया',
      pillar4Title: '100% निःशुल्क सेवा',
      faqHeading: 'अक्सर पूछे जाने वाले सवाल (FAQ)',
      askSampleQuery: 'पुधुमई पेण्ण योजना के बारे में विस्तार से बताएं',
    },
  };

  const l = labels[currentLanguage] || labels.ta;

  return (
    <div className="space-y-6 text-left">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#9333EA] rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>{l.govtSchemeBadge}</span>
          </div>

          <h2
            className={`font-black tracking-tight leading-tight ${
              isLargeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
            }`}
          >
            {schemeData.scheme_name[currentLanguage] || schemeData.scheme_name.ta}
          </h2>

          <p className="text-purple-100 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
            {l.bannerDesc}
          </p>

          <div className="pt-1 flex flex-wrap gap-2">
            <button
              onClick={handleReadAloud}
              className="inline-flex items-center gap-2 bg-white text-[#6D28D9] font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-[#F3EDFF] transition-all active:scale-95 shadow-2xs"
            >
              <Volume2 className="w-4 h-4 text-[#6D28D9]" />
              <span>{l.listenBtn}</span>
            </button>

            <button
              onClick={() => onAskQuestion(l.askSampleQuery)}
              className="inline-flex items-center gap-1.5 bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{l.askSiraguBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pillar 1 */}
        <div className="bg-white border-2 border-[#F3EDFF] rounded-2xl p-5 shadow-2xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              {l.pillar1Badge}
            </span>
            <h3
              className={`font-black text-[#1E293B] mt-0.5 ${
                isLargeText ? 'text-xl' : 'text-lg'
              }`}
            >
              {l.pillar1Title}
            </h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed font-medium">
              {schemeData.benefit_details.payment_mode[currentLanguage] || schemeData.benefit_details.payment_mode.ta}
            </p>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white border-2 border-[#F3EDFF] rounded-2xl p-5 shadow-2xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F3EDFF] text-[#6D28D9] flex items-center justify-center shrink-0 border border-[#A78BFA]/30">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">
              {l.pillar2Badge}
            </span>
            <h3
              className={`font-black text-[#1E293B] mt-0.5 ${
                isLargeText ? 'text-xl' : 'text-lg'
              }`}
            >
              {l.pillar2Title}
            </h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed font-medium">
              {schemeData.benefit_details.duration[currentLanguage] || schemeData.benefit_details.duration.ta}
            </p>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white border-2 border-[#F3EDFF] rounded-2xl p-5 shadow-2xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              {l.pillar3Badge}
            </span>
            <h3
              className={`font-black text-[#1E293B] mt-0.5 ${
                isLargeText ? 'text-xl' : 'text-lg'
              }`}
            >
              {l.pillar3Title}
            </h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed font-medium">
              {schemeData.eligibility_criteria[1]?.description[currentLanguage] || schemeData.eligibility_criteria[1]?.description.ta}
            </p>
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="bg-white border-2 border-[#F3EDFF] rounded-2xl p-5 shadow-2xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              {l.pillar4Badge}
            </span>
            <h3
              className={`font-black text-[#1E293B] mt-0.5 ${
                isLargeText ? 'text-xl' : 'text-lg'
              }`}
            >
              {l.pillar4Title}
            </h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed font-medium">
              {schemeData.application_steps[2]?.description[currentLanguage] || schemeData.application_steps[2]?.description.ta}
            </p>
          </div>
        </div>
      </div>

      {/* Official FAQs */}
      <div className="bg-white border-2 border-[#F3EDFF] rounded-3xl p-6 shadow-2xs space-y-4">
        <h3
          className={`font-black text-[#1E293B] ${
            isLargeText ? 'text-xl' : 'text-lg'
          }`}
        >
          {l.faqHeading}
        </h3>

        <div className="space-y-3">
          {schemeData.faq_list.map((faq, i) => (
            <div
              key={i}
              className="bg-[#FAF9FF] border border-[#F3EDFF] rounded-2xl p-4 text-left"
            >
              <h4 className="font-bold text-[#1E293B] text-xs sm:text-sm mb-1.5 flex items-start gap-2">
                <span className="text-[#6D28D9] shrink-0 font-black">Q:</span>
                <span>{faq.question[currentLanguage] || faq.question.ta}</span>
              </h4>
              <p className="text-xs text-[#64748B] leading-relaxed pl-5 font-medium">
                {faq.answer[currentLanguage] || faq.answer.ta}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
