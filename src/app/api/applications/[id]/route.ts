import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ApplicationModel } from '@/models/Application';
import { requireEditor } from '@/lib/editorAuth';

// DELETE /api/applications/:id — müraciəti sil (owner/admin)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const guard = requireEditor(req);
  if (guard.response) return guard.response;

  const conn = await connectToDatabase();
  if (!conn) return NextResponse.json({ error: 'Verilənlər bazası əlçatmazdır.' }, { status: 503 });

  try {
    const result = await ApplicationModel.deleteOne({ id: params.id });
    if (!result.deletedCount) return NextResponse.json({ error: 'Müraciət tapılmadı.' }, { status: 404 });
    return NextResponse.json({ ok: true, deleted: params.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Silmək alınmadı.' }, { status: 500 });
  }
}
