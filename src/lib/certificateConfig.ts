/**
 * Sertifikat dizaynının ortaq konfiqurasiyası.
 * Həm brauzer (canvas), həm server (validasiya) bu fayldan istifadə edir —
 * ona görə burada yalnız saf JS/TS məntiqi saxlanılır.
 */

export const DESIGN_WIDTH = 2000;
export const DESIGN_HEIGHT = 1414;

export type CertificateTheme = "classic" | "ribbon";

/** Bir sertifikata əlavə oluna bilən maksimum qonaq (və uyğun qonaq elementi). */
export const GUESTS_MAX = 30;

/** Dizaynın sabit elementləri. */
export const BASE_ELEMENT_KEYS = [
  "organizer",
  "title",
  "name",
  "body",
  "date",
  "logo",
  "sigLeft",
  "sigRight",
  "code",
] as const;

export type BaseElementKey = (typeof BASE_ELEMENT_KEYS)[number];

/** Hər qonaq üçün ayrı element: `guest1`, `guest2`, … `guest30`. */
export type GuestElementKey = `guest${number}`;

/**
 * `guests` — köhnə versiyadan qalan tək element. Sertifikat çəkilərkən
 * avtomatik olaraq ayrı-ayrı `guestN` elementlərinə çevrilir.
 */
export type ElementKey = BaseElementKey | GuestElementKey | "guests";

export const ELEMENT_KEYS = BASE_ELEMENT_KEYS;

export const ELEMENT_LABELS: Record<BaseElementKey, string> = {
  organizer: "Təşkilat adı",
  title: "Başlıq (SERTİFİKAT)",
  name: "İştirakçının adı",
  body: "Tədbir mətni",
  date: "Tarix",
  logo: "Loqo (qrup)",
  sigLeft: "Sol imza mətni",
  sigRight: "Sağ imza mətni",
  code: "Yoxlama kodu",
};

const GUEST_KEY_PATTERN = /^guest([1-9]|[12][0-9]|30)$/;

export function isGuestKey(key: string): key is GuestElementKey {
  return GUEST_KEY_PATTERN.test(key);
}

/** `guest3` → 2 (sıfırdan başlayan indeks). */
export function guestIndexFromKey(key: GuestElementKey): number {
  return Number(key.slice(5)) - 1;
}

export function guestElementKey(index: number): GuestElementKey {
  return `guest${index + 1}` as GuestElementKey;
}

export function elementLabel(key: ElementKey): string {
  if (isGuestKey(key)) return `Qonaq ${guestIndexFromKey(key) + 1}`;
  if (key === "guests") return "Qonaq adları (köhnə)";
  return ELEMENT_LABELS[key];
}

/** İştirakçı adı, kod və qonaq adları avtomatik yazılır; digər mətnlər redaktə olunur. */
export function isAutoElement(key: ElementKey): boolean {
  return isGuestKey(key) || key === "name" || key === "code";
}

export interface CertificateElement {
  key: ElementKey;
  /**
   * Mətn. `{event}`, `{date}`, `{name}`, `{code}`, `{guest1}`, `{guest2}`, … yer
   * tutucuları dəstəklənir. Qonaq elementlərinin mətni avtomatikdir.
   */
  text: string;
  /** Loqo elementi üçün ayrıca şəkil URL-i (çoxlu loqo dəstəyi). */
  imageUrl?: string;
  /** Mərkəzin üfüqi mövqeyi (0–100%). */
  x: number;
  /** Mərkəzin şaquli mövqeyi (0–100%). */
  y: number;
  /** Şrift ölçüsü (dizayn eni 2000px üçün piksel) və ya loqo üçün hündürlük. */
  size: number;
  color: string;
  weight: number;
  align: "left" | "center" | "right";
  letterSpacing: number;
  lineHeight: number;
  visible: boolean;
}

export interface CertificateDesign {
  theme: CertificateTheme;
  frameColor: string;
  accentColor: string;
  logoUrl: string;
  /** Sertifikatda göstərilən bütün loqo şəkillərinin URL-ləri. */
  logoUrls: string[];
  elements: CertificateElement[];
}

export interface CertificateProgram extends CertificateDesign {
  slug: string;
  title: string;
  date: string;
  guests: string[];
}

export const DEFAULT_ORGANIZER =
  "AZƏRBAYCAN ELM VƏ İNNOVASİYA KÖNÜLLÜLƏRİ\nGƏNCLƏR TƏŞKİLATI";

export const DEFAULT_BODY =
  "Azərbaycan Elm və İnnovasiya Könüllüləri Gənclər Təşkilatının təşkil etdiyi “{event}” adlı layihədə iştirak etdiyi üçün təqdim olunur.";

const element = (value: CertificateElement): CertificateElement => value;

export const DEFAULT_ELEMENTS: Record<BaseElementKey, CertificateElement> = {
  organizer: element({
    key: "organizer",
    text: DEFAULT_ORGANIZER,
    x: 50,
    y: 11.5,
    size: 42,
    color: "#20365C",
    weight: 600,
    align: "center",
    letterSpacing: 1.2,
    lineHeight: 1.4,
    visible: true,
  }),
  title: element({
    key: "title",
    text: "SERTİFİKAT",
    x: 50,
    y: 24.5,
    size: 88,
    color: "#24466F",
    weight: 400,
    align: "center",
    letterSpacing: 18,
    lineHeight: 1.1,
    visible: true,
  }),
  name: element({
    key: "name",
    text: "{name}",
    x: 50,
    y: 39.5,
    size: 106,
    color: "#2F5C9A",
    weight: 700,
    align: "center",
    letterSpacing: 0,
    lineHeight: 1.15,
    visible: true,
  }),
  body: element({
    key: "body",
    text: DEFAULT_BODY,
    x: 50,
    y: 52.5,
    size: 32,
    color: "#2A2A32",
    weight: 400,
    align: "center",
    letterSpacing: 1,
    lineHeight: 1.6,
    visible: true,
  }),
  date: element({
    key: "date",
    text: "{date}",
    x: 50,
    y: 61,
    size: 24,
    color: "#6B7280",
    weight: 500,
    align: "center",
    letterSpacing: 0.6,
    lineHeight: 1.2,
    visible: true,
  }),
  logo: element({
    key: "logo",
    text: "",
    x: 50,
    y: 76,
    size: 100,
    color: "#20365C",
    weight: 400,
    align: "center",
    letterSpacing: 0,
    lineHeight: 1,
    visible: true,
  }),
  sigLeft: element({
    key: "sigLeft",
    text: "Azərbaycan Elm və İnnovasiya Könüllüləri\nGənclər Təşkilatının İcraçı Direktoru:",
    x: 26,
    y: 86.5,
    size: 22,
    color: "#20365C",
    weight: 600,
    align: "center",
    letterSpacing: 0.2,
    lineHeight: 1.5,
    visible: true,
  }),
  sigRight: element({
    key: "sigRight",
    text: "Azərbaycan Elm və İnnovasiya Könüllüləri\nGənclər Təşkilatının Həmtəşəkkilçisi:",
    x: 74,
    y: 86.5,
    size: 22,
    color: "#20365C",
    weight: 600,
    align: "center",
    letterSpacing: 0.2,
    lineHeight: 1.5,
    visible: true,
  }),
  code: element({
    key: "code",
    text: "{code}",
    x: 93,
    y: 96.5,
    size: 15,
    color: "#8A93A5",
    weight: 600,
    align: "right",
    letterSpacing: 0.6,
    lineHeight: 1.2,
    visible: true,
  }),
};

/** Yeni qonaq elementi üçün standart görünüş — hər qonaq öz sətrində. */
export function defaultGuestElement(index: number): CertificateElement {
  return {
    key: guestElementKey(index),
    text: `{guest${index + 1}}`,
    x: 50,
    y: Math.min(96, 65 + index * 2.8),
    size: 24,
    color: "#6B7280",
    weight: 500,
    align: "center",
    letterSpacing: 0.4,
    lineHeight: 1.35,
    visible: true,
  };
}

/** Hər hansı element açarı üçün standart element (qonaq elementləri daxil). */
export function defaultElement(key: ElementKey): CertificateElement {
  if (isGuestKey(key)) return defaultGuestElement(guestIndexFromKey(key));
  if (key === "guests") return { ...defaultGuestElement(0), key: "guests", text: "{guests}" };
  return DEFAULT_ELEMENTS[key];
}

export const DEFAULT_DESIGN: CertificateDesign = {
  theme: "classic",
  frameColor: "#1D3B66",
  accentColor: "#2F5F9E",
  logoUrl: "",
  logoUrls: [],
  elements: BASE_ELEMENT_KEYS.map((key) => ({ ...DEFAULT_ELEMENTS[key] })),
};

const MONTHS = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avqust",
  "sentyabr",
  "oktyabr",
  "noyabr",
  "dekabr",
];

export function formatCertificateDate(value?: string): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  return `${Number(match[3])} ${MONTHS[Number(match[2]) - 1] || ""} ${match[1]}`.trim();
}

export function elementByKey(elements: CertificateElement[] | undefined, key: ElementKey): CertificateElement {
  return (elements || []).find((item) => item.key === key) || defaultElement(key);
}

const clamp = (value: unknown, min: number, max: number, fallback: number) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
};

const color = (value: unknown, fallback: string) => {
  const text = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(text) ? text.toLowerCase() : fallback;
};

const WEIGHTS = [300, 400, 500, 600, 700, 800];

const isKnownKey = (key: string): key is ElementKey =>
  key === "guests" || isGuestKey(key) || (BASE_ELEMENT_KEYS as readonly string[]).includes(key);

export function sanitizeElements(input: unknown): CertificateElement[] {
  const map = new Map<string, Record<string, unknown>>();
  if (Array.isArray(input)) {
    for (const raw of input) {
      if (!raw || typeof raw !== "object") continue;
      const key = String((raw as Record<string, unknown>).key || "");
      if (isKnownKey(key) && !map.has(key)) {
        map.set(key, raw as Record<string, unknown>);
      }
    }
  }

  const keys: ElementKey[] = [...BASE_ELEMENT_KEYS];
  for (let index = 0; index < GUESTS_MAX; index += 1) {
    const key = guestElementKey(index);
    if (map.has(key)) keys.push(key);
  }
  if (map.has("guests")) keys.push("guests");

  return keys.map((key) => {
    const base = defaultElement(key);
    const raw = map.get(key) || {};
    const align = raw.align === "left" || raw.align === "right" || raw.align === "center" ? raw.align : base.align;
    const weight = WEIGHTS.includes(Number(raw.weight)) ? Number(raw.weight) : base.weight;
    const imageUrl = typeof raw.imageUrl === "string" ? raw.imageUrl.trim().slice(0, 500) : "";
    const cleanImageUrl = /^(https?:\/\/\S+|\/[^\s]*)$/i.test(imageUrl) ? imageUrl : "";
    return {
      key,
      // Qonaq elementlərinin mətni həmişə öz yer tutucusudur: {guest1}, {guest2}, …
      text: isGuestKey(key) ? `{guest${guestIndexFromKey(key) + 1}}` : typeof raw.text === "string" ? raw.text.slice(0, 500) : base.text,
      imageUrl: key === "logo" ? cleanImageUrl : undefined,
      x: clamp(raw.x, 0, 100, base.x),
      y: clamp(raw.y, 0, 100, base.y),
      size: clamp(raw.size, 6, 400, base.size),
      color: color(raw.color, base.color),
      weight,
      align: align as CertificateElement["align"],
      letterSpacing: clamp(raw.letterSpacing, -4, 40, base.letterSpacing),
      lineHeight: clamp(raw.lineHeight, 0.9, 2.8, base.lineHeight),
      visible: raw.visible === undefined ? base.visible : raw.visible !== false,
    };
  });
}

/**
 * Qonaq sayına uyğun olaraq `guest1…guestN` elementlərini tamamlayır.
 * Köhnə tək `guests` elementi varsa, onun görünüşü əsasında ayrı-ayrı
 * qonaq elementlərinə çevrilir. Artıq qonağı olmayan elementlər silinir.
 */
export function ensureGuestElements(
  elements: CertificateElement[] | undefined,
  guestCount: number
): CertificateElement[] {
  const list = (Array.isArray(elements) ? elements : []).map((item) => ({ ...item }));
  const legacy = list.find((item) => item.key === "guests") || null;
  const slots = new Map<number, CertificateElement>();
  for (const item of list) {
    if (isGuestKey(item.key) && !slots.has(guestIndexFromKey(item.key))) {
      slots.set(guestIndexFromKey(item.key), item);
    }
  }

  const base = list.filter((item) => item.key !== "guests" && !isGuestKey(item.key));
  const total = Math.max(0, Math.min(GUESTS_MAX, Math.floor(Number(guestCount) || 0)));
  const style = slots.get(0) || legacy || null;
  const styleY = style && Number.isFinite(style.y) ? style.y : 65;
  const spacing =
    style && style.size
      ? Math.max(1.4, ((style.size * (style.lineHeight || 1.3)) / DESIGN_HEIGHT) * 100 * 1.25)
      : 2.8;

  const guests: CertificateElement[] = [];
  for (let index = 0; index < total; index += 1) {
    const key = guestElementKey(index);
    const text = `{guest${index + 1}}`;
    const existing = slots.get(index);
    if (existing) {
      guests.push({ ...existing, key, text });
      continue;
    }
    if (style) {
      guests.push({ ...style, key, text, y: Math.min(99, Math.max(1, styleY + index * spacing)) });
      continue;
    }
    guests.push(defaultGuestElement(index));
  }

  return [...base, ...guests];
}

/**
 * `{event}`, `{date}`, `{name}`, `{code}`, `{guest1}`, `{guest2}`, … və köhnə
 * `{guests}` yer tutucularını doldurur.
 */
export function resolveCertificateText(
  template: string,
  context: { event?: string; date?: string; name?: string; code?: string; guests?: string[] | string }
): string {
  const guests = Array.isArray(context.guests)
    ? context.guests
    : String(context.guests || "")
        .split(/[,\n;]+/)
        .map((item) => item.trim())
        .filter(Boolean);

  return String(template || "")
    .replace(/\{event\}/gi, context.event || "")
    .replace(/\{date\}/gi, context.date || "")
    .replace(/\{name\}/gi, context.name || "")
    .replace(/\{code\}/gi, context.code || "")
    .replace(/\{guest(\d{1,2})\}/gi, (_match, index: string) => guests[Number(index) - 1] || "")
    .replace(/\{guests\}/gi, guests.join(", "))
    .replace(/[ \t]+$/gm, "")
    .trim();
}

/** Fayl adı üçün ad-soyad sətrini təmizləyir. */
export function certificateFileBase(name: string): string {
  const map: Record<string, string> = {
    ə: "e",
    ı: "i",
    ş: "s",
    ç: "c",
    ö: "o",
    ü: "u",
    ğ: "g",
  };
  const clean = String(name || "sertifikat")
    .toLowerCase()
    .replace(/[əışçöüğ]/g, (char) => map[char] || char)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return clean || "sertifikat";
}

export function sanitizeTheme(value: unknown): CertificateTheme {
  return value === "ribbon" ? "ribbon" : "classic";
}

export function sanitizeDesignColor(value: unknown, fallback: string): string {
  return color(value, fallback);
}
