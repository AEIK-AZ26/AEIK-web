import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SiteContentModel } from '@/models/SiteContent';
import { requireEditor } from '@/lib/editorAuth';

const FIELDS = [
  'title', 'subtitle', 'text', 'body', 'image', 'link', 'date', 'status', 'order', 'meta',
] as const;

// PATCH /api/content/:id — redaktə (owner/admin)
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
    return NextResponse.json(
      { connected: false, error: 'Verilənlər bazası əlçatmazdır. Dəyişiklik yalnız brauzerdə saxlanıldı.' },
      { status: 503 }
    );
  }

  const update: Record<string, unknown> = { ts: Date.now() };
  for (const field of FIELDS) {
    if (body[field] !== undefined) update[field] = body[field];
  }
  if (typeof update.order === 'string') update.order = Number(update.order) || 0;
  if (update.status && update.status !== 'draft') update.status = 'published';

  try {
    const doc = await SiteContentModel.findOneAndUpdate({ id: params.id }, { $set: update }, { new: true }).lean();
    if (!doc) return NextResponse.json({ error: 'Qeyd tapılmadı.' }, { status: 404 });
    return NextResponse.json({ connected: true, data: doc });
  } catch (error: any) {
    console.error('Content PATCH error:', error);
    return NextResponse.json({ error: error.message || 'Yeniləmək alınmadı.' }, { status: 500 });
  }
}

// DELETE /api/content/:id
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const guard = requireEditor(req);
  if (guard.response) return guard.response;

  const conn = await connectToDatabase();
  if (!conn) {
    return NextResponse.json(
      { connected: false, error: 'Verilənlər bazası əlçatmazdır.' },
      { status: 503 }
    );
  }

  try {
    const result = await SiteContentModel.deleteOne({ id: params.id });
    if (!result.deletedCount) return NextResponse.json({ error: 'Qeyd tapılmadı.' }, { status: 404 });
    return NextResponse.json({ connected: true, deleted: params.id });
  } catch (error: any) {
    console.error('Content DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Silmək alınmadı.' }, { status: 500 });
  }
}
