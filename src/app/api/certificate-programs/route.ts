import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CertificateProgramModel } from '@/models/CertificateProgram';
import { CertificateModel } from '@/models/Certificate';
import { requireEditor } from '@/lib/editorAuth';
import { DEFAULT_DESIGN } from '@/lib/certificateConfig';
import { designFromBody, publicCertificateProgram } from '@/lib/certificateProgramServer';

const AZ_MAP: Record<string, string> = {
  ə: 'e',
  ı: 'i',
  ş: 's',
  ç: 'c',
  ö: 'o',
  ü: 'u',
  ğ: 'g',
};

function makeSlug(value: string): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[əışçöüğ]/g, (char) => AZ_MAP[char] || char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

function parseGuests(value: unknown): string[] {
  const list = Array.isArray(value) ? value : String(value || '').split(/[\n,;]+/);
  return list
    .map((guest) => String(guest).replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 30)
    .map((guest) => guest.slice(0, 80));
}

function plain(doc: unknown): Record<string, any> {
  const result = { ...(doc as Record<string, any>) };
  delete result._id;
  delete result.__v;
  return result;
}

// GET /api/certificate-programs — ?slug=... ictimai (yalnız aktiv), əks halda redaktor siyahısı
export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = makeSlug(url.searchParams.get('slug') || '');

  const conn = await connectToDatabase();
  if (!conn) {
    return NextResponse.json({ connected: false, error: 'Verilənlər bazası əlçatmazdır.' }, { status: 503 });
  }

  try {
    if (slug) {
      const doc = await CertificateProgramModel.findOne({ slug }).lean();
      if (!doc) return NextResponse.json({ connected: true, found: false, active: false });
      if (!doc.active) return NextResponse.json({ connected: true, found: false, active: false });
      return NextResponse.json({ connected: true, found: true, active: true, data: publicCertificateProgram(doc) });
    }

    // İctimai siyahı — yalnız aktiv proqramlar.
    if (url.searchParams.get('active') === '1') {
      const activePrograms = await CertificateProgramModel.find({ active: true }).sort({ date: 1, ts: -1 }).lean();
      return NextResponse.json({ connected: true, data: activePrograms.map(publicCertificateProgram) });
    }

    const guard = requireEditor(req);
    if (guard.response) return guard.response;

    const programs = await CertificateProgramModel.find({}).sort({ ts: -1 }).lean();
    const counts = await Promise.all(
      programs.map((program) => CertificateModel.countDocuments({ programId: program.id }))
    );

    return NextResponse.json({
      connected: true,
      data: programs.map((program, index) => ({
        ...plain(program),
        ...publicCertificateProgram(program),
        issuedCount: counts[index],
      })),
    });
  } catch (error: any) {
    console.error('Certificate programs GET error:', error);
    return NextResponse.json({ error: error.message || 'Proqramları yükləmək alınmadı.' }, { status: 500 });
  }
}

// POST /api/certificate-programs — yeni proqram (owner/admin)
export async function POST(req: Request) {
  const guard = requireEditor(req);
  if (guard.response) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON gövdəsi düzgün deyil.' }, { status: 400 });
  }

  const title = String(body.title || '').replace(/\s+/g, ' ').trim().slice(0, 160);
  const date = String(body.date || '').trim();

  if (title.length < 3) return NextResponse.json({ error: 'Tədbirin adı tələb olunur.' }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Tarix YYYY-MM-DD formatında olmalıdır.' }, { status: 400 });
  }

  const conn = await connectToDatabase();
  if (!conn) {
    return NextResponse.json({ error: 'Verilənlər bazası əlçatmazdır.' }, { status: 503 });
  }

  try {
    const base = makeSlug(String(body.slug || title)) || `sertifikat-${Date.now().toString(36)}`;
    let slug = base;
    let suffix = 1;
    while (await CertificateProgramModel.exists({ slug })) {
      suffix += 1;
      slug = `${base}-${suffix}`;
    }

    const design = body.elements ? designFromBody(body) : { ...DEFAULT_DESIGN };

    const doc = await CertificateProgramModel.create({
      id: `cert-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      slug,
      title,
      date,
      guests: parseGuests(body.guests),
      active: body.active === true,
      ...design,
      ts: Date.now(),
      updatedAt: Date.now(),
    });

    return NextResponse.json({ connected: true, data: { ...plain(doc), issuedCount: 0 } }, { status: 201 });
  } catch (error: any) {
    console.error('Certificate programs POST error:', error);
    return NextResponse.json({ error: error.message || 'Proqram yaradılmadı.' }, { status: 500 });
  }
}
