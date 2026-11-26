/**
 * Canvas-dan alınan JPEG-i bir səhifəlik PDF-ə çevirir.
 * Xarici kitabxana tələb etmir: PDF-in içinə rastr şəkil (DCTDecode) yerləşdirir.
 */
export function certificateJpegToPdf(dataUrl: string, widthPx: number, heightPx: number): Blob {
  const base64 = dataUrl.split(",")[1] || "";
  const binary = atob(base64);
  const jpeg = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) jpeg[i] = binary.charCodeAt(i);

  const pageWidth = 842;
  const ratio = heightPx > 0 && widthPx > 0 ? heightPx / widthPx : 0.707;
  const pageHeight = Math.round(pageWidth * ratio * 100) / 100;

  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  let total = 0;
  const push = (part: string | Uint8Array) => {
    const bytes = typeof part === "string" ? encoder.encode(part) : part;
    chunks.push(bytes);
    total += bytes.length;
  };

  push("%PDF-1.4\n");
  push(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

  const offsets: number[] = [];
  const addObject = (number: number, parts: (string | Uint8Array)[]) => {
    offsets[number] = total;
    push(`${number} 0 obj\n`);
    for (const part of parts) push(part);
    push("\nendobj\n");
  };

  addObject(1, ["<< /Type /Catalog /Pages 2 0 R >>"]);
  addObject(2, ["<< /Type /Pages /Kids [3 0 R] /Count 1 >>"]);
  addObject(3, [
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] ` +
      `/Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`,
  ]);
  addObject(4, [
    `<< /Type /XObject /Subtype /Image /Width ${Math.round(widthPx)} /Height ${Math.round(
      heightPx
    )} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
    jpeg,
    "\nendstream",
  ]);

  const content = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im0 Do\nQ\n`;
  addObject(5, [`<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream`]);

  const xrefOffset = total;
  push("xref\n0 6\n");
  push("0000000000 65535 f \n");
  for (let i = 1; i <= 5; i += 1) {
    push(`${String(offsets[i] || 0).padStart(10, "0")} 00000 n \n`);
  }
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  return new Blob(chunks as BlobPart[], { type: "application/pdf" });
}
