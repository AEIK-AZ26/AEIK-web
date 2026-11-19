import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { verifyPassword, signToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email və şifrə daxil edilməlidir.' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (!conn) {
      // Demo mode fallback if DB not yet configured
      const isAdmin = email.toLowerCase().includes('admin');
      const demoToken = signToken({
        userId: 'demo_' + (isAdmin ? 'admin' : 'member'),
        email,
        role: isAdmin ? 'admin' : 'member',
      });
      return NextResponse.json({
        user: {
          uid: 'demo_' + (isAdmin ? 'admin' : 'member'),
          email,
          displayName: isAdmin ? 'Nərhiz Hacıllı (Admin)' : email.split('@')[0],
          department: isAdmin ? 'İdarə Heyəti Sədri' : 'Layihələrin idarə olunması',
          role: isAdmin ? 'admin' : 'member',
        },
        token: demoToken,
        isDemo: true,
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Bu email ilə qeydiyyatdan keçmiş istifadəçi tapılmadı.' },
        { status: 404 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Daxil edilən şifrə yanlışdır.' },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      user: {
        uid: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        department: user.department,
        role: user.role,
      },
      token,
      isDemo: false,
    });
  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Giriş zamanı xəta baş verdi.' },
      { status: 500 }
    );
  }
}
