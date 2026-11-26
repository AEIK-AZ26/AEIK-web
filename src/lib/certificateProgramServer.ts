import {
  CertificateDesign,
  DEFAULT_DESIGN,
  sanitizeDesignColor,
  sanitizeElements,
  sanitizeTheme,
} from './certificateConfig';

/** https URL-lər və sayt daxilindəki (/assets/...) şəkil yolları qəbul edilir. */
const isLogoSource = (value: string): boolean => /^(https?:\/\/\S+|\/[^\s]*)$/i.test(value);

const cleanLogoUrl = (value: unknown): string => {
  const url = String(value || '').trim();
  return isLogoSource(url) ? url.slice(0, 500) : '';
};

const cleanLogoUrls = (value: unknown): string[] => {
  const list = Array.isArray(value) ? value : String(value || '').split(/[\n,;]+/);
  return list
    .map((item) => String(item).trim())
    .filter((item) => isLogoSource(item))
    .map((item) => item.slice(0, 500))
    .slice(0, 12);
};

/** Publik səhifəyə yalnız dizaynı çəkmək üçün lazım olan sahələr verilir. */
export function publicCertificateProgram(doc: Record<string, any>) {
  return {
    slug: doc.slug,
    title: doc.title,
    date: doc.date,
    guests: Array.isArray(doc.guests) ? doc.guests : [],
    theme: sanitizeTheme(doc.theme),
    frameColor: sanitizeDesignColor(doc.frameColor, DEFAULT_DESIGN.frameColor),
    accentColor: sanitizeDesignColor(doc.accentColor, DEFAULT_DESIGN.accentColor),
    logoUrl: cleanLogoUrl(doc.logoUrl),
    logoUrls: cleanLogoUrls(doc.logoUrls),
    elements: sanitizeElements(doc.elements),
  };
}

/** Sorğu gövdəsindən təhlükəsiz dizayn konfiqurasiyası çıxarır. */
export function designFromBody(body: Record<string, unknown>): CertificateDesign {
  return {
    theme: sanitizeTheme(body.theme),
    frameColor: sanitizeDesignColor(body.frameColor, DEFAULT_DESIGN.frameColor),
    accentColor: sanitizeDesignColor(body.accentColor, DEFAULT_DESIGN.accentColor),
    logoUrl: cleanLogoUrl(body.logoUrl),
    logoUrls: cleanLogoUrls(body.logoUrls),
    elements: sanitizeElements(body.elements),
  };
}
