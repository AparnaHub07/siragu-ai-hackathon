import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Volume2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { speechService } from '../services/speech';
import { Language } from '../types/scheme';

interface EligibilityCheckerViewProps {
  currentLanguage: Language;
  onGoToSteps: () => void;
  onGoToAssistant: (q: string) => void;
  isLargeText?: boolean;
}

export const EligibilityCheckerView: React.FC<EligibilityCheckerViewProps> = ({
  currentLanguage,
  onGoToSteps,
  onGoToAssistant,
  isLargeText = false,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Array<boolean | null>>([null, null, null]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const questionsData: Record<
    Language,
    Array<{ badge: string; title: string; spoken: string; help: string }>
  > = {
    ta: [
      {
        badge: 'கேள்வி 1 / 3',
        title: 'நீங்கள் 6 முதல் 12 ஆம் வகுப்பு வரை தமிழ்நாட்டில் உள்ள அரசுப் பள்ளியில் படித்தீர்களா?',
        spoken: 'முதல் கேள்வி: நீங்கள் 6 முதல் 12 ஆம் வகுப்பு வரை தமிழ்நாட்டில் உள்ள அரசுப் பள்ளியில் தொடர்ந்து படித்தீர்களா?',
        help: 'மாநகராட்சி, நகராட்சி, ஆதிதிராவிடர், பழங்குடியினர் மற்றும் அரசுப் பள்ளிகள் இதில் அடங்கும்.',
      },
      {
        badge: 'கேள்வி 2 / 3',
        title: 'தற்போது அங்கீகரிக்கப்பட்ட கல்லூரி, பாலிடெக்னிக் அல்லது தொழிற்கல்வி பயில்கிறீர்களா?',
        spoken: 'இரண்டாவது கேள்வி: தற்போது அங்கீகரிக்கப்பட்ட கல்லூரி, பாலிடெக்னிக் அல்லது தொழிற்கல்வி பயில்கிறீர்களா?',
        help: 'இளங்கலை பட்டப்படிப்பு (B.A, B.Sc, B.Com, B.E) அல்லது தொழிற்கல்வி இதில் அடங்கும்.',
      },
      {
        badge: 'கேள்வி 3 / 3',
        title: 'உங்கள் பெயரில் தனியாக தனிநபர் வங்கிக் கணக்கு உள்ளதா?',
        spoken: 'மூன்றாவது கேள்வி: உங்கள் சொந்த பெயரில் தனியாக ஒரு சேமிப்புக் கணக்கு உள்ளதா?',
        help: 'மாணவியின் சொந்த சேமிப்புக் கணக்கு மட்டுமே ஏற்கப்படும். பெற்றோர் கணக்கு ஏற்கப்படாது.',
      },
    ],
    ml: [
      {
        badge: 'ചോദ്യം 1 / 3',
        title: 'നിങ്ങൾ 6 മുതൽ 12 വരെ തമിഴ്നാട് സർക്കാർ സ്കൂളിൽ പഠിച്ചവരാണോ?',
        spoken: 'ഒന്നാമത്തെ ചോദ്യം: നിങ്ങൾ 6 മുതൽ 12 വരെ തമിഴ്നാട്ടിലെ സർക്കാർ സ്കൂളിൽ പഠിച്ചവരാണോ?',
        help: 'സർക്കാർ, കോർപ്പറേഷൻ, മുനിസിപ്പൽ സ്കൂളുകൾ ഇതിൽ ഉൾപ്പെടുന്നു.',
      },
      {
        badge: 'ചോദ്യം 2 / 3',
        title: 'നിലവിൽ അംഗീകൃത കോളേജിലോ പോളിടെക്നിക്കിലോ ഐടിഐയിലോ പഠിക്കുകയാണോ?',
        spoken: 'രണ്ടാമത്തെ ചോദ്യം: നിലവിൽ അംഗീകൃത കോളേജിലോ പോളിടെക്നിക്കിലോ പഠിക്കുകയാണോ?',
        help: 'ബിരുദ കോഴ്സുകൾ (B.A, B.Sc, B.Com, B.E) അല്ലെങ്കിൽ ഡിപ്ലോമ ഇതിൽ ഉൾപ്പെടുന്നു.',
      },
      {
        badge: 'ചോദ്യം 3 / 3',
        title: 'നിങ്ങളുടെ സ്വന്തം പേരിൽ വ്യക്തിഗത ബാങ്ക് അക്കൗണ്ട് ഉണ്ടോ?',
        spoken: 'മൂന്നാമത്തെ ചോദ്യം: നിങ്ങളുടെ സ്വന്തം പേരിൽ ബാങ്ക് അക്കൗണ്ട് ഉണ്ടോ?',
        help: 'വിദ്യാർത്ഥിനിയുടെ സ്വന്തം അക്കൗണ്ട് മാത്രമേ അനുവദിക്കൂ.',
      },
    ],
    te: [
      {
        badge: 'ప్రశ్న 1 / 3',
        title: 'మీరు 6 నుండి 12వ తరగతి వరకు తమిళనాడు ప్రభుత్వ పాఠశాలలో చదివారా?',
        spoken: 'మొదటి ప్రశ్న: మీరు 6 నుండి 12 వరకు తమిళనాడు ప్రభుత్వ పాఠశాలలో చదివారా?',
        help: 'ప్రభుత్వ, మున్సిపల్ మరియు సంక్షేమ పాఠశాలలు ఇందులో చేర్చబడ్డాయి.',
      },
      {
        badge: 'ప్రశ్న 2 / 3',
        title: 'ప్రస్తుతం గుర్తింపు పొందిన కళాశాల లేదా పాలిటెక్నిక్‌లో చదువుతున్నారా?',
        spoken: 'రెండవ ప్రశ్న: ప్రస్తుతం గుర్తింపు పొందిన కళాశాల లేదా పాలిటెక్నిక్‌లో చదువుతున్నారా?',
        help: 'డిగ్రీ కోర్సులు (B.A, B.Sc, B.Com, B.E) లేదా డిప్లొమా ఇందులో ఉంటాయి.',
      },
      {
        badge: 'ప్రశ్న 3 / 3',
        title: 'మీ స్వంత పేరు మీద ప్రత్యేక బ్యాంక్ ఖాతా ఉందా?',
        spoken: 'మూడవ ప్రశ్న: మీ స్వంత పేరు మీద బ్యాంక్ ఖాతా ఉందా?',
        help: 'విద్యార్థిని సొంత ఖాతా మాత్రమే చెల్లుతుంది. తల్లిదండ్రుల ఖాతా చెల్లదు.',
      },
    ],
    kn: [
      {
        badge: 'ಪ್ರಶ್ನೆ 1 / 3',
        title: 'ನೀವು 6 ರಿಂದ 12 ನೇ ತರಗತಿಯವರೆಗೆ ತಮಿಳುನಾಡು ಸರಕಾರಿ ಶಾಲೆಯಲ್ಲಿ ಓದಿದ್ದೀರಾ?',
        spoken: 'ಮೊದಲ ಪ್ರಶ್ನೆ: ನೀವು 6 ರಿಂದ 12 ನೇ ತರಗತಿಯವರೆಗೆ ತಮಿಳುನಾಡು ಸರಕಾರಿ ಶಾಲೆಯಲ್ಲಿ ಓದಿದ್ದೀರಾ?',
        help: 'ಸರಕಾರಿ, ಪುರಸಭೆ ಹಾಗೂ ಕಲ್ಯಾಣ ಶಾಲೆಗಳು ಇದರಲ್ಲಿ ಸೇರಿವೆ.',
      },
      {
        badge: 'ಪ್ರಶ್ನೆ 2 / 3',
        title: 'ಪ್ರಸ್ತುತ ಮಾನ್ಯತೆ ಪಡೆದ ಕಾಲೇಜು, ಪಾಲಿಟೆಕ್ನಿಕ್ ಅಥವಾ ಐಟಿಐನಲ್ಲಿ ಕಲಿಯುತ್ತಿದ್ದೀರಾ?',
        spoken: 'ಎರಡನೇ ಪ್ರಶ್ನೆ: ಪ್ರಸ್ತುತ ಮಾನ್ಯತೆ ಪಡೆದ ಕಾಲೇಜಿನಲ್ಲಿ ಕಲಿಯುತ್ತಿದ್ದೀರಾ?',
        help: 'ಪದವಿ ಕೋರ್ಸ್‌ಗಳು (B.A, B.Sc, B.Com, B.E) ಅಥವಾ ಡಿಪ್ಲೋಮಾ ಸೇರಿವೆ.',
      },
      {
        badge: 'ಪ್ರಶ್ನೆ 3 / 3',
        title: 'ನಿಮ್ಮ ಸ್ವಂತ ಹೆಸರಿನಲ್ಲಿ ಪ್ರತ್ಯೇಕ ಬ್ಯಾಂಕ್ ಖಾತೆ ಇದೆಯೇ?',
        spoken: 'ಮೂರನೇ ಪ್ರಶ್ನೆ: ನಿಮ್ಮ ಸ್ವಂತ ಹೆಸರಿನಲ್ಲಿ ಪ್ರತ್ಯೇಕ ಬ್ಯಾಂಕ್ ಖಾತೆ ಇದೆಯೇ?',
        help: 'ವಿದ್ಯಾರ್ಥಿನಿಯ ಸ್ವಂತ ಖಾತೆ ಮಾತ್ರ ಅನ್ವಯಿಸುತ್ತದೆ.',
      },
    ],
    hi: [
      {
        badge: 'प्रश्न 1 / 3',
        title: 'क्या आपने कक्षा 6 से 12 तक तमिलनाडु के सरकारी स्कूल में पढ़ाई की है?',
        spoken: 'पहला सवाल: क्या आपने कक्षा 6 से 12 तक तमिलनाडु के सरकारी स्कूल में पढ़ाई की है?',
        help: 'सरकारी, नगर निगम तथा कल्याणकारी स्कूल इसमें शामिल हैं।',
      },
      {
        badge: 'प्रश्न 2 / 3',
        title: 'क्या आप वर्तमान में किसी मान्यता प्राप्त कॉलेज या पॉलिटेक्निक में पढ़ रही हैं?',
        spoken: 'दूसरा सवाल: क्या आप वर्तमान में किसी मान्यता प्राप्त कॉलेज या पॉलिटेक्निक में पढ़ रही हैं?',
        help: 'स्नातक कोर्स (B.A, B.Sc, B.Com, B.E) या डिप्लोमा इसमें शामिल हैं।',
      },
      {
        badge: 'प्रश्न 3 / 3',
        title: 'क्या आपके अपने नाम पर व्यक्तिगत बैंक खाता है?',
        spoken: 'तीसरा सवाल: क्या आपके अपने नाम पर अलग बैंक खाता है?',
        help: 'केवल छात्रा का अपना खाता मान्य होगा। माता-पिता का खाता नहीं चलेगा।',
      },
    ],
  };

  const currentQuestions = questionsData[currentLanguage] || questionsData.ta;
  const currentQ = currentQuestions[currentQuestionIndex];

  useEffect(() => {
    if (!isCompleted) {
      speakCurrentQuestion();
    }
  }, [currentQuestionIndex, isCompleted, currentLanguage]);

  const speakCurrentQuestion = () => {
    setIsSpeaking(true);
    speechService.speakText(currentQ.spoken, {
      lang: currentLanguage,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleAnswer = (val: boolean | null) => {
    speechService.stopSpeaking();
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = val;
    setAnswers(newAnswers);

    if (currentQuestionIndex < 2) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      speakResult(newAnswers);
    }
  };

  const handleBack = () => {
    speechService.stopSpeaking();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    speechService.stopSpeaking();
    setAnswers([null, null, null]);
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
  };

  const speakResult = (finalAnswers: Array<boolean | null>) => {
    const isGovtSchool = finalAnswers[0] === true;
    const isCollegeEnrolled = finalAnswers[1] === true;

    const resultAudios: Record<Language, { success: string; fail: string }> = {
      ta: {
        success: 'வாழ்த்துகள்! நீங்கள் புதுமைப் பெண் திட்டத்திற்கு தகுதியானவராகத் தெரிகிறீர்கள். கல்லூரி ஒருங்கிணைப்பாளரிடம் விண்ணப்பிக்கவும்.',
        fail: 'தகவல்: புதுமைப் பெண் திட்டம் 6 முதல் 12 வரை அரசுப் பள்ளியில் படித்த மாணவிகளுக்கு மட்டுமே பொருந்தும்.',
      },
      ml: {
        success: 'അഭിനന്ദനങ്ങൾ! നിങ്ങൾ പുതുമൈ പെൺ പദ്ധതിക്ക് അർഹതയുള്ളവരായി കാണപ്പെടുന്നു. കോളേജ് നോഡൽ ഓഫീസറെ സമീപിക്കുക.',
        fail: 'വിവരം: 6 മുതൽ 12 വരെ സർക്കാർ സ്കൂളുകളിൽ പഠിച്ചവർക്ക് മാത്രമാണ് ഈ പദ്ധതി.',
      },
      te: {
        success: 'అభినందనలు! ప్రాథమిక పరిశీలన ప్రకారం మీరు పుదుమై పెణ్ పథకానికి అర్హులు. కాలేజ్ నోడల్ అధికారిని సంప్రదించండి.',
        fail: 'సమాచారం: ప్రభుత్వ పాఠశాలలో చదివిన వారికి మాత్రమే ఈ పథకం వర్తిస్తుంది.',
      },
      kn: {
        success: 'ಅಭಿನಂದನೆಗಳು! ಪ್ರಾಥಮಿಕವಾಗಿ ನೀವು ಪುದುಮೈ ಪೆಣ್ ಯೋಜನೆಗೆ ಅರ್ಹರಾಗಿದ್ದೀರಿ. ಕಾಲೇಜು ನೋಡಲ್ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
        fail: 'ಮಾಹಿತಿ: ಸರಕಾರಿ ಶಾಲೆಯಲ್ಲಿ ಓದಿದ ವಿದ್ಯಾರ್ಥಿನಿಯರಿಗೆ ಮಾತ್ರ ಈ ಯೋಜನೆ ಅನ್ವಯಿಸುತ್ತದೆ.',
      },
      hi: {
        success: 'बधाई हो! आप पुधुमई पेण्ण योजना के लिए पात्र प्रतीत होती हैं। कॉलेज नोडल अधिकारी से संपर्क करें।',
        fail: 'सूचना: यह योजना केवल सरकारी स्कूल में 6 से 12 तक पढ़ी छात्राओं के लिए ही है।',
      },
    };

    const dict = resultAudios[currentLanguage] || resultAudios.ta;
    const text = isGovtSchool && isCollegeEnrolled ? dict.success : dict.fail;
    speechService.speakText(text, { lang: currentLanguage });
  };

  const isEligible = answers[0] === true && answers[1] === true;
  const isBankPending = answers[2] !== true;

  // Localized Button Labels
  const uiLabels: Record<
    Language,
    {
      yes: string;
      no: string;
      notSure: string;
      repeatQ: string;
      prevQ: string;
      prelimTitle: string;
      successHeading: string;
      failHeading: string;
      successDesc: string;
      failDesc: string;
      bankWarning: string;
      approvalNote: string;
      altScholarshipsNote: string;
      howToApplyBtn: string;
      checkAgainBtn: string;
      askSiraguBtn: string;
    }
  > = {
    ta: {
      yes: 'ஆம் (Yes)',
      no: 'இல்லை (No)',
      notSure: 'தெரியவில்லை',
      repeatQ: 'மீண்டும் கேள்',
      prevQ: 'முந்தைய கேள்வி',
      prelimTitle: 'சுய தகுதி சோதனை (Preliminary Check)',
      successHeading: '🎉 வாழ்த்துகள்! நீங்கள் தகுதியானவர்!',
      failHeading: 'விதிமுறைகள் குறித்த விளக்கம்',
      successDesc: 'நீங்கள் 6 முதல் 12 வரை அரசுப் பள்ளியில் படித்து தற்போது உயர்கல்வி பயில்வதால் மாதம் ₹1,000 உதவித்தொகை பெற தகுதி உடையவர்.',
      failDesc: 'தமிழ்நாடு அரசின் விதிமுறையின்படி இத்திட்டம் 6 முதல் 12 வரை அரசுப் பள்ளிகளில் பயின்ற மாணவிகளுக்கு மட்டுமே வழங்கப்படுகிறது.',
      bankWarning: '⚠️ உதவித்தொகை உங்கள் சொந்த வங்கிக் கணக்கிற்கு மட்டுமே வரும். உடனே தனி சேமிப்புக் கணக்கு தொடங்கவும்.',
      approvalNote: '* கல்லூரி ஆவணங்களை சரிபார்த்த பிறகே அதிகாரப்பூர்வ உதவித்தொகை வழங்கப்படும்.',
      altScholarshipsNote: 'பிற அரசு கல்வி உதவித்தொகைகள் குறித்து உங்கள் கல்லூரி அலுவலகத்தில் கேட்டுத் தெரிந்துகொள்ளலாம்.',
      howToApplyBtn: 'விண்ணப்பிக்கும் முறையைப் பார்க்க',
      checkAgainBtn: 'மீண்டும் சோதிக்க',
      askSiraguBtn: 'சிறகுவிடம் கேட்க',
    },
    ml: {
      yes: 'അതെ (Yes)',
      no: 'അല്ല (No)',
      notSure: 'അറിയില്ല',
      repeatQ: 'വീണ്ടും കേൾക്കുക',
      prevQ: 'മുമ്പത്തെ ചോദ്യം',
      prelimTitle: 'സ്വയം യോഗ്യതാ പരിശോധന',
      successHeading: '🎉 അഭിനന്ദനങ്ങൾ! നിങ്ങൾ അർഹരാണ്!',
      failHeading: 'നിബന്ധനകൾ സംബന്ധിച്ച വിവരം',
      successDesc: 'സർക്കാർ സ്കൂളിൽ പഠിച്ച് കോളേജിൽ ചേർന്നതിനാൽ പ്രതിമാസം ₹1,000 സഹായധനം ലഭിക്കാൻ നിങ്ങൾ അർഹയാണ്.',
      failDesc: 'തമിഴ്നാട് സർക്കാരിൻ്റെ നിയമപ്രകാരം സർക്കാർ സ്കൂളിൽ പഠിച്ചവർക്ക് മാത്രമാണ് ഇത് ബാധകം.',
      bankWarning: '⚠️ പണം നിങ്ങളുടെ സ്വന്തം അക്കൗണ്ടിലേക്ക് മാത്രമേ ലഭിക്കൂ. ഉടൻ അക്കൗണ്ട് എടുക്കുക.',
      approvalNote: '* രേഖകൾ പരിശോധിച്ച ശേഷമായിരിക്കും ഔദ്യോഗിക അനുമതി.',
      altScholarshipsNote: 'മറ്റ് സ്കോളർഷിപ്പുകളെക്കുറിച്ച് കോളേജ് ഓഫീസിൽ അന്വേഷിക്കാം.',
      howToApplyBtn: 'അപേക്ഷാരീതി കാണുക',
      checkAgainBtn: 'വീണ്ടും പരിശോധിക്കുക',
      askSiraguBtn: 'സിറഗുവിനോട് ചോദിക്കുക',
    },
    te: {
      yes: 'అవును (Yes)',
      no: 'కాదు (No)',
      notSure: 'తెలియదు',
      repeatQ: 'మళ్లీ వినండి',
      prevQ: 'మునుపటి ప్రశ్న',
      prelimTitle: 'అర్హత స్వయం తనిఖీ',
      successHeading: '🎉 అభినందనలు! మీరు అర్హులు!',
      failHeading: 'నిబంధనల వివరాలు',
      successDesc: 'ప్రభుత్వ పాఠశాలలో చదివి కళాశాలలో చేరినందున నెలకు ₹1,000 పొందడానికి మీరు అర్హులు.',
      failDesc: 'తమిళనాడు ప్రభుత్వ నిబంధనల ప్రకారం ప్రభుత్వ పాఠశాల విద్యార్థినులకు మాత్రమే ఇది వర్తిస్తుంది.',
      bankWarning: '⚠️ సహాయం మీ స్వంత ఖాతాలోకే జమ అవుతుంది. వెంటనే ప్రత్యేక ఖాతా తెరవండి.',
      approvalNote: '* కాలేజీలో పత్రాలు ధృవీకరించిన తర్వాతే అధికారిక మంజూరు లభిస్తుంది.',
      altScholarshipsNote: 'ఇతర ప్రభుత్వ స్కాలర్‌షిప్‌ల గురించి కాలేజీ కార్యాలయంలో తెలుసుకోవచ్చు.',
      howToApplyBtn: 'దరఖాస్తు విధానం చూడండి',
      checkAgainBtn: 'మళ్లీ తనిఖీ చేయండి',
      askSiraguBtn: 'సిరగును అడగండి',
    },
    kn: {
      yes: 'ಹೌದು (Yes)',
      no: 'ಇಲ್ಲ (No)',
      notSure: 'ಗೊತ್ತಿಲ್ಲ',
      repeatQ: 'ಮತ್ತೆ ಆಲಿಸಿ',
      prevQ: 'ಹಿಂದಿನ ಪ್ರಶ್ನೆ',
      prelimTitle: 'ಸ್ವಯಂ ಅರ್ಹತೆ ಪರೀಕ್ಷೆ',
      successHeading: '🎉 ಅಭಿನಂದನೆಗಳು! ನೀವು ಅರ್ಹರು!',
      failHeading: 'ನಿಯಮಾವಳಿಗಳ ಮಾಹಿತಿ',
      successDesc: 'ಸರಕಾರಿ ಶಾಲೆಯಲ್ಲಿ ಓದಿ ಕಾಲೇಜಿಗೆ ಸೇರಿದ ಕಾರಣ ತಿಂಗಳಿಗೆ ₹1,000 ಪಡೆಯಲು ನೀವು ಅರ್ಹರಾಗಿದ್ದೀರಿ.',
      failDesc: 'ತಮಿಳುನಾಡು ಸರಕಾರದ ನಿಯಮದಂತೆ ಸರಕಾರಿ ಶಾಲಾ ವಿದ್ಯಾರ್ಥಿನಿಯರಿಗೆ ಮಾತ್ರ ಈ ಯೋಜನೆ ಅನ್ವಯಿಸುತ್ತದೆ.',
      bankWarning: '⚠️ ಹಣ ನಿಮ್ಮ ಸ್ವಂತ ಖಾತೆಗೆ ಮಾತ್ರ ಬರುತ್ತದೆ. ತಕ್ಷಣ ಪ್ರತ್ಯೇಕ ಖಾತೆ ತೆರೆಯಿರಿ.',
      approvalNote: '* ದಾಖಲೆಗಳ ಪರಿಶೀಲನೆಯ ನಂತರವೇ ಅಧಿಕೃತ ಮಂಜೂರಾತಿ ಸಿಗುತ್ತದೆ.',
      altScholarshipsNote: 'ಇತರ ವಿದ್ಯಾರ್ಥಿವೇತನಗಳ ಬಗ್ಗೆ ಕಾಲೇಜು ಕಚೇರಿಯಲ್ಲಿ ವಿಚಾರಿಸಬಹುದು.',
      howToApplyBtn: 'ಅರ್ಜಿ ವಿಧಾನ ನೋಡಿ',
      checkAgainBtn: 'ಮತ್ತೆ ಪರೀಕ್ಷಿಸಿ',
      askSiraguBtn: 'ಸಿರೆಗು ಜೊತೆ ಕೇಳಿ',
    },
    hi: {
      yes: 'हाँ (Yes)',
      no: 'नहीं (No)',
      notSure: 'पता नहीं',
      repeatQ: 'दोबारा सुनें',
      prevQ: 'पिछला सवाल',
      prelimTitle: 'स्वयं पात्रता जांच',
      successHeading: '🎉 बधाई हो! आप पात्र हैं!',
      failHeading: 'योजना के नियम',
      successDesc: 'सरकारी स्कूल से पढ़कर कॉलेज में प्रवेश लेने के कारण आप हर महीने ₹1,000 की पात्र हैं।',
      failDesc: 'तमिलनाडु सरकार के नियमों के अनुसार यह केवल सरकारी स्कूल की छात्राओं के लिए है।',
      bankWarning: '⚠️ राशि केवल आपके व्यक्तिगत बैंक खाते में आएगी। तुरंत अलग खाता खुलवाएं।',
      approvalNote: '* कॉलेज द्वारा दस्तावेजों के सत्यापन के बाद ही आधिकारिक मंजूरी मिलेगी।',
      altScholarshipsNote: 'अन्य छात्रवृत्तियों के बारे में कॉलेज कार्यालय से जानकारी ले सकती हैं।',
      howToApplyBtn: 'आवेदन प्रक्रिया देखें',
      checkAgainBtn: 'दोबारा जांचें',
      askSiraguBtn: 'सिरगु से पूछें',
    },
  };

  const ui = uiLabels[currentLanguage] || uiLabels.ta;

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left">
      {/* Intro Header */}
      <div className="bg-white border-2 border-[#F3EDFF] rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F3EDFF] text-[#6D28D9] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#6D28D9] bg-[#F3EDFF] px-2.5 py-0.5 rounded-full border border-[#A78BFA]/30">
              {ui.prelimTitle}
            </span>
          </div>

          {!isCompleted && (
            <span className="text-xs font-bold text-[#6D28D9]">
              {currentQ.badge}
            </span>
          )}
        </div>

        <h2
          className={`font-black text-[#1E293B] ${
            isLargeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
          }`}
        >
          ₹1,000 / Month
        </h2>

        {/* Progress Bar */}
        {!isCompleted && (
          <div className="w-full bg-[#F3EDFF] h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-[#6D28D9] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / 3) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Active Question Box */}
      {!isCompleted ? (
        <div className="bg-white border-2 border-[#F3EDFF] rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-start justify-between gap-3">
            <span className="text-xs font-black text-[#6D28D9] bg-[#F3EDFF] px-2.5 py-1 rounded-lg">
              {currentQ.badge}
            </span>

            <button
              onClick={speakCurrentQuestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF9FF] text-[#6D28D9] border border-[#A78BFA]/30 hover:bg-[#F3EDFF] transition-all"
            >
              <Volume2 className="w-4 h-4 text-[#6D28D9]" />
              <span>{ui.repeatQ}</span>
            </button>
          </div>

          <h3
            className={`font-black text-[#1E293B] leading-snug ${
              isLargeText ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
            }`}
          >
            {currentQ.title}
          </h3>

          <p className="text-xs text-[#64748B] font-medium bg-[#FAF9FF] p-3 rounded-xl border border-[#F3EDFF]">
            💡 {currentQ.help}
          </p>

          {/* 3 Large Action Buttons: Yes, No, Not Sure */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => handleAnswer(true)}
              className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{ui.yes}</span>
            </button>

            <button
              onClick={() => handleAnswer(false)}
              className="p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <XCircle className="w-5 h-5" />
              <span>{ui.no}</span>
            </button>

            <button
              onClick={() => handleAnswer(null)}
              className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <HelpCircle className="w-5 h-5" />
              <span>{ui.notSure}</span>
            </button>
          </div>

          {currentQuestionIndex > 0 && (
            <div className="pt-2">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#1E293B]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{ui.prevQ}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Preliminary Eligibility Result Summary */
        <div
          className={`rounded-3xl p-6 sm:p-7 border-2 shadow-sm text-left transition-all ${
            isEligible
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              : 'bg-amber-50/90 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-start gap-3.5">
            {isEligible ? (
              <CheckCircle2 className="w-9 h-9 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-9 h-9 text-amber-600 shrink-0 mt-0.5" />
            )}

            <div className="space-y-3 flex-1">
              <div>
                <h3
                  className={`font-black tracking-tight ${
                    isLargeText ? 'text-2xl' : 'text-xl'
                  }`}
                >
                  {isEligible ? ui.successHeading : ui.failHeading}
                </h3>
              </div>

              {isEligible ? (
                <div className="space-y-2 text-xs sm:text-sm font-medium leading-relaxed">
                  <p>{ui.successDesc}</p>
                  {isBankPending && (
                    <div className="bg-amber-100/90 border border-amber-300 rounded-xl p-3 text-amber-950 text-xs">
                      {ui.bankWarning}
                    </div>
                  )}
                  <p className="text-xs text-emerald-800 italic">
                    {ui.approvalNote}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-xs sm:text-sm font-medium leading-relaxed">
                  <p>{ui.failDesc}</p>
                  <p className="text-xs">{ui.altScholarshipsNote}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                {isEligible && (
                  <button
                    onClick={onGoToSteps}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-xs transition-all active:scale-95"
                  >
                    <span>{ui.howToApplyBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white text-[#1E293B] border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{ui.checkAgainBtn}</span>
                </button>

                <button
                  onClick={() => onGoToAssistant('Eligibility')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#0D9488] text-white hover:bg-[#0F766E] transition-all shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{ui.askSiraguBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
