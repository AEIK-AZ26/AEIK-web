import { NextResponse } from 'next/server';

const MAX_BYTES = 15 * 1024 * 1024;

function isPrivateHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (!host) return true;
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) return true;
  if (host === '0.0.0.0' || host === '::1' || host === '[::1]') return true;
  if (/^127\./.test(host) || /^10\./.test(host) || /^169\.254\./.test(host)) return true;
  if (/^192\.168\./.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return true;
  return false;
}

// GET /api/image-proxy?url=... — sertifikat şablonunu canvas üçün eyni mənşədən verir.
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get('url');
  if (!raw) {
    return NextResponse.json({ error: 'url parametri tələb olunur.' }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json({ error: 'URL düzgün deyil.' }, { status: 400 });
  }

  if (target.protocol !== 'https:') {
    return NextResponse.json({ error: 'Yalnız https şəkillərə icazə var.' }, { status: 400 });
  }
  if (isPrivateHost(target.hostname)) {
    return NextResponse.json({ error: 'Bu ünvana icazə yoxdur.' }, { status: 403 });
  }

  try {
    const res = await fetch(target.toString(), {
      headers: { Accept: 'image/*' },
      signal: AbortSignal.timeout(25_000),
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Şəkil mənbədən yüklənmədi.' }, { status: 502 });
    }

    // Yönləndirmədən sonra daxili ünvana düşmə ehtimalını bağlayırıq.
    try {
      if (res.url && isPrivateHost(new URL(res.url).hostname)) {
        return NextResponse.json({ error: 'Bu ünvana icazə yoxdur.' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Şəkil ünvanı düzgün deyil.' }, { status: 502 });
    }

    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    if (!contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'Ünvan şəkil qaytarmır.' }, { status: 415 });
    }

    const declared = Number(res.headers.get('content-length') || 0);
    if (declared > MAX_BYTES) {
      return NextResponse.json({ error: 'Şəkil çox böyükdür.' }, { status: 413 });
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length > MAX_BYTES) {
      return NextResponse.json({ error: 'Şəkil çox böyükdür.' }, { status: 413 });
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error: any) {
    console.error('Image proxy error:', error);
    return NextResponse.json({ error: 'Şəkil yüklənərkən xəta baş verdi.' }, { status: 502 });
  }
}
