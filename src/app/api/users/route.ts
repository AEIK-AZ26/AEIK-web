import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { getUserFromRequest, hashPassword } from '@/lib/jwt';

// GET /api/users - Bütün istifadəçiləri gətir (yalnız owner və admin)
export async function GET(req: Request) {
  try {
    const caller = getUserFromRequest(req);
    if (!caller) {
      return NextResponse.json({ error: 'Giriş edilməyib və ya token etibarsızdır.' }, { status: 401 });
    }

    if (caller.role !== 'owner' && caller.role !== 'admin') {
      return NextResponse.json({ error: 'Bu əməliyyat üçün icazəniz yoxdur.' }, { status: 403 });
    }

    await connectToDatabase();
    const users = await User.find({}, '-password').sort({ createdAt: -1 });

    return NextResponse.json({ users, callerRole: caller.role });
  } catch (error: any) {
    console.error('Get Users Error:', error);
    return NextResponse.json({ error: error.message || 'İstifadəçiləri yükləmək mümkün olmadı.' }, { status: 500 });
  }
}

// POST /api/users - Yeni istifadəçi yarat
export async function POST(req: Request) {
  try {
    const caller = getUserFromRequest(req);
    if (!caller) {
      return NextResponse.json({ error: 'Giriş edilməyib.' }, { status: 401 });
    }

    if (caller.role !== 'owner' && caller.role !== 'admin') {
      return NextResponse.json({ error: 'İstifadəçi yaratmaq səlahiyyətiniz yoxdur.' }, { status: 403 });
    }

    const { email, password, displayName, department, role } = await req.json();

    if (!email || !password || !displayName) {
      return NextResponse.json({ error: 'Email, şifrə və ad vacibdir.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Şifrə ən azı 6 simvoldan ibarət olmalıdır.' }, { status: 400 });
    }

    // Role assignment logic:
    // Admin yalnız 'member' yarada bilər.
    // Yalnız Owner 'owner', 'admin' və ya 'member' təyin edə bilər.
    let finalRole: 'owner' | 'admin' | 'member' = 'member';
    if (caller.role === 'owner') {
      if (role === 'owner' || role === 'admin' || role === 'member') {
        finalRole = role;
      }
    } else {
      // Caller is admin:
      if (role && role !== 'member') {
        return NextResponse.json(
          { error: 'Admin yalnız "Member" rolu təyin edə bilər. Rol idarəçiliyi yalnız Owner-ə məxsusdur.' },
          { status: 403 }
        );
      }
      finalRole = 'member';
    }

    await connectToDatabase();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'Bu email ilə istifadəçi artıq mövcuddur.' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      displayName: displayName.trim(),
      department: department || 'Layihələrin idarə olunması',
      role: finalRole,
      createdAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      user: {
        _id: newUser._id.toString(),
        email: newUser.email,
        displayName: newUser.displayName,
        department: newUser.department,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Create User Error:', error);
    return NextResponse.json({ error: error.message || 'İstifadəçi yaratmaq uğursuz oldu.' }, { status: 500 });
  }
}
