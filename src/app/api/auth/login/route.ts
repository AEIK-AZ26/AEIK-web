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
      return NextResponse.json(
        { error: 'Verilənlər bazasına qoşulmaq mümkün olmadı. Zəhmət olmasa bir az sonra yenidən cəhd edin.' },
        { status: 503 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Email və ya şifrə yanlışdır.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Email və ya şifrə yanlışdır.' },
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
