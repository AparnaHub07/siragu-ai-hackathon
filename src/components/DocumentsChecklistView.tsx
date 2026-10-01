import React, { useState } from 'react';
import {
  FileCheck2,
  CheckSquare,
  Square,
  Volume2,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { RequiredDocument, Language } from '../types/scheme';
import { speechService } from '../services/speech';
import { translations } from '../data/translations';

interface DocumentsChecklistViewProps {
  currentLanguage: Language;
  documents: RequiredDocument[];
  onAskQuestion: (q: string) => void;
  isLargeText?: boolean;
}

export const DocumentsChecklistView: React.FC<DocumentsChecklistViewProps> = ({
  currentLanguage,
  documents,
  onAskQuestion,
  isLargeText = false,
}) => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [activeDocIndex, setActiveDocIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

  const t = translations[currentLanguage];

  const getDocName = (doc: RequiredDocument) => {
    return doc.name[currentLanguage] || doc.name.ta || '';
  };

  const getDocHowToGet = (doc: RequiredDocument) => {
    return doc.how_to_get[currentLanguage] || doc.how_to_get.ta || '';
  };

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReadDoc = (doc: RequiredDocument) => {
    const howToGetWord: Record<Language, string> = {
      ta: 'இதை எப்படி பெறுவது:',
      ml: 'ഇത് എങ്ങനെ ലഭിക്കും:',
      te: 'దీన్ని ఎలా పొందాలి:',
      kn: 'ಇದನ್ನು ಹೇಗೆ ಪಡೆಯುವುದು:',
      hi: 'यह कैसे प्राप्त करें:',
    };

    const text = `${getDocName(doc)}. ${howToGetWord[currentLanguage] || howToGetWord.ta} ${getDocHowToGet(doc)}`;
    speechService.speakText(text, { lang: currentLanguage });
  };

  const fullDocsAudio: Record<Language, string> = {
    ta: 'புதுமைப் பெண் திட்டத்திற்கு 5 முக்கிய ஆவணங்கள் தேவை. ஒன்று: 6 முதல் 12 அரசுப் பள்ளி படிப்பு சான்று அல்லது EMIS எண். இரண்டு: கல்லூரி சேர்க்கை அட்டை. மூன்று: மாணவி பெயரில் உள்ள வங்கி புத்தக நகல். நான்கு: ஆதார் அட்டை நகல். ஐந்து: 10 மற்றும் 12 ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்.',
    ml: 'പുതുമൈ പെൺ പദ്ധതിക്ക് 5 രേഖകൾ ആവശ്യമാണ്: 1. സ്കൂൾ പഠന സർട്ടിഫിക്കറ്റ് അല്ലെങ്കിൽ EMIS നമ്പർ. 2. കോളേജ് അഡ്മിഷൻ കാർഡ്. 3. സ്വന്തം പേരിലുള്ള ബാങ്ക് പാസ്സ്ബുക്ക്. 4. ആധാർ കാർഡ് പകർപ്പ്. 5. പത്ത്, പന്ത്രണ്ട് ക്ലാസ് മാർക്ക് ഷീറ്റുകൾ.',
    te: 'పుదుమై పెణ్ పథకానికి 5 ముఖ్యమైన పత్రాలు అవసరం: 1. పాఠశాల చదువు ధృవీకరణ లేదా EMIS నంబర్. 2. కాలేజీ ప్రవేశ ఆర్డర్. 3. బ్యాంక్ పాస్‌బుక్ కాపీ. 4. ఆధార్ కార్డు జిరాక్స్. 5. పదవ మరియు పన్నెండవ తరగతి మార్కుల జాబితా.',
    kn: 'ಪುದುಮೈ ಪೆಣ್ ಯೋಜನೆಗೆ 5 ದಾಖಲೆಗಳು ಬೇಕಾಗುತ್ತವೆ: 1. ಶಾಲಾ ವ್ಯಾಸಂಗ ಪ್ರಮಾಣಪತ್ರ ಅಥವಾ EMIS ಸಂಖ್ಯೆ. 2. ಕಾಲೇಜು ಪ್ರವೇಶ ಪತ್ರ. 3. ವಿದ್ಯಾರ್ಥಿನಿಯ ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್. 4. ಆಧಾರ್ ಕಾರ್ಡ್ ಪ್ರತಿ. 5. ಹತ್ತನೇ ಮತ್ತು ಹನ್ನೆರಡನೇ ತರಗತಿಯ ಅಂಕಪಟ್ಟಿಗಳು.',
    hi: 'पुधुमई पेण्ण योजना के लिए 5 मुख्य दस्तावेज़ आवश्यक हैं: 1. स्कूल अध्ययन प्रमाण पत्र या EMIS संख्या। 2. कॉलेज प्रवेश आवंटन पत्र। 3. छात्रा के नाम की बैंक पासबुक। 4. आधार कार्ड की फोटोकॉपी। 5. 10वीं और 12वीं की अंकतालिका।',
  };

  const handleReadFullList = () => {
    const text = fullDocsAudio[currentLanguage] || fullDocsAudio.ta;
    speechService.speakText(text, { lang: currentLanguage });
  };

  const totalDocs = documents.length;
  const readyDocs = Object.values(checkedIds).filter(Boolean).length;
  const currentDoc = documents[activeDocIndex];

  const uiLabels: Record<
    Language,
    {
      badge: string;
      title: string;
      desc: string;
      listenAllBtn: string;
      readyBadge: string;
      stepByStepTab: string;
      allDocsTab: string;
      docWord: string;
      ofWord: string;
      markedReady: string;
      tapToMark: string;
      howToGetTitle: string;
      prevBtn: string;
      nextBtn: string;
      askSiraguBtn: string;
      safetyNoticeTitle: string;
      safetyNoticeDesc: string;
      askQuery: string;
    }
  > = {
    ta: {
      badge: 'சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ பட்டியல்',
      title: 'கல்லூரிக்கு சமர்ப்பிக்க வேண்டிய 5 ஆவணங்கள்',
      desc: 'அனைத்து ஆவணங்களின் நகல்களையும் (Photocopies) உங்கள் கல்லூரி புதுமைப் பெண் ஒருங்கிணைப்பாளரிடம் நேரில் சமர்ப்பிக்க வேண்டும்.',
      listenAllBtn: 'பட்டியலை குரலில் கேட்க',
      readyBadge: 'தயார்',
      stepByStepTab: 'ஒவ்வொன்றாக சரிபார்க்க',
      allDocsTab: 'முழு பட்டியல்',
      docWord: 'ஆவணம்',
      ofWord: 'இல்',
      markedReady: '✅ தயார்',
      tapToMark: 'தொட்டு குறித்துக்கொள்ளவும்',
      howToGetTitle: 'எப்படி பெறுவது?',
      prevBtn: 'முந்தைய ஆவணம்',
      nextBtn: 'அடுத்த ஆவணம்',
      askSiraguBtn: 'சிறகுவிடம் கேட்க',
      safetyNoticeTitle: 'முக்கிய பாதுகாப்பு எச்சரிக்கை:',
      safetyNoticeDesc: 'இந்த இணையதளத்தில் உங்கள் அசல் ஆவணங்களையோ, ஆதார் எண்ணையோ, வங்கி கடவுச்சொல்லையோ எங்கும் பதிவேற்றத் தேவையில்லை. நகல்களை மட்டுமே கல்லூரியில் சமர்ப்பிக்க வேண்டும்.',
      askQuery: 'ஆவணங்கள் பற்றிய சந்தேகம்',
    },
    ml: {
      badge: 'ഔദ്യോഗിക രേഖകളുടെ പട്ടിക',
      title: 'കോളേജിൽ നൽകേണ്ട 5 രേഖകൾ',
      desc: 'എല്ലാ രേഖകളുടെയും പകർപ്പുകൾ (Photocopies) കോളേജ് നോഡൽ ഓഫീസർക്ക് നേരിട്ട് സമർപ്പിക്കുക.',
      listenAllBtn: 'പട്ടിക കേൾക്കുക',
      readyBadge: 'തയ്യാർ',
      stepByStepTab: 'ഓരോന്നായി പരിശോധിക്കുക',
      allDocsTab: 'പൂർണ്ണ പട്ടിക',
      docWord: 'രേഖ',
      ofWord: '/',
      markedReady: '✅ തയ്യാർ',
      tapToMark: 'തൊട്ട് അടയാളപ്പെടുത്തുക',
      howToGetTitle: 'എങ്ങനെ ലഭിക്കും?',
      prevBtn: 'മുമ്പത്തെ രേഖ',
      nextBtn: 'അടുത്ത രേഖ',
      askSiraguBtn: 'സിറഗുവിനോട് ചോദിക്കുക',
      safetyNoticeTitle: 'പ്രധാന സുരക്ഷാ നിർദ്ദേശം:',
      safetyNoticeDesc: 'ഈ വെബ്‌സൈറ്റിൽ നിങ്ങളുടെ രേഖകളോ ആധാർ നമ്പറോ അപ്‌ലോഡ് ചെയ്യേണ്ടതില്ല. പകർപ്പുകൾ കോളേജിൽ മാത്രം നൽകുക.',
      askQuery: 'രേഖകളെക്കുറിച്ചുള്ള സംശയം',
    },
    te: {
      badge: 'ధృవీకరించబడిన అధికారిక జాబితా',
      title: 'కళాశాలలో సమర్పించాల్సిన 5 పత్రాలు',
      desc: 'అన్ని పత్రాల జిరాక్స్ కాపీలను కాలేజీ నోడల్ అధికారికి స్వయంగా అందించాలి.',
      listenAllBtn: 'జాబితాను వినండి',
      readyBadge: 'సిద్ధం',
      stepByStepTab: 'ఒక్కొక్కటిగా చూడండి',
      allDocsTab: 'మొత్తం జాబితా',
      docWord: 'పత్రం',
      ofWord: '/',
      markedReady: '✅ సిద్ధం',
      tapToMark: 'తాకి గుర్తించండి',
      howToGetTitle: 'ఎలా పొందాలి?',
      prevBtn: 'మునుపటి పత్రం',
      nextBtn: 'తదుపరి పత్రం',
      askSiraguBtn: 'సిరగును అడగండి',
      safetyNoticeTitle: 'ముఖ్యమైన భద్రతా హెచ్చరిక:',
      safetyNoticeDesc: 'ఈ వెబ్‌సైట్‌లో మీ అసలు పత్రాలు లేదా ఆధార్ నంబర్‌ను అప్‌లోడ్ చేయనవసరం లేదు. కాలేజీలో మాత్రమే సమర్పించండి.',
      askQuery: 'పత్రాలపై సందేహం',
    },
    kn: {
      badge: 'ಪರಿಶೀಲಿಸಿದ ಅಧಿಕೃತ ದಾಖಲೆಗಳು',
      title: 'ಕಾಲೇಜಿಗೆ ಸಲ್ಲಿಸಬೇಕಾದ 5 ದಾಖಲೆಗಳು',
      desc: 'ಎಲ್ಲಾ ದಾಖಲೆಗಳ ಜೆರಾಕ್ಸ್ ಪ್ರತಿಗಳನ್ನು ಕಾಲೇಜಿನ ನೋಡಲ್ ಅಧಿಕಾರಿಗೆ ನೇರವಾಗಿ ಸಲ್ಲಿಸಬೇಕು.',
      listenAllBtn: 'ಪಟ್ಟಿಯನ್ನು ಆಲಿಸಿ',
      readyBadge: 'ಸಿದ್ಧ',
      stepByStepTab: 'ಒಂದೊಂದಾಗಿ ಪರಿಶೀಲಿಸಿ',
      allDocsTab: 'ಸಂಪೂರ್ಣ ಪಟ್ಟಿ',
      docWord: 'ದಾಖಲೆ',
      ofWord: '/',
      markedReady: '✅ ಸಿದ್ಧ',
      tapToMark: 'ಮುಟ್ಟಿ ಗುರುತಿಸಿ',
      howToGetTitle: 'ಹೇಗೆ ಪಡೆಯುವುದು?',
      prevBtn: 'ಹಿಂದಿನ ದಾಖಲೆ',
      nextBtn: 'ಮುಂದಿನ ದಾಖಲೆ',
      askSiraguBtn: 'ಸಿರೆಗುವನ್ನು ಕೇಳಿ',
      safetyNoticeTitle: 'ಮುಖ್ಯ ಸುರಕ್ಷತಾ ಸೂಚನೆ:',
      safetyNoticeDesc: 'ಈ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ. ಪ್ರತಿಗಳನ್ನು ಕಾಲೇಜಿನಲ್ಲಿ ಮಾತ್ರ ನೀಡಿ.',
      askQuery: 'ದಾಖಲೆಗಳ ಬಗ್ಗೆ ಸಂದೇಹ',
    },
    hi: {
      badge: 'सत्यापित आधिकारिक दस्तावेज़',
      title: 'कॉलेज में जमा करने हेतु 5 आवश्यक दस्तावेज़',
      desc: 'सभी दस्तावेजों की फोटोकॉपी (ज़ेरॉक्स) अपने कॉलेज के पुधुमई पेण्ण नोडल अधिकारी को व्यक्तिगत रूप से सौंपें।',
      listenAllBtn: 'दस्तावेज़ सूची सुनें',
      readyBadge: 'तैयार',
      stepByStepTab: 'एक-एक करके जांचें',
      allDocsTab: 'पूरी सूची',
      docWord: 'दस्तावेज़',
      ofWord: '/',
      markedReady: '✅ तैयार',
      tapToMark: 'टच करके मार्क करें',
      howToGetTitle: 'कैसे प्राप्त करें?',
      prevBtn: 'पिछला दस्तावेज़',
      nextBtn: 'अगला दस्तावेज़',
      askSiraguBtn: 'सिरगु से पूछें',
      safetyNoticeTitle: 'महत्वपूर्ण सुरक्षा चेतावनी:',
      safetyNoticeDesc: 'इस वेबसाइट पर अपने मूल दस्तावेज़, आधार नंबर या पासवर्ड अपलोड करने की आवश्यकता नहीं है। फोटोकॉपी केवल कॉलेज में ही जमा करें।',
      askQuery: 'दस्तावेजों पर प्रश्न',
    },
  };

  const ui = uiLabels[currentLanguage] || uiLabels.ta;

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left">
      {/* Intro Header */}
      <div className="bg-white border-2 border-[#F3EDFF] rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <div>
            <span className="text-xs font-bold text-[#6D28D9] bg-[#F3EDFF] px-2.5 py-1 rounded-full border border-[#A78BFA]/30">
              {ui.badge}
            </span>
            <h2
              className={`font-black text-[#1E293B] mt-2 ${
                isLargeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
              }`}
            >
              {ui.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleReadFullList}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F3EDFF] text-[#6D28D9] hover:bg-[#F3EDFF]/80 transition-all border border-[#A78BFA]/30 shadow-2xs"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#6D28D9]" />
              <span>{ui.listenAllBtn}</span>
            </button>
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl">
              {readyDocs} / {totalDocs} {ui.readyBadge}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-medium">
          {ui.desc}
        </p>

        {/* View Mode Toggle */}
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
            {ui.allDocsTab}
          </button>
        </div>
      </div>

      {/* SINGLE DOCUMENT FOCUS VIEW */}
      {viewMode === 'single' && currentDoc && (
        <div className="bg-white border-2 border-[#6D28D9]/40 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#6D28D9] bg-[#F3EDFF] px-2.5 py-0.5 rounded-full">
              {ui.docWord} {activeDocIndex + 1} {ui.ofWord} {totalDocs}
            </span>

            <button
              onClick={() => handleReadDoc(currentDoc)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#6D28D9] hover:bg-[#F3EDFF] px-2.5 py-1 rounded-lg border border-[#A78BFA]/30"
              title={t.replayAnswer}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t.replayAnswer}</span>
            </button>
          </div>

          <div
            onClick={() => toggleCheck(currentDoc.id)}
            className="cursor-pointer flex items-start gap-3.5 p-3 rounded-2xl bg-[#FAF9FF] border border-[#F3EDFF] hover:border-[#A78BFA] transition-all"
          >
            <button
              type="button"
              className="mt-1 text-[#6D28D9] shrink-0 focus:outline-hidden"
              aria-label={checkedIds[currentDoc.id] ? 'Marked' : 'Mark'}
            >
              {checkedIds[currentDoc.id] ? (
                <CheckSquare className="w-7 h-7 text-emerald-600" />
              ) : (
                <Square className="w-7 h-7 text-[#A78BFA]" />
              )}
            </button>

            <div className="space-y-1">
              <h3
                className={`font-black text-[#1E293B] ${
                  isLargeText ? 'text-xl' : 'text-lg'
                } ${checkedIds[currentDoc.id] ? 'line-through text-[#64748B]' : ''}`}
              >
                {getDocName(currentDoc)}
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                {checkedIds[currentDoc.id] ? ui.markedReady : ui.tapToMark}
              </span>
            </div>
          </div>

          <div className="bg-[#F3EDFF]/60 p-4 rounded-2xl border border-[#A78BFA]/30 space-y-1">
            <span className="text-xs font-bold text-[#6D28D9] block uppercase tracking-wider">
              {ui.howToGetTitle}
            </span>
            <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed font-medium">
              {getDocHowToGet(currentDoc)}
            </p>
          </div>

          {/* Stepper buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveDocIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeDocIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#1E293B] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{ui.prevBtn}</span>
            </button>

            {activeDocIndex < totalDocs - 1 ? (
              <button
                onClick={() => setActiveDocIndex((prev) => Math.min(totalDocs - 1, prev + 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-xs"
              >
                <span>{ui.nextBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onAskQuestion(ui.askQuery)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0D9488] text-white shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{ui.askSiraguBtn}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ALL DOCUMENTS VIEW */}
      {viewMode === 'all' && (
        <div className="space-y-3">
          {documents.map((doc, idx) => {
            const isChecked = Boolean(checkedIds[doc.id]);
            return (
              <div
                key={doc.id}
                onClick={() => toggleCheck(doc.id)}
                className={`cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all active:scale-[0.99] flex items-start gap-4 text-left ${
                  isChecked
                    ? 'bg-[#F3EDFF]/70 border-[#A78BFA] shadow-2xs'
                    : 'bg-white border-[#F3EDFF] hover:border-[#A78BFA]'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-[#6D28D9] shrink-0 focus:outline-hidden"
                  aria-label={isChecked ? 'Marked' : 'Mark'}
                >
                  {isChecked ? (
                    <CheckSquare className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <Square className="w-6 h-6 text-[#A78BFA]" />
                  )}
                </button>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold bg-[#F3EDFF] text-[#6D28D9] px-2 py-0.5 rounded-md border border-[#A78BFA]/30">
                      {ui.docWord} {idx + 1}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReadDoc(doc);
                      }}
                      className="text-[#6D28D9] hover:bg-[#F3EDFF] p-1 rounded-lg"
                      title={t.replayAnswer}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3
                    className={`font-bold text-[#1E293B] ${
                      isLargeText ? 'text-lg' : 'text-base'
                    } ${isChecked ? 'line-through text-[#64748B]' : ''}`}
                  >
                    {getDocName(doc)}
                  </h3>

                  <p className="text-xs text-[#64748B] leading-relaxed font-medium bg-[#FAF9FF] p-2.5 rounded-xl border border-[#F3EDFF]">
                    <strong className="text-[#1E293B]">
                      {ui.howToGetTitle}
                    </strong>{' '}
                    {getDocHowToGet(doc)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Safety Alert (Zero Document Uploads) */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">{ui.safetyNoticeTitle}</p>
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            {ui.safetyNoticeDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
