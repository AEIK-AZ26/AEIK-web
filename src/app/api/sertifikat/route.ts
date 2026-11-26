import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CertificateProgramModel } from '@/models/CertificateProgram';
import { DEMO_CERTIFICATES } from '@/data/brief';

export interface CertificateRecord {
  code: string;
  name: string;
  event: string;
  date: string;
  role: string;
  status: 'valid' | 'revoked';
  demo?: boolean;
}

const normalize = (value: string | null) =>
  String(value || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .slice(0, 40);

// GET /api/sertifikat?code=AEIK-2026-0001 — ictimai sertifikat yoxlaması
export async function GET(req: Request) {
  const code = normalize(new URL(req.url).searchParams.get('code'));

  if (!code) {
    return NextResponse.json({ error: 'Sertifikat kodunu daxil edin.' }, { status: 400 });
  }

  if (!/^[A-Z0-9-]{4,40}$/.test(code)) {
    return NextResponse.json({ error: 'Kod formatı düzgün deyil. Nümunə: AEIK-2026-0001' }, { status: 400 });
  }

  const conn = await connectToDatabase();
  if (conn) {
    try {
      const database = conn.connection.db;
      if (database) {
        const doc = await database.collection('certificates').findOne({ code });
        if (doc) {
          const { _id, ...rest } = doc as Record<string, any>;
          // Proqramın cari adı/tarixi əsasdır: sertifikat onun dizaynı ilə çəkilir,
          // yoxlama nəticəsi də həmin məlumatı göstərməlidir.
          if (rest.programId) {
            const program = await CertificateProgramModel.findOne({ id: rest.programId }).lean();
            if (program) {
              rest.event = program.title;
              rest.date = program.date;
            }
          }
          return NextResponse.json({ found: true, connected: true, demo: false, data: rest });
        }
        // Baza boş ola bilər — yalnız sənəddə göstərilən demo kodlar üçün nümunə qeyd qaytarılır.
        const demoRecord = DEMO_CERTIFICATES.find((record) => record.code === code);
        if (demoRecord) {
          return NextResponse.json({ found: true, connected: true, demo: true, data: demoRecord });
        }
        return NextResponse.json({ found: false, connected: true, data: null });
      }
    } catch (error: any) {
      console.error('Certificate lookup error:', error);
    }
  }

  // Baza yoxdursa nümunə qeydlər yoxlanılır — nəticə "demo" kimi işarələnir.
  const demo = DEMO_CERTIFICATES.find((record) => record.code === code);
  return NextResponse.json({
    found: Boolean(demo),
    connected: false,
    demo: true,
    data: demo || null,
  });
}
