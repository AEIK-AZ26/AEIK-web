import { NextResponse } from 'next/server';
import { requireEditor } from '@/lib/editorAuth';

// imgbb açarı yalnız mühit dəyişənindən oxunur (.env.local və ya Vercel env).
const IMGBB_KEY = (process.env.IMGBB_API_KEY || '').trim();
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

export async function POST(req: Request) {
  const guard = requireEditor(req);
  if (guard.response) return guard.response;

  if (!IMGBB_KEY) {
    return NextResponse.json(
      { error: 'Şəkil yükləmə konfiqurasiya olunmayıb: IMGBB_API_KEY mühit dəyişəni təyin edilməyib.' },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Form məlumatı oxunmadı.' }, { status: 400 });
  }

  const file = form.get('image');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Şəkil faylı tələb olunur.' }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: 'Yalnız PNG, JPEG, WEBP və GIF şəkilləri dəstəklənir.' }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Şəkil 8 MB-dan böyük olmamalıdır.' }, { status: 413 });
  }

  const name = String(form.get('name') || file.name || 'aeik').replace(/\.[^.]+$/, '').slice(0, 60);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const payload = new FormData();
    payload.append('image', buffer.toString('base64'));
    payload.append('name', name);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
      method: 'POST',
      // imgbb Node/undici sorğularını bloklayır — brauzer User-Agent tələb olunur.
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        Accept: 'application/json',
      },
      body: payload,
      signal: AbortSignal.timeout(30_000),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.success) {
      return NextResponse.json(
        { error: json?.error?.message || 'imgbb yükləməsi alınmadı.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: json.data.url,
      displayUrl: json.data.display_url,
      thumb: json.data.thumb?.url,
      deleteUrl: json.data.delete_url,
      size: json.data.size,
    });
  } catch (error: any) {
    console.error('imgbb upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Şəkil yüklənərkən xəta baş verdi.' },
      { status: 502 }
    );
  }
}
