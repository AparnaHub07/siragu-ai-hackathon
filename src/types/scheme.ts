export type Language = 'ta' | 'ml' | 'te' | 'kn' | 'hi';

export interface LanguageMeta {
  code: Language;
  nameNative: string;
  nameDisplay: string;
  locale: string;
  pronounceText: string;
  welcomeSnippet: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: 'ta',
    nameNative: 'தமிழ்',
    nameDisplay: 'தமிழ் (Tamil)',
    locale: 'ta-IN',
    pronounceText: 'தமிழ்',
    welcomeSnippet: 'வணக்கம், நான் உங்கள் சிறகு AI.',
  },
  {
    code: 'ml',
    nameNative: 'മലയാളം',
    nameDisplay: 'മലയാളം (Malayalam)',
    locale: 'ml-IN',
    pronounceText: 'മലയാളം',
    welcomeSnippet: 'നമസ്കാരം, ഞാൻ നിങ്ങളുടെ സിറഗു AI.',
  },
  {
    code: 'te',
    nameNative: 'తెలుగు',
    nameDisplay: 'తెలుగు (Telugu)',
    locale: 'te-IN',
    pronounceText: 'తెలుగు',
    welcomeSnippet: 'నమస్కారం, నేను మీ సిరగు AI.',
  },
  {
    code: 'kn',
    nameNative: 'ಕನ್ನಡ',
    nameDisplay: 'ಕನ್ನಡ (Kannada)',
    locale: 'kn-IN',
    pronounceText: 'ಕನ್ನಡ',
    welcomeSnippet: 'ನಮಸ್ಕಾರ, ನಾನು ನಿಮ್ಮ ಸಿರೆಗು AI.',
  },
  {
    code: 'hi',
    nameNative: 'हिन्दी',
    nameDisplay: 'हिन्दी (Hindi)',
    locale: 'hi-IN',
    pronounceText: 'हिन्दी',
    welcomeSnippet: 'नमस्ते, मैं आपकी सिरगु AI हूँ।',
  },
];

export type ActivePage =
  | 'welcome'
  | 'tutorial'
  | 'assistant'
  | 'scheme_info'
  | 'eligibility'
  | 'documents'
  | 'application_steps'
  | 'support';

// Backwards compatibility alias
export type ActiveTab = ActivePage;

export interface SchemeBenefit {
  amount_per_month: string;
  amount_in_words: Record<Language, string>;
  payment_mode: Record<Language, string>;
  duration: Record<Language, string>;
  is_verified: boolean;
}

export interface EligibilityCriterion {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  is_verified: boolean;
}

export interface RequiredDocument {
  id: string;
  name: Record<Language, string>;
  how_to_get: Record<Language, string>;
  is_mandatory: boolean;
  is_verified: boolean;
}

export interface ApplicationStep {
  step_number: number;
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
}

export interface FAQItem {
  question: Record<Language, string>;
  answer: Record<Language, string>;
}

export interface SchemeKnowledge {
  scheme_name: Record<Language, string>;
  short_name: Record<Language, string>;
  department: Record<Language, string>;
  official_portal_url: string;
  disclaimer: Record<Language, string>;
  benefit_details: SchemeBenefit;
  eligibility_criteria: EligibilityCriterion[];
  ineligible_conditions: Record<Language, string[]>;
  required_documents: RequiredDocument[];
  application_steps: ApplicationStep[];
  faq_list: FAQItem[];
  official_helplines: {
    women_helpline: string;
    cm_helpline: string;
    official_website: string;
  };
  unverified_placeholders: {
    current_cycle_deadline: Record<Language, string>;
    district_nodal_directory: Record<Language, string>;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  isVoiceInput?: boolean;
}

export interface TutorialStep {
  id: number;
  title: Record<Language, string>;
  spoken: Record<Language, string>;
  action_label: Record<Language, string>;
  explanation: Record<Language, string>;
  highlight_target: 'button' | 'mic_permission' | 'mic_tap' | 'listen' | 'help';
}
