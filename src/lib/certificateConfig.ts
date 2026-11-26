/**
 * Sertifikat dizaynının ortaq konfiqurasiyası.
 * Həm brauzer (canvas), həm server (validasiya) bu fayldan istifadə edir —
 * ona görə burada yalnız saf JS/TS məntiqi saxlanılır.
 */

export const DESIGN_WIDTH = 2000;
export const DESIGN_HEIGHT = 1414;

export type CertificateTheme = "classic" | "ribbon";

export const ELEMENT_KEYS = [
  "organizer",
  "title",
  "name",
  "body",
  "date",
  "logo",
  "guests",
  "sigLeft",
  "sigRight",
  "code",
] as const;

export type ElementKey = (typeof ELEMENT_KEYS)[number];

export const ELEMENT_LABELS: Record<ElementKey, string> = {
  organizer: "Təşkilat adı",
  title: "Başlıq (SERTİFİKAT)",
  name: "İştirakçının adı",
  body: "Tədbir mətni",
  date: "Tarix",
  logo: "Loqo (qrup)",
  guests: "Qonaq adları",
  sigLeft: "Sol imza mətni",
  sigRight: "Sağ imza mətni",
  code: "Yoxlama kodu",
};

/** İştirakçı adı və kod avtomatik yazılır; digər mətnlər admin tərəfindən redaktə olunur. */
export const AUTO_ELEMENTS: ElementKey[] = ["name", "code"];

export interface CertificateElement {
  key: ElementKey;
  /** Mətn. {event}, {date}, {name}, {code}, {guests} yer tutucuları dəstəklənir. */
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

export const DEFAULT_ELEMENTS: Record<ElementKey, CertificateElement> = {
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
    y: 72,
    size: 100,
    color: "#20365C",
    weight: 400,
    align: "center",
    letterSpacing: 0,
    lineHeight: 1,
    visible: true,
  }),
  guests: element({
    key: "guests",
    text: "{guests}",
    x: 50,
    y: 66,
    size: 24,
    color: "#6B7280",
    weight: 500,
    align: "center",
    letterSpacing: 0.4,
    lineHeight: 1.4,
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

export const DEFAULT_DESIGN: CertificateDesign = {
  theme: "classic",
  frameColor: "#1D3B66",
  accentColor: "#2F5F9E",
  logoUrl: "",
  logoUrls: [],
  elements: ELEMENT_KEYS.map((key) => ({ ...DEFAULT_ELEMENTS[key] })),
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
  return (elements || []).find((item) => item.key === key) || DEFAULT_ELEMENTS[key];
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

export function sanitizeElements(input: unknown): CertificateElement[] {
  const map = new Map<string, Record<string, unknown>>();
  if (Array.isArray(input)) {
    for (const raw of input) {
      if (!raw || typeof raw !== "object") continue;
      const key = String((raw as Record<string, unknown>).key || "");
      if ((ELEMENT_KEYS as readonly string[]).includes(key) && !map.has(key)) {
        map.set(key, raw as Record<string, unknown>);
      }
    }
  }

  return ELEMENT_KEYS.map((key) => {
    const base = DEFAULT_ELEMENTS[key];
    const raw = map.get(key) || {};
    const align = raw.align === "left" || raw.align === "right" || raw.align === "center" ? raw.align : base.align;
    const weight = WEIGHTS.includes(Number(raw.weight)) ? Number(raw.weight) : base.weight;
    const imageUrl = typeof raw.imageUrl === "string" ? raw.imageUrl.trim().slice(0, 500) : "";
    const cleanImageUrl = /^(https?:\/\/\S+|\/[^\s]*)$/i.test(imageUrl) ? imageUrl : "";
    return {
      key,
      text: typeof raw.text === "string" ? raw.text.slice(0, 500) : base.text,
      imageUrl: key === "logo" || key.startsWith("logo") ? cleanImageUrl : undefined,
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

export function sanitizeTheme(value: unknown): CertificateTheme {
  return value === "ribbon" ? "ribbon" : "classic";
}

export function sanitizeDesignColor(value: unknown, fallback: string): string {
  return color(value, fallback);
}

/** `{event}`, `{date}`, `{name}`, `{code}`, `{guests}` yer tutucularını doldurur. */
export function resolveCertificateText(
  template: string,
  context: { event?: string; date?: string; name?: string; code?: string; guests?: string }
): string {
  return String(template || "")
    .replace(/\{event\}/gi, context.event || "")
    .replace(/\{date\}/gi, context.date || "")
    .replace(/\{name\}/gi, context.name || "")
    .replace(/\{code\}/gi, context.code || "")
    .replace(/\{guests\}/gi, context.guests || "")
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
