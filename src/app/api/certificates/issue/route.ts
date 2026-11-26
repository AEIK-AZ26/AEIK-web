import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CertificateProgramModel } from '@/models/CertificateProgram';
import { CertificateModel } from '@/models/Certificate';
import { publicCertificateProgram } from '@/lib/certificateProgramServer';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomSuffix(length = 6): string {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return result;
}

// POST /api/certificates/issue — iştirakçı adını yazır, sertifikat qeydi yaranır
export async function POST(req: Request) {
  let body: { slug?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON gövdəsi düzgün deyil.' }, { status: 400 });
  }

  const slug = String(body.slug || '').trim().toLowerCase().slice(0, 80);
  const name = String(body.name || '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);

  if (!slug) return NextResponse.json({ error: 'Tədbir linki düzgün deyil.' }, { status: 400 });
  if (name.length < 2) return NextResponse.json({ error: 'Adınızı yazın.' }, { status: 400 });
  if (!/^[A-Za-zƏəÖöÜüĞğŞşÇçİıА-Яа-яЁё\s'’.\-]+$/.test(name)) {
    return NextResponse.json({ error: 'Ad yalnız hərflərdən ibarət olmalıdır (məsələn: Aysel Məmmədova).' }, { status: 400 });
  }

  const conn = await connectToDatabase();
  if (!conn) {
    return NextResponse.json({ error: 'Sertifikat bazası əlçatmazdır. Bir az sonra yenidən cəhd edin.' }, { status: 503 });
  }

  try {
    const program = await CertificateProgramModel.findOne({ slug, active: true }).lean();
    if (!program) {
      return NextResponse.json(
        { error: 'Bu tədbir üçün sertifikat hazırda aktiv deyil. Səhifəni sonra yenidən yoxlayın.' },
        { status: 403 }
      );
    }

    const nameKey = name.toLowerCase();
    const existing = await CertificateModel.findOne({ programId: program.id, nameKey }).lean();
    if (existing) {
      if (existing.status === 'revoked') {
        return NextResponse.json({ error: 'Bu ad üçün sertifikat ləğv edilib. Bizimlə əlaqə saxlayın.' }, { status: 403 });
      }
      return NextResponse.json({
        ok: true,
        certificate: {
          code: existing.code,
          name: existing.name,
          event: existing.event,
          date: existing.date,
          role: existing.role,
          status: existing.status,
        },
        program: publicCertificateProgram(program),
      });
    }

    const yearMatch = /^(\d{4})/.exec(program.date || '');
    const year = yearMatch ? yearMatch[1] : String(new Date().getFullYear());

    let code = '';
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const candidate = `AEIK-${year}-${randomSuffix()}`;
      if (!(await CertificateModel.exists({ code: candidate }))) {
        code = candidate;
        break;
      }
    }
    if (!code) {
      return NextResponse.json({ error: 'Sertifikat kodu yaradılmadı. Yenidən cəhd edin.' }, { status: 500 });
    }

    const document = {
      code,
      name,
      nameKey,
      event: program.title,
      date: program.date,
      role: 'İştirakçı',
      status: 'valid' as const,
      programId: program.id,
      eventSlug: program.slug,
      ts: Date.now(),
    };

    try {
      await CertificateModel.create(document);
    } catch (error: any) {
      // Paralel sorğu eyni adı yaradıbsa mövcud qeydi qaytarırıq.
      if (error?.code === 11000) {
        const duplicate = await CertificateModel.findOne({ programId: program.id, nameKey }).lean();
        if (duplicate) {
          return NextResponse.json({
            ok: true,
            certificate: {
              code: duplicate.code,
              name: duplicate.name,
              event: duplicate.event,
              date: duplicate.date,
              role: duplicate.role,
              status: duplicate.status,
            },
            program: publicCertificateProgram(program),
          });
        }
      }
      throw error;
    }

    return NextResponse.json({
      ok: true,
      certificate: {
        code: document.code,
        name: document.name,
        event: document.event,
        date: document.date,
        role: document.role,
        status: document.status,
      },
      program: publicCertificateProgram(program),
    });
  } catch (error: any) {
    console.error('Certificate issue error:', error);
    return NextResponse.json({ error: error.message || 'Sertifikat yaradılmadı.' }, { status: 500 });
  }
}
