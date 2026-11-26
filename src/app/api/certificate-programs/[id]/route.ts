import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CertificateProgramModel } from '@/models/CertificateProgram';
import { CertificateModel } from '@/models/Certificate';
import { requireEditor } from '@/lib/editorAuth';
import { designFromBody, publicCertificateProgram } from '@/lib/certificateProgramServer';

function plain(doc: unknown): Record<string, any> {
  const result = { ...(doc as Record<string, any>) };
  delete result._id;
  delete result.__v;
  return result;
}

// PATCH /api/certificate-programs/:id — redaktə / aktivlik (owner/admin)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const guard = requireEditor(req);
  if (guard.response) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON gövdəsi düzgün deyil.' }, { status: 400 });
  }

  const conn = await connectToDatabase();
  if (!conn) {
    return NextResponse.json({ error: 'Verilənlər bazası əlçatmazdır.' }, { status: 503 });
  }

  const update: Record<string, any> = { updatedAt: Date.now() };

  if (body.title !== undefined) {
    const title = String(body.title).replace(/\s+/g, ' ').trim().slice(0, 160);
    if (title.length < 3) return NextResponse.json({ error: 'Tədbirin adı tələb olunur.' }, { status: 400 });
    update.title = title;
  }
  if (body.date !== undefined) {
    const date = String(body.date).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Tarix YYYY-MM-DD formatında olmalıdır.' }, { status: 400 });
    }
    update.date = date;
  }
  if (body.guests !== undefined) {
    const list = Array.isArray(body.guests) ? body.guests : String(body.guests).split(/[\n,;]+/);
    update.guests = list
      .map((guest) => String(guest).replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .slice(0, 30)
      .map((guest) => String(guest).slice(0, 80));
  }
  if (body.active !== undefined) update.active = body.active === true;

  if (
    body.theme !== undefined ||
    body.elements !== undefined ||
    body.frameColor !== undefined ||
    body.accentColor !== undefined ||
    body.logoUrl !== undefined ||
    body.logoUrls !== undefined
  ) {
    Object.assign(update, designFromBody(body));
  }

  try {
    const doc = await CertificateProgramModel.findOneAndUpdate({ id: params.id }, { $set: update }, { new: true }).lean();
    if (!doc) return NextResponse.json({ error: 'Proqram tapılmadı.' }, { status: 404 });

    // Artıq verilmiş sertifikatlar da redaktəni əks etdirməlidir: yoxlama səhifəsi
    // məhz `certificates` kolleksiyasındakı event/date sahələrini oxuyur.
    try {
      await CertificateModel.updateMany(
        { programId: params.id },
        { $set: { event: doc.title, date: doc.date } }
      );
    } catch (syncError) {
      console.error('Certificate sync error:', syncError);
    }

    return NextResponse.json({
      connected: true,
      data: { ...plain(doc), ...publicCertificateProgram(doc) },
    });
  } catch (error: any) {
    console.error('Certificate programs PATCH error:', error);
    return NextResponse.json({ error: error.message || 'Yeniləmək alınmadı.' }, { status: 500 });
  }
}

// DELETE /api/certificate-programs/:id — proqramı silir (verilmiş sertifikatlar qalır)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const guard = requireEditor(req);
  if (guard.response) return guard.response;

  const conn = await connectToDatabase();
  if (!conn) {
    return NextResponse.json({ error: 'Verilənlər bazası əlçatmazdır.' }, { status: 503 });
  }

  try {
    const result = await CertificateProgramModel.deleteOne({ id: params.id });
    if (!result.deletedCount) return NextResponse.json({ error: 'Proqram tapılmadı.' }, { status: 404 });
    return NextResponse.json({ connected: true, deleted: params.id });
  } catch (error: any) {
    console.error('Certificate programs DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Silmək alınmadı.' }, { status: 500 });
  }
}
