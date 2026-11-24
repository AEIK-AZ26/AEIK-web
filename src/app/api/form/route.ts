import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ApplicationFormModel } from '@/models/ApplicationForm';
import { requireEditor } from '@/lib/editorAuth';
import { DEFAULT_APPLICATION_FORM, FORM_KEY, normalizeFormConfig } from '@/lib/applicationForm';

// GET /api/form — ictimai: formun aktiv statusu və sahələri
export async function GET() {
  const conn = await connectToDatabase();
  if (!conn) {
    return NextResponse.json({ connected: false, data: DEFAULT_APPLICATION_FORM });
  }

  try {
    const doc = await ApplicationFormModel.findOne({ key: FORM_KEY }).lean();
    return NextResponse.json({ connected: true, data: normalizeFormConfig(doc || DEFAULT_APPLICATION_FORM) });
  } catch (error: any) {
    console.error('Form GET error:', error);
    return NextResponse.json({ connected: false, data: DEFAULT_APPLICATION_FORM, error: error.message });
  }
}

// PUT /api/form — formu redaktə et (owner/admin)
export async function PUT(req: Request) {
  const guard = requireEditor(req);
  if (guard.response) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON gövdəsi düzgün deyil.' }, { status: 400 });
  }

  const conn = await connectToDatabase();
  if (!conn) {
    return NextResponse.json({ error: 'Verilənlər bazası əlçatmazdır.' }, { status: 503 });
  }

  try {
    const config = normalizeFormConfig(body);
    const doc = await ApplicationFormModel.findOneAndUpdate(
      { key: FORM_KEY },
      { ...config, key: FORM_KEY, ts: Date.now() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ connected: true, data: normalizeFormConfig(doc) });
  } catch (error: any) {
    console.error('Form PUT error:', error);
    return NextResponse.json({ error: error.message || 'Formu yadda saxlamaq alınmadı.' }, { status: 500 });
  }
}
