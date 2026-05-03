import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getDomains, getCategories } from "../lib/db";
import FeaturedSlider from "../components/FeaturedSlider";
import Newsletter from "../components/Newsletter";

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const allDomains = useMemo(() => getDomains(), []);
  const categories = useMemo(() => getCategories(), []);

  const featured = allDomains.filter((d) => d.featured && d.status === "AVAILABLE");

  const suggestions = q.trim()
    ? allDomains.filter((d) =>
        `${d.name}${d.tld}`.toLowerCase().includes(q.toLowerCase()) ||
        d.arabicName?.includes(q)
      ).slice(0, 5)
    : [];

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) navigate(`/domains?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <>
      {/* ===== HERO SECTION — NameClub style ===== */}
      <section className="relative overflow-hidden bg-white">
        {/* Top cyan glow */}
        <div className="hero-glow-top" />

        <div className="relative max-w-6xl mx-auto px-5 lg:px-8 pt-20 md:pt-28 pb-16 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#91eff2]/40 bg-[#91eff2]/10 text-[#2ab0b4] text-xs tracking-widest mb-7 font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-[#91eff2] animate-pulse" />
            بوتيك النطاقات العربية الفاخرة
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight text-[#0a1a3a]"
          >
            امتلك <span className="cyan-text">هويّتك</span>
            <br />
            الرقميّة
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-9"
          >
            مجموعة مُختارة بعناية من النطاقات العربية النادرة، من كلمة واحدة،
            صُمّمت لتمنح علامتك التجارية حضوراً عالمياً يليق بطموحك.
          </motion.p>

          {/* Search */}
          <motion.form
            onSubmit={onSearchSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 max-w-2xl mx-auto relative"
          >
            <div className="bg-white border-2 border-gray-200 rounded-full flex items-center pr-2 pl-2 py-2 shadow-xl shadow-gray-200/50 hover:border-[#91eff2]/60 transition-colors focus-within:border-[#91eff2] focus-within:shadow-[#91eff2]/20">
              <span className="px-4 text-[#91eff2]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="text"
                placeholder="ابحث عن نطاقك المثالي... (مثال: aqar)"
                className="flex-1 bg-transparent outline-none text-[#0a1a3a] placeholder:text-gray-400 text-base py-2"
              />
              <button type="submit" className="btn-cyan px-6 py-3 rounded-full text-sm">
                بحث
              </button>
            </div>

            {/* live suggestions */}
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute mt-2 w-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50 text-right z-20"
              >
                {suggestions.map((s) => (
                  <Link
                    key={s.id}
                    to={`/domain/${s.name}${s.tld}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-[#91eff2]/5 border-b border-gray-100 last:border-0"
                  >
                    <span className="domain-display text-lg text-[#0a1a3a]">
                      {s.name}<span className="text-[#5bc9cc]">{s.tld}</span>
                    </span>
                    <span className="text-xs text-gray-400">
                      {s.price ? `$${s.price.toLocaleString("en-US")}` : "قدّم عرضاً"}
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}
          </motion.form>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {[
              { v: "+150", l: "نطاق فاخر" },
              { v: "+40", l: "علامة تجارية" },
              { v: "100%", l: "نقل آمن" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="cyan-text font-black text-3xl md:text-4xl">{s.v}</div>
                <div className="text-gray-400 text-xs md:text-sm mt-1 tracking-wider">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CATEGORIES STRIP ===== */}
      <section className="border-y border-gray-100 bg-gray-50/60 py-6">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="text-gray-400 ml-2">تصفّح حسب الفئة:</span>
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/domains?cat=${c.slug}`}
              className="px-4 py-1.5 rounded-full border border-gray-200 hover:border-[#91eff2] hover:text-[#2ab0b4] hover:bg-[#91eff2]/5 transition text-gray-600"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURED DOMAINS SLIDER ===== */}
      <section className="relative max-w-7xl mx-auto px-5 lg:px-8 py-20 overflow-hidden">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-[#5bc9cc] text-xs tracking-[0.3em] uppercase mb-2 font-semibold">
              The Collection
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#0a1a3a] section-title-line">
              نطاقات مميّزة
            </h2>
          </div>
          <Link to="/domains" className="text-sm text-gray-400 hover:text-[#2ab0b4] hidden md:inline transition">
            عرض الكل ←
          </Link>
        </div>

        {/* Horizontal Slider */}
        <FeaturedSlider domains={featured} />
      </section>

      {/* ===== 3-COLUMN FEATURES ===== */}
      <section className="relative overflow-hidden">
        {/* Bottom cyan glow */}
        <div className="hero-glow-bottom" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#0a1a3a]">
              لماذا <span className="cyan-text">نِطاقات</span>؟
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              نوفّر تجربة متكاملة لامتلاك نطاقك الفاخر بأمان واحترافية عالية.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                t: "ضمان Escrow.com",
                d: "كل عملية شراء تتم بأمان عبر منصة الضمان العالمية، حماية كاملة للطرفين.",
                i: "🛡️",
                color: "from-[#91eff2]/20 to-[#91eff2]/5",
              },
              {
                t: "نقل ملكية فوري",
                d: "ننقل ملكية النطاق إلى حسابك خلال 24-72 ساعة بعد إتمام الدفع.",
                i: "⚡",
                color: "from-[#91eff2]/15 to-[#5bc9cc]/5",
              },
              {
                t: "استشارة مجانية",
                d: "فريقنا يساعدك في اختيار النطاق المناسب لرؤية علامتك التجارية.",
                i: "✦",
                color: "from-[#91eff2]/10 to-white",
              },
            ].map((c) => (
              <motion.div
                key={c.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="luxury-card rounded-2xl p-8 text-center group"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform`}>
                  {c.i}
                </div>
                <div className="font-bold text-[#0a1a3a] text-lg mb-2">{c.t}</div>
                <div className="text-gray-500 text-sm leading-7">{c.d}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VIP NEWSLETTER SECTION ===== */}
      <Newsletter />

      {/* ===== CTA SECTION with bottom glow ===== */}
      <section className="relative overflow-hidden bg-white py-20">
        <div className="hero-glow-bottom" style={{ bottom: "-300px" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-5 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-[#0a1a3a]"
          >
            علامتك التجارية تستحق <span className="cyan-text">الأفضل</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-500 text-lg leading-8"
          >
            اكتشف النطاق المثالي لمشروعك القادم، واحجز اسمك في العالم الرقمي اليوم.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/domains" className="btn-cyan px-8 py-4 rounded-full text-base">
              تصفّح النطاقات
            </Link>
            <Link to="/contact" className="btn-ghost px-8 py-4 rounded-full text-base border-2">
              تواصل معنا
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
