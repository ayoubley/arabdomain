// Mock data layer that mirrors the Prisma schema.
// In production these functions would call Server Actions / Route Handlers
// hitting Prisma + PostgreSQL. Here we persist to localStorage so the UI
// is fully interactive without a backend.

import type { Category, Domain, Offer } from "./types";

const KEY_CATEGORIES = "nitaqat:categories";
const KEY_DOMAINS = "nitaqat:domains";
const KEY_OFFERS = "nitaqat:offers";
const KEY_SEED = "nitaqat:seeded:v3";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------------- SEED ----------------

const seedCategories: Category[] = [
  { id: "cat_realestate", name: "العقارات", slug: "real-estate" },
  { id: "cat_auto", name: "السيارات", slug: "automotive" },
  { id: "cat_tech", name: "التقنية", slug: "tech" },
  { id: "cat_finance", name: "المالية والأعمال", slug: "finance" },
  { id: "cat_lifestyle", name: "نمط الحياة", slug: "lifestyle" },
];

const seedDomains: Domain[] = [
  {
    id: "dom_aqar",
    name: "aqar",
    tld: ".com",
    arabicName: "عَقار",
    description:
      "اسم عربي قوي يعني (عقار)، مثالي لمنصات العقارات والاستثمار العقاري في الشرق الأوسط. مكوّن من أربعة أحرف فقط ويسهل تذكره عالمياً.",
    price: 85000,
    views: 1284,
    status: "AVAILABLE",
    categoryId: "cat_realestate",
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "dom_sayarat",
    name: "sayarat",
    tld: ".net",
    arabicName: "سَيّارات",
    description:
      "اسم نطاق فاخر يعني (سيارات)، مناسب لسوق سيارات إلكتروني، وكالة تأجير، أو منصة مزادات سيارات.",
    price: 42000,
    views: 873,
    status: "AVAILABLE",
    categoryId: "cat_auto",
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "dom_midad",
    name: "midad",
    tld: ".io",
    arabicName: "مِداد",
    description:
      "اسم أنيق يعني (الحبر) — مثالي لمنصة كتابة، تطبيق ذكاء اصطناعي إبداعي، أو شركة ناشئة تقنية.",
    price: null,
    views: 542,
    status: "AVAILABLE",
    categoryId: "cat_tech",
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "dom_thara",
    name: "thara",
    tld: ".com",
    arabicName: "ثَراء",
    description:
      "كلمة عربية فاخرة تعني (الغنى والوفرة). نطاق مثالي لمنصات الاستثمار، إدارة الثروات، أو خدمات مصرفية رقمية.",
    price: 120000,
    views: 2104,
    status: "AVAILABLE",
    categoryId: "cat_finance",
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "dom_safa",
    name: "safa",
    tld: ".co",
    arabicName: "صَفاء",
    description:
      "اسم رقيق ومميز يعني (النقاء)، مناسب لعلامات تجارية في العناية الشخصية، السبا، أو الحياة الصحية.",
    price: 28000,
    views: 612,
    status: "AVAILABLE",
    categoryId: "cat_lifestyle",
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "dom_noor",
    name: "noor",
    tld: ".com",
    arabicName: "نُور",
    description:
      "كلمة عالمية الانتشار تعني (الضوء)، مثالية لشركات الطاقة، الإضاءة، أو علامة تجارية فاخرة.",
    price: 250000,
    views: 3201,
    status: "AVAILABLE",
    categoryId: "cat_lifestyle",
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "dom_amal",
    name: "amal",
    tld: ".org",
    arabicName: "أمَل",
    description:
      "اسم يحمل دلالة عاطفية قوية (الأمل)، مناسب للمنظمات غير الربحية والمبادرات الإنسانية.",
    price: 35000,
    views: 489,
    status: "AVAILABLE",
    categoryId: "cat_lifestyle",
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "dom_rizq",
    name: "rizq",
    tld: ".com",
    arabicName: "رِزق",
    description:
      "اسم عربي تجاري قوي يعني (الرزق)، مثالي لمنصات تجارة إلكترونية أو تطبيقات مالية.",
    price: 65000,
    views: 977,
    status: "AVAILABLE",
    categoryId: "cat_finance",
    featured: false,
    createdAt: new Date().toISOString(),
  },
];

function seedIfNeeded() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(KEY_SEED)) return;
  write(KEY_CATEGORIES, seedCategories);
  write(KEY_DOMAINS, seedDomains);
  write(KEY_OFFERS, [] as Offer[]);
  localStorage.setItem(KEY_SEED, "1");
}
seedIfNeeded();

// ---------------- CATEGORIES ----------------

export function getCategories(): Category[] {
  seedIfNeeded();
  return read<Category[]>(KEY_CATEGORIES, seedCategories);
}

// ---------------- DOMAINS ----------------

export function getDomains(): Domain[] {
  seedIfNeeded();
  return read<Domain[]>(KEY_DOMAINS, seedDomains);
}

export function getDomainBySlug(slug: string): Domain | undefined {
  return getDomains().find(
    (d) => `${d.name}${d.tld}`.toLowerCase() === slug.toLowerCase()
  );
}

export function incrementViews(slug: string) {
  const domains = getDomains();
  const idx = domains.findIndex(
    (d) => `${d.name}${d.tld}`.toLowerCase() === slug.toLowerCase()
  );
  if (idx >= 0) {
    domains[idx] = { ...domains[idx], views: domains[idx].views + 1 };
    write(KEY_DOMAINS, domains);
  }
}

export function createDomain(data: Omit<Domain, "id" | "createdAt" | "views">): Domain {
  const domains = getDomains();
  const newDomain: Domain = {
    ...data,
    id: `dom_${uid()}`,
    views: 0,
    createdAt: new Date().toISOString(),
  };
  write(KEY_DOMAINS, [newDomain, ...domains]);
  return newDomain;
}

export function updateDomain(id: string, patch: Partial<Domain>): Domain | null {
  const domains = getDomains();
  const idx = domains.findIndex((d) => d.id === id);
  if (idx < 0) return null;
  domains[idx] = { ...domains[idx], ...patch };
  write(KEY_DOMAINS, domains);
  return domains[idx];
}

export function deleteDomain(id: string) {
  const domains = getDomains().filter((d) => d.id !== id);
  write(KEY_DOMAINS, domains);
}

// ---------------- OFFERS ----------------

export function getOffers(): Offer[] {
  seedIfNeeded();
  return read<Offer[]>(KEY_OFFERS, []);
}

export function createOffer(data: Omit<Offer, "id" | "createdAt" | "status">): Offer {
  const offers = getOffers();
  const newOffer: Offer = {
    ...data,
    id: `off_${uid()}`,
    status: "UNREAD",
    createdAt: new Date().toISOString(),
  };
  write(KEY_OFFERS, [newOffer, ...offers]);
  return newOffer;
}

export function updateOfferStatus(id: string, status: Offer["status"]): Offer | null {
  const offers = getOffers();
  const idx = offers.findIndex((o) => o.id === id);
  if (idx < 0) return null;
  offers[idx] = { ...offers[idx], status };
  write(KEY_OFFERS, offers);
  return offers[idx];
}

export function deleteOffer(id: string) {
  const offers = getOffers().filter((o) => o.id !== id);
  write(KEY_OFFERS, offers);
}

// ---------------- CONFIG ----------------

export const SITE_CONFIG = {
  whatsappNumber: "971500000000", // change to real number
  brandName: "نِطاقات",
  brandNameEn: "Nitaqat",
  email: "sales@nitaqat.boutique",
};
