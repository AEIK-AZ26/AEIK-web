import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TeamMemberModel } from '@/models/TeamMember';
import { requireEditor } from '@/lib/editorAuth';

const FIELDS = ['name', 'role', 'project', 'text', 'image', 'email', 'order', 'status'] as const;

// PATCH /api/team/:id — redaktə (owner/admin)
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

  const update: Record<string, unknown> = { ts: Date.now() };
  for (const field of FIELDS) {
    if (body[field] !== undefined) update[field] = body[field];
  }
  if (typeof update.order === 'string') update.order = Number(update.order) || 0;
  if (update.status && update.status !== 'draft') update.status = 'published';
  if (typeof update.name === 'string') update.name = update.name.replace(/\s+/g, ' ').trim().slice(0, 80);

  try {
    const doc = await TeamMemberModel.findOneAndUpdate({ id: params.id }, { $set: update }, { new: true }).lean();
    if (!doc) return NextResponse.json({ error: 'Üzv tapılmadı.' }, { status: 404 });

    const plain = { ...(doc as unknown as Record<string, unknown>) };
    delete plain._id;
    delete plain.__v;
    return NextResponse.json({ connected: true, data: plain });
  } catch (error: any) {
    console.error('Team PATCH error:', error);
    return NextResponse.json({ error: error.message || 'Yeniləmək alınmadı.' }, { status: 500 });
  }
}

// DELETE /api/team/:id
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const guard = requireEditor(req);
  if (guard.response) return guard.response;

  const conn = await connectToDatabase();
  if (!conn) {
    return NextResponse.json({ error: 'Verilənlər bazası əlçatmazdır.' }, { status: 503 });
  }

  try {
    const result = await TeamMemberModel.deleteOne({ id: params.id });
    if (!result.deletedCount) return NextResponse.json({ error: 'Üzv tapılmadı.' }, { status: 404 });
    return NextResponse.json({ connected: true, deleted: params.id });
  } catch (error: any) {
    console.error('Team DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Silmək alınmadı.' }, { status: 500 });
  }
}
