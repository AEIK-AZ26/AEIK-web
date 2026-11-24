import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/serverAuth';

export function requireEditor(req: Request) {
  const user = getServerUser(req);
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: 'Giriş edilməyib.' }, { status: 401 }),
    };
  }
  if (user.role !== 'owner' && user.role !== 'admin') {
    return {
      user: null,
      response: NextResponse.json({ error: 'Bu əməliyyat üçün icazəniz yoxdur.' }, { status: 403 }),
    };
  }
  return { user, response: null };
}
