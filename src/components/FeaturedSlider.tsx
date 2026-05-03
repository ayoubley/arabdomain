import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Domain } from "../lib/types";
import { toggleFavorite, isFavorite } from "../lib/favorites";

interface Props {
  domains: Domain[];
}

export default function FeaturedSlider({ domains }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [, setRefresh] = useState(0);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    const newScroll = direction === "right" 
      ? scrollRef.current.scrollLeft + scrollAmount 
      : scrollRef.current.scrollLeft - scrollAmount;
    scrollRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }

  function handleMouseLeave() {
    setIsDragging(false);
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  }

  function handleToggleFav(domainId: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(domainId);
    setRefresh((r) => r + 1);
  }

  return (
    <div className="relative group">
      {/* Navigation arrows */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg shadow-gray-200/50 flex items-center justify-center text-[#2ab0b4] opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:border-[#91eff2]"
        style={{ right: "-24px" }}
      >
        <svg className="w-5 h-5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg shadow-gray-200/50 flex items-center justify-center text-[#2ab0b4] opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:border-[#91eff2]"
        style={{ left: "-24px" }}
      >
        <svg className="w-5 h-5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* Slider container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {domains.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="min-w-[340px] max-w-[340px]"
          >
            <SliderCard domain={d} onToggleFav={handleToggleFav} />
          </motion.div>
        ))}
      </div>

      {/* CSS to hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function SliderCard({ domain, onToggleFav }: { domain: Domain; onToggleFav: (id: string, e: React.MouseEvent) => void }) {
  const slug = `${domain.name}${domain.tld}`;
  const isMakeOffer = domain.price === null;
  const favorited = isFavorite(domain.id);

  return (
    <Link
      to={`/domain/${slug}`}
      className="luxury-card relative block rounded-2xl p-6 overflow-hidden group h-full bg-gradient-to-br from-white to-[#91eff2]/5"
    >
      {/* Favorite button */}
      <button
        onClick={(e) => onToggleFav(domain.id, e)}
        className={`absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center transition z-10 ${
          favorited 
            ? "bg-gradient-to-br from-[#91eff2] to-[#5bc9cc] text-white shadow-lg shadow-[#91eff2]/30" 
            : "bg-white border border-gray-200 text-gray-300 hover:text-red-400 hover:border-red-200"
        }`}
        title={favorited ? "إزالة من المفضلة" : "إضافة للمفضلة"}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      {/* Premium badge */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400">
          Premium Domain
        </span>
        <span className="text-[10px] px-2.5 py-1 rounded-full border border-emerald-300/50 text-emerald-600 bg-emerald-50">
          متاح
        </span>
      </div>

      {/* Domain name */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <h3 className="domain-display text-3xl font-bold text-[#0a1a3a] group-hover:text-[#2ab0b4] transition-colors duration-500">
            {domain.name}
          </h3>
          <span className="domain-display text-xl text-[#91eff2] font-light">
            {domain.tld}
          </span>
        </div>
        {domain.arabicName && (
          <p className="mt-1 text-gray-400 text-sm">
            ({domain.arabicName})
          </p>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-6 line-clamp-2 mb-6 min-h-[2.75rem]">
        {domain.description}
      </p>

      {/* Footer */}
      <div className="flex items-end justify-between pt-4 border-t border-gray-100">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
            السعر
          </div>
          {isMakeOffer ? (
            <div className="text-emerald-600 font-bold">قدّم عرضك</div>
          ) : (
            <div className="text-[#0a1a3a] font-black text-lg">
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
  );
}
