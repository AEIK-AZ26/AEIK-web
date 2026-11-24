import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SiteContentModel, SiteSection } from '@/models/SiteContent';
import { requireEditor } from '@/lib/editorAuth';
import { DEFAULT_CONTENT, SiteItem } from '@/lib/siteContent';

const SECTIONS: SiteSection[] = ['announcement', 'news', 'membership', 'project', 'about', 'plan'];
const FIELDS: (keyof SiteItem)[] = [
  'title', 'subtitle', 'text', 'body', 'image', 'link', 'date', 'status', 'order', 'meta',
];

function clean(body: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};
  for (const field of FIELDS) {
    if (body[field] !== undefined && body[field] !== null) payload[field] = body[field];
  }
  if (typeof payload.order === 'string') payload.order = Number(payload.order) || 0;
  return payload;
}

// GET /api/content — ictimai: yalnız dərc olunmuşlar. ?all=1 — redaktor: hamısı.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const all = url.searchParams.get('all') === '1';
  const sec = url.searchParams.get('sec');

  if (all) {
    const guard = requireEditor(req);
    if (guard.response) return guard.response;
  }

  const conn = await connectToDatabase();
  if (!conn) {
    const fallback = all ? DEFAULT_CONTENT : DEFAULT_CONTENT.filter((i) => i.status !== 'draft');
    return NextResponse.json({ connected: false, data: fallback, fallback: true });
  }

  try {
    const filter: Record<string, unknown> = {};
    if (!all) filter.status = { $ne: 'draft' };
    if (sec && SECTIONS.includes(sec as SiteSection)) filter.sec = sec;

    let docs = await SiteContentModel.find(filter).sort({ sec: 1, order: 1, ts: -1 }).lean();

    // Redaktor ilk dəfə açanda boş baza hazır məzmunla doldurulur ki,
    // panel dərhal redaktə oluna bilən qeydlər göstərsin.
    if (all && docs.length === 0 && !sec) {
      try {
        await SiteContentModel.insertMany(DEFAULT_CONTENT, { ordered: false });
      } catch (_) {
        /* paralel seed zamanı duplicate — mövcud qeydlər oxunur */
      }
      docs = await SiteContentModel.find(filter).sort({ sec: 1, order: 1, ts: -1 }).lean();
    }
    const data = docs.map((doc) => {
      const plain = doc as unknown as Record<string, unknown>;
      const { _id, __v, ...rest } = plain;
      return rest;
    });

    return NextResponse.json({ connected: true, data });
  } catch (error: any) {
    console.error('Content GET error:', error);
    return NextResponse.json(
      { connected: false, data: DEFAULT_CONTENT, fallback: true, error: error.message },
      { status: 200 }
    );
  }
}

// POST /api/content — yeni məzmun (owner/admin)
export async function POST(req: Request) {
  const guard = requireEditor(req);
  if (guard.response) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON gövdəsi düzgün deyil.' }, { status: 400 });
  }

  const sec = String(body.sec || '') as SiteSection;
  if (!SECTIONS.includes(sec)) {
    return NextResponse.json({ error: 'Bölmə (sec) düzgün deyil.' }, { status: 400 });
  }
  if (!String(body.title || '').trim()) {
    return NextResponse.json({ error: 'Başlıq tələb olunur.' }, { status: 400 });
  }

  const conn = await connectToDatabase();
  if (!conn) {
    return NextResponse.json(
      { connected: false, error: 'Verilənlər bazası əlçatmazdır. Dəyişiklik yalnız brauzerdə saxlanıldı.' },
      { status: 503 }
    );
  }

  try {
    const id =
      typeof body.id === 'string' && body.id.trim()
        ? body.id.trim()
        : `${sec.slice(0, 3)}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

    const doc = await SiteContentModel.findOneAndUpdate(
      { id },
      {
        ...clean(body),
        id,
        sec,
        status: body.status === 'draft' ? 'draft' : 'published',
        ts: Date.now(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    const plain = doc as unknown as Record<string, unknown>;
    delete plain._id;
    delete plain.__v;

    return NextResponse.json({ connected: true, data: plain }, { status: 201 });
  } catch (error: any) {
    console.error('Content POST error:', error);
    return NextResponse.json({ error: error.message || 'Yadda saxlamaq alınmadı.' }, { status: 500 });
  }
}
