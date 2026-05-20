import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

// ─── Navigation Links ───────────────────────────────────────────────────────
const NAV_LINKS = ["Services", "Telehealth", "Home Care", "Testimonials", "Contact", "Health Tools"];

// ─── Services Data (Nigerian context) ───────────────────────────────────────
const SERVICES = [
  {
    icon: "🩺",
    title: "Google Meet Consultations",
    desc: "Book a live video consultation with MDCN-registered doctors via Google Meet. Automatic transcripts keep a full record of your diagnosis, prescriptions, and lab requests.",
    color: "from-green-700 to-emerald-500",
    link: "telehealth",
  },
  {
    icon: "💊",
    title: "Prescription Management",
    desc: "Receive digital prescriptions after every consultation. Your transcript records exactly what was prescribed, the dosage, and the duration — no confusion, no lost papers.",
    color: "from-teal-700 to-green-500",
    link: "telehealth",
  },
  {
    icon: "🤝",
    title: "Domiciliary Care",
    desc: "Compassionate, trained caregivers visiting you at home across Lagos, Abuja, Port Harcourt, and other major cities — supporting daily living and personal care.",
    color: "from-emerald-600 to-teal-500",
    link: "home-care",
  },
  {
    icon: "❤️",
    title: "Chronic Disease Management",
    desc: "Ongoing care plans for hypertension, diabetes, sickle cell anaemia, and other prevalent Nigerian health conditions — with specialist oversight and monitoring.",
    color: "from-rose-600 to-pink-500",
    link: "home-care",
  },
  {
    icon: "🧠",
    title: "Mental Health Support",
    desc: "THERAPIST-led sessions for anxiety, depression, and grief — conducted via Google Meet with complete privacy and fully documented session transcripts.",
    color: "from-violet-600 to-purple-500",
    link: "telehealth",
  },
  {
    icon: "🧪",
    title: "Lab Test Coordination",
    desc: "Your doctor orders lab tests directly from your consultation transcript. We coordinate with partner labs in your city for home sample collection and result delivery.",
    color: "from-amber-600 to-orange-500",
    link: "contact",
  },
];

// ─── Testimonials (Nigerian patients) ───────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Adaeze O.",
    age: 62,
    location: "Lagos",
    text: "I was managing my hypertension with guesswork. Zorim Care connected me with a cardiologist on Google Meet within hours. The transcript showed my exact medications — I finally understand my own health.",
    avatar: "AO",
    stars: 5,
  },
  {
    name: "Emeka & Ngozi B.",
    age: null,
    location: "Abuja",
    text: "When our father had a diabetic episode, we called Zorim Care. They sent a carer to our Abuja home within the day and set up a telehealth follow-up. The transcript of every consultation is gold.",
    avatar: "EB",
    stars: 5,
  },
  {
    name: "Fatima A.",
    age: 71,
    location: "Kano",
    text: "As a senior woman in Kano, travelling to hospital is difficult. Zorim Care brought the hospital to my phone. My daughter reads the consultation transcripts with me. It has changed everything.",
    avatar: "FA",
    stars: 5,
  },
];

// ─── Statistics ──────────────────────────────────────────────────────────────
const STATS = [
  { value: "8,000+", label: "Patients Served" },
  { value: "97%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Always Available" },
  { value: "300+", label: "Qualified Carers" },
];

// ─── Nigerian Cities Served ──────────────────────────────────────────────────
const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Enugu", "Benin City", "Kaduna"];

// ─── Scroll Animation Hook ───────────────────────────────────────────────────
// This hook watches whether an element has scrolled into the viewport,
// then sets inView=true so we can trigger a CSS animation.
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── Animated Section Wrapper ────────────────────────────────────────────────
function AnimatedSection({ children, className = "", delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Star Rating Component ───────────────────────────────────────────────────
function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-amber-400 text-sm">★</span>
      ))}
    </div>
  );
}


// ─── BMI Calculator Modal ─────────────────────────────────────────────────────
function BMIModal({ onClose, dark }) {
  const [unit, setUnit] = useState("metric");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [bmi, setBmi] = useState(null);

  const theme = {
    card: dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200",
    text: dark ? "text-slate-100" : "text-slate-800",
    muted: dark ? "text-slate-400" : "text-slate-500",
    input: dark ? "bg-slate-800 border-slate-600 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400",
  };

  const calcBMI = () => {
    let b;
    if (unit === "metric") {
      const h = parseFloat(height) / 100;
      const w = parseFloat(weight);
      if (!h || !w) return;
      b = w / (h * h);
    } else {
      const totalIn = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
      const w = parseFloat(weight);
      if (!totalIn || !w) return;
      b = (w / (totalIn * totalIn)) * 703;
    }
    setBmi(Math.round(b * 10) / 10);
  };

  const getCategory = (b) => {
    if (b < 18.5) return { label: "Underweight", color: "text-blue-500", bg: "bg-blue-50", advice: "You may be underweight. Consider speaking with a doctor or nutritionist about a healthy diet plan." };
    if (b < 25)   return { label: "Normal weight", color: "text-green-600", bg: "bg-green-50", advice: "Your BMI is in the healthy range. Maintain a balanced diet and regular physical activity." };
    if (b < 30)   return { label: "Overweight", color: "text-amber-500", bg: "bg-amber-50", advice: "You are slightly above the healthy range. A doctor can advise on diet and exercise adjustments." };
    if (b < 35)   return { label: "Obese (Class I)", color: "text-orange-600", bg: "bg-orange-50", advice: "Obesity increases risk of hypertension, diabetes, and heart disease. Please consult a doctor." };
    if (b < 40)   return { label: "Obese (Class II)", color: "text-red-500", bg: "bg-red-50", advice: "Significant health risks present. Medical supervision is strongly recommended." };
    return         { label: "Obese (Class III)", color: "text-red-700", bg: "bg-red-50", advice: "Severe obesity. Please seek medical advice promptly." };
  };

  const pct = bmi ? Math.min(Math.max(((bmi - 10) / 40) * 100, 0), 100) : 0;
  const cat = bmi ? getCategory(bmi) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
      <div className={`${theme.card} border rounded-3xl w-full max-w-md shadow-2xl`}>
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-2xl font-bold ${theme.text}`} style={{ fontFamily: "Cormorant Garamond, serif" }}>BMI Calculator</h3>
              <p className={`${theme.muted} text-sm mt-0.5`}>Body Mass Index — a general health screening tool</p>
            </div>
            <button onClick={onClose} className={`w-9 h-9 rounded-full flex items-center justify-center ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"} hover:scale-110 transition-transform text-lg`}>✕</button>
          </div>

          {/* Unit toggle */}
          <div className={`flex rounded-xl overflow-hidden border ${dark ? "border-slate-700" : "border-slate-200"} mb-5`}>
            {["metric", "imperial"].map(u => (
              <button key={u} onClick={() => { setUnit(u); setBmi(null); }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${unit === u ? "bg-green-700 text-white" : dark ? "bg-slate-800 text-slate-400" : "bg-white text-slate-500"}`}>
                {u === "metric" ? "Metric (cm / kg)" : "Imperial (ft / lbs)"}
              </button>
            ))}
          </div>

          <div className="space-y-4 mb-5">
            {unit === "metric" ? (
              <div>
                <label className={`text-xs font-semibold ${theme.muted} block mb-1.5 uppercase tracking-wider`}>Height (cm)</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 170"
                  className={`w-full px-4 py-3 rounded-xl border text-sm ${theme.input} focus:border-green-500 transition-colors`} />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-semibold ${theme.muted} block mb-1.5 uppercase tracking-wider`}>Feet</label>
                  <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} placeholder="5"
                    className={`w-full px-4 py-3 rounded-xl border text-sm ${theme.input} focus:border-green-500 transition-colors`} />
                </div>
                <div>
                  <label className={`text-xs font-semibold ${theme.muted} block mb-1.5 uppercase tracking-wider`}>Inches</label>
                  <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} placeholder="7"
                    className={`w-full px-4 py-3 rounded-xl border text-sm ${theme.input} focus:border-green-500 transition-colors`} />
                </div>
              </div>
            )}
            <div>
              <label className={`text-xs font-semibold ${theme.muted} block mb-1.5 uppercase tracking-wider`}>Weight ({unit === "metric" ? "kg" : "lbs"})</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
                className={`w-full px-4 py-3 rounded-xl border text-sm ${theme.input} focus:border-green-500 transition-colors`} />
            </div>
          </div>

          <button onClick={calcBMI}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 text-white font-bold text-base hover:scale-[1.02] transition-all duration-200 mb-4">
            Calculate My BMI
          </button>

          {bmi && cat && (
            <div className={`rounded-2xl p-5 ${dark ? "bg-slate-800" : cat.bg}`}>
              {/* BMI value */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-3xl font-bold ${cat.color}`}>{bmi}</span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${dark ? "bg-slate-700 " + cat.color : cat.color + " bg-white/60"}`}>{cat.label}</span>
              </div>
              {/* Scale bar */}
              <div className="h-3 rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-amber-400 to-red-600 mb-1 relative">
                <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-slate-700 rounded-full shadow"
                  style={{ left: `calc(${pct}% - 8px)` }} />
              </div>
              <div className={`flex justify-between text-xs ${theme.muted} mb-4`}>
                <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
              </div>
              <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>{cat.advice}</p>
              <p className={`text-xs ${theme.muted} mt-3`}>⚠️ BMI is a screening tool only and does not account for muscle mass, age, or ethnicity. Always consult a physician for a full health assessment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── AI Medical Intake Modal ──────────────────────────────────────────────────
// ─── Zorim AI: Self-Contained Clinical Decision Engine ───────────────────────
// No external API. All logic runs entirely inside the browser.

const SYMPTOM_KB = [
  // ── EMERGENCY ──
  { keywords: ["chest pain","chest tightness","chest pressure","heart attack","crushing chest"], conditions: ["Acute Coronary Syndrome (possible heart attack)","Unstable Angina","Aortic Dissection"], urgency: "EMERGENCY", redFlags: ["Chest pain radiating to arm or jaw","Sweating with chest pain","Shortness of breath with chest pain"], nextSteps: ["Call 112 immediately","Do NOT drive yourself","Chew aspirin 300mg if available and not allergic","Lie down and rest"], summary: "Patient presents with chest pain — emergency cardiac evaluation required immediately." },
  { keywords: ["stroke","face drooping","arm weakness","speech difficulty","sudden numbness","sudden confusion","sudden vision loss"], conditions: ["Ischaemic Stroke","Transient Ischaemic Attack (TIA)","Haemorrhagic Stroke"], urgency: "EMERGENCY", redFlags: ["Facial drooping (one side)","Unable to raise both arms equally","Slurred or absent speech","Sudden severe headache"], nextSteps: ["Call 112 immediately — time is critical for stroke","Note exact time symptoms started","Do NOT give food or water"], summary: "Patient presents with stroke symptoms — immediate neurological emergency." },
  { keywords: ["can't breathe","cannot breathe","not breathing","severe breathing difficulty","choking","anaphylaxis","allergic reaction severe"], conditions: ["Severe Anaphylaxis","Acute Asthma Attack","Pulmonary Embolism","Foreign Body Airway Obstruction"], urgency: "EMERGENCY", redFlags: ["Cannot complete sentences","Lips or fingernails turning blue","Throat swelling"], nextSteps: ["Call 112 immediately","Sit upright","Use inhaler if available (asthma)","Epinephrine auto-injector if prescribed"], summary: "Patient presents with acute respiratory emergency." },
  { keywords: ["unconscious","unresponsive","not waking","fainted","collapsed","seizure","convulsion","fitting"], conditions: ["Syncope","Seizure Disorder","Hypoglycaemia","Cardiac Arrhythmia"], urgency: "EMERGENCY", redFlags: ["Prolonged unconsciousness","Tongue biting","Incontinence during episode","No pulse"], nextSteps: ["Call 112 immediately","Place in recovery position","Do not restrain during seizure","Check breathing and pulse"], summary: "Patient presents with loss of consciousness or seizure — emergency evaluation required." },
  { keywords: ["heavy bleeding","uncontrolled bleeding","bleeding won't stop","vomiting blood","blood in stool black"], conditions: ["Gastrointestinal Haemorrhage","Peptic Ulcer Bleeding","Oesophageal Varices"], urgency: "EMERGENCY", redFlags: ["Black tarry stool","Bright red blood in vomit","Dizziness with bleeding","Rapid weak pulse"], nextSteps: ["Call 112 immediately","Apply pressure to external wounds","Do not eat or drink"], summary: "Patient presents with significant haemorrhage — emergency surgical evaluation required." },

  // ── HIGH URGENCY ──
  { keywords: ["high fever","very high temperature","fever 39","fever 40","fever 41","high temperature","shivering fever"], conditions: ["Severe Bacterial Infection","Malaria","Typhoid Fever","Meningitis"], urgency: "HIGH", redFlags: ["Fever above 39.5°C","Stiff neck with fever","Rash with fever","Confusion with fever — possible meningitis"], nextSteps: ["Visit hospital or clinic today","Take paracetamol to reduce fever","Malaria rapid test recommended","Stay hydrated"], summary: "Patient presents with high-grade fever requiring same-day clinical evaluation." },
  { keywords: ["malaria","chills","sweating fever","rigors","shaking chills","headache fever body ache"], conditions: ["Plasmodium falciparum Malaria","Typhoid Fever","Dengue Fever","Viral Haemorrhagic Fever"], urgency: "HIGH", redFlags: ["Fever with confusion","Yellow eyes or skin (jaundice)","Difficulty breathing with fever","Dark cola-coloured urine"], nextSteps: ["Get a malaria RDT or blood film test urgently","Visit a clinic today","Do not self-medicate with ACTs without testing","Stay hydrated"], summary: "Patient presents with symptoms consistent with malaria — urgent parasitological testing required." },
  { keywords: ["severe abdominal pain","stomach pain severe","appendix","right side pain sharp","abdominal rigidity"], conditions: ["Acute Appendicitis","Ectopic Pregnancy","Ovarian Torsion","Peritonitis","Bowel Obstruction"], urgency: "HIGH", redFlags: ["Pain that worsens with movement","Rigid board-like abdomen","Fever with severe abdominal pain","Pain in right lower quadrant"], nextSteps: ["Seek hospital evaluation today — possible surgical emergency","Do not eat or drink","Do not take painkillers until evaluated (may mask symptoms)"], summary: "Patient presents with acute abdominal pain — surgical emergency must be excluded." },
  { keywords: ["head injury","concussion","hit head","head trauma","knock to head","fell and hit head"], conditions: ["Concussion","Intracranial Haemorrhage","Skull Fracture"], urgency: "HIGH", redFlags: ["Loss of consciousness after head injury","Vomiting after head injury","Confusion or memory loss","Worsening headache after head injury"], nextSteps: ["Go to A&E today","Do not leave patient alone for 24 hours","Avoid painkillers containing aspirin","CT scan may be required"], summary: "Patient presents with head injury — intracranial pathology must be excluded." },
  { keywords: ["diabetic","sugar very high","hyperglycaemia","glucose high","DKA","diabetic emergency","sugar level"], conditions: ["Diabetic Ketoacidosis (DKA)","Hyperosmolar Hyperglycaemic State","Severe Hypoglycaemia"], urgency: "HIGH", redFlags: ["Blood glucose above 15 mmol/L","Fruity breath odour","Vomiting with diabetes","Confusion in a diabetic patient"], nextSteps: ["Check blood glucose immediately","If glucose very high — go to hospital today","If glucose low — take sugary drink immediately","Do not skip insulin doses"], summary: "Patient presents with diabetic emergency — urgent glucose management and medical review required." },

  // ── MODERATE URGENCY ──
  { keywords: ["headache","head pain","migraine","head ache","throbbing head"], conditions: ["Tension Headache","Migraine","Hypertensive Headache","Sinusitis"], urgency: "MODERATE", redFlags: ["Worst headache of your life (thunderclap)","Headache with fever and stiff neck","Headache with vision changes","Headache after head injury"], nextSteps: ["Rest in a quiet dark room","Take paracetamol or ibuprofen as directed","Check blood pressure if possible","Book a telehealth consultation if recurring"], summary: "Patient presents with headache — hypertensive cause and secondary pathology should be excluded." },
  { keywords: ["high blood pressure","hypertension","BP high","blood pressure high","pressure reading","systolic"], conditions: ["Essential Hypertension","Secondary Hypertension","Hypertensive Urgency"], urgency: "MODERATE", redFlags: ["BP above 180/120 mmHg","Headache with very high BP","Blurred vision with high BP","Chest pain with high BP — EMERGENCY"], nextSteps: ["Take prescribed antihypertensive medication","Avoid salt, stress, and caffeine","Book telehealth review within 48 hours","Monitor BP twice daily and record readings"], summary: "Patient presents with elevated blood pressure — medication review and lifestyle counselling indicated." },
  { keywords: ["cough","persistent cough","coughing","chest cough","productive cough","coughing blood","haemoptysis"], conditions: ["Upper Respiratory Tract Infection","Pulmonary Tuberculosis","Asthma","Pneumonia","Chronic Bronchitis"], urgency: "MODERATE", redFlags: ["Coughing blood","Cough lasting more than 3 weeks — TB screening required","Night sweats with cough","Weight loss with cough"], nextSteps: ["If cough >3 weeks — TB sputum test essential","Avoid smoking","Stay hydrated","Book telehealth review"], summary: "Patient presents with cough — pulmonary tuberculosis must be excluded if duration exceeds 3 weeks." },
  { keywords: ["diabetes","sugar","blood glucose","type 2","type 1","insulin","metformin"], conditions: ["Type 2 Diabetes Mellitus","Type 1 Diabetes Mellitus","Pre-Diabetes","Metabolic Syndrome"], urgency: "MODERATE", redFlags: ["Frequent urination + excessive thirst + weight loss","Non-healing wounds","Blurred vision in a diabetic","Numbness in feet"], nextSteps: ["Check fasting blood glucose","Book telehealth consultation","Reduce sugar, white bread, and rice intake","Take medications as prescribed"], summary: "Patient presents with diabetes-related concerns — HbA1c and fasting glucose review recommended." },
  { keywords: ["diarrhoea","diarrhea","loose stool","running stomach","frequent stool","watery stool","cholera"], conditions: ["Acute Gastroenteritis","Cholera","Typhoid Fever","Irritable Bowel Syndrome","Food Poisoning"], urgency: "MODERATE", redFlags: ["Blood or mucus in stool","Signs of dehydration (dry mouth, no urine, sunken eyes)","Diarrhoea with high fever","Diarrhoea for more than 3 days"], nextSteps: ["Drink ORS (Oral Rehydration Solution) frequently","Avoid dairy, spicy, or fatty foods","Visit clinic if diarrhoea persists beyond 48 hours","Wash hands thoroughly"], summary: "Patient presents with diarrhoea — dehydration prevention and infective cause workup indicated." },
  { keywords: ["urinary","burning urination","painful urination","frequent urination","UTI","urine infection","urethral discharge"], conditions: ["Urinary Tract Infection (UTI)","Sexually Transmitted Infection","Kidney Infection (Pyelonephritis)","Prostatitis (men)"], urgency: "MODERATE", redFlags: ["Fever with urinary symptoms — possible kidney infection","Blood in urine","Back or flank pain with urinary symptoms","Urethral discharge"], nextSteps: ["Increase fluid intake","Book telehealth consultation for urine culture","Do not self-medicate antibiotics without culture result","Complete full antibiotic course if prescribed"], summary: "Patient presents with urinary symptoms — urine microscopy culture and sensitivity (MCS) recommended." },
  { keywords: ["skin rash","rash","itching","hives","eczema","skin lesion","skin infection","boil","abscess"], conditions: ["Allergic Contact Dermatitis","Eczema (Atopic Dermatitis)","Fungal Skin Infection","Cellulitis","Chickenpox"], urgency: "MODERATE", redFlags: ["Rapidly spreading rash with fever","Rash with breathing difficulty — EMERGENCY","Painful red swollen skin (possible cellulitis)","Rash on face with systemic symptoms"], nextSteps: ["Avoid scratching","Apply calamine lotion for itch relief","Book telehealth dermatology review","Avoid soap and detergents on affected area"], summary: "Patient presents with dermatological complaint — clinical assessment and allergy workup recommended." },
  { keywords: ["sickle cell","crisis","vaso-occlusive","bone pain","sickling","HbSS","genotype SS"], conditions: ["Sickle Cell Vaso-Occlusive Crisis","Acute Chest Syndrome","Splenic Sequestration","Aplastic Crisis"], urgency: "MODERATE", redFlags: ["Chest pain with sickle cell — EMERGENCY","Fever in sickle cell patient","Sudden severe headache in sickle cell","Priapism (prolonged painful erection)"], nextSteps: ["Increase fluid intake (oral or IV)","Take prescribed pain relief","Visit hospital for IV fluids and pain management if severe","Keep warm and avoid cold"], summary: "Patient presents with sickle cell crisis — haematological and pain management review required." },

  // ── LOW URGENCY ──
  { keywords: ["cold","runny nose","sneezing","blocked nose","stuffy nose","common cold","nasal congestion"], conditions: ["Common Cold (Rhinovirus)","Allergic Rhinitis","Sinusitis"], urgency: "LOW", redFlags: ["Symptoms lasting more than 10 days","Fever above 38.5°C","Green or yellow nasal discharge for more than a week"], nextSteps: ["Rest and stay hydrated","Take paracetamol for discomfort","Saline nasal rinse can help","Book telehealth if no improvement in 7 days"], summary: "Patient presents with upper respiratory symptoms — likely viral, supportive management recommended." },
  { keywords: ["back pain","lower back","backache","back ache","lumbar","spine pain"], conditions: ["Musculoskeletal Back Pain","Lumbar Disc Herniation","Kidney Stone (if flank)","Muscle Strain"], urgency: "LOW", redFlags: ["Back pain with numbness or weakness in legs","Loss of bladder or bowel control with back pain","Back pain after trauma","Night pain that wakes from sleep"], nextSteps: ["Rest and apply warm compress","Take ibuprofen or paracetamol as directed","Gentle stretching after 48 hours","Book physiotherapy or telehealth review if persisting"], summary: "Patient presents with back pain — red flag exclusion and musculoskeletal assessment recommended." },
  { keywords: ["stress","anxiety","worried","panic","overthinking","nervous","mental health","depression","sad","low mood"], conditions: ["Generalised Anxiety Disorder","Major Depressive Disorder","Adjustment Disorder","Burnout Syndrome"], urgency: "LOW", redFlags: ["Thoughts of self-harm or suicide — seek help immediately","Unable to care for yourself or dependants","Prolonged inability to sleep or eat"], nextSteps: ["Book a mental health telehealth session","Talk to a trusted person","Reduce caffeine and screen time","Practice slow breathing exercises daily"], summary: "Patient presents with mental health concerns — psychological evaluation and supportive therapy recommended." },
  { keywords: ["tired","fatigue","weakness","exhausted","always tired","no energy","lethargy"], conditions: ["Anaemia","Hypothyroidism","Diabetes Mellitus","Depression","Chronic Fatigue Syndrome"], urgency: "LOW", redFlags: ["Extreme fatigue with chest pain","Fatigue with jaundice (yellow eyes)","Fatigue with unexplained weight loss","Fatigue in a known diabetic or HIV patient"], nextSteps: ["Check full blood count (FBC) and thyroid function","Ensure adequate sleep (7–9 hours)","Eat iron-rich foods (beans, meat, leafy greens)","Book telehealth review for blood tests"], summary: "Patient presents with fatigue — haematological and metabolic workup recommended to exclude organic cause." },
  { keywords: ["weight loss","losing weight","unintentional weight loss","weight reducing"], conditions: ["Tuberculosis","HIV/AIDS","Diabetes Mellitus","Malignancy","Hyperthyroidism"], urgency: "LOW", redFlags: ["Weight loss with night sweats and cough — TB screening essential","Weight loss with blood in stool","Weight loss with fatigue and lumps"], nextSteps: ["Book telehealth consultation urgently","HIV and TB screening recommended","Full blood count and metabolic panel","Do not ignore unexplained weight loss"], summary: "Patient presents with unexplained weight loss — comprehensive metabolic and infectious disease workup required." },
];

function matchSymptoms(text) {
  const lower = text.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const entry of SYMPTOM_KB) {
    const score = entry.keywords.filter(k => lower.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  return bestScore > 0 ? best : null;
}

const INTAKE_QUESTIONS = [
  { key: "symptom",   ask: "What is your main health concern or symptom today?" },
  { key: "duration",  ask: "How long have you been experiencing this? (e.g. 2 days, 1 week)" },
  { key: "severity",  ask: "On a scale of 1–10, how severe is it? (1 = mild, 10 = unbearable)" },
  { key: "age",       ask: "How old are you, and what is your gender?" },
  { key: "history",   ask: "Do you have any existing medical conditions (e.g. diabetes, hypertension, sickle cell)? Or are you currently on any medications?" },
  { key: "other",     ask: "Any other symptoms alongside the main one? (e.g. fever, nausea, dizziness)" },
];

function buildReport(data) {
  const combined = Object.values(data).join(" ");
  const match = matchSymptoms(combined) || matchSymptoms(data.symptom || "");

  if (!match) {
    return `Thank you for sharing that information. Based on what you've described, I wasn't able to match a specific condition in my database — but that doesn't mean your concern is unimportant.\n\n✅ RECOMMENDED NEXT STEPS\n• Book a telehealth consultation with a Zorim Care doctor for a proper clinical review.\n• Note down all your symptoms, when they started, and any medications you're taking.\n\n⚠️ These findings are informational only and require confirmation by a qualified physician.`;
  }

  const urgencyColors = { EMERGENCY: "🚨", HIGH: "🔴", MODERATE: "🟡", LOW: "🟢" };
  const icon = urgencyColors[match.urgency] || "🟡";

  return `Thank you. Based on the information you've provided, here is your Zorim AI health assessment:\n\n📋 SYMPTOM SUMMARY\nPatient (${data.age || "age not provided"}) reports: ${data.symptom || "stated concern"}. Duration: ${data.duration || "not specified"}. Severity: ${data.severity || "not rated"}/10. Additional symptoms: ${data.other || "none mentioned"}. Medical history: ${data.history || "none stated"}.\n\n🔬 POSSIBLE CONDITIONS\n${match.conditions.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n\n🚦 URGENCY LEVEL: ${icon} ${match.urgency}\n\n✅ RECOMMENDED NEXT STEPS\n${match.nextSteps.map(s => `• ${s}`).join("\n")}\n\n🚨 RED FLAG WARNINGS\nSeek emergency care immediately if you experience:\n${match.redFlags.map(r => `• ${r}`).join("\n")}\n\n📄 PROVIDER SUMMARY\n${match.summary} Patient age/gender: ${data.age || "not provided"}. Duration of symptoms: ${data.duration || "unspecified"}. Severity score: ${data.severity || "N/A"}/10. Background: ${data.history || "nil known"}.\n\n⚠️ IMPORTANT DISCLAIMER\nThese findings are informational only and do not constitute a medical diagnosis. All outputs must be confirmed by a qualified physician. Zorim Care is not liable for clinical decisions made on the basis of this tool alone.`;
}

function AIMedicalModal({ onClose, dark }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm Zorim AI, your health intake assistant 🩺\n\nI'll ask you a few short questions to assess your symptoms and provide guidance. This is not a diagnosis — always confirm with a doctor.\n\n" + INTAKE_QUESTIONS[0].ask }
  ]);
  const [done, setDone] = useState(false);
  const bottomRef = useRef(null);

  const theme = {
    card: dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200",
    text: dark ? "text-slate-100" : "text-slate-800",
    muted: dark ? "text-slate-400" : "text-slate-500",
    input: dark ? "bg-slate-800 border-slate-600 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400",
    bubble: dark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-800",
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => {
    if (!input.trim() || done) return;
    const userMsg = { role: "user", content: input.trim() };
    const key = INTAKE_QUESTIONS[step]?.key;
    const newData = { ...data, [key]: input.trim() };
    setData(newData);
    setInput("");

    // Emergency keyword fast-path
    const lower = input.toLowerCase();
    const emergencyWords = ["chest pain","can't breathe","cannot breathe","not breathing","stroke","unconscious","unresponsive","heavy bleeding","vomiting blood","heart attack","choking","seizure","convulsion","collapsed"];
    if (emergencyWords.some(w => lower.includes(w))) {
      setMessages(prev => [...prev, userMsg, { role: "assistant", content: "🚨 EMERGENCY DETECTED\n\nBased on what you've described, this may be a life-threatening emergency.\n\n📞 CALL 112 IMMEDIATELY or go to the nearest hospital A&E.\n\nDo NOT wait. Do NOT drive yourself if possible. Alert someone nearby.\n\n⚠️ These findings are informational only — but please do not delay emergency care." }]);
      setDone(true);
      return;
    }

    const nextStep = step + 1;
    if (nextStep < INTAKE_QUESTIONS.length) {
      setMessages(prev => [...prev, userMsg, { role: "assistant", content: INTAKE_QUESTIONS[nextStep].ask }]);
      setStep(nextStep);
    } else {
      const report = buildReport(newData);
      setMessages(prev => [...prev, userMsg, { role: "assistant", content: report }]);
      setDone(true);
    }
  };

  const restart = () => {
    setStep(0); setData({}); setInput(""); setDone(false);
    setMessages([{ role: "assistant", content: "Let's start again. " + INTAKE_QUESTIONS[0].ask }]);
  };

  const formatMsg = (text) => text.split("\n").map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
  ));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
      <div className={`${theme.card} border rounded-3xl w-full max-w-lg shadow-2xl flex flex-col`} style={{ height: "85vh" }}>
        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: dark ? "#334155" : "#e2e8f0" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xl">🤖</div>
            <div>
              <div className={`font-bold ${theme.text}`}>Zorim AI Health Assistant</div>
              <div className={`text-xs ${theme.muted}`}>
                {done ? "Assessment complete" : `Step ${step + 1} of ${INTAKE_QUESTIONS.length}`}
              </div>
            </div>
          </div>
          <button onClick={onClose} className={`w-9 h-9 rounded-full flex items-center justify-center ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"} hover:scale-110 transition-transform text-lg`}>✕</button>
        </div>

        {/* Progress bar */}
        {!done && (
          <div className="h-1 bg-slate-200">
            <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
              style={{ width: `${((step) / INTAKE_QUESTIONS.length) * 100}%` }} />
          </div>
        )}

        {/* Disclaimer */}
        <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-100 flex items-start gap-2">
          <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
          <p className="text-amber-700 text-xs leading-relaxed">Informational only — not a medical diagnosis. Emergency? Call <strong>112</strong>.</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-sm mr-2 mt-1 flex-shrink-0">🤖</div>
              )}
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-green-700 text-white rounded-br-sm" : theme.bubble + " rounded-bl-sm"}`}>
                {formatMsg(m.content)}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input / done state */}
        <div className="p-4 border-t" style={{ borderColor: dark ? "#334155" : "#e2e8f0" }}>
          {done ? (
            <div className="space-y-2">
              <button onClick={restart}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-bold text-sm hover:scale-[1.02] transition-all">
                Start New Assessment 🔄
              </button>
              <button onClick={onClose}
                className={`w-full py-3 rounded-xl border font-semibold text-sm ${dark ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600"} hover:scale-[1.02] transition-all`}>
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  placeholder="Type your answer..."
                  className={`flex-1 px-4 py-3 rounded-xl border text-sm ${theme.input} focus:border-purple-500 transition-colors`} />
                <button onClick={send} disabled={!input.trim()}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-bold text-sm hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100">
                  Send
                </button>
              </div>
              <p className={`${theme.muted} text-xs text-center mt-2`}>Press Enter to send · All data stays on your device</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Consultation Booking Modal ───────────────────────────────────────────────
// Opens Calendly so patients can book a real Google Meet consultation.
const CALENDLY_URL = "https://calendly.com/zorimcare/30min";

function ConsultationModal({ onClose, dark }) {
  const theme = {
    card: dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200",
    text: dark ? "text-slate-100" : "text-slate-800",
    muted: dark ? "text-slate-400" : "text-slate-500",
  };

  const handleBookNow = () => {
    window.open(CALENDLY_URL, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
      <div className={`${theme.card} border rounded-3xl w-full max-w-md shadow-2xl`}>
        <div className="p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-2xl font-bold ${theme.text}`} style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Book a Consultation
              </h3>
              <p className={`${theme.muted} text-sm mt-0.5`}>
                Choose a time that works for you — a real Google Meet link will be sent instantly.
              </p>
            </div>
            <button onClick={onClose}
              className={`w-9 h-9 rounded-full flex items-center justify-center ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"} hover:scale-110 transition-transform text-lg`}>
              ✕
            </button>
          </div>

          {/* Info Card */}
          <div className="rounded-2xl p-5 mb-5" style={{ background: "linear-gradient(135deg, #14532d, #065f46)" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎥</span>
              <span className="text-white font-bold">Google Meet Consultation</span>
            </div>
            <ul className="text-green-200 text-sm space-y-2">
              <li>✅ Pick your preferred date & time</li>
              <li>✅ Real Google Meet link sent to your email</li>
              <li>✅ 30-minute session with a care advisor</li>
              <li>✅ Confirmation & reminder sent automatically</li>
            </ul>
          </div>

          <button onClick={handleBookNow}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 text-white font-bold text-base hover:shadow-xl hover:shadow-green-500/25 hover:scale-[1.02] transition-all duration-200">
            Book My Consultation on Calendly 🎥
          </button>
          <p className={`${theme.muted} text-xs text-center mt-3`}>
            You'll be taken to our Calendly page to choose your slot.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main App Component ───────────────────────────────────────────────────────
export default function ZorimCareApp() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBMI, setShowBMI] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "", service: "", city: "" });
  const [submitted, setSubmitted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Theme colours — deep green replaces the previous navy blue throughout
  const theme = {
    bg: dark ? "bg-slate-950" : "bg-slate-50",
    text: dark ? "text-slate-100" : "text-slate-800",
    muted: dark ? "text-slate-400" : "text-slate-500",
    card: dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
    navBg: scrolled
      ? (dark ? "bg-slate-950/95 backdrop-blur-xl shadow-2xl" : "bg-white/95 backdrop-blur-xl shadow-lg")
      : "bg-transparent",
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    // Validation: require name and phone at minimum
    if (!formData.name || !formData.phone) {
      alert("Please enter at least your full name and phone number.");
      return;
    }

    try {
      // 1. Send email to zorimcare@gmail.com via EmailJS
      await emailjs.send(
        "service_9i53swh",
        "template_51nvbp3",
        {
          patient_name:    formData.name,
          patient_phone:   formData.phone,
          patient_email:   formData.email   || "Not provided",
          patient_city:    formData.city    || "Not specified",
          patient_service: formData.service || "Not specified",
          patient_needs:   formData.message || "Not provided",
        },
        "FI2aysWtLvEwBH-pt"
      );
    } catch (err) {
      console.error("EmailJS error:", err);
      // Don't block the user — still open WhatsApp below
    }

    // 2. Open WhatsApp with pre-filled message to 0810 163 0202
    const waText =
      "%F0%9F%8F%A5 *New Zorim Care Enquiry*%0A%0A" +
      "%F0%9F%91%A4 *Name:* "    + formData.name                    + "%0A" +
      "%F0%9F%93%9E *Phone:* "   + formData.phone                   + "%0A" +
      "%F0%9F%93%A7 *Email:* "   + (formData.email   || "Not provided")   + "%0A" +
      "%F0%9F%93%8D *City:* "    + (formData.city    || "Not specified")   + "%0A" +
      "%F0%9F%A9%BA *Service:* " + (formData.service || "Not specified")   + "%0A" +
      "%F0%9F%93%9D *Needs:* "   + (formData.message || "Not provided");
    window.open("https://wa.me/2348101630202?text=" + waText, "_blank");

    // 3. Show success state and reset form
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: "", email: "", phone: "", message: "", service: "", city: "" });
  };

  return (
    <div className={`${theme.bg} ${theme.text} min-h-screen transition-colors duration-300`}>

      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, .serif { font-family: 'Cormorant Garamond', serif; }

        /* Deep green hero gradient replacing the previous navy */
        .hero-gradient { background: linear-gradient(135deg, #052e16 0%, #14532d 40%, #065f46 100%); }

        /* Glassmorphism — a frosted glass effect using backdrop blur */
        .glass { background: rgba(255,255,255,0.08); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15); }

        /* Subtle green glow for the hero card */
        .glow { box-shadow: 0 0 60px rgba(16, 185, 129, 0.25); }

        /* Hover lift for service cards */
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(16,185,129,0.15); }

        /* Floating animation for the hero dashboard card */
        .float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }

        /* Gradient text using deep greens */
        .gradient-text { background: linear-gradient(135deg, #15803d, #059669); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .gradient-text-light { background: linear-gradient(135deg, #86efac, #6ee7b7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        /* Pulsing ring for the "live" status dot */
        .pulse-ring { animation: pulse-ring 2.5s infinite; }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); } 70% { box-shadow: 0 0 0 20px rgba(16,185,129,0); } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); } }

        /* Subtle mesh background pattern for sections */
        .mesh-bg { background-image: radial-gradient(circle at 20% 50%, rgba(21,128,61,0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(5,150,105,0.05) 0%, transparent 40%); }
      `}</style>

      {/* ── Consultation Modal (shown when user clicks "Book") ── */}
      {showModal && <ConsultationModal onClose={() => setShowModal(false)} dark={dark} />}
      {showBMI && <BMIModal onClose={() => setShowBMI(false)} dark={dark} />}
      {showAI && <AIMedicalModal onClose={() => setShowAI(false)} dark={dark} />}

      {/* ══════════════════════════════════════════════════════════
          NAVIGATION
      ══════════════════════════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${theme.navBg}`}>
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => scrollTo("hero")}>
            <img src="data:image/png;base64,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" alt="Zorim Care" style={{height:"52px", width:"auto", mixBlendMode: dark ? "normal" : "multiply", filter: dark ? "brightness(0) invert(1)" : "none"}}/>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <button key={link}
                onClick={() => scrollTo(link.toLowerCase().replace(" ", "-"))}
                className={`text-sm font-medium tracking-wide ${theme.muted} hover:text-green-600 transition-colors duration-200`}>
                {link}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button onClick={() => setDark(!dark)}
              className={`w-9 h-9 rounded-full flex items-center justify-center ${dark ? "bg-slate-800 text-yellow-400" : "bg-slate-100 text-slate-600"} transition-all hover:scale-110`}>
              {dark ? "☀️" : "🌙"}
            </button>
            <button onClick={() => setShowModal(true)}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-700 to-emerald-600 text-white text-sm font-semibold shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all duration-200">
              Book Consultation
            </button>
            {/* Mobile hamburger */}
            <button className="md:hidden w-9 h-9 flex items-center justify-center" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="space-y-1.5">
                <div className={`w-5 h-0.5 ${dark ? "bg-white" : "bg-slate-800"} transition-all`} style={{ transform: menuOpen ? "rotate(45deg) translate(4px,4px)" : "" }} />
                <div className={`w-5 h-0.5 ${dark ? "bg-white" : "bg-slate-800"}`} style={{ opacity: menuOpen ? 0 : 1 }} />
                <div className={`w-5 h-0.5 ${dark ? "bg-white" : "bg-slate-800"} transition-all`} style={{ transform: menuOpen ? "rotate(-45deg) translate(4px,-4px)" : "" }} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className={`md:hidden px-5 pb-5 pt-2 ${dark ? "bg-slate-950" : "bg-white"} border-t ${dark ? "border-slate-800" : "border-slate-100"}`}>
            {NAV_LINKS.map(link => (
              <button key={link}
                onClick={() => scrollTo(link.toLowerCase().replace(" ", "-"))}
                className={`block w-full text-left py-3 text-sm font-medium ${theme.muted} hover:text-green-600 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
                {link}
              </button>
            ))}
            <button onClick={() => { setShowModal(true); setMenuOpen(false); }}
              className="mt-4 w-full py-3 rounded-full bg-gradient-to-r from-green-700 to-emerald-600 text-white text-sm font-semibold">
              Book Consultation
            </button>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen hero-gradient overflow-hidden flex items-center">

        {/* Decorative background orbs and grid */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute bottom-0 -left-40 w-80 h-80 rounded-full bg-green-400/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 py-32 grid md:grid-cols-2 gap-16 items-center">

          {/* Left: Headline and CTAs */}
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-ring" />
              <span className="text-emerald-300 text-xs font-medium tracking-widest uppercase">MDCN Registered · Serving All Nigeria</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Quality Care,<br />
              <span className="gradient-text-light">Right Across</span><br />
              Nigeria
            </h1>

            <p className="text-green-100/80 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
              Zorim Care connects Nigerians with certified doctors via Google Meet — with automatic consultation transcripts so you never forget a prescription or lab test result again.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setShowModal(true)}
                className="px-8 py-4 rounded-full bg-white text-green-800 font-bold text-base hover:bg-emerald-50 hover:scale-105 transition-all duration-200 shadow-2xl">
                🎥 Book a Google Meet Consultation
              </button>
              <button onClick={() => scrollTo("telehealth")}
                className="px-8 py-4 rounded-full glass text-white font-semibold text-base hover:bg-white/15 transition-all duration-200 border border-white/20">
                How It Works →
              </button>
            </div>

            {/* Nigerian cities served */}
            <div className="mt-10">
              <p className="text-green-300/60 text-xs uppercase tracking-widest mb-3">Currently Serving</p>
              <div className="flex flex-wrap gap-2">
                {CITIES.map(city => (
                  <span key={city} className="glass text-green-200 text-xs px-3 py-1 rounded-full">{city}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Floating consultation dashboard card */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative float">
              <div className="glass rounded-3xl p-8 w-80 glow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-700 flex items-center justify-center text-2xl">🩺</div>
                  <div>
                    <div className="text-white font-semibold">Google Meet Consultation</div>
                    <div className="text-emerald-300 text-sm">Dr. Chukwuemeka Obi</div>
                  </div>
                </div>

                {/* Simulated transcript preview */}
                <div className="bg-white/10 rounded-2xl p-4 mb-4">
                  <p className="text-green-300 text-xs font-semibold mb-2 uppercase tracking-wider">📝 Live Transcript</p>
                  <p className="text-white/80 text-xs leading-relaxed">
                    "...Blood pressure is elevated at 150/95. I am prescribing Amlodipine 5mg once daily. Please also do a lipid profile at any MedBridge lab..."
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-200 text-sm">Prescription Ready</span>
                    <span className="text-emerald-400 text-sm font-bold">✓ Saved</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full" />
                  </div>
                </div>

                <button onClick={() => setShowModal(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-700 text-white font-semibold text-sm hover:opacity-90 transition-opacity">
                  Start My Consultation
                </button>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 glass rounded-2xl px-4 py-2 flex items-center gap-2">
                <span className="text-emerald-400">●</span>
                <span className="text-white text-xs font-medium">Doctor Online</span>
              </div>
              <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-2 flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="text-white text-xs font-bold">4.9/5.0</div>
                  <div className="text-green-300 text-xs">300+ Reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar at the bottom of the hero */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-5 pb-10">
            <div className="glass rounded-3xl px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold gradient-text-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>{s.value}</div>
                  <div className="text-green-200/70 text-xs mt-1 tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SERVICES SECTION
      ══════════════════════════════════════════════════════════ */}
      <section id="services" className={`py-28 ${theme.bg} mesh-bg`}>
        <div className="max-w-7xl mx-auto px-5">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 ${dark ? "bg-green-900/50 text-emerald-400" : "bg-green-50 text-green-700"}`}>
                Our Services
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Healthcare Built for <span className="gradient-text">Every Nigerian</span>
              </h2>
              <p className={`${theme.muted} text-lg max-w-2xl mx-auto leading-relaxed`}>
                From instant Google Meet doctor consultations with automatic transcripts, to in-home care across major Nigerian cities — Zorim Care covers every need.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 80}>
                <div className={`card-hover ${theme.card} border rounded-3xl p-7 h-full`}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                    {s.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>{s.title}</h3>
                  <p className={`${theme.muted} text-sm leading-relaxed`}>{s.desc}</p>
                  <button onClick={() => scrollTo(s.link)}
                    className="mt-5 text-green-600 text-sm font-semibold hover:text-emerald-600 transition-colors">
                    Learn More →
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TELEHEALTH SECTION — Google Meet + Transcripts explained
      ══════════════════════════════════════════════════════════ */}
      <section id="telehealth" className={`py-28 ${dark ? "bg-slate-900" : "bg-gradient-to-br from-green-50 via-emerald-50 to-white"}`}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left: Explanation */}
            <AnimatedSection>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 ${dark ? "bg-green-900/50 text-emerald-400" : "bg-green-100 text-green-700"}`}>
                Telehealth via Google Meet
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                See a Doctor Online.<br />
                <span className="gradient-text">Keep Every Word on Record.</span>
              </h2>
              <p className={`${theme.muted} text-lg leading-relaxed mb-8`}>
                Every Zorim Care consultation happens on Google Meet — a platform Nigerians already know and trust. After your call, an automatic transcript captures your doctor's exact words: prescriptions, lab test orders, dosage instructions, and follow-up plans. No more struggling to remember what the doctor said.
              </p>

              {/* How it works steps */}
              <div className="space-y-4 mb-8">
                {[
                  { step: "1", title: "Book your consultation", desc: "Choose a specialist, pick a time, and get a unique Google Meet link instantly." },
                  { step: "2", title: "Join your Google Meet session", desc: "Connect with your MDCN-registered doctor via video, audio, or chat — from anywhere in Nigeria." },
                  { step: "3", title: "Receive your transcript", desc: "Google Meet generates a full transcript. Zorim Care also lets you save it as a document for your records." },
                  { step: "4", title: "Get prescriptions & lab orders", desc: "Your transcript contains your exact prescription and any lab tests ordered — share it with any pharmacy or lab." },
                ].map(item => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-700 to-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className={`${theme.muted} text-sm`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setShowModal(true)}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-green-700 to-emerald-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all duration-200">
                🎥 Book My Google Meet Consultation →
              </button>
            </AnimatedSection>

            {/* Right: App mockup showing transcript UI */}
            <AnimatedSection delay={200}>
              <div className="relative">
                <div className={`${dark ? "bg-slate-800" : "bg-white"} rounded-3xl shadow-2xl p-6 border ${dark ? "border-slate-700" : "border-slate-200"}`}>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="font-bold text-base">Consultation Transcript</div>
                      <div className={`${theme.muted} text-xs`}>Dr. Ngozi Adeyemi · 18 May 2026</div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">✓ Saved</span>
                  </div>

                  {/* Transcript content preview */}
                  <div className={`${dark ? "bg-slate-700" : "bg-green-50"} rounded-2xl p-4 mb-4 text-sm leading-relaxed`}>
                    <p className={`${theme.muted} text-xs mb-2 uppercase tracking-wider font-semibold`}>📝 Consultation Notes</p>
                    <p className={theme.text}>Patient presents with persistent headaches and elevated blood pressure reading of <strong>160/100 mmHg</strong>.</p>
                    <p className={`${theme.muted} mt-2`}>Patient is advised to reduce salt intake and begin medication immediately.</p>
                  </div>

                  {/* Prescription block */}
                  <div className={`${dark ? "bg-slate-700" : "bg-white"} border ${dark ? "border-slate-600" : "border-green-200"} rounded-2xl p-4 mb-4`}>
                    <p className="text-green-600 text-xs font-bold uppercase tracking-wider mb-3">💊 Prescription</p>
                    {[
                      { drug: "Amlodipine 5mg", instruction: "Once daily, morning" },
                      { drug: "Losartan 50mg", instruction: "Once daily, evening" },
                    ].map(rx => (
                      <div key={rx.drug} className="flex justify-between items-center py-2 border-b last:border-0 border-dashed border-slate-200">
                        <span className={`font-semibold text-sm ${theme.text}`}>{rx.drug}</span>
                        <span className={`${theme.muted} text-xs`}>{rx.instruction}</span>
                      </div>
                    ))}
                  </div>

                  {/* Lab tests block */}
                  <div className={`${dark ? "bg-slate-700" : "bg-amber-50"} rounded-2xl p-4 mb-4`}>
                    <p className="text-amber-600 text-xs font-bold uppercase tracking-wider mb-3">🧪 Lab Tests Ordered</p>
                    {["Full Blood Count (FBC)", "Lipid Profile", "Kidney Function Test"].map(test => (
                      <div key={test} className="flex items-center gap-2 py-1">
                        <span className="text-amber-500 text-xs">→</span>
                        <span className={`text-sm ${theme.text}`}>{test}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => setShowModal(true)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-700 to-emerald-600 text-white font-semibold text-sm">
                    Start Your Consultation
                  </button>
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-600/20 blur-xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gradient-to-br from-teal-400/20 to-green-600/20 blur-xl" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          HOME CARE SECTION
      ══════════════════════════════════════════════════════════ */}
      <section id="home-care" className={`py-28 ${theme.bg}`}>
        <div className="max-w-7xl mx-auto px-5">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 ${dark ? "bg-teal-900/50 text-teal-400" : "bg-teal-50 text-teal-700"}`}>
                Domiciliary Care
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Professional Care in<br />
                <span className="gradient-text">Your Nigerian Home</span>
              </h2>
              <p className={`${theme.muted} text-lg max-w-2xl mx-auto`}>
                Our trained caregivers visit patients at home across Lagos, Abuja, Port Harcourt, and other major cities — providing dignified, person-centred support every day.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="space-y-5">
                {[
                  { icon: "🌅", title: "Morning & Evening Care Visits", desc: "Personal hygiene, dressing, meal preparation, and medication support — delivered with warmth and respect, every day." },
                  { icon: "🏡", title: "Live-In Caregiving", desc: "A dedicated carer lives with your loved one, providing round-the-clock support and companionship. Available in all major cities." },
                  { icon: "🩸", title: "Chronic Disease Home Management", desc: "Specialist support for hypertension, diabetes, sickle cell disease, and stroke recovery — the most prevalent conditions in Nigeria." },
                  { icon: "👴", title: "Elderly Care & Companionship", desc: "Our carers are trained to support older Nigerians with dignity, cultural sensitivity, and genuine warmth." },
                  { icon: "👨‍👩‍👧", title: "Family Respite Care", desc: "Give family members a well-deserved rest with our professional short-term and emergency cover service." },
                ].map((item, i) => (
                  <AnimatedSection key={item.title} delay={i * 60}>
                    <div className={`flex gap-4 p-5 rounded-2xl ${theme.card} border card-hover`}>
                      <div className="text-3xl flex-shrink-0">{item.icon}</div>
                      <div>
                        <h3 className="font-bold mb-1">{item.title}</h3>
                        <p className={`${theme.muted} text-sm leading-relaxed`}>{item.desc}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="hero-gradient rounded-3xl p-10 text-white">
                <h3 className="text-3xl font-bold mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  Your Care, Your Way
                </h3>
                <p className="text-green-100/80 text-sm leading-relaxed mb-8">
                  Every care plan is built around you — your needs, your preferences, your schedule. We match you with carers from your region who understand your language and culture.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    ["Background-Verified Carers", "Every carer undergoes thorough police and reference checks"],
                    ["MDCN & NMCN Oversight", "Supervised by registered medical and nursing professionals"],
                    ["Level 3+ Care Training", "All caregivers hold professional care qualifications"],
                    ["Fully Insured", "Complete insurance coverage for your total peace of mind"],
                  ].map(([title, desc]) => (
                    <div key={title} className="glass rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-emerald-400">✓</span>
                        <span className="font-semibold text-sm">{title}</span>
                      </div>
                      <p className="text-green-200/70 text-xs ml-5">{desc}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => scrollTo("contact")}
                  className="w-full py-4 rounded-2xl bg-white text-green-800 font-bold text-sm hover:bg-green-50 transition-colors">
                  Request a Home Care Assessment →
                </button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section id="testimonials" className={`py-28 ${dark ? "bg-slate-900" : "bg-gradient-to-br from-green-800 to-emerald-700"}`}>
        <div className="max-w-7xl mx-auto px-5">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 bg-white/15 text-white">
                Testimonials
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Voices from Across Nigeria
              </h2>
              <p className="text-green-100/70 text-lg max-w-xl mx-auto">
                Real stories from the Nigerian families and patients we are privileged to care for.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 100}>
                <div
                  className="glass rounded-3xl p-7 h-full cursor-pointer transition-all duration-300"
                  style={{
                    background: activeTestimonial === i ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
                    transform: activeTestimonial === i ? "scale(1.02)" : "scale(1)",
                  }}
                  onClick={() => setActiveTestimonial(i)}
                >
                  <StarRating count={t.stars} />
                  <p className="text-white/90 text-sm leading-relaxed mt-4 mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-700 flex items-center justify-center text-white text-sm font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{t.name}</div>
                      <div className="text-green-200/70 text-xs">{t.location}{t.age ? `, Age ${t.age}` : ""}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`h-2 rounded-full transition-all duration-300 ${activeTestimonial === i ? "bg-white w-6" : "bg-white/30 w-2"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CONTACT SECTION
      ══════════════════════════════════════════════════════════ */}
      <section id="contact" className={`py-28 ${theme.bg} mesh-bg`}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-16 items-start">

            <AnimatedSection>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 ${dark ? "bg-green-900/50 text-emerald-400" : "bg-green-50 text-green-700"}`}>
                Get In Touch
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-5" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Begin Your<br />
                <span className="gradient-text">Care Journey Today</span>
              </h2>
              <p className={`${theme.muted} text-lg leading-relaxed mb-10`}>
                Our care advisors are ready to help you find the right solution — whether that's an immediate Google Meet consultation or in-home domiciliary care.
              </p>

              <div className="space-y-5">
                {[
                  { icon: "📞", label: "Phone / WhatsApp", value: "0810 163 0202", sub: "Mon–Sat 7am–9pm" },
                  { icon: "📧", label: "Email", value: "zorimcare@gmail.com", sub: "We respond within 2 hours" },
                  { icon: "📍", label: "Head Office", value: "Lokogoma, Abuja", sub: "Serving Lagos, Abuja, PH & more" },
                  { icon: "🚨", label: "Emergency Line", value: "0704 339 7245", sub: "24/7 for existing patients" },
                ].map(item => (
                  <div key={item.label} className={`flex gap-4 p-5 rounded-2xl ${theme.card} border`}>
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <div className={`${theme.muted} text-xs font-semibold uppercase tracking-wider mb-0.5`}>{item.label}</div>
                      <div className="font-bold">{item.value}</div>
                      <div className={`${theme.muted} text-xs mt-0.5`}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection delay={200}>
              <div className={`${theme.card} border rounded-3xl p-8 shadow-xl`}>
                <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>Send Us a Message</h3>
                <p className={`${theme.muted} text-sm mb-7`}>Or call us directly — a care advisor will respond within 2 hours.</p>

                {submitted ? (
                  <div className="py-16 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h4 className="text-xl font-bold mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>Thank You!</h4>
                    <p className={`${theme.muted} text-sm`}>A Zorim Care advisor will contact you within 2 hours.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`text-xs font-semibold ${theme.muted} block mb-1.5 uppercase tracking-wider`}>Full Name *</label>
                        <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                          className={`w-full px-4 py-3 rounded-xl border text-sm ${dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"} focus:border-green-500 transition-colors`}
                          placeholder="Your full name" />
                      </div>
                      <div>
                        <label className={`text-xs font-semibold ${theme.muted} block mb-1.5 uppercase tracking-wider`}>Phone *</label>
                        <input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                          className={`w-full px-4 py-3 rounded-xl border text-sm ${dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"} focus:border-green-500 transition-colors`}
                          placeholder="e.g. 0803 123 4567" />
                      </div>
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${theme.muted} block mb-1.5 uppercase tracking-wider`}>Email Address</label>
                      <input value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} type="email"
                        className={`w-full px-4 py-3 rounded-xl border text-sm ${dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"} focus:border-green-500 transition-colors`}
                        placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${theme.muted} block mb-1.5 uppercase tracking-wider`}>Your City</label>
                      <select value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-xl border text-sm ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"} focus:border-green-500 transition-colors`}>
                        <option value="">Select your city...</option>
                        {CITIES.map(c => <option key={c}>{c}</option>)}
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${theme.muted} block mb-1.5 uppercase tracking-wider`}>Service Required</label>
                      <select value={formData.service} onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-xl border text-sm ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"} focus:border-green-500 transition-colors`}>
                        <option value="">Select a service...</option>
                        <option>Google Meet Consultation</option>
                        <option>Domiciliary / Home Care</option>
                        <option>Live-In Care</option>
                        <option>Chronic Disease Management</option>
                        <option>Mental Health Support</option>
                        <option>Lab Test Coordination</option>
                      </select>
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${theme.muted} block mb-1.5 uppercase tracking-wider`}>Tell Us About Your Needs</label>
                      <textarea value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} rows={4}
                        className={`w-full px-4 py-3 rounded-xl border text-sm resize-none ${dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"} focus:border-green-500 transition-colors`}
                        placeholder="Describe your health concern, care needs, or any questions you have..." />
                    </div>
                    <button onClick={handleSubmit}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 text-white font-bold text-base hover:shadow-xl hover:shadow-green-500/25 hover:scale-[1.02] transition-all duration-200">
                      Send Message — We'll Call You Back ✓
                    </button>
                    <p className={`${theme.muted} text-xs text-center`}>
                      🔒 Your information is 100% confidential and securely stored.
                    </p>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          HEALTH TOOLS SECTION
      ══════════════════════════════════════════════════════════ */}
      <section id="health-tools" className={`py-24 ${dark ? "bg-slate-900" : "bg-gradient-to-b from-white to-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-5">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 ${dark ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-50 text-emerald-700"}`}>
                🛠 Health Tools
              </div>
              <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${dark ? "text-white" : "text-slate-900"}`}
                style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Your Personal Health Toolkit
              </h2>
              <p className={`${dark ? "text-slate-400" : "text-slate-500"} max-w-xl mx-auto`}>
                Free tools to help you understand your health — always backed by the advice to consult a qualified doctor.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* BMI Calculator Card */}
              <div className={`rounded-3xl p-8 border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-lg hover:shadow-xl transition-shadow`}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-3xl mb-5">⚖️</div>
                <h3 className={`text-2xl font-bold mb-2 ${dark ? "text-white" : "text-slate-900"}`} style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  BMI Calculator
                </h3>
                <p className={`${dark ? "text-slate-400" : "text-slate-500"} text-sm mb-6 leading-relaxed`}>
                  Calculate your Body Mass Index instantly. Supports metric and imperial units with personalised health guidance based on your result.
                </p>
                <ul className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"} space-y-1.5 mb-6`}>
                  <li>✅ Metric & imperial units</li>
                  <li>✅ Visual BMI scale</li>
                  <li>✅ Personalised health advice</li>
                </ul>
                <button onClick={() => setShowBMI(true)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold hover:scale-[1.02] transition-all duration-200">
                  Calculate My BMI ⚖️
                </button>
              </div>

              {/* AI Medical Intake Card */}
              <div className={`rounded-3xl p-8 border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-lg hover:shadow-xl transition-shadow`}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-3xl mb-5">🤖</div>
                <h3 className={`text-2xl font-bold mb-2 ${dark ? "text-white" : "text-slate-900"}`} style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  AI Symptom Assessment
                </h3>
                <p className={`${dark ? "text-slate-400" : "text-slate-500"} text-sm mb-6 leading-relaxed`}>
                  Describe your symptoms conversationally. Our AI collects your health history and generates a structured clinical summary for your doctor.
                </p>
                <ul className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"} space-y-1.5 mb-6`}>
                  <li>✅ Differential diagnosis suggestions</li>
                  <li>✅ Urgency & risk assessment</li>
                  <li>✅ Red-flag warnings</li>
                  <li>✅ Provider-ready summary</li>
                </ul>
                <button onClick={() => setShowAI(true)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-bold hover:scale-[1.02] transition-all duration-200">
                  Start AI Assessment 🤖
                </button>
              </div>
            </div>

            <p className={`text-center text-xs ${dark ? "text-slate-500" : "text-slate-400"} mt-8 max-w-lg mx-auto`}>
              ⚠️ All tools are for informational purposes only. Results do not constitute a medical diagnosis and must be reviewed by a qualified healthcare professional.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer className={`${dark ? "bg-slate-950 border-slate-800" : "bg-slate-900"} border-t py-14`}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img src="data:image/png;base64,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" alt="Zorim Care" style={{height:"56px", width:"auto", filter:"brightness(0) invert(1)"}}/>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-5">
                Delivering compassionate telehealth and domiciliary care services across Nigeria — connecting patients with MDCN-registered doctors via Google Meet, with automatic consultation transcripts.
              </p>
              <div className="flex gap-3">
                {["📘", "🐦", "📸", "💬"].map((icon, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-slate-800 hover:bg-green-700 flex items-center justify-center cursor-pointer transition-colors text-sm">{icon}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-4 text-sm">Services</div>
              {["Google Meet Consultations", "Domiciliary Care", "Live-In Care", "Chronic Disease Care", "Mental Health Support", "Lab Test Coordination"].map(s => (
                <div key={s} className="text-slate-400 text-sm mb-2 hover:text-emerald-400 cursor-pointer transition-colors">{s}</div>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold mb-4 text-sm">Company</div>
              {["About Zorim Care", "Our Doctors", "MDCN Registration", "Privacy Policy", "Terms of Service", "Careers"].map(s => (
                <div key={s} className="text-slate-400 text-sm mb-2 hover:text-emerald-400 cursor-pointer transition-colors">{s}</div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-slate-500 text-xs">© 2026 Zorim Care Nigeria Ltd. RC: 1234567. MDCN Registered Provider.</p>
            <div className="flex gap-4 text-slate-500 text-xs">
              <span>🏅 MDCN Registered</span>
              <span>🎥 Google Meet Powered</span>
              <span>🇳🇬 Made for Nigeria</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
