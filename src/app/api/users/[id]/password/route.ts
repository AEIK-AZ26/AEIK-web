import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { getUserFromRequest, hashPassword } from '@/lib/jwt';

// POST /api/users/[id]/password - Şifrəni dəyiş / təyin et
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const caller = getUserFromRequest(req);
    if (!caller) {
      return NextResponse.json({ error: 'Giriş edilməyib.' }, { status: 401 });
    }

    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Şifrə ən azı 6 simvoldan ibarət olmalıdır.' }, { status: 400 });
    }

    await connectToDatabase();
    const targetUser = await User.findById(params.id);
    if (!targetUser) {
      return NextResponse.json({ error: 'İstifadəçi tapılmadı.' }, { status: 404 });
    }

    // Permission check:
    const isSelf = caller.userId === targetUser._id.toString();
    const isOwner = caller.role === 'owner';
    const isAdmin = caller.role === 'admin';

    if (!isSelf && !isOwner) {
      if (isAdmin && (targetUser.role === 'owner' || targetUser.role === 'admin')) {
        return NextResponse.json({ error: 'Admin yalnız Member hesablarının şifrəsini dəyişə bilər.' }, { status: 403 });
      } else if (!isAdmin) {
        return NextResponse.json({ error: 'Bu istifadəçinin şifrəsini dəyişmək icazəniz yoxdur.' }, { status: 403 });
      }
    }

    const hashed = await hashPassword(newPassword);
    targetUser.password = hashed;
    await targetUser.save();

    return NextResponse.json({ success: true, message: 'Şifrə uğurla yeniləndi.' });
  } catch (error: any) {
    console.error('Password Change Error:', error);
    return NextResponse.json({ error: error.message || 'Şifrəni dəyişmək mümkün olmadı.' }, { status: 500 });
  }
}
