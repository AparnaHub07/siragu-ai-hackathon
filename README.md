# SIRAGU AI (சிறகு AI)
### உங்களுக்கான டிஜிட்டல் வழிகாட்டி (Your Personal Digital Guide)
**Built for the PromptWars X Hackathon — "The Invisible Woman" Challenge**

---

## 🦋 About SIRAGU AI (சிறகு AI)
**SIRAGU AI** is an accessible, bilingual (Tamil-first), voice-guided digital companion built specifically for first-time female smartphone users in rural Tamil Nadu who have **zero prior digital literacy**. 

Under the Government of Tamil Nadu's **Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme (Pudhumai Penn Scheme)**, eligible female students who studied from Classes 6 to 12 in Tamil Nadu Government schools receive **₹1,000 per month** directly in their bank accounts throughout their college, diploma, or ITI education. 

SIRAGU AI bridges the digital divide by **teaching the user how to use the website while simultaneously guiding her through understanding and accessing the government scheme**.

---

## 🎨 Visual Identity & Butterfly Logo

The SIRAGU AI visual identity features an abstract, elegant **butterfly logo** representing transformation, freedom, and higher education for young women:
- **Four Geometric Butterfly Wings**: Two upper wings and two lower wings.
- **Central Diamond Core**: A small white diamond-like gap at the center.
- **Color Palette**:
  - Primary Violet: `#6D28D9`
  - Lavender: `#A78BFA`
  - Light Lavender: `#F3EDFF`
  - Soft Background: `#FAF9FF`
  - Subtle Teal Accent: `#0D9488`
  - High-Contrast Text: `#1E293B`
- Subtle breathing animation during loading and active speech states without distorting the wing geometry.

---

## 🧭 The 8 Connected Pages

SIRAGU AI provides a seamless 8-page journey without overwhelming the first-time user:

1. **Page 1: Welcome (முகப்பு)**:
   - Butterfly logo branding, SIRAGU AI, and the official tagline *"உங்களுக்கான டிஜிட்டல் வழிகாட்டி"*.
   - Spoken welcome audio button, prominent microphone button (*"பேச தொடங்குங்கள்"*), and interactive tutorial launcher.
   - Three large illustrated quick-action cards.

2. **Page 2: How to Use Siragu AI (பயிற்சி — Interactive Tutorial)**:
   - Step-by-step interactive onboarding for a first-time user:
     1. How to tap buttons (with an animated pointing hand).
     2. How microphone permissions work (with visual browser prompt explanation).
     3. How to tap the mic and speak when it turns red.
     4. How to listen to spoken answers and replay them.
     5. How to use *"புரியவில்லை" (I don't understand)* to get simple help anytime.
   - Genuinely interactive — waits for real user actions before advancing.

3. **Page 3: Gemini AI Voice Assistant (AI குரல் அரட்டை)**:
   - Full conversational voice AI powered by Google Gemini (`gemini-3.8-flash`).
   - Browser Web Speech API recognition (`ta-IN`, `en-US`) and text-to-speech with server fallback.
   - Animated audio wave visualizer, replay answer button, stop-speaking control, suggested questions, and conversation reset.

4. **Page 4: Pudhumai Penn Scheme Information (திட்டம் பற்றி)**:
   - Verified official facts: ₹1,000/month, DBT direct bank transfer, college duration, and 100% free guarantee.
   - Illustrated cards with audio read-aloud buttons and *"Ask Siragu"* buttons.

5. **Page 5: Guided Eligibility Checker (தகுதி சோதனை)**:
   - Conversational, one question at a time:
     - Q1: 6th–12th Tamil Nadu Government School?
     - Q2: Enrolled in recognized College / Diploma / ITI?
     - Q3: Individual bank account in your own name?
   - Large **ஆம் (Yes)**, **இல்லை (No)**, and **தெரியவில்லை (Not Sure)** buttons.
   - Spoken questions, progress tracker, and preliminary guidance summary.

6. **Page 6: Interactive Documents Checklist (ஆவணங்கள் சரிபார்ப்பு)**:
   - 5 officially verified documents:
     1. 6th–12th Govt School Study Proof / EMIS Number
     2. College Admission Allotment Order / College ID
     3. Student's Bank Passbook First Page (with IFSC & Aadhaar seeding)
     4. Aadhaar Card Photocopy (physical college verification only)
     5. 10th and 12th Standard Mark Sheets
   - Audio explanations on how to obtain each document, with single-document stepper or full checklist mode.
   - Strict warning: **Zero document uploads required online**.

7. **Page 7: Step-by-Step Application Guidance (விண்ணப்பிக்கும் முறை)**:
   - 4 verified steps:
     1. Meet College Nodal Officer
     2. Submit Physical Photocopies
     3. Free Online Registration on `pudhumaipenn.tn.gov.in` by College
     4. Receive ₹1,000 Monthly DBT Credit
   - Stepper controls, audio narration, and direct link to the official portal.

8. **Page 8: Help and Support (உதவி எண்கள்)**:
   - Direct 1-tap call buttons for **181 Women Helpline** (24/7) and **1100 CM Helpline**.
   - Microphone troubleshooting with clear visual instructions.
   - Restart tutorial button.
   - Anti-fraud safety advisory (Never share ATM PINs or OTPs).

---

## 💡 Persistent AI Help & "புரியவில்லை" Button
Every page includes a persistent helper bar:
- **"இந்தப் பக்கத்தை விளக்கு" (Explain This Page)**: Speaks a clear, simple summary of the active page.
- **"சிறகுவிடம் பேசுங்கள்" (Talk to Siragu)**: Opens the voice assistant directly from any step.
- **"புரியவில்லை" (I Don't Understand)**: Immediately reassures the user and breaks down instructions in simple terms.
- **"முகப்பு" (Home)**: 1-tap return to the welcome page.

---

## 🔒 Security, Privacy & Accuracy
- **Zero Secrets on Client**: `GEMINI_API_KEY` is kept exclusively on the Node.js/Express backend.
- **No Sensitive Data Stored**: Siragu AI never asks for, records, or stores Aadhaar numbers, bank account numbers, passwords, or OTPs.
- **Grounded Factuality**: All scheme-related answers are strictly grounded in verified official facts from `scheme-knowledge.json`.
- **Unverified Fields Disclosure**: Fields awaiting current academic year circulars are clearly labeled with official verification warnings.

---

## 🛠 Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React icons
- **Backend**: Node.js 22, Express
- **AI Engine**: Google Gemini API (`@google/genai` TypeScript SDK, `gemini-3.8-flash`)
- **Speech**: Web Speech API (`ta-IN` / `en-US`), Gemini TTS fallback (`gemini-3.8-flash-lite-tts`)
- **Container**: Multi-stage Dockerfile, Google Cloud Run ready

---

## 🚀 Running Locally & Testing

### 1. Installation
```bash
# Clone the repository
git clone <repo-url>
cd siragu-ai

# Install dependencies
npm install
```

### 2. Environment Variables
Create a `.env` file:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=3000
NODE_ENV=development
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000`.

### 4. Run Test Suite
```bash
npm test
```

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🐳 Docker & Google Cloud Run Deployment

### Build and Run Docker Container
```bash
docker build -t siragu-ai .
docker run -p 3000:3000 -e GEMINI_API_KEY="YOUR_KEY" siragu-ai
```

### Deploy to Google Cloud Run
```bash
gcloud run deploy siragu-ai \
  --source . \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="YOUR_KEY"
```

---

## 📜 Official Scheme Information
- **Scheme Name**: Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme (Pudhumai Penn Scheme)
- **Department**: Department of Social Welfare and Women Empowerment, Government of Tamil Nadu
- **Official Portal**: [https://pudhumaipenn.tn.gov.in](https://pudhumaipenn.tn.gov.in)
- **Toll-Free Helplines**: 181 (Women Helpline) / 1100 (CM Helpline)
