import { ABOUT, PROJECTS, ROADMAP } from '@/data/program';

export type SiteSection =
  | 'announcement'
  | 'news'
  | 'membership'
  | 'project'
  | 'about'
  | 'plan';

export interface SiteItem {
  id: string;
  sec: SiteSection;
  title: string;
  subtitle?: string;
  text?: string;
  body?: string;
  image?: string;
  link?: string;
  date?: string;
  status?: 'published' | 'draft';
  order?: number;
  meta?: string;
  ts: number;
}

export const SECTION_LABELS: Record<SiteSection, string> = {
  announcement: 'Elanlar',
  news: 'Xəbərlər',
  membership: 'Üzvlük proqramı',
  project: 'Layihələr',
  about: 'Haqqımızda',
  plan: 'Fəaliyyət planı',
};

/** imgbb-yə yüklənmiş şəkillər — media kitabxanasında hazır seçim kimi görünür. */
export const IMGBB_LIBRARY: { label: string; url: string }[] = [
  { label: 'Hero kartı', url: 'https://i.ibb.co/9kG3mcDH/aeik-hero-card.jpg' },
  { label: 'Elmi forum', url: 'https://i.ibb.co/q3QFvmjv/aeik-project-forum.jpg' },
  { label: 'Startap akseleratoru', url: 'https://i.ibb.co/QvM3xPKT/aeik-project-startup.jpg' },
  { label: 'Laboratoriya', url: 'https://i.ibb.co/Xxs77NMz/aeik-about-lab.jpg' },
  { label: 'Emblem', url: 'https://i.ibb.co/LzZ5RR2v/aeik-emblem.png' },
  { label: 'Atom nişanı', url: 'https://i.ibb.co/847X1QNN/badge-atom-blue.png' },
  { label: 'Tərəfdaş — Bir tələbə', url: 'https://i.ibb.co/G34GjKyb/partner-bir-telebe.jpg' },
];

/** Layihə daxilində qalan yerli şəkillər — API/şəbəkə problemi olduqda fallback. */
export const LOCAL_IMAGES: { label: string; url: string }[] = [
  { label: 'Hero kartı (yerli)', url: '/assets/pages/hero-card.jpg' },
  { label: 'Elmi forum (yerli)', url: '/assets/pages/project-forum.jpg' },
  { label: 'Startap (yerli)', url: '/assets/pages/project-startup.jpg' },
  { label: 'Laboratoriya (yerli)', url: '/assets/pages/about-lab.jpg' },
  { label: 'Emblem (yerli)', url: '/assets/pages/emblem.png' },
  { label: 'Loqo (yerli)', url: '/assets/logo-primary-trim.png' },
];

export const FALLBACK_IMAGE = '/assets/pages/hero-card.jpg';

const base = (i: number) => 1_760_000_000_000 + i * 1000;

function fromProjects(): SiteItem[] {
  const published = PROJECTS.items.filter((item) => !item.pending);
  return published.map((item, index) => ({
    id: `seed-project-${index + 1}`,
    sec: 'project' as const,
    title: item.title as string,
    subtitle: item.eyebrow as string,
    text: item.text as string,
    image: (item.image as string) || FALLBACK_IMAGE,
    meta: `${item.meta as string} · ${item.note as string}`,
    link: '',
    status: 'published' as const,
    order: index + 1,
    ts: base(index),
  }));
}

function fromRoadmap(): SiteItem[] {
  return ROADMAP.months.map((month, index) => ({
    id: `seed-plan-${index + 1}`,
    sec: 'plan' as const,
    title: month.title,
    subtitle: `${month.month} ${month.year}`,
    text: month.text,
    meta: month.tag,
    status: 'published' as const,
    order: index + 1,
    ts: base(index),
  }));
}

export const DEFAULT_CONTENT: SiteItem[] = [
  {
    id: 'seed-about',
    sec: 'about',
    title: ABOUT.title.join(' '),
    subtitle: ABOUT.label,
    text: ABOUT.text,
    body: ABOUT.points.join('\n'),
    image: '/assets/pages/about-lab.jpg',
    status: 'published',
    order: 0,
    ts: base(0),
  },
  {
    id: 'seed-announcement-1',
    sec: 'announcement',
    title: 'Beynəlxalq Elmi Forum üçün tezis qəbulu açıqdır',
    subtitle: 'Aktiv elan',
    text: 'Gənc tədqiqatçılar üçün məqalə və poster tezislərinin qəbulu başladı. Son müraciət tarixi 15 dekabr 2026.',
    image: 'https://i.ibb.co/q3QFvmjv/aeik-project-forum.jpg',
    link: '#elaqe',
    date: '2026-12-15',
    status: 'published',
    order: 1,
    meta: 'Tezis qəbulu',
    ts: base(1),
  },
  {
    id: 'seed-announcement-2',
    sec: 'announcement',
    title: 'İnnovasiya akseleratoruna komanda müraciətləri',
    subtitle: 'Yeni imkan',
    text: '4 aylıq mentorluq proqramı üçün 8–10 komanda seçiləcək. Müraciət formu açıqdır.',
    image: 'https://i.ibb.co/QvM3xPKT/aeik-project-startup.jpg',
    link: '#elaqe',
    date: '2026-10-01',
    status: 'published',
    order: 2,
    meta: 'Akselerator',
    ts: base(2),
  },
  {
    id: 'seed-news-1',
    sec: 'news',
    title: 'Məqalə saatları yeni mövsümə başladı',
    subtitle: 'Davamlı fəaliyyət',
    text: 'Elmi məqalənin strukturu, mənbələrlə iş və rəy mədəniyyəti üzrə ilk sessiya keçirildi.',
    image: 'https://i.ibb.co/Xxs77NMz/aeik-about-lab.jpg',
    date: '2026-09-18',
    status: 'published',
    order: 1,
    ts: base(3),
  },
  {
    id: 'seed-news-2',
    sec: 'news',
    title: 'Yeni tərəfdaşlıq: universitetlərlə memorandum',
    subtitle: 'Əməkdaşlıq',
    text: 'Birgə elmi tədbirlər, tələbə mübadiləsi və mentorluq proqramları üzrə razılıq əldə olundu.',
    image: 'https://i.ibb.co/G34GjKyb/partner-bir-telebe.jpg',
    date: '2026-09-05',
    status: 'published',
    order: 2,
    ts: base(4),
  },
  {
    id: 'seed-news-3',
    sec: 'news',
    title: 'Elm Kafe: ilk açıq müzakirə',
    subtitle: 'Yeni format',
    text: 'Gənc tədqiqatçılar elmi işlərini sadə dildə təqdim etdi, suallar və ideyalar paylaşıldı.',
    image: 'https://i.ibb.co/9kG3mcDH/aeik-hero-card.jpg',
    date: '2026-08-22',
    status: 'published',
    order: 3,
    ts: base(5),
  },
  {
    id: 'seed-membership-1',
    sec: 'membership',
    title: 'Müraciət',
    subtitle: '01',
    text: 'Qısa motivasiya məktubu və maraq dairənizi bildirin. Formu doldurmaq 5 dəqiqə çəkir.',
    meta: '5 dəqiqə',
    status: 'published',
    order: 1,
    ts: base(6),
  },
  {
    id: 'seed-membership-2',
    sec: 'membership',
    title: 'Tanışlıq görüşü',
    subtitle: '02',
    text: 'Komanda ilə 20 dəqiqəlik onlayn söhbət: gözləntilər, qruplar və fəaliyyət formatı.',
    meta: '20 dəqiqə',
    status: 'published',
    order: 2,
    ts: base(7),
  },
  {
    id: 'seed-membership-3',
    sec: 'membership',
    title: 'Onboarding',
    subtitle: '03',
    text: 'Qrupunuza qoşulun, mentor təyin olunur və ilk sessiyada iştirak edirsiniz.',
    meta: '1 həftə',
    status: 'published',
    order: 3,
    ts: base(8),
  },
  ...fromProjects(),
  ...fromRoadmap(),
];

const AZ_SLUG_MAP: Record<string, string> = {
  'ə': 'e', 'ı': 'i', 'ş': 's', 'ç': 'c', 'ö': 'o', 'ü': 'u', 'ğ': 'g',
  'Ə': 'e', 'I': 'i', 'İ': 'i', 'Ş': 's', 'Ç': 'c', 'Ö': 'o', 'Ü': 'u', 'Ğ': 'g',
};

/** Oxunaqlı URL: "Məqalə saatları yeni mövsümə başladı" → "meqale-saatlari-yeni-movsume-basladi". */
export function slugify(value: string): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[əışçöüğ]/g, (char) => AZ_SLUG_MAP[char] || char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

/** Kart/detal linki üçün oxunaqlı slug (boş başlıqda id-yə düşür). */
export function itemSlug(item: SiteItem): string {
  const slug = slugify(item.title || '');
  return slug || item.id;
}

/**
 * Kartlarda göstərilən qısa təqdimat: 200 simvol, sözün ortasında kəsilmir.
 * Detal səhifəsi tam mətni (`body`/`text`) olduğu kimi göstərir.
 */
export function excerpt(value?: string, limit = 200): string {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[.,;:!?…\-–—]+$/, "")}…`;
}

/** Keçmiş tarixli elanlar avtomatik "Bitib" sayılır. */
export function isExpired(item: SiteItem): boolean {
  if (!item?.date) return false;
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(item.date);
  if (!iso) return false;
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  return `${iso[1]}-${iso[2]}-${iso[3]}` < todayKey;
}

export function groupContent(items: SiteItem[]): Record<SiteSection, SiteItem[]> {
  const GROUPS: SiteSection[] = ['announcement', 'news', 'membership', 'project', 'about', 'plan'];
  const grouped = GROUPS.reduce((acc, sec) => {
    acc[sec] = [];
    return acc;
  }, {} as Record<SiteSection, SiteItem[]>);

  for (const item of items) {
    if (!item || !item.sec || !grouped[item.sec]) continue;
    grouped[item.sec].push(item);
  }

  for (const sec of GROUPS) {
    grouped[sec].sort(
      (a, b) =>
        (a.order ?? 0) - (b.order ?? 0) ||
        String(b.date || '').localeCompare(String(a.date || '')) ||
        b.ts - a.ts
    );
    if (grouped[sec].length === 0) {
      grouped[sec] = DEFAULT_CONTENT.filter((item) => item.sec === sec)
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
  }

  return grouped;
}

/** API işləmirsə statik məzmun qaytarır — əsas səhifə heç vaxt boş qalmır. */
export async function fetchSiteContent(): Promise<{ items: SiteItem[]; connected: boolean }> {
  try {
    const res = await fetch('/api/content', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const data = Array.isArray(json?.data) ? (json.data as SiteItem[]) : [];
    if (!data.length) return { items: DEFAULT_CONTENT, connected: false };
    const hasAbout = data.some((item) => item.sec === 'about');
    return {
      items: hasAbout ? data : [...data, ...DEFAULT_CONTENT.filter((d) => d.sec === 'about')],
      connected: true,
    };
  } catch {
    return { items: DEFAULT_CONTENT, connected: false };
  }
}

const AZ_MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr',
];

/**
 * Tarixi həmişə eyni formada göstərir: "15 dekabr 2026".
 * `toLocaleDateString` brauzer/server ICU fərqinə görə fərqli nəticə verirdi və
 * React hydration xətası yaradırdı — ona görün format əl ilə qurulur.
 */
export function formatDate(value?: string) {
  if (!value) return '';

  // "2026-12-15" kimi ISO sətirləri saat qurşağı sürüşməsi olmadan oxunur.
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  let year: number;
  let month: number;
  let day: number;

  if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    year = parsed.getFullYear();
    month = parsed.getMonth() + 1;
    day = parsed.getDate();
  }

  if (month < 1 || month > 12) return value;
  return `${day} ${AZ_MONTHS[month - 1]} ${year}`;
}
