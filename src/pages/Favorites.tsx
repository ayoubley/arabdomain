import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFavoriteDomains, toggleFavorite } from "../lib/favorites";
import type { Domain } from "../lib/types";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Domain[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setFavorites(getFavoriteDomains());
  }, [refresh]);

  function handleToggle(domainId: string) {
    toggleFavorite(domainId);
    setRefresh((r) => r + 1);
  }

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[#5bc9cc] text-xs tracking-[0.3em] uppercase mb-2 font-semibold">
          Your Collection
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#0a1a3a] section-title-line flex items-center gap-3">
          المفضلة
          <span className="text-2xl">❤️</span>
        </h1>
        <p className="mt-4 text-gray-500 max-w-xl">
          النطاقات التي قمت بحفظها للعودة إليها لاحقاً.
        </p>
      </motion.div>

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 luxury-card rounded-2xl p-16 text-center"
        >
          <div className="text-6xl mb-4">💎</div>
          <h2 className="text-2xl font-bold text-[#0a1a3a] mb-2">لا توجد نطاقات مفضلة بعد</h2>
          <p className="text-gray-500 mb-6">
            استكشف مجموعتنا واحفظ النطاقات التي تعجبك للعودة إليها لاحقاً.
          </p>
          <Link to="/domains" className="btn-cyan inline-block px-8 py-3 rounded-full text-sm font-semibold">
            تصفّح النطاقات
          </Link>
        </motion.div>
      ) : (
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((d, i) => (
            <FavoriteCard key={d.id} domain={d} index={i} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

function FavoriteCard({ domain, index, onToggle }: { domain: Domain; index: number; onToggle: (id: string) => void }) {
  const slug = `${domain.name}${domain.tld}`;
  const isMakeOffer = domain.price === null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="luxury-card relative rounded-2xl p-6 overflow-hidden group h-full"
    >
      {/* Remove button */}
      <button
        onClick={(e) => { e.preventDefault(); onToggle(domain.id); }}
        className="absolute top-4 left-4 w-9 h-9 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-100 transition z-10"
        title="إزالة من المفضلة"
      >
        ❤️
      </button>

      <Link to={`/domain/${slug}`} className="block">
        {/* status pill */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400">
            Premium Domain
          </span>
          <span className="text-[10px] px-2.5 py-1 rounded-full border border-emerald-300/50 text-emerald-600 bg-emerald-50">
            متاح
          </span>
        </div>

        {/* domain name */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <h3 className="domain-display text-4xl md:text-5xl font-bold text-[#0a1a3a] group-hover:text-[#2ab0b4] transition-colors duration-500">
              {domain.name}
            </h3>
            <span className="domain-display text-2xl md:text-3xl text-[#91eff2] font-light">
              {domain.tld}
            </span>
          </div>
          {domain.arabicName && (
            <p className="mt-1 text-gray-400 text-sm">
              ({domain.arabicName})
            </p>
          )}
        </div>

        {/* description */}
        <p className="text-gray-500 text-sm leading-6 line-clamp-2 mb-6 min-h-[3rem]">
          {domain.description}
        </p>

        {/* footer */}
        <div className="flex items-end justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
              السعر
            </div>
            {isMakeOffer ? (
              <div className="text-emerald-600 font-bold">قدّم عرضك</div>
            ) : (
              <div className="text-[#0a1a3a] font-black text-xl">
                ${domain.price!.toLocaleString("en-US")}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {domain.views.toLocaleString("ar-EG")}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
