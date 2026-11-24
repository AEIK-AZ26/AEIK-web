import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ApplicationFormModel } from '@/models/ApplicationForm';
import { ApplicationModel } from '@/models/Application';
import { requireEditor } from '@/lib/editorAuth';
import { DEFAULT_APPLICATION_FORM, FORM_KEY, normalizeFormConfig } from '@/lib/applicationForm';

// GET /api/applications — müraciətlərin siyahısı (owner/admin)
export async function GET(req: Request) {
  const guard = requireEditor(req);
  if (guard.response) return guard.response;

  const conn = await connectToDatabase();
  if (!conn) return NextResponse.json({ connected: false, data: [] });

  try {
    const docs = await ApplicationModel.find({ formKey: FORM_KEY }).sort({ ts: -1 }).limit(300).lean();
    return NextResponse.json({
      connected: true,
      data: docs.map((doc) => {
        const plain = doc as unknown as Record<string, unknown>;
        delete plain._id;
        delete plain.__v;
        return plain;
      }),
    });
  } catch (error: any) {
    console.error('Applications GET error:', error);
    return NextResponse.json({ connected: false, data: [], error: error.message });
  }
}

// POST /api/applications — ictimai müraciət göndərişi
export async function POST(req: Request) {
  let body: { values?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON gövdəsi düzgün deyil.' }, { status: 400 });
  }

  const conn = await connectToDatabase();
  if (!conn) {
    return NextResponse.json(
      { error: 'Müraciət qeydə alınmadı: verilənlər bazası əlçatmazdır. Bir az sonra yenidən cəhd edin.' },
      { status: 503 }
    );
  }

  try {
    const stored = await ApplicationFormModel.findOne({ key: FORM_KEY }).lean();
    const form = normalizeFormConfig(stored || DEFAULT_APPLICATION_FORM);

    if (!form.active) {
      return NextResponse.json({ error: form.closedMessage }, { status: 403 });
    }

    const incoming = body.values && typeof body.values === 'object' ? body.values : {};
    const values: Record<string, string> = {};
    const missing: string[] = [];

    for (const field of form.fields) {
      const value = String(incoming[field.id] ?? '').trim().slice(0, 4000);
      if (field.required && !value) missing.push(field.label);
      if (value) values[field.id] = value;
    }

    if (missing.length) {
      return NextResponse.json({ error: `Bu sahələr tələb olunur: ${missing.join(', ')}` }, { status: 400 });
    }

    const id = `app-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    await ApplicationModel.create({ id, formKey: FORM_KEY, values, ts: Date.now() });

    return NextResponse.json({ ok: true, id, message: form.successMessage }, { status: 201 });
  } catch (error: any) {
    console.error('Applications POST error:', error);
    return NextResponse.json({ error: error.message || 'Müraciəti göndərmək alınmadı.' }, { status: 500 });
  }
}
