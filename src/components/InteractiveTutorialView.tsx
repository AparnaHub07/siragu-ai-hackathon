import React, { useState, useEffect } from 'react';
import {
  Hand,
  Volume2,
  Mic,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Language, ActivePage } from '../types/scheme';
import { speechService } from '../services/speech';
import { SiraguLogo } from './SiraguLogo';

interface InteractiveTutorialViewProps {
  currentLanguage: Language;
  onNavigate: (page: ActivePage) => void;
  isLargeText?: boolean;
}

export const InteractiveTutorialView: React.FC<InteractiveTutorialViewProps> = ({
  currentLanguage,
  onNavigate,
  isLargeText = false,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isStepCompleted, setIsStepCompleted] = useState<boolean>(false);
  const [isSpeakingInstruction, setIsSpeakingInstruction] = useState<boolean>(false);

  // 5-language tutorial data
  const tutorialTexts: Record<
    Language,
    Array<{ step: number; title: string; spoken: string; explanation: string; tapDemoBtn: string; tappedDoneBtn: string; permUnderstood: string; micDoneNotice: string; listenDoneNotice: string; allReadyTitle: string; allReadyDesc: string }>
  > = {
    ta: [
      {
        step: 1,
        title: '1. பொத்தானைத் தொடுவது எப்படி?',
        spoken: 'வணக்கம்! இணையதளத்தை பயன்படுத்துவது இதுவே முதல் முறை என்றாலும் கவலை வேண்டாம். கீழே கை காட்டும் பெரிய ஊதா பொத்தானைத் தொடவும்.',
        explanation: 'செல்போன் திரையில் உள்ள பொத்தான்களை விரலால் மெதுவாக ஒரு முறை தொட்டு இயக்கலாம். கீழே உள்ள பொத்தானைத் தொட்டுப் பாருங்கள்.',
        tapDemoBtn: '👉 இந்த பொத்தானைத் தொடுங்கள் 👈',
        tappedDoneBtn: 'நன்றாக தொட்டீர்கள்! (முடிந்தது)',
        permUnderstood: 'அனுமதி புரிந்தது (அடுத்து)',
        micDoneNotice: '✅ மைக் செயல்படுகிறது!',
        listenDoneNotice: 'இங்கே தொட்டு ஒலிக்கச் செய்யுங்கள்',
        allReadyTitle: 'வாழ்த்துகள்! நீங்கள் தயாராகிவிட்டீர்கள்!',
        allReadyDesc: 'இப்போது புதுமைப் பெண் திட்டம் பற்றி அறிய விரும்புகிறீர்களா, அல்லது தகுதி சரிபார்க்க விரும்புகிறீர்களா?',
      },
      {
        step: 2,
        title: '2. மைக்ரோஃபோன் அனுமதி அறிதல்',
        spoken: 'அருமை! நீங்கள் என்னுடன் தமிழில் பேச உங்கள் செல்போன் மைக் அனுமதி தேவை. உலாவி கேட்கும் போது Allow அல்லது அனுமதி பொத்தானைத் தொடவும்.',
        explanation: 'உலாவி மைக்ரோஃபோன் அனுமதி கேட்கும்போது பயப்பட வேண்டாம். அது உங்கள் குரலை மட்டுமே கேட்கும். கீழே உள்ளதை உறுதி செய்யவும்.',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: 'அனுமதி புரிந்தது (அடுத்து)',
        micDoneNotice: '',
        listenDoneNotice: '',
        allReadyTitle: '',
        allReadyDesc: '',
      },
      {
        step: 3,
        title: '3. மைக்கை அழுத்திப் பேசுவது',
        spoken: 'அற்புதம்! பெரிய மைக் பொத்தானை ஒரு முறை தொட்டதும் அது சிவப்பு நிறமாக மாறி நீங்கள் பேசுவதைக் கேட்கும். அப்போது தெளிவாகப் பேசுங்கள்.',
        explanation: 'மைக் சிவப்பு நிறமாக இருக்கும்போது மட்டுமே உங்கள் குரல் கேட்கப்படும். கீழே உள்ள மாதிரி மைக்கை தொட்டுப் பாருங்கள்.',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: '',
        micDoneNotice: '✅ மைக் செயல்படுகிறது!',
        listenDoneNotice: '',
        allReadyTitle: '',
        allReadyDesc: '',
      },
      {
        step: 4,
        title: '4. பதிலை குரலில் கேட்பது',
        spoken: 'நன்று! நீங்கள் கேட்கும் கேள்விகளுக்கு சிறகு AI எளிய தமிழில் குரல் மூலமாகவே பதில் கூறும். அதை மீண்டும் கேட்க ஒலிபெருக்கியைத் தொடலாம்.',
        explanation: 'எழுத்துகளை படிக்க சிரமமாக இருந்தாலும் கவலைப்பட வேண்டாம்; அனைத்து தகவல்களையும் குரலிலேயே கேட்டுத் தெரிந்துகொள்ளலாம்.',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: '',
        micDoneNotice: '',
        listenDoneNotice: 'இங்கே தொட்டு ஒலிக்கச் செய்யுங்கள்',
        allReadyTitle: '',
        allReadyDesc: '',
      },
      {
        step: 5,
        title: '5. உதவி பெறுவது எப்படி?',
        spoken: 'வாழ்த்துகள்! நீங்கள் சிறகு AI-ஐ பயன்படுத்தக் கற்றுக்கொண்டீர்கள்! எந்தப் பக்கத்திலும் சந்தேகம் இருந்தால் புரியவில்லை பொத்தானைத் தொட்டு உதவி பெறலாம்.',
        explanation: 'இப்போது நீங்கள் புதுமைப் பெண் திட்டம் பற்றி அறிய விரும்புகிறீர்களா, அல்லது தகுதி சரிபார்க்க விரும்புகிறீர்களா?',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: '',
        micDoneNotice: '',
        listenDoneNotice: '',
        allReadyTitle: 'வாழ்த்துகள்! நீங்கள் தயாராகிவிட்டீர்கள்!',
        allReadyDesc: 'இப்போது புதுமைப் பெண் திட்டம் பற்றி அறிய விரும்புகிறீர்களா, அல்லது தகுதி சரிபார்க்க விரும்புகிறீர்களா?',
      },
    ],
    ml: [
      {
        step: 1,
        title: '1. ബട്ടൺ അമർത്തുന്നത് എങ്ങനെ?',
        spoken: 'നമസ്കാരം! ഇന്റർനെറ്റ് ഉപയോഗിക്കുന്നത് ആദ്യമായാണെങ്കിലും വിഷമിക്കേണ്ട. താഴെ കൈ ചൂണ്ടുന്ന വലിയ ബട്ടൺ അമർത്തുക.',
        explanation: 'സ്‌ക്രീനിലെ ഏതൊരു ബട്ടണും വിരൽ കൊണ്ട് മെല്ലെ തൊട്ട് പ്രവർത്തിപ്പിക്കാം. താഴെയുള്ള ബട്ടൺ തൊട്ടുനോക്കൂ.',
        tapDemoBtn: '👉 ഈ ബട്ടൺ അമർത്തുക 👈',
        tappedDoneBtn: 'നന്നായി ചെയ്തു! (പൂർത്തിയായി)',
        permUnderstood: 'മനസ്സിലായി (അടുത്തത്)',
        micDoneNotice: '✅ മൈക്ക് പ്രവർത്തിക്കുന്നു!',
        listenDoneNotice: 'ഇവിടെ തൊട്ട് കേൾക്കൂ',
        allReadyTitle: 'അഭിനന്ദനങ്ങൾ! നിങ്ങൾ തയ്യാറായിക്കഴിഞ്ഞു!',
        allReadyDesc: 'ഇനി പദ്ധതിയെക്കുറിച്ച് അറിയണമോ അതോ യോഗ്യത പരിശോധിക്കണമോ?',
      },
      {
        step: 2,
        title: '2. മൈക്രോഫോൺ അനുമതി',
        spoken: 'നന്നായി! സംസാരിക്കാൻ നിങ്ങളുടെ ഫോണിലെ മൈക്ക് അനുമതി വേണം. അനുമതി ചോദിക്കുമ്പോൾ Allow എന്ന് നൽകുക.',
        explanation: 'ബ്രൗസർ അനുമതി ചോദിക്കുമ്പോൾ ഭയപ്പെടേണ്ടതില്ല. നിങ്ങളുടെ ചോദ്യങ്ങൾ കേൾക്കാൻ മാത്രമാണിത്.',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: 'മനസ്സിലായി (അടുത്തത്)',
        micDoneNotice: '',
        listenDoneNotice: '',
        allReadyTitle: '',
        allReadyDesc: '',
      },
      {
        step: 3,
        title: '3. മൈക്കിൽ സംസാരിക്കുക',
        spoken: 'വളരെ നല്ലത്! മൈക്ക് ബട്ടൺ തൊടുമ്പോൾ ചുവപ്പായി മാറും. അപ്പോൾ സംസാരിക്കുക.',
        explanation: 'മൈക്ക് ചുവപ്പായിരിക്കുമ്പോൾ മാത്രമേ ശബ്ദം കേൾക്കൂ. താഴെയുള്ള മൈക്ക് പരീക്ഷിച്ചുനോക്കൂ.',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: '',
        micDoneNotice: '✅ മൈക്ക് പ്രവർത്തിക്കുന്നു!',
        listenDoneNotice: '',
        allReadyTitle: '',
        allReadyDesc: '',
      },
      {
        step: 4,
        title: '4. മറുപടി ശബ്ദത്തിൽ കേൾക്കുക',
        spoken: 'നന്ന്! സിറഗു AI ലളിതമായ ഭാഷയിൽ ശബ്ദത്തിലൂടെ മറുപടി നൽകും.',
        explanation: 'വായിക്കാൻ ബുദ്ധിമുട്ടുണ്ടെങ്കിലും ശബ്ദത്തിലൂടെ എല്ലാം കേട്ടു മനസ്സിലാക്കാം.',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: '',
        micDoneNotice: '',
        listenDoneNotice: 'ഇവിടെ തൊട്ട് കേൾക്കൂ',
        allReadyTitle: '',
        allReadyDesc: '',
      },
      {
        step: 5,
        title: '5. സഹായം നേടുന്നത് എങ്ങനെ?',
        spoken: 'അഭിനന്ദനങ്ങൾ! സംശയമുണ്ടെങ്കിൽ മനസ്സിലായില്ല എന്ന ബട്ടൺ അമർത്തി എളുപ്പത്തിൽ സഹായം തേടാം.',
        explanation: 'ഇനി പദ്ധതിയെക്കുറിച്ച് അറിയണമോ അതോ യോഗ്യത പരിശോധിക്കണമോ?',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: '',
        micDoneNotice: '',
        listenDoneNotice: '',
        allReadyTitle: 'അഭിനന്ദനങ്ങൾ! നിങ്ങൾ തയ്യാറായിക്കഴിഞ്ഞു!',
        allReadyDesc: 'ഇനി പദ്ധതിയെക്കുറിച്ച് അറിയണമോ അതോ യോഗ്യത പരിശോധിക്കണമോ?',
      },
    ],
    te: [
      {
        step: 1,
        title: '1. బటన్ ఎలా నొక్కాలి?',
        spoken: 'నమస్కారం! మొదటిసారి ఇంటర్నెట్ వాడుతున్నారా? ఏమీ పర్వాలేదు. క్రింద చూపించిన పెద్ద బటన్‌ను నొక్కండి.',
        explanation: 'స్క్రీన్ మీద ఉన్న బటన్‌ను వేలితో తాకి ఉపయోగించవచ్చు. క్రింది బటన్‌ను తాకి చూడండి.',
        tapDemoBtn: '👉 ఈ బటన్‌ను నొక్కండి 👈',
        tappedDoneBtn: 'బాగా చేశారు! (పూర్తయింది)',
        permUnderstood: 'అనుమతి అర్థమైంది (తదుపరి)',
        micDoneNotice: '✅ మైక్ పనిచేస్తోంది!',
        listenDoneNotice: 'ఇక్కడ నొక్కి వినండి',
        allReadyTitle: 'అభినందనలు! మీరు సిద్ధమయ్యారు!',
        allReadyDesc: 'ఇప్పుడు పుదుమై పెణ్ పథకం గురించి తెలుసుకుంటారా లేదా అర్హత చూసుకుంటారా?',
      },
      {
        step: 2,
        title: '2. మైక్రోఫోన్ అనుమతి',
        spoken: 'చాలా బాగుంది! మాట్లాడటానికి మీ ఫోన్ మైక్ అనుమతి కావాలి. Allow అని అడిగినప్పుడు నొక్కండి.',
        explanation: 'బ్రౌజర్ అనుమతి అడిగినప్పుడు కంగారు పడవద్దు. ఇది సురక్షితమైనది.',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: 'అనుమతి అర్థమైంది (తదుపరి)',
        micDoneNotice: '',
        listenDoneNotice: '',
        allReadyTitle: '',
        allReadyDesc: '',
      },
      {
        step: 3,
        title: '3. మైక్ నొక్కి మాట్లాడటం',
        spoken: 'అద్భుతం! మైక్ బటన్ నొక్కినప్పుడు ఎరుపు రంగులోకి మారుతుంది. అప్పుడు మీ ప్రశ్నను స్పష్టంగా మాట్లాడండి.',
        explanation: 'మైక్ ఎరుపుగా ఉన్నప్పుడే మీ వాయిస్ వినబడుతుంది. క్రింది మైక్‌ను ప్రయత్నించండి.',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: '',
        micDoneNotice: '✅ మైక్ పనిచేస్తోంది!',
        listenDoneNotice: '',
        allReadyTitle: '',
        allReadyDesc: '',
      },
      {
        step: 4,
        title: '4. సమాధానం వాయిస్‌లో వినడం',
        spoken: 'మంచిది! సిరగు AI సులభమైన మాటల్లో వాయిస్ ద్వారానే సమాధానం చెబుతుంది.',
        explanation: 'చదవడం రాకపోయినా బాధపడకండి; ప్రతి వివరమూ వాయిస్‌లోనే వినవచ్చు.',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: '',
        micDoneNotice: '',
        listenDoneNotice: 'ఇక్కడ నొక్కి వినండి',
        allReadyTitle: '',
        allReadyDesc: '',
      },
      {
        step: 5,
        title: '5. సహాయం పొందడం ఎలా?',
        spoken: 'అభినందనలు! ఎక్కడైనా అర్థం కాకపోతే క్రింది అర్థం కాలేదు బటన్ నొక్కి సహాయం పొందవచ్చు.',
        explanation: 'ఇప్పుడు పుదుమై పెణ్ పథకం గురించి తెలుసుకుంటారా లేదా అర్హత చూసుకుంటారా?',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: '',
        micDoneNotice: '',
        listenDoneNotice: '',
        allReadyTitle: 'అభినందనలు! మీరు సిద్ధమయ్యారు!',
        allReadyDesc: 'ఇప్పుడు పుదుమై పెణ్ పథకం గురించి తెలుసుకుంటారా లేదా అర్హత చూసుకుంటారా?',
      },
    ],
    kn: [
      {
        step: 1,
        title: '1. ಬಟನ್ ಮುಟ್ಟುವುದು ಹೇಗೆ?',
        spoken: 'ನಮಸ್ಕಾರ! ಮೊದಲ ಬಾರಿ ಇಂಟರ್ನೆಟ್ ಬಳಸುತ್ತಿದ್ದೀರಾ? ಚಿಂತಿಸಬೇಡಿ. ಕೆಳಗೆ ತೋರಿಸಿರುವ ದೊಡ್ಡ ಬಟನ್ ಒತ್ತಿರಿ.',
        explanation: 'ಸ್ಕ್ರೀನ್ ಮೇಲಿನ ಬಟನ್ ಅನ್ನು ಬೆರಳಿನಿಂದ ಮೃದುವಾಗಿ ಮುಟ್ಟಿ ಕಾರ್ಯನಿರ್ವಹಿಸಬಹುದು. ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿ ನೋಡಿ.',
        tapDemoBtn: '👉 ಈ ಬಟನ್ ಒತ್ತಿರಿ 👈',
        tappedDoneBtn: 'ಉತ್ತಮ! (ಮುಗಿಯಿತು)',
        permUnderstood: 'ಅರ್ಥವಾಯಿತು (ಮುಂದೆ)',
        micDoneNotice: '✅ ಮೈಕ್ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ!',
        listenDoneNotice: 'ಇಲ್ಲಿ ಮುಟ್ಟಿ ಆಲಿಸಿ',
        allReadyTitle: 'ಅಭಿನಂದನೆಗಳು! ನೀವು ಸಿದ್ಧರಾಗಿದ್ದೀರಿ!',
        allReadyDesc: 'ಈಗ ಪುದುಮೈ ಪೆಣ್ ಯೋಜನೆ ಬಗ್ಗೆ ತಿಳಿಯಬೇಕೇ ಅಥವಾ ಅರ್ಹತೆ ಪರೀಕ್ಷಿಸಬೇಕೇ?',
      },
      {
        step: 2,
        title: '2. ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ',
        spoken: 'ಉತ್ತಮ! ಮಾತನಾಡಲು ಮೈಕ್ ಅನುಮತಿ ಅಗತ್ಯ. ಅನುಮತಿ ಕೇಳಿದಾಗ Allow ಒತ್ತಿರಿ.',
        explanation: 'ಬ್ರೌಸರ್ ಅನುಮತಿ ಕೇಳಿದಾಗ ಹಿಂಜರಿಯಬೇಡಿ. ಇದು ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಲು ಮಾತ್ರ.',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: 'ಅರ್ಥವಾಯಿತು (ಮುಂದೆ)',
        micDoneNotice: '',
        listenDoneNotice: '',
        allReadyTitle: '',
        allReadyDesc: '',
      },
      {
        step: 3,
        title: '3. ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡುವುದು',
        spoken: 'ಅದ್ಭುತ! ಮೈಕ್ ಬಟನ್ ಮುಟ್ಟಿದಾಗ ಕೆಂಪು ಬಣ್ಣಕ್ಕೆ ತಿರುಗುತ್ತದೆ. ಆಗ ಮಾತನಾಡಿ.',
        explanation: 'ಮೈಕ್ ಕೆಂಪಾಗಿದ್ದಾಗ ಮಾತ್ರ ಧ್ವನಿ ಕೇಳಿಸುತ್ತದೆ. ಕೆಳಗಿನ ಮೈಕ್ ಪರೀಕ್ಷಿಸಿ.',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: '',
        micDoneNotice: '✅ ಮೈಕ್ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ!',
        listenDoneNotice: '',
        allReadyTitle: '',
        allReadyDesc: '',
      },
      {
        step: 4,
        title: '4. ಧ್ವನಿಯಲ್ಲಿ ಉತ್ತರ ಆಲಿಸುವುದು',
        spoken: 'ಉತ್ತಮ! ಸಿರೆಗು AI ಧ್ವನಿಯ ಮೂಲಕವೇ ಸರಳವಾಗಿ ಉತ್ತರಿಸುತ್ತದೆ.',
        explanation: 'ಓದಲು ಕಷ್ಟವಾದರೂ ಚಿಂತೆಯಿಲ್ಲ; ಪ್ರತಿಯೊಂದು ಮಾಹಿತಿಯನ್ನೂ ಧ್ವನಿಯಲ್ಲೇ ಕೇಳಬಹುದು.',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: '',
        micDoneNotice: '',
        listenDoneNotice: 'ಇಲ್ಲಿ ಮುಟ್ಟಿ ಆಲಿಸಿ',
        allReadyTitle: '',
        allReadyDesc: '',
      },
      {
        step: 5,
        title: '5. ನೆರವು ಪಡೆಯುವುದು ಹೇಗೆ?',
        spoken: 'ಅಭಿನಂದನೆಗಳು! ಸಂದೇಹವಿದ್ದರೆ ಅರ್ಥವಾಗಲಿಲ್ಲ ಎಂಬ ಬಟನ್ ಒತ್ತಿ ನೆರವು ಪಡೆಯಬಹುದು.',
        explanation: 'ಈಗ ಪುದುಮೈ ಪೆಣ್ ಯೋಜನೆ ಬಗ್ಗೆ ತಿಳಿಯಬೇಕೇ ಅಥವಾ ಅರ್ಹತೆ ಪರೀಕ್ಷಿಸಬೇಕೇ?',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: '',
        micDoneNotice: '',
        listenDoneNotice: '',
        allReadyTitle: 'ಅಭಿನಂದನೆಗಳು! ನೀವು ಸಿದ್ಧರಾಗಿದ್ದೀರಿ!',
        allReadyDesc: 'ಈಗ ಪುದುಮೈ ಪೆಣ್ ಯೋಜನೆ ಬಗ್ಗೆ ತಿಳಿಯಬೇಕೇ ಅಥವಾ ಅರ್ಹತೆ ಪರೀಕ್ಷಿಸಬೇಕೇ?',
      },
    ],
    hi: [
      {
        step: 1,
        title: '1. बटन कैसे दबाएं?',
        spoken: 'नमस्ते! पहली बार इंटरनेट चला रही हैं? कोई चिंता नहीं। नीचे हाथ से इशारा किए गए बड़े बटन को छुएं।',
        explanation: 'स्क्रीन पर मौजूद किसी भी बटन को उंगली से छूकर चलाया जा सकता है। नीचे दिए गए बटन को छूकर देखें।',
        tapDemoBtn: '👉 यह बटन दबाएं 👈',
        tappedDoneBtn: 'बहुत बढ़िया! (सफल)',
        permUnderstood: 'अनुमति समझी (आगे)',
        micDoneNotice: '✅ माइक चालू है!',
        listenDoneNotice: 'यहाँ छूकर सुनें',
        allReadyTitle: 'बधाई हो! आप तैयार हैं!',
        allReadyDesc: 'अब पुधुमई पेण्ण योजना के बारे में जानना चाहती हैं या पात्रता जांचना चाहती हैं?',
      },
      {
        step: 2,
        title: '2. माइक्रोफ़ोन अनुमति',
        spoken: 'बहुत अच्छे! बोलने के लिए आपके फ़ोन की माइक अनुमति चाहिए। पूछे जाने पर Allow दबाएं।',
        explanation: 'जब ब्राउज़र माइक की अनुमति मांगे तो घबराएं नहीं। यह केवल आपके प्रश्न सुनने के लिए है।',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: 'अनुमति समझी (आगे)',
        micDoneNotice: '',
        listenDoneNotice: '',
        allReadyTitle: '',
        allReadyDesc: '',
      },
      {
        step: 3,
        title: '3. माइक दबाकर बोलना',
        spoken: 'शाबाश! जब आप माइक बटन छुएंगी, तो यह लाल हो जाएगा। तब अपना सवाल साफ़-साफ़ बोलें।',
        explanation: 'जब माइक लाल रंग का हो, तभी वह आपकी आवाज़ सुनेगा। नीचे डेमो माइक छूकर देखें।',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: '',
        micDoneNotice: '✅ माइक चालू है!',
        listenDoneNotice: '',
        allReadyTitle: '',
        allReadyDesc: '',
      },
      {
        step: 4,
        title: '4. आवाज़ में उत्तर सुनना',
        spoken: 'बहुत अच्छा! सिरगु AI आसान भाषा में बोलकर उत्तर देती है।',
        explanation: 'पढ़ने में असुविधा हो तो भी चिंता न करें; पूरी जानकारी बोलकर सुनाई जाएगी।',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: '',
        micDoneNotice: '',
        listenDoneNotice: 'यहाँ छूकर सुनें',
        allReadyTitle: '',
        allReadyDesc: '',
      },
      {
        step: 5,
        title: '5. मदद कैसे पाएं?',
        spoken: 'बधाई हो! कोई भी सवाल समझ न आए तो नीचे दिए गए समझ नहीं आया बटन को छूकर सहायता ले सकती हैं।',
        explanation: 'अब पुधुमई पेण्ण योजना के बारे में जानना चाहती हैं या पात्रता जांचना चाहती हैं?',
        tapDemoBtn: '',
        tappedDoneBtn: '',
        permUnderstood: '',
        micDoneNotice: '',
        listenDoneNotice: '',
        allReadyTitle: 'बधाई हो! आप तैयार हैं!',
        allReadyDesc: 'अब पुधुमई पेण्ण योजना के बारे में जानना चाहती हैं या पात्रता जांचना चाहती हैं?',
      },
    ],
  };

  const stepsList = tutorialTexts[currentLanguage] || tutorialTexts.ta;
  const activeStepData = stepsList[currentStep - 1];

  useEffect(() => {
    setIsStepCompleted(false);
    playStepInstruction();
  }, [currentStep, currentLanguage]);

  const playStepInstruction = () => {
    setIsSpeakingInstruction(true);
    speechService.speakText(activeStepData.spoken, {
      lang: currentLanguage,
      onStart: () => setIsSpeakingInstruction(true),
      onEnd: () => setIsSpeakingInstruction(false),
      onError: () => setIsSpeakingInstruction(false),
    });
  };

  const handleNextStep = () => {
    speechService.stopSpeaking();
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onNavigate('scheme_info');
    }
  };

  const handlePrevStep = () => {
    speechService.stopSpeaking();
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestartTutorial = () => {
    speechService.stopSpeaking();
    setCurrentStep(1);
    setIsStepCompleted(false);
  };

  // Localized UI strings
  const labels: Record<Language, { replayVoice: string; siraguSpeaking: string; stepOf: string; back: string; next: string; talkToAi: string; restart: string; checkElig: string; learnScheme: string }> = {
    ta: {
      replayVoice: 'குரலை மீண்டும் கேட்க',
      siraguSpeaking: 'சிறகு AI பேசுகிறது...',
      stepOf: 'படி',
      back: 'முந்தைய படி',
      next: 'அடுத்த படி',
      talkToAi: 'AI உதவியாளரிடம் பேச',
      restart: 'மீண்டும் தொடங்கு',
      checkElig: '2. தகுதி சரிபார்க்க',
      learnScheme: '1. திட்டம் பற்றி அறிய',
    },
    ml: {
      replayVoice: 'ശബ്ദം വീണ്ടും കേൾക്കുക',
      siraguSpeaking: 'സിറഗു AI സംസാരിക്കുന്നു...',
      stepOf: 'ഘട്ടം',
      back: 'മുമ്പത്തെ ഘട്ടം',
      next: 'അടുത്ത ഘട്ടം',
      talkToAi: 'AI സഹായിയോട് സംസാരിക്കുക',
      restart: 'വീണ്ടും തുടങ്ങുക',
      checkElig: '2. യോഗ്യത പരിശോധിക്കുക',
      learnScheme: '1. പദ്ധതിയെക്കുറിച്ച് അറിയുക',
    },
    te: {
      replayVoice: 'వాయిస్ మళ్లీ వినండి',
      siraguSpeaking: 'సిరగు AI మాట్లాడుతోంది...',
      stepOf: 'దశ',
      back: 'మునుపటి దశ',
      next: 'తరువాతి దశ',
      talkToAi: 'AI సహాయకురాలితో మాట్లాడండి',
      restart: 'మళ్లీ ప్రారంభించండి',
      checkElig: '2. అర్హత చూడండి',
      learnScheme: '1. పథకం గురించి తెలుసుకోండి',
    },
    kn: {
      replayVoice: 'ಧ್ವನಿ ಮತ್ತೆ ಆಲಿಸಿ',
      siraguSpeaking: 'ಸಿರೆಗು AI ಮಾತನಾಡುತ್ತಿದೆ...',
      stepOf: 'ಹಂತ',
      back: 'ಹಿಂದಿನ ಹಂತ',
      next: 'ಮುಂದಿನ ಹಂತ',
      talkToAi: 'AI ಸಹಾಯಕರೊಂದಿಗೆ ಮಾತನಾಡಿ',
      restart: 'ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ',
      checkElig: '2. ಅರ್ಹತೆ ಪರೀಕ್ಷಿಸಿ',
      learnScheme: '1. ಯೋಜನೆ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ',
    },
    hi: {
      replayVoice: 'आवाज़ दोबारा सुनें',
      siraguSpeaking: 'सिरगु AI बोल रही है...',
      stepOf: 'चरण',
      back: 'पिछला चरण',
      next: 'अगला चरण',
      talkToAi: 'AI सहायिका से बोलें',
      restart: 'दोबारा शुरू करें',
      checkElig: '2. पात्रता जांचें',
      learnScheme: '1. योजना के बारे में जानें',
    },
  };

  const l = labels[currentLanguage] || labels.ta;

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      {/* Tutorial Progress Card */}
      <div className="bg-white border-2 border-[#F3EDFF] rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <SiraguLogo size={36} animate={isSpeakingInstruction} />
            <div>
              <span className="text-xs font-bold text-[#6D28D9] bg-[#F3EDFF] px-2.5 py-0.5 rounded-full border border-[#A78BFA]/30">
                SIRAGU AI
              </span>
              <h2
                className={`font-black text-[#1E293B] mt-0.5 ${
                  isLargeText ? 'text-2xl' : 'text-xl'
                }`}
              >
                {activeStepData.title}
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-[#6D28D9]">
              {`${l.stepOf} ${currentStep} / 5`}
            </span>
            <div className="w-24 bg-[#F3EDFF] h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-[#6D28D9] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Spoken Explanation Box */}
        <div className="bg-gradient-to-r from-[#F3EDFF] via-[#FAF9FF] to-[#F3EDFF] border border-[#A78BFA]/40 rounded-2xl p-4 sm:p-5 relative">
          <p
            className={`font-semibold text-[#1E293B] leading-relaxed ${
              isLargeText ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            }`}
          >
            "{activeStepData.spoken}"
          </p>

          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={playStepInstruction}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#6D28D9] font-bold text-xs hover:bg-[#F3EDFF] border border-[#A78BFA]/30 shadow-2xs transition-all active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-[#6D28D9]" />
              <span>{l.replayVoice}</span>
            </button>

            {isSpeakingInstruction && (
              <span className="text-xs font-semibold text-[#6D28D9] animate-pulse">
                {l.siraguSpeaking}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Demonstration Area Based on Current Step */}
      <div className="bg-white border-2 border-[#F3EDFF] rounded-3xl p-6 sm:p-8 shadow-sm text-center relative overflow-hidden">
        {/* Step 1: Learning to Tap */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <p className="text-sm font-medium text-[#64748B]">
              {activeStepData.explanation}
            </p>

            <div className="relative inline-block py-6">
              {!isStepCompleted && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[#6D28D9] animate-hand-point flex flex-col items-center">
                  <Hand className="w-9 h-9 fill-current rotate-180 drop-shadow-md" />
                  <span className="text-xs font-black bg-[#6D28D9] text-white px-2 py-0.5 rounded-full mt-1">
                    👇
                  </span>
                </div>
              )}

              <button
                onClick={() => {
                  setIsStepCompleted(true);
                  speechService.speakText(
                    currentLanguage === 'ta'
                      ? 'அருமை! நீங்கள் சரியாக தொட்டுவிட்டீர்கள்.'
                      : currentLanguage === 'ml'
                      ? 'നന്നായി ചെയ്തു!'
                      : currentLanguage === 'te'
                      ? 'చాలా బాగా చేశారు!'
                      : currentLanguage === 'kn'
                      ? 'ಉತ್ತಮವಾಗಿ ಮಾಡಿದ್ದೀರಿ!'
                      : 'बहुत बढ़िया!',
                    { lang: currentLanguage }
                  );
                }}
                className={`px-8 py-5 rounded-2xl font-black text-base sm:text-lg transition-all active:scale-95 shadow-md flex items-center gap-3 ${
                  isStepCompleted
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-[#6D28D9]/30 hover:scale-105'
                }`}
              >
                {isStepCompleted ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-white" />
                    <span>{activeStepData.tappedDoneBtn}</span>
                  </>
                ) : (
                  <span>{activeStepData.tapDemoBtn}</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Microphone Permission */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-[#64748B]">
              {activeStepData.explanation}
            </p>

            <div className="max-w-md mx-auto bg-[#FAF9FF] border-2 border-dashed border-[#A78BFA] rounded-2xl p-4 text-left shadow-2xs">
              <div className="flex items-center gap-2 mb-2 text-[#6D28D9] font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Microphone Access Prompt</span>
              </div>
              <p className="text-xs text-[#1E293B] font-semibold mb-3">
                siragu-ai wants to use your microphone
              </p>
              <div className="flex justify-end gap-2">
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] bg-white border border-slate-200">
                  Block
                </span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 border border-emerald-700 shadow-xs flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Allow</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsStepCompleted(true);
              }}
              className="mt-3 px-6 py-3.5 rounded-xl font-bold text-sm bg-[#6D28D9] text-white hover:bg-[#5B21B6] transition-all active:scale-95 shadow-xs"
            >
              {activeStepData.permUnderstood}
            </button>
          </div>
        )}

        {/* Step 3: Tapping Mic & Speaking */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-[#64748B]">
              {activeStepData.explanation}
            </p>

            <div className="flex flex-col items-center justify-center py-4">
              <button
                onClick={() => {
                  setIsStepCompleted(true);
                  speechService.speakText('OK', { lang: currentLanguage });
                }}
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-lg active:scale-95 ${
                  isStepCompleted
                    ? 'bg-red-600 text-white animate-pulse-ring'
                    : 'bg-[#6D28D9] text-white hover:scale-105'
                }`}
              >
                <Mic className="w-10 h-10 mb-1" />
                <span className="text-[11px] font-bold">
                  {isStepCompleted ? '●' : 'Mic'}
                </span>
              </button>

              <p className="mt-3 text-xs font-bold text-[#6D28D9]">
                {isStepCompleted ? activeStepData.micDoneNotice : '🎤'}
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Replaying Answers */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-[#64748B]">
              {activeStepData.explanation}
            </p>

            <div className="max-w-md mx-auto bg-[#F3EDFF]/70 border border-[#A78BFA]/50 rounded-2xl p-4 text-left shadow-2xs space-y-2">
              <span className="text-[11px] font-bold text-[#6D28D9] block">
                SIRAGU AI:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#1E293B]">
                "₹1,000 / Month (DBT)"
              </p>

              <button
                onClick={() => {
                  setIsStepCompleted(true);
                  speechService.speakText('₹1,000', { lang: currentLanguage });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#6D28D9] text-white hover:bg-[#5B21B6] transition-all shadow-xs active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>{activeStepData.listenDoneNotice}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Wrap up */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#1E293B]">
                {activeStepData.allReadyTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto font-medium">
                {activeStepData.allReadyDesc}
              </p>
            </div>

            {/* Smart Next Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
              <button
                onClick={() => onNavigate('scheme_info')}
                className="p-4 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold text-xs sm:text-sm text-left flex items-center justify-between shadow-sm active:scale-95 transition-all"
              >
                <span>{l.learnScheme}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('eligibility')}
                className="p-4 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-xs sm:text-sm text-left flex items-center justify-between shadow-sm active:scale-95 transition-all"
              >
                <span>{l.checkElig}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Navigation Bar for Tutorial */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#1E293B] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{l.back}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRestartTutorial}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-[#6D28D9] hover:bg-[#F3EDFF] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{l.restart}</span>
            </button>

            {currentStep < 5 ? (
              <button
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-xs transition-all active:scale-95"
              >
                <span>{l.next}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('assistant')}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-xs transition-all active:scale-95"
              >
                <span>{l.talkToAi}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
