import React from 'react';
import {
  PhoneCall,
  ShieldCheck,
  RotateCcw,
  Mic,
  Volume2,
} from 'lucide-react';
import { SchemeKnowledge, Language, ActivePage } from '../types/scheme';
import { speechService } from '../services/speech';

interface SupportOfficialViewProps {
  currentLanguage: Language;
  schemeData: SchemeKnowledge;
  onNavigate: (page: ActivePage) => void;
  onAskQuestion: (q: string) => void;
  isLargeText?: boolean;
}

const UI_TEXTS: Record<
  Language,
  {
    badge: string;
    listenBtn: string;
    title: string;
    desc: string;
    womenBadge: string;
    womenDesc: string;
    call181Btn: string;
    cmBadge: string;
    cmDesc: string;
    call1100Btn: string;
    micTroubleTitle: string;
    micTips: string[];
    tutorialReviewTitle: string;
    tutorialReviewDesc: string;
    startTutorialBtn: string;
    fraudTitle: string;
    fraudTips: string[];
  }
> = {
  ta: {
    badge: 'உதவி எண்கள் & தொடர்புகள்',
    listenBtn: 'குரலில் கேட்க',
    title: 'அதிகாரப்பூர்வ உதவி மையம்',
    desc: 'ஏதேனும் சந்தேகங்கள் இருந்தால் அல்லது உதவித்தொகை வரவு வைக்கப்படவில்லை என்றால் கீழே உள்ள தமிழ்நாடு அரசின் கட்டணமில்லா உதவி எண்களைத் தொடர்பு கொள்ளலாம்.',
    womenBadge: '24 மணி நேர இலவச சேவை',
    womenDesc: 'தமிழ்நாடு அரசு மகளிர் உதவி மையம் (Women Helpline). பெண்களுக்கான அனைத்து அரசு நலத்திட்டங்கள் மற்றும் உதவிக்கு.',
    call181Btn: '181-ஐ இப்போது அழைக்க',
    cmBadge: 'அரசு உதவி மையம்',
    cmDesc: 'முதலமைச்சர் உதவி மையம் (CM Helpline). அரசுத் திட்டங்கள் குறித்த குறைகள் மற்றும் கோரிக்கைகளை பதிவு செய்ய.',
    call1100Btn: '1100-ஐ இப்போது அழைக்க',
    micTroubleTitle: 'மைக்ரோஃபோன் வேலை செய்யவில்லையா?',
    micTips: [
      'உலாவியின் முகவரிப் பட்டியில் உள்ள பூட்டு (Lock) அல்லது மைக்ரோஃபோன் குறியீட்டைத் தொட்டு அனுமதி (Allow) வழங்கவும்.',
      'அமைதியான இடத்தில் இருந்து மைக்கை அருகில் வைத்துப் பேசவும்.',
      'குரல் வேலை செய்யாவிட்டால் கீழேயுள்ள தட்டச்சுப் பெட்டியில் எழுதி அனுப்பலாம்.',
    ],
    tutorialReviewTitle: 'பயிற்சியை மீண்டும் பார்க்க வேண்டுமா?',
    tutorialReviewDesc: 'பொத்தான்களைத் தொடுவது மற்றும் பேசுவது எப்படி என்று மீண்டும் கற்றுக்கொள்ளலாம்.',
    startTutorialBtn: 'பயிற்சியைத் தொடங்கு',
    fraudTitle: 'மோசடிகளிலிருந்து எச்சரிக்கை!',
    fraudTips: [
      'புதுமைப் பெண் திட்டம் முற்றிலும் இலவசமானது. யாரிடமும் பணம் கொடுக்க வேண்டாம்.',
      'வங்கி ஏடிஎம் PIN அல்லது செல்போன் OTP எக்காரணம் கொண்டும் யாரிடமும் பகிராதீர்கள்.',
    ],
  },
  ml: {
    badge: 'സഹായ നമ്പറുകൾ & ബന്ധപ്പെടേണ്ട വിവരങ്ങൾ',
    listenBtn: 'ശബ്ദത്തിൽ കേൾക്കുക',
    title: 'ഔദ്യോഗിക ഹെൽപ്പ്‌ലൈൻ കേന്ദ്രം',
    desc: 'പദ്ധതിയെക്കുറിച്ച് എന്തെങ്കിലും സംശയങ്ങളുണ്ടെങ്കിൽ തമിഴ്നാട് സർക്കാരിന്റെ ടോൾ ഫ്രീ നമ്പറുകളിൽ ബന്ധപ്പെടാം.',
    womenBadge: '24 മണിക്കൂർ സൗജന്യ സേവനം',
    womenDesc: 'തമിഴ്നാട് സർക്കാർ വനിതാ ഹെൽപ്പ്‌ലൈൻ (Women Helpline 181). വനിതാ ക്ഷേമ പദ്ധതികൾക്കും പിന്തുണയ്ക്കും.',
    call181Btn: '181 ഇപ്പോൾ വിളിക്കുക',
    cmBadge: 'സിഎം ഹെൽപ്പ്‌ലൈൻ',
    cmDesc: 'മുഖ്യമന്ത്രിയുടെ ഹെൽപ്പ്‌ലൈൻ (CM Helpline 1100). പരാതികളും വിവരങ്ങളും അറിയിക്കാം.',
    call1100Btn: '1100 ഇപ്പോൾ വിളിക്കുക',
    micTroubleTitle: 'മൈക്ക് പ്രവർത്തിക്കുന്നില്ലേ?',
    micTips: [
      'ബ്രൗസറിലെ അഡ്രസ് ബാറിലുള്ള ലോക്ക് അല്ലെങ്കിൽ മൈക്ക് ചിഹ്നത്തിൽ തൊട്ട് Allow നൽകുക.',
      'ശാന്തമായ സ്ഥലത്തിരുന്ന് മൈക്ക് അടുപ്പിച്ച് സംസാരിക്കുക.',
      'ശബ്ദം ലഭ്യമല്ലെങ്കിൽ താഴെയുള്ള ബോക്സിൽ ടൈപ്പ് ചെയ്ത് ചോദിക്കാം.',
    ],
    tutorialReviewTitle: 'പരിശീലനം വീണ്ടും കാണണോ?',
    tutorialReviewDesc: 'ബട്ടണുകൾ അമർത്തുന്നതും സംസാരിക്കുന്നതും എങ്ങനെ എന്ന് വീണ്ടും പഠിക്കാം.',
    startTutorialBtn: 'പരിശീലനം ആരംഭിക്കുക',
    fraudTitle: 'തട്ടിപ്പുകൾക്കെതിരെ ജാഗ്രത!',
    fraudTips: [
      'പുതുമൈ പെൺ പദ്ധതി പൂർണ്ണമായും സൗജന്യമാണ്. ആർക്കും പണം നൽകരുത്.',
      'ബാങ്ക് എടിഎം പിൻ നമ്പറോ ഒടിപിയോ ആരുമായും പങ്കിടരുത്.',
    ],
  },
  te: {
    badge: 'సహాయ నంబర్లు & సంప్రదింపులు',
    listenBtn: 'వినండి',
    title: 'అధికారిక హెల్ప్‌లైన్ కేంద్రం',
    desc: 'ఏవైనా సందేహాలుంటే క్రింది తమిళనాడు ప్రభుత్వ ఉచిత టోల్‌ఫ్రీ నంబర్లను సంప్రదించవచ్చు.',
    womenBadge: '24 గంటల ఉచిత సేవ',
    womenDesc: 'తమిళనాడు ప్రభుత్వ మహిళా హెల్ప్‌లైన్ 181. మహిళా సంక్షేమ పథకాలకు తక్షణ సహాయం.',
    call181Btn: '181 కి కాల్ చేయండి',
    cmBadge: 'సీఎం హెల్ప్‌లైన్',
    cmDesc: 'ముఖ్యమంత్రి హెల్ప్‌లైన్ 1100. ప్రభుత్వ సేవల సమస్యలను నమోదు చేసుకోవచ్చు.',
    call1100Btn: '1100 కి కాల్ చేయండి',
    micTroubleTitle: 'మైక్రోఫోన్ పనిచేయడం లేదా?',
    micTips: [
      'బ్రౌజర్ అడ్రస్ బార్‌లోని లాక్ లేదా మైక్ గుర్తును తాకి Allow అనుమతి ఇవ్వండి.',
      'నిశ్శబ్దమైన ప్రదేశంలో మైక్ దగ్గరగా మాట్లాడండి.',
      'వాయిస్ రాకపోతే క్రింది పెట్టెలో టైప్ చేసి అడగవచ్చు.',
    ],
    tutorialReviewTitle: 'ట్యుటోరియల్ మళ్ళీ చూడాలా?',
    tutorialReviewDesc: 'బటన్లు నొక్కడం, వాయిస్ మాట్లాడటం ఎలాగో మళ్ళీ నేర్చుకోవచ్చు.',
    startTutorialBtn: 'ట్యుటోరియల్ ప్రారంభించండి',
    fraudTitle: 'మోసాలపై జాగ్రత్త!',
    fraudTips: [
      'పుదుమై పెణ్ పథకం 100% ఉచితం. దళారులకు ఎవరికీ డబ్బు ఇవ్వవద్దు.',
      'మీ బ్యాంక్ ఏటీఎం పిన్ లేదా ఓటీపీని ఎవరితోనూ పంచుకోవద్దు.',
    ],
  },
  kn: {
    badge: 'ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆಗಳು',
    listenBtn: 'ಆಲಿಸಿ',
    title: 'ಅಧಿಕೃತ ಸಹಾಯವಾಣಿ ಕೇಂದ್ರ',
    desc: 'ಯಾವುದೇ ಸಂದೇಹಗಳಿದ್ದರೆ ತಮಿಳುನಾಡು ಸರಕಾರದ ಉಚಿತ ಸಹಾಯವಾಣಿಗಳನ್ನು ಸಂಪರ್ಕಿಸಬಹುದು.',
    womenBadge: '24 ಗಂಟೆಗಳ ಉಚಿತ ಸೇವೆ',
    womenDesc: 'ತಮಿಳುನಾಡು ಮಹಿಳಾ ಸಹಾಯವಾಣಿ 181. ಮಹಿಳಾ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳ ಮಾಹಿತಿ ಮತ್ತು ನೆರವು.',
    call181Btn: '181 ಗೆ ಕರೆ ಮಾಡಿ',
    cmBadge: 'ಸಿಎಂ ಸಹಾಯವಾಣಿ',
    cmDesc: 'ಮುಖ್ಯಮಂತ್ರಿ ಸಹಾಯವಾಣಿ 1100. ಯೋಜನೆಗಳ ದೂರುಗಳು ಮತ್ತು ವಿಚಾರಣೆಗಳಿಗೆ.',
    call1100Btn: '1100 ಗೆ ಕರೆ ಮಾಡಿ',
    micTroubleTitle: 'ಮೈಕ್ರೊಫೋನ್ ಕೆಲಸ ಮಾಡುತ್ತಿಲ್ಲವೇ?',
    micTips: [
      'ಬ್ರೌಸರ್ ವಿಳಾಸ ಪಟ್ಟಿಯ ಲಾಕ್ ಅಥವಾ ಮೈಕ್ ಐಕಾನ್ ಮುಟ್ಟಿ Allow ಅನುಮತಿ ನೀಡಿ.',
      'ಶಾಂತವಾದ ಸ್ಥಳದಲ್ಲಿ ಮೈಕ್ ಹತ್ತಿರ ಮಾತನಾಡಿ.',
      'ಧ್ವನಿ ಇಲ್ಲದಿದ್ದರೆ ಕೆಳಗಿನ ಪೆಟ್ಟಿಗೆಯಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ ಕೇಳಬಹುದು.',
    ],
    tutorialReviewTitle: 'ಟ್ಯುಟೋರಿಯಲ್ ಮತ್ತೆ ನೋಡಬೇಕೇ?',
    tutorialReviewDesc: 'ಗುಂಡಿಗಳನ್ನು ಮುಟ್ಟುವುದು ಮತ್ತು ಮಾತನಾಡುವುದು ಹೇಗೆಂದು ಕಲಿಯಿರಿ.',
    startTutorialBtn: 'ಟ್ಯುಟೋರಿಯಲ್ ಪ್ರಾರಂಭಿಸಿ',
    fraudTitle: 'ವಂಚನೆಗಳ ಬಗ್ಗೆ ಎಚ್ಚರ!',
    fraudTips: [
      'ಪುದುಮೈ ಪೆಣ್ ಯೋಜನೆಯು ಸಂಪೂರ್ಣ ಉಚಿತವಾಗಿದೆ. ಯಾರಿಗೂ ಹಣ ನೀಡಬೇಡಿ.',
      'ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಎಟಿಎಂ ಪಿನ್ ಅಥವಾ ಒಟಿಪಿಯನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.',
    ],
  },
  hi: {
    badge: 'हेल्पलाइन एवं संपर्क सूत्र',
    listenBtn: 'सुनें',
    title: 'आधिकारिक सहायता केंद्र',
    desc: 'यदि योजना से संबंधित कोई प्रश्न हो, तो तमिलनाडु सरकार के निःशुल्क टोल-फ्री नंबरों पर संपर्क करें।',
    womenBadge: '24 घंटे निःशुल्क सेवा',
    womenDesc: 'तमिलनाडु महिला हेल्पलाइन (181)। महिला कल्याण योजनाओं एवं त्वरित सहायता के लिए।',
    call181Btn: '181 पर कॉल करें',
    cmBadge: 'सीएम हेल्पलाइन',
    cmDesc: 'मुख्यमंत्री हेल्पलाइन (1100)। सरकारी योजनाओं से जुड़ी शिकायतों व जानकारी के लिए।',
    call1100Btn: '1100 पर कॉल करें',
    micTroubleTitle: 'माइक्रोफ़ोन काम नहीं कर रहा?',
    micTips: [
      'ब्राउज़र के एड्रेस बार में लॉक या माइक आइकन दबाकर "Allow" की अनुमति दें।',
      'शांत स्थान पर आकर माइक के समीप स्पष्ट आवाज़ में बोलें।',
      'यदि वॉयस उपलब्ध न हो, तो नीचे टेक्स्ट बॉक्स में लिखकर पूछ सकती हैं।',
    ],
    tutorialReviewTitle: 'ट्यूटोरियल दोबारा देखना चाहती हैं?',
    tutorialReviewDesc: 'बटन दबाना और माइक से बात करना दोबारा सीखें।',
    startTutorialBtn: 'ट्यूटोरियल शुरू करें',
    fraudTitle: 'धोखाधड़ी से सावधान!',
    fraudTips: [
      'पुधुमई पेण्ण योजना 100% निःशुल्क है। किसी भी दलाल को कोई राशि न दें।',
      'अपना बैंक एटीएम पिन, नेट बैंकिंग पासवर्ड या ओटीपी कभी किसी से साझा न करें।',
    ],
  },
};

export const SupportOfficialView: React.FC<SupportOfficialViewProps> = ({
  currentLanguage,
  schemeData,
  onNavigate,
  onAskQuestion,
  isLargeText = false,
}) => {
  const ui = UI_TEXTS[currentLanguage] || UI_TEXTS.ta;

  const helplinesAudio: Record<Language, string> = {
    ta: 'தமிழ்நாடு அரசு மகளிர் உதவி எண் 181. இது 24 மணி நேரமும் செயல்படும் இலவச தொலைபேசி எண். மேலும் முதலமைச்சரின் உதவி மையம் எண் 1100.',
    ml: 'തമിഴ്നാട് സർക്കാർ വനിതാ ഹെൽപ്പ്‌ലൈൻ 181. മുഖ്യമന്ത്രിയുടെ ഹെൽപ്പ്‌ലൈൻ 1100.',
    te: 'తమిళనాడు మహిళా హెల్ప్‌లైన్ 181. ముఖ్యమంత్రి హెల్ప్‌లైన్ 1100.',
    kn: 'ತಮಿಳುನಾಡು ಮಹಿಳಾ ಸಹಾಯವಾಣಿ 181. ಮುಖ್ಯಮಂತ್ರಿ ಸಹಾಯವಾಣಿ 1100.',
    hi: 'तमिलनाडु सरकार महिला हेल्पलाइन 181 और मुख्यमंत्री हेल्पलाइन 1100 है।',
  };

  const handleReadHelplines = () => {
    const text = helplinesAudio[currentLanguage] || helplinesAudio.ta;
    speechService.speakText(text, { lang: currentLanguage });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left">
      {/* Intro */}
      <div className="bg-white border-2 border-[#F3EDFF] rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-xs font-bold text-[#6D28D9] bg-[#F3EDFF] px-2.5 py-1 rounded-full border border-[#A78BFA]/30">
            {ui.badge}
          </span>

          <button
            onClick={handleReadHelplines}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F3EDFF] text-[#6D28D9] hover:bg-[#F3EDFF]/80 transition-all border border-[#A78BFA]/30 shadow-2xs"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#6D28D9]" />
            <span>{ui.listenBtn}</span>
          </button>
        </div>

        <h2
          className={`font-black text-[#1E293B] mt-1 mb-2 ${
            isLargeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
          }`}
        >
          {ui.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-medium">
          {ui.desc}
        </p>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Women Helpline 181 */}
        <div className="bg-white border-2 border-[#F3EDFF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0D9488]/10 text-[#0D9488] flex items-center justify-center border border-[#0D9488]/20">
              <PhoneCall className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#0D9488] uppercase tracking-wider block">
              {ui.womenBadge}
            </span>
            <h3
              className={`font-black text-[#1E293B] ${
                isLargeText ? 'text-2xl' : 'text-xl'
              }`}
            >
              181
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed font-medium">
              {ui.womenDesc}
            </p>
          </div>

          <a
            href="tel:181"
            className="mt-4 w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{ui.call181Btn}</span>
          </a>
        </div>

        {/* CM Helpline 1100 */}
        <div className="bg-white border-2 border-[#F3EDFF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#F3EDFF] text-[#6D28D9] flex items-center justify-center border border-[#A78BFA]/30">
              <PhoneCall className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider block">
              {ui.cmBadge}
            </span>
            <h3
              className={`font-black text-[#1E293B] ${
                isLargeText ? 'text-2xl' : 'text-xl'
              }`}
            >
              1100
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed font-medium">
              {ui.cmDesc}
            </p>
          </div>

          <a
            href="tel:1100"
            className="mt-4 w-full bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{ui.call1100Btn}</span>
          </a>
        </div>
      </div>

      {/* Microphone Troubleshooting Card */}
      <div className="bg-white border-2 border-[#F3EDFF] rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-[#6D28D9] font-bold text-sm">
          <Mic className="w-5 h-5" />
          <span>{ui.micTroubleTitle}</span>
        </div>
        <ul className="text-xs text-[#64748B] space-y-1.5 list-disc list-inside leading-relaxed font-medium">
          {ui.micTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Restart Tutorial Quick Action */}
      <div className="bg-[#FAF9FF] border border-[#F3EDFF] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="space-y-1">
          <h4 className="font-bold text-[#1E293B] text-xs sm:text-sm">
            {ui.tutorialReviewTitle}
          </h4>
          <p className="text-xs text-[#64748B] font-medium">
            {ui.tutorialReviewDesc}
          </p>
        </div>

        <button
          onClick={() => onNavigate('tutorial')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#6D28D9] text-white hover:bg-[#5B21B6] transition-all shadow-xs shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{ui.startTutorialBtn}</span>
        </button>
      </div>

      {/* Fraud Safety Reminder */}
      <div className="bg-[#1E293B] text-white rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>{ui.fraudTitle}</span>
        </div>
        <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed font-normal">
          {ui.fraudTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
