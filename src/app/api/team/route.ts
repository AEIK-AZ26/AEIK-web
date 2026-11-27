import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TeamMemberModel } from '@/models/TeamMember';
import { requireEditor } from '@/lib/editorAuth';
import { DEFAULT_TEAM } from '@/lib/team';

const FIELDS = ['name', 'role', 'project', 'text', 'image', 'email', 'order', 'status'] as const;

function plain(doc: unknown): Record<string, any> {
  const result = { ...(doc as Record<string, any>) };
  delete result._id;
  delete result.__v;
  return result;
}

function clean(body: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};
  for (const field of FIELDS) {
    if (body[field] !== undefined && body[field] !== null) payload[field] = body[field];
  }
  if (typeof payload.order === 'string') payload.order = Number(payload.order) || 0;
  if (payload.status && payload.status !== 'draft') payload.status = 'published';
  return payload;
}

// GET /api/team — ictimai: yalnız dərc olunmuşlar. ?all=1 — redaktor: hamısı.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const all = url.searchParams.get('all') === '1';

  if (all) {
    const guard = requireEditor(req);
    if (guard.response) return guard.response;
  }

  const conn = await connectToDatabase();
  if (!conn) {
    const fallback = all ? DEFAULT_TEAM : DEFAULT_TEAM.filter((member) => member.status !== 'draft');
    return NextResponse.json({ connected: false, data: fallback, fallback: true });
  }

  try {
    const filter: Record<string, unknown> = all ? {} : { status: { $ne: 'draft' } };
    let docs = await TeamMemberModel.find(filter).sort({ order: 1, ts: 1 }).lean();

    // Panel ilk dəfə açılanda boş baza hazır komanda ilə doldurulur.
    if (all && docs.length === 0) {
      try {
        await TeamMemberModel.insertMany(DEFAULT_TEAM, { ordered: false });
      } catch (_) {
        /* paralel seed zamanı duplicate — mövcud qeydlər oxunur */
      }
      docs = await TeamMemberModel.find(filter).sort({ order: 1, ts: 1 }).lean();
    }

    // Baza hələ doldurulmayıbsa, ictimai səhifə standart komandanı göstərir.
    const data = docs.length ? docs.map(plain) : all ? [] : DEFAULT_TEAM.filter((member) => member.status !== 'draft');

    return NextResponse.json({ connected: true, data });
  } catch (error: any) {
    console.error('Team GET error:', error);
    return NextResponse.json(
      { connected: false, data: DEFAULT_TEAM, fallback: true, error: error.message },
      { status: 200 }
    );
  }
}

// POST /api/team — yeni komanda üzvü (owner/admin)
export async function POST(req: Request) {
  const guard = requireEditor(req);
  if (guard.response) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON gövdəsi düzgün deyil.' }, { status: 400 });
  }

  const name = String(body.name || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  if (!name) {
    return NextResponse.json({ error: 'Ad və soyad tələb olunur.' }, { status: 400 });
  }

  const conn = await connectToDatabase();
  if (!conn) {
    return NextResponse.json({ error: 'Verilənlər bazası əlçatmazdır. Dəyişiklik yalnız brauzerdə saxlanıldı.' }, { status: 503 });
  }

  try {
    const id =
      typeof body.id === 'string' && body.id.trim()
        ? body.id.trim()
        : `team-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

    const doc = await TeamMemberModel.findOneAndUpdate(
      { id },
      {
        ...clean(body),
        name,
        id,
        status: body.status === 'draft' ? 'draft' : 'published',
        ts: Date.now(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ connected: true, data: plain(doc) }, { status: 201 });
  } catch (error: any) {
    console.error('Team POST error:', error);
    return NextResponse.json({ error: error.message || 'Yadda saxlamaq alınmadı.' }, { status: 500 });
  }
}
