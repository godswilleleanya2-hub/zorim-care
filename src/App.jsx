import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Services", "Telehealth", "Elderly Care", "Testimonials", "Contact"];

const SERVICES = [
  {
    icon: "🏥",
    title: "24/7 Virtual Consultations",
    desc: "Board-certified physicians available around the clock via secure video, phone, or chat — from the comfort of your home.",
    color: "from-blue-600 to-cyan-500",
  },
  {
    icon: "💊",
    title: "Medication Management",
    desc: "Personalised medication reminders, prescription delivery, and real-time monitoring by dedicated care coordinators.",
    color: "from-indigo-600 to-blue-500",
  },
  {
    icon: "🤝",
    title: "Domiciliary Care",
    desc: "Compassionate, trained carers visiting you at home — supporting daily living, personal care, and companionship.",
    color: "from-teal-600 to-emerald-500",
  },
  {
    icon: "❤️",
    title: "Chronic Condition Care",
    desc: "Ongoing management of diabetes, heart disease, COPD, and more — with specialist oversight and care plans.",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: "🧠",
    title: "Mental Wellbeing Support",
    desc: "Accredited counsellors and therapists offering mental health support, dementia care, and cognitive assessments.",
    color: "from-violet-600 to-purple-500",
  },
  {
    icon: "🚑",
    title: "Emergency Response",
    desc: "Rapid emergency escalation pathways with GPS-linked alert devices and direct NHS liaison services.",
    color: "from-orange-500 to-amber-500",
  },
];

const TESTIMONIALS = [
  {
    name: "Margaret H.",
    age: 78,
    location: "Birmingham",
    text: "SilverCare Connect UK has transformed my life. My carer arrives every morning with a smile, and my doctor is just a tap away. I finally feel safe in my own home.",
    avatar: "MH",
    stars: 5,
  },
  {
    name: "Robert & Susan T.",
    age: null,
    location: "Manchester",
    text: "After my father's stroke, we were desperate. SilverCare arranged everything within 48 hours — from home carers to telehealth monitoring. The team is extraordinary.",
    avatar: "RT",
    stars: 5,
  },
  {
    name: "Dorothy W.",
    age: 84,
    location: "Leeds",
    text: "I was sceptical about video consultations at my age, but the SilverCare team made it so simple. My cardiologist reviews my readings weekly. It's truly brilliant.",
    avatar: "DW",
    stars: 5,
  },
];

const STATS = [
  { value: "15,000+", label: "Patients Cared For" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Always Available" },
  { value: "500+", label: "Qualified Carers" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

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

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-amber-400 text-sm">★</span>
      ))}
    </div>
  );
}

export default function SilverCareApp() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "", service: "" });
  const [submitted, setSubmitted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const theme = {
    bg: dark ? "bg-slate-950" : "bg-slate-50",
    text: dark ? "text-slate-100" : "text-slate-800",
    muted: dark ? "text-slate-400" : "text-slate-500",
    card: dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
    navBg: scrolled ? (dark ? "bg-slate-950/95 backdrop-blur-xl shadow-2xl" : "bg-white/95 backdrop-blur-xl shadow-lg") : "bg-transparent",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", email: "", phone: "", message: "", service: "" });
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className={`${theme.bg} ${theme.text} min-h-screen font-sans transition-colors duration-300`}
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* Custom CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, .serif { font-family: 'Cormorant Garamond', serif; }
        .hero-gradient { background: linear-gradient(135deg, #0f2a6e 0%, #1a4fa8 40%, #0891b2 100%); }
        .glass { background: rgba(255,255,255,0.08); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15); }
        .glow { box-shadow: 0 0 60px rgba(8, 145, 178, 0.3); }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(8,145,178,0.15); }
        .shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); background-size: 200% 100%; animation: shimmer 3s infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .pulse-ring { animation: pulse-ring 2.5s infinite; }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(8,145,178,0.4); } 70% { box-shadow: 0 0 0 20px rgba(8,145,178,0); } 100% { box-shadow: 0 0 0 0 rgba(8,145,178,0); } }
        .float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        .gradient-text { background: linear-gradient(135deg, #1a4fa8, #0891b2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .gradient-text-light { background: linear-gradient(135deg, #93c5fd, #67e8f9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        input, textarea, select { outline: none !important; }
        input:focus, textarea:focus, select:focus { ring: none !important; }
        .mesh-bg { background-image: radial-gradient(circle at 20% 50%, rgba(26,79,168,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(8,145,178,0.06) 0%, transparent 40%), radial-gradient(circle at 60% 80%, rgba(99,102,241,0.05) 0%, transparent 40%); }
      `}</style>

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${theme.navBg}`}>
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("hero")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">SC</div>
            <div>
              <div className="text-base font-bold leading-tight" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                <span className="text-blue-700 dark:text-blue-400">SilverCare</span>
                <span className={theme.text}> Connect UK</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <button key={link} onClick={() => scrollTo(link.toLowerCase().replace(" ", "-"))}
                className={`text-sm font-medium tracking-wide ${theme.muted} hover:text-blue-600 transition-colors duration-200`}>
                {link}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setDark(!dark)}
              className={`w-9 h-9 rounded-full flex items-center justify-center ${dark ? "bg-slate-800 text-yellow-400" : "bg-slate-100 text-slate-600"} transition-all hover:scale-110`}>
              {dark ? "☀️" : "🌙"}
            </button>
            <button onClick={() => scrollTo("contact")}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-700 to-cyan-600 text-white text-sm font-semibold shadow-lg hover:shadow-cyan-500/30 hover:scale-105 transition-all duration-200">
              Book Care
            </button>
            <button className="md:hidden w-9 h-9 flex items-center justify-center" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="space-y-1.5">
                <div className={`w-5 h-0.5 ${dark ? "bg-white" : "bg-slate-800"} transition-all`} style={{ transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "" }} />
                <div className={`w-5 h-0.5 ${dark ? "bg-white" : "bg-slate-800"} transition-all`} style={{ opacity: menuOpen ? 0 : 1 }} />
                <div className={`w-5 h-0.5 ${dark ? "bg-white" : "bg-slate-800"} transition-all`} style={{ transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "" }} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={`md:hidden px-5 pb-5 pt-2 ${dark ? "bg-slate-950" : "bg-white"} border-t ${dark ? "border-slate-800" : "border-slate-100"}`}>
            {NAV_LINKS.map(link => (
              <button key={link} onClick={() => scrollTo(link.toLowerCase().replace(" ", "-"))}
                className={`block w-full text-left py-3 text-sm font-medium ${theme.muted} hover:text-blue-600 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
                {link}
              </button>
            ))}
            <button onClick={() => scrollTo("contact")}
              className="mt-4 w-full py-3 rounded-full bg-gradient-to-r from-blue-700 to-cyan-600 text-white text-sm font-semibold">
              Book Care Now
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen hero-gradient overflow-hidden flex items-center">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute bottom-0 -left-40 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-indigo-400/5 blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 py-32 grid md:grid-cols-2 gap-16 items-center">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-ring" />
              <span className="text-cyan-300 text-xs font-medium tracking-widest uppercase">NHS Registered · CQC Regulated</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Premium Care,<br />
              <span className="gradient-text-light">Delivered with</span><br />
              Compassion
            </h1>

            <p className="text-blue-100/80 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
              SilverCare Connect UK brings world-class telehealth and domiciliary care directly to your door — keeping you safe, independent, and thriving.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => scrollTo("contact")}
                className="px-8 py-4 rounded-full bg-white text-blue-800 font-bold text-base hover:bg-cyan-50 hover:scale-105 transition-all duration-200 shadow-2xl">
                Book a Free Assessment
              </button>
              <button onClick={() => scrollTo("telehealth")}
                className="px-8 py-4 rounded-full glass text-white font-semibold text-base hover:bg-white/15 transition-all duration-200 border border-white/20">
                Explore Telehealth →
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-12">
              {["🏅 CQC Registered", "🔒 GDPR Compliant", "✅ NHS Partner"].map(b => (
                <div key={b} className="text-blue-200/70 text-sm font-medium">{b}</div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative float">
              {/* Main card */}
              <div className="glass rounded-3xl p-8 w-80 glow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl">🏥</div>
                  <div>
                    <div className="text-white font-semibold">Virtual Consultation</div>
                    <div className="text-cyan-300 text-sm">Dr. Sarah Mitchell</div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-200 text-sm">Heart Rate</span>
                    <span className="text-emerald-400 text-sm font-bold">72 BPM ✓</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" />
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-200 text-sm">Blood Pressure</span>
                    <span className="text-cyan-300 text-sm font-bold">120/80</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full" />
                  </div>
                </div>
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity">
                  Join Video Call Now
                </button>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 glass rounded-2xl px-4 py-2 flex items-center gap-2">
                <span className="text-emerald-400">●</span>
                <span className="text-white text-xs font-medium">Doctor Online</span>
              </div>
              <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-2 flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="text-white text-xs font-bold">4.9/5.0</div>
                  <div className="text-blue-300 text-xs">500+ Reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-5 pb-10">
            <div className="glass rounded-3xl px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white gradient-text-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>{s.value}</div>
                  <div className="text-blue-200/70 text-xs mt-1 tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className={`py-28 ${theme.bg} mesh-bg`}>
        <div className="max-w-7xl mx-auto px-5">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 ${dark ? "bg-blue-900/50 text-cyan-400" : "bg-blue-50 text-blue-700"}`}>
                Our Services
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Comprehensive <span className="gradient-text">Care Solutions</span>
              </h2>
              <p className={`${theme.muted} text-lg max-w-2xl mx-auto leading-relaxed`}>
                From urgent telehealth consultations to daily domiciliary support, every service is designed around your comfort, dignity, and wellbeing.
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
                  <button className="mt-5 text-blue-600 text-sm font-semibold hover:text-cyan-600 transition-colors">
                    Learn More →
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* TELEHEALTH */}
      <section id="telehealth" className={`py-28 ${dark ? "bg-slate-900" : "bg-gradient-to-br from-blue-50 via-cyan-50 to-white"}`}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 ${dark ? "bg-blue-900/50 text-cyan-400" : "bg-blue-100 text-blue-700"}`}>
                Telehealth Platform
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                World-Class Healthcare,<br />
                <span className="gradient-text">Right at Your Fingertips</span>
              </h2>
              <p className={`${theme.muted} text-lg leading-relaxed mb-8`}>
                Our GDPR-compliant telehealth platform connects you with NHS-registered doctors, specialist nurses, and therapists via HD video consultations — no travel, no waiting rooms, no stress.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "HD video, phone & secure chat consultations",
                  "Wearable health device integration & monitoring",
                  "Electronic prescriptions delivered to your door",
                  "Full medical records & care history dashboard",
                  "Multi-language support & BSL interpretation",
                ].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className={`${theme.muted} text-sm`}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => scrollTo("contact")}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-200">
                Start Your Consultation →
              </button>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="relative">
                {/* Device mockup */}
                <div className={`${dark ? "bg-slate-800" : "bg-white"} rounded-3xl shadow-2xl p-6 border ${dark ? "border-slate-700" : "border-slate-200"}`}>
                  {/* App header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="font-bold text-base">Good morning, Dorothy</div>
                      <div className={`${theme.muted} text-xs`}>Sunday, 17 May 2026</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">DW</div>
                  </div>
                  {/* Vitals */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: "Heart Rate", value: "72", unit: "BPM", color: "text-rose-500", icon: "❤️" },
                      { label: "SpO2", value: "98", unit: "%", color: "text-blue-500", icon: "🫁" },
                      { label: "Steps", value: "4,291", unit: "today", color: "text-emerald-500", icon: "👣" },
                    ].map(v => (
                      <div key={v.label} className={`${dark ? "bg-slate-700" : "bg-slate-50"} rounded-2xl p-3 text-center`}>
                        <div className="text-xl mb-1">{v.icon}</div>
                        <div className={`font-bold text-sm ${v.color}`}>{v.value}</div>
                        <div className={`${theme.muted} text-xs`}>{v.unit}</div>
                      </div>
                    ))}
                  </div>
                  {/* Upcoming */}
                  <div className={`${dark ? "bg-slate-700" : "bg-blue-50"} rounded-2xl p-4 mb-4`}>
                    <div className={`text-xs font-semibold ${theme.muted} mb-3 uppercase tracking-wider`}>Upcoming</div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm">👨‍⚕️</div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">Dr. James Adeyemi</div>
                        <div className={`${theme.muted} text-xs`}>Cardiology Review · 2:30 PM</div>
                      </div>
                      <button className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold">Join</button>
                    </div>
                  </div>
                  {/* Medication */}
                  <div className={`${dark ? "bg-slate-700" : "bg-emerald-50"} rounded-2xl p-4`}>
                    <div className={`text-xs font-semibold ${theme.muted} mb-2 uppercase tracking-wider`}>Medication Reminder</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Ramipril 5mg</span>
                      <button className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold">Mark Taken ✓</button>
                    </div>
                  </div>
                </div>
                {/* Decorative */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 blur-xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-600/20 blur-xl" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ELDERLY CARE */}
      <section id="elderly-care" className={`py-28 ${theme.bg}`}>
        <div className="max-w-7xl mx-auto px-5">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 ${dark ? "bg-teal-900/50 text-teal-400" : "bg-teal-50 text-teal-700"}`}>
                Domiciliary Care
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Caring for Your Loved Ones<br />
                <span className="gradient-text">In the Comfort of Home</span>
              </h2>
              <p className={`${theme.muted} text-lg max-w-2xl mx-auto`}>
                Our compassionate care team provides dignified, person-centred support — from morning routines to overnight care — so independence never has to be compromised.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="space-y-5">
                {[
                  { icon: "🌅", title: "Morning & Evening Care", desc: "Personal hygiene, dressing, meal preparation, and medication support — delivered with warmth and respect every day." },
                  { icon: "🏡", title: "Live-In Care", desc: "Round-the-clock dedicated carers living with your loved one, providing comprehensive support and genuine companionship." },
                  { icon: "🧩", title: "Dementia Specialist Care", desc: "Trained dementia carers using evidence-based approaches — creating calm, familiar routines that reduce anxiety." },
                  { icon: "♿", title: "Physical Disability Support", desc: "Expert support for mobility, transfers, and physical rehabilitation — enabling freedom and dignity at home." },
                  { icon: "👨‍👩‍👧", title: "Respite Care for Families", desc: "Give family carers a well-deserved rest with our professional short-term or emergency cover service." },
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
              <div className="relative">
                <div className="hero-gradient rounded-3xl p-10 text-white">
                  <h3 className="text-3xl font-bold mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                    Your Care, Your Way
                  </h3>
                  <p className="text-blue-100/80 text-sm leading-relaxed mb-8">
                    Every care plan is built around you — your needs, your preferences, your schedule. We match you with carers who share your values and truly understand you.
                  </p>
                  <div className="space-y-4 mb-8">
                    {[
                      ["DBS Checked Carers", "Every carer undergoes enhanced DBS checks"],
                      ["Care Quality Commission", "Regulated and inspected for your safety"],
                      ["Specialist Training", "Our team holds Level 3+ care qualifications"],
                      ["Insurance & Bonded", "Fully insured for complete peace of mind"],
                    ].map(([title, desc]) => (
                      <div key={title} className="glass rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-cyan-400">✓</span>
                          <span className="font-semibold text-sm">{title}</span>
                        </div>
                        <p className="text-blue-200/70 text-xs ml-5">{desc}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => scrollTo("contact")}
                    className="w-full py-4 rounded-2xl bg-white text-blue-800 font-bold text-sm hover:bg-cyan-50 transition-colors">
                    Request a Care Assessment →
                  </button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className={`py-28 ${dark ? "bg-slate-900" : "bg-gradient-to-br from-blue-700 to-cyan-700"}`}>
        <div className="max-w-7xl mx-auto px-5">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 bg-white/15 text-white">
                Testimonials
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Voices of Our Community
              </h2>
              <p className="text-blue-100/70 text-lg max-w-xl mx-auto">
                Real stories from the families and patients we are privileged to care for every day.
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{t.name}</div>
                      <div className="text-blue-200/70 text-xs">{t.location}{t.age ? `, Age ${t.age}` : ""}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeTestimonial === i ? "bg-white w-6" : "bg-white/30"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className={`py-28 ${theme.bg} mesh-bg`}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <AnimatedSection>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 ${dark ? "bg-blue-900/50 text-cyan-400" : "bg-blue-50 text-blue-700"}`}>
                Get In Touch
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-5" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Begin Your<br />
                <span className="gradient-text">Care Journey Today</span>
              </h2>
              <p className={`${theme.muted} text-lg leading-relaxed mb-10`}>
                Our friendly care advisors are ready to help you find the perfect care solution. Reach out today for a free, no-obligation assessment.
              </p>

              <div className="space-y-5">
                {[
                  { icon: "📞", label: "Phone", value: "0800 123 4567", sub: "Mon–Fri 8am–8pm, Sat 9am–5pm" },
                  { icon: "📧", label: "Email", value: "care@silvercareconnect.co.uk", sub: "We respond within 2 hours" },
                  { icon: "📍", label: "Head Office", value: "Central London, EC1A 1BB", sub: "Serving all of England & Wales" },
                  { icon: "🚨", label: "Emergency Line", value: "0800 999 7777", sub: "24/7 for existing clients" },
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

            <AnimatedSection delay={200}>
              <div className={`${theme.card} border rounded-3xl p-8 shadow-xl`}>
                <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>Request a Free Assessment</h3>
                <p className={`${theme.muted} text-sm mb-7`}>We'll contact you within 2 hours to arrange your free home assessment.</p>

                {submitted ? (
                  <div className="py-16 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h4 className="text-xl font-bold mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>Thank You!</h4>
                    <p className={`${theme.muted} text-sm`}>A care advisor will contact you within 2 hours.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`text-xs font-semibold ${theme.muted} block mb-1.5 uppercase tracking-wider`}>Full Name *</label>
                        <input value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} required
                          className={`w-full px-4 py-3 rounded-xl border text-sm ${dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"} focus:border-blue-500 transition-colors`}
                          placeholder="Your full name" />
                      </div>
                      <div>
                        <label className={`text-xs font-semibold ${theme.muted} block mb-1.5 uppercase tracking-wider`}>Phone *</label>
                        <input value={formData.phone} onChange={e => setFormData(p => ({...p, phone: e.target.value}))} required
                          className={`w-full px-4 py-3 rounded-xl border text-sm ${dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"} focus:border-blue-500 transition-colors`}
                          placeholder="Your phone number" />
                      </div>
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${theme.muted} block mb-1.5 uppercase tracking-wider`}>Email Address *</label>
                      <input value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} required type="email"
                        className={`w-full px-4 py-3 rounded-xl border text-sm ${dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"} focus:border-blue-500 transition-colors`}
                        placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${theme.muted} block mb-1.5 uppercase tracking-wider`}>Service Required</label>
                      <select value={formData.service} onChange={e => setFormData(p => ({...p, service: e.target.value}))}
                        className={`w-full px-4 py-3 rounded-xl border text-sm ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"} focus:border-blue-500 transition-colors`}>
                        <option value="">Select a service...</option>
                        <option>Telehealth Consultation</option>
                        <option>Domiciliary Care</option>
                        <option>Live-In Care</option>
                        <option>Dementia Care</option>
                        <option>Respite Care</option>
                        <option>Emergency Response</option>
                      </select>
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${theme.muted} block mb-1.5 uppercase tracking-wider`}>Tell Us About Your Needs</label>
                      <textarea value={formData.message} onChange={e => setFormData(p => ({...p, message: e.target.value}))} rows={4}
                        className={`w-full px-4 py-3 rounded-xl border text-sm resize-none ${dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"} focus:border-blue-500 transition-colors`}
                        placeholder="Please describe the care needs, any medical conditions, and your preferred care schedule..." />
                    </div>
                    <button onClick={handleSubmit}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-bold text-base hover:shadow-xl hover:shadow-cyan-500/25 hover:scale-[1.02] transition-all duration-200">
                      Send Request — It's Free ✓
                    </button>
                    <p className={`${theme.muted} text-xs text-center`}>
                      🔒 Your information is 100% confidential and GDPR protected.
                    </p>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`${dark ? "bg-slate-950 border-slate-800" : "bg-slate-900"} border-t py-14`}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">SC</div>
                <div className="text-white font-bold text-lg" style={{ fontFamily: "Cormorant Garamond, serif" }}>SilverCare Connect UK</div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-5">
                Delivering compassionate, CQC-regulated telehealth and domiciliary care services across England and Wales since 2018.
              </p>
              <div className="flex gap-3">
                {["📘", "🐦", "📸", "💼"].map((icon, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-slate-800 hover:bg-blue-700 flex items-center justify-center cursor-pointer transition-colors text-sm">{icon}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-4 text-sm">Services</div>
              {["Telehealth", "Domiciliary Care", "Live-In Care", "Dementia Care", "Medication Management", "Emergency Response"].map(s => (
                <div key={s} className="text-slate-400 text-sm mb-2 hover:text-cyan-400 cursor-pointer transition-colors">{s}</div>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold mb-4 text-sm">Company</div>
              {["About Us", "Our Carers", "CQC Registration", "Privacy Policy", "Terms of Service", "Careers"].map(s => (
                <div key={s} className="text-slate-400 text-sm mb-2 hover:text-cyan-400 cursor-pointer transition-colors">{s}</div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-slate-500 text-xs">© 2026 SilverCare Connect UK Ltd. Registered in England & Wales. CQC Registered Provider.</p>
            <div className="flex gap-4 text-slate-500 text-xs">
              <span>🏅 CQC Regulated</span>
              <span>🔒 GDPR Compliant</span>
              <span>✅ NHS Assured</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
