import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ApplicationModel } from '@/models/Application';
import { requireEditor } from '@/lib/editorAuth';

const KINDS = ['event', 'thesis', 'partner', 'volunteer'] as const;
type Kind = (typeof KINDS)[number];

const REQUIRED: Record<Kind, string[]> = {
  event: ['name', 'email'],
  thesis: ['name', 'email', 'title'],
  partner: ['name', 'email', 'organization'],
  volunteer: ['name', 'email'],
};

// GET /api/submissions?kind=event — göndərişlərin siyahısı (owner/admin)
export async function GET(req: Request) {
  const guard = requireEditor(req);
  if (guard.response) return guard.response;

  const kind = new URL(req.url).searchParams.get('kind') || 'event';
  if (!KINDS.includes(kind as Kind)) {
    return NextResponse.json({ error: 'Növ düzgün deyil.' }, { status: 400 });
  }

  const conn = await connectToDatabase();
  if (!conn) return NextResponse.json({ connected: false, data: [] });

  try {
    const docs = await ApplicationModel.find({ formKey: `submission:${kind}` })
      .sort({ ts: -1 })
      .limit(300)
      .lean();
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
    console.error('Submissions GET error:', error);
    return NextResponse.json({ connected: false, data: [], error: error.message });
  }
}

// POST /api/submissions — tədbir qeydiyyatı, tezis, tərəfdaş sorğusu, könüllü müraciəti
export async function POST(req: Request) {
  let body: { kind?: string; values?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON gövdəsi düzgün deyil.' }, { status: 400 });
  }

  const kind = String(body.kind || '') as Kind;
  if (!KINDS.includes(kind)) {
    return NextResponse.json({ error: 'Göndəriş növü düzgün deyil.' }, { status: 400 });
  }

  const incoming = body.values && typeof body.values === 'object' ? body.values : {};
  const values: Record<string, string> = {};

  for (const [key, value] of Object.entries(incoming)) {
    const safeKey = key.replace(/[^\w-]/g, '').slice(0, 40);
    const text = String(value ?? '').trim().slice(0, 4000);
    if (safeKey && text) values[safeKey] = text;
  }

  const missing = REQUIRED[kind].filter((field) => !values[field]);
  if (missing.length) {
    return NextResponse.json({ error: `Bu sahələr tələb olunur: ${missing.join(', ')}` }, { status: 400 });
  }

  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return NextResponse.json({ error: 'E-poçt ünvanı düzgün deyil.' }, { status: 400 });
  }

  const conn = await connectToDatabase();
  if (!conn) {
    return NextResponse.json(
      { error: 'Göndəriş qeydə alınmadı: verilənlər bazası əlçatmazdır. E-poçtla müraciət edin.' },
      { status: 503 }
    );
  }

  try {
    const id = `sub-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    await ApplicationModel.create({ id, formKey: `submission:${kind}`, values, ts: Date.now() });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error: any) {
    console.error('Submissions POST error:', error);
    return NextResponse.json({ error: error.message || 'Göndəriş qeydə alınmadı.' }, { status: 500 });
  }
}
