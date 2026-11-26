/**
 * Sertifikat dizaynının canvas üzərində çəkilməsi.
 * Dizayn kodla qurulur (şablon şəkil tələb olunmur), ona görə çap/PDF çıxışı
 * eyni məntiqdən istifadə edir və nəticə həmişə eyni görünür.
 */

import {
  CertificateElement,
  CertificateProgram,
  DEFAULT_DESIGN,
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  ElementKey,
  formatCertificateDate,
  resolveCertificateText,
  sanitizeElements,
} from "./certificateConfig";

export * from "./certificateConfig";

export interface CertificateRecord {
  code: string;
  name: string;
  event: string;
  date: string;
  role: string;
  status: string;
}

export interface CertificateData {
  name: string;
  code?: string;
  guests?: string[];
}

export interface CertificateBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type CertificateBoxes = Partial<Record<ElementKey, CertificateBox>>;

/** Şablon/loqo şəklini eyni mənşəli proxy üzərindən yükləyirik ki, canvas “taint” olmasın. */
export function certificateImageProxy(url: string): string {
  if (!url) return "";
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

export function loadCertificateImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Şəkil yüklənmədi."));
    img.src = src;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const paragraphs = String(text || "").split(/\r?\n/);
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push("");
      continue;
    }
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (current && ctx.measureText(candidate).width > maxWidth) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
  }

  return lines.length ? lines : [""];
}

const round = (value: number) => Math.round(value * 100) / 100;

const isHex = (value: string) => /^#[0-9a-f]{6}$/i.test(value);

function drawClassicFrame(ctx: CanvasRenderingContext2D, program: CertificateProgram) {
  const frame = isHex(program.frameColor) ? program.frameColor : "#1D3B66";
  const accent = isHex(program.accentColor) ? program.accentColor : "#2F5F9E";

  ctx.fillStyle = frame;
  ctx.fillRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);

  // Ağ kağız sahəsi
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(34, 34, DESIGN_WIDTH - 68, DESIGN_HEIGHT - 68);

  // Nazik mavi xətt
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(96, 96, DESIGN_WIDTH - 192, DESIGN_HEIGHT - 192);

  // Kəsikli boz haşiyə
  ctx.save();
  ctx.strokeStyle = "#A9B0BA";
  ctx.lineWidth = 2;
  ctx.setLineDash([11, 9]);
  ctx.strokeRect(120, 120, DESIGN_WIDTH - 240, DESIGN_HEIGHT - 240);
  ctx.restore();

  // Künc bəzəkləri (L mötərizələr + ulduzlar)
  const gray = "#98A0AB";
  const corners: Array<[number, number, number, number]> = [
    [176, 168, 1, 1],
    [DESIGN_WIDTH - 176, 168, -1, 1],
    [176, DESIGN_HEIGHT - 168, 1, -1],
    [DESIGN_WIDTH - 176, DESIGN_HEIGHT - 168, -1, -1],
  ];

  for (const [cx, cy, sx, sy] of corners) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(sx, sy);
    ctx.fillStyle = gray;
    ctx.fillRect(0, 0, 12, 122);
    ctx.fillRect(0, 0, 122, 12);

    // Ulduz
    ctx.beginPath();
    const starX = 52;
    const starY = 52;
    const outer = 18;
    const inner = 7.6;
    for (let i = 0; i < 10; i += 1) {
      const radius = i % 2 === 0 ? outer : inner;
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const pointX = starX + Math.cos(angle) * radius;
      const pointY = starY + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(pointX, pointY);
      else ctx.lineTo(pointX, pointY);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function drawRibbonFrame(ctx: CanvasRenderingContext2D, program: CertificateProgram) {
  const frame = isHex(program.frameColor) ? program.frameColor : "#1D3B66";
  const accent = isHex(program.accentColor) ? program.accentColor : "#2F5F9E";

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);

  const corners: Array<[number, number, number, number]> = [
    [0, 0, 1, 1],
    [DESIGN_WIDTH, 0, -1, 1],
    [0, DESIGN_HEIGHT, 1, -1],
    [DESIGN_WIDTH, DESIGN_HEIGHT, -1, -1],
  ];

  for (const [ox, oy, sx, sy] of corners) {
    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(sx, sy);

    // Tünd mavi künc üçbucağı
    ctx.fillStyle = frame;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, DESIGN_HEIGHT * 0.24);
    ctx.lineTo(DESIGN_WIDTH * 0.15, 0);
    ctx.closePath();
    ctx.fill();

    // Açıq mavi lent
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(0, DESIGN_HEIGHT * 0.24);
    ctx.lineTo(0, DESIGN_HEIGHT * 0.3);
    ctx.lineTo(DESIGN_WIDTH * 0.19, 0);
    ctx.lineTo(DESIGN_WIDTH * 0.15, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.strokeStyle = frame;
  ctx.lineWidth = 2.4;
  ctx.strokeRect(74, 74, DESIGN_WIDTH - 148, DESIGN_HEIGHT - 148);
  ctx.strokeStyle = "rgba(29,59,102,0.35)";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(88, 88, DESIGN_WIDTH - 176, DESIGN_HEIGHT - 176);
}

interface ElementRenderOptions {
  program: CertificateProgram;
  data: CertificateData;
  logos: HTMLImageElement[];
  theme: CertificateProgram["theme"];
}

function drawTextElement(
  ctx: CanvasRenderingContext2D,
  el: CertificateElement,
  text: string,
  { program, theme }: ElementRenderOptions
): CertificateBox {
  const cx = (el.x / 100) * DESIGN_WIDTH;
  const cy = (el.y / 100) * DESIGN_HEIGHT;
  const maxWidth =
    el.key === "body"
      ? DESIGN_WIDTH * 0.7
      : el.key === "sigLeft" || el.key === "sigRight"
        ? DESIGN_WIDTH * 0.27
        : DESIGN_WIDTH * 0.84;

  ctx.save();
  ctx.fillStyle = el.color;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  if ("letterSpacing" in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${el.letterSpacing}px`;
  }

  const font = (size: number) => `${el.weight} ${size}px Manrope, Arial, sans-serif`;
  let size = el.size;
  ctx.font = font(size);
  let lines = wrapText(ctx, text, maxWidth);

  // Çox uzun söz/sətir olarsa şrifti kiçildirik.
  let guard = 0;
  while (guard < 24 && lines.some((line) => ctx.measureText(line).width > maxWidth) && size > 8) {
    size -= 2;
    ctx.font = font(size);
    lines = wrapText(ctx, text, maxWidth);
    guard += 1;
  }

  const lineHeight = size * el.lineHeight;
  const widths = lines.map((line) => ctx.measureText(line).width);
  const widest = Math.max(...widths, 0);
  const blockHeight = lines.length * lineHeight;
  const top = cy - blockHeight / 2;
  let left = cx - widest / 2;
  let right = cx + widest / 2;

  if (el.align === "left") {
    left = cx;
    right = cx + widest;
  } else if (el.align === "right") {
    left = cx - widest;
    right = cx;
  }

  lines.forEach((line, index) => {
    const lineWidth = widths[index] || 0;
    let drawX = cx - lineWidth / 2;
    if (el.align === "left") drawX = cx;
    if (el.align === "right") drawX = cx - lineWidth;
    ctx.fillText(line, drawX, top + lineHeight / 2 + index * lineHeight);
  });

  // İmza sətirləri
  if (el.key === "sigLeft" || el.key === "sigRight") {
    const width = Math.min(Math.max(widest + 30, DESIGN_WIDTH * 0.19), DESIGN_WIDTH * 0.29);
    const lineY = top - 26;
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = el.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - width / 2, lineY);
    ctx.lineTo(cx + width / 2, lineY);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Ad altındakı xətt (klassik temada uclarda nöqtələrlə)
  if (el.key === "name") {
    const accent = isHex(program.accentColor) ? program.accentColor : "#2F5F9E";
    const width = Math.min(Math.max(widest + 70, 240), DESIGN_WIDTH * 0.86);
    const lineY = top + blockHeight + 26;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(cx - width / 2, lineY);
    ctx.lineTo(cx + width / 2, lineY);
    ctx.stroke();
    if (theme === "classic") {
      ctx.fillStyle = accent;
      for (const dotX of [cx - width / 2, cx + width / 2]) {
        ctx.beginPath();
        ctx.arc(dotX, lineY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // “Müasir” temada başlığın yanlarındakı xətlər
  if (el.key === "title" && theme === "ribbon" && lines.length === 1) {
    const accent = isHex(program.accentColor) ? program.accentColor : "#2F5F9E";
    const half = widest / 2;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - half - 60, cy);
    ctx.lineTo(cx - half - 250, cy);
    ctx.moveTo(cx + half + 60, cy);
    ctx.lineTo(cx + half + 250, cy);
    ctx.stroke();
  }

  ctx.restore();

  return {
    x: round(left),
    y: round(top),
    w: round(Math.max(right - left, 24)),
    h: round(blockHeight),
  };
}

function resolveElementText(el: CertificateElement, { program, data }: ElementRenderOptions): string {
  return resolveCertificateText(el.text || "", {
    event: program.title,
    date: formatCertificateDate(program.date),
    name: data.name,
    code: data.code || "",
    guests: (program.guests || []).join(", "),
  });
}

/**
 * Sertifikatı canvas-a çəkir. Qaytarılan `boxes` admin redaktorunda
 * elementlərin sürüşdürülməsi (hit-test) üçün istifadə olunur.
 */
export function paintCertificate(
  canvas: HTMLCanvasElement,
  program: CertificateProgram,
  data: CertificateData,
  logos: HTMLImageElement[] = [],
  options: { scale?: number; highlight?: ElementKey | null } = {}
): CertificateBoxes {
  const scale = Math.max(0.25, Math.min(4, options.scale || 1));
  canvas.width = Math.round(DESIGN_WIDTH * scale);
  canvas.height = Math.round(DESIGN_HEIGHT * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) return {};

  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);

  const elements = program.elements && program.elements.length ? program.elements : sanitizeElements(DEFAULT_DESIGN.elements);
  const theme = program.theme === "ribbon" ? "ribbon" : "classic";

  if (theme === "ribbon") drawRibbonFrame(ctx, program);
  else drawClassicFrame(ctx, program);

  const renderOptions: ElementRenderOptions = { program, data, logos, theme };
  const boxes: CertificateBoxes = {};

  for (const el of elements) {
    if (!el.visible) continue;

    if (el.key === "logo") {
      const validLogos = (logos || []).filter(Boolean);
      if (!validLogos.length) continue;
      const height = el.size;
      const spacing = Math.max(12, Math.round(height * 0.18));
      const widths = validLogos.map((img) => {
        const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
        return Math.min(height * ratio, DESIGN_WIDTH * 0.28);
      });
      const totalWidth = widths.reduce((sum, w) => sum + w, 0) + spacing * (validLogos.length - 1);
      const cx = (el.x / 100) * DESIGN_WIDTH;
      const cy = (el.y / 100) * DESIGN_HEIGHT;
      let cursorX = cx - totalWidth / 2;
      validLogos.forEach((img, index) => {
        const w = widths[index];
        ctx.drawImage(img, cursorX, cy - height / 2, w, height);
        cursorX += w + spacing;
      });
      boxes.logo = { x: round(cx - totalWidth / 2), y: round(cy - height / 2), w: round(totalWidth), h: round(height) };
      continue;
    }

    const text = resolveElementText(el, renderOptions);
    if (!text) continue;
    boxes[el.key] = drawTextElement(ctx, el, text, renderOptions);
  }

  if (options.highlight && boxes[options.highlight]) {
    const box = boxes[options.highlight]!;
    ctx.save();
    ctx.strokeStyle = "#6552F5";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);
    ctx.strokeRect(box.x - 8, box.y - 8, box.w + 16, box.h + 16);
    ctx.restore();
  }

  return boxes;
}

async function waitForFonts() {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  try {
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);
  } catch {
    /* şrift yüklənməzsə sistem şriftinə keçirik */
  }
}

/** Loqo və şriftləri yükləyib sertifikatı çəkir (brauzer tərəfli). */
export async function renderCertificate(
  canvas: HTMLCanvasElement,
  program: CertificateProgram,
  data: CertificateData,
  options: { scale?: number; loadLogo?: boolean } = {}
): Promise<CertificateBoxes> {
  await waitForFonts();

  const logos: HTMLImageElement[] = [];
  if (options.loadLogo !== false) {
    const urls =
      Array.isArray(program.logoUrls) && program.logoUrls.length
        ? program.logoUrls
        : program.logoUrl
          ? [program.logoUrl]
          : [];
    for (const url of urls) {
      if (!url) continue;
      try {
        logos.push(await loadCertificateImage(certificateImageProxy(url)));
      } catch {
        /* şəkil yüklənməsə atlanır */
      }
    }
  }

  return paintCertificate(canvas, program, data, logos, { scale: options.scale });
}

/** Canvas-ı yüksək keyfiyyətli JPEG kimi yükləyir. */
export function canvasToJpegBlob(canvas: HTMLCanvasElement, quality = 0.95): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

