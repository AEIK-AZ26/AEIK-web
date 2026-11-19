import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { hashPassword, signToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const { email, password, displayName, department } = await req.json();

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: 'Bütün vacib xanaları doldurun.' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (!conn) {
      // Return demo mode response if DB not yet connected
      const demoToken = signToken({
        userId: 'demo_' + Date.now(),
        email,
        role: 'member',
      });
      return NextResponse.json({
        user: {
          uid: 'demo_' + Date.now(),
          email,
          displayName,
          department: department || 'Layihələrin idarə olunması',
          role: 'member',
        },
        token: demoToken,
        isDemo: true,
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email ünvanı ilə artıq qeydiyyat mövcuddur.' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const count = await User.countDocuments();
    // First user is automatically admin, others are member
    const role = count === 0 ? 'admin' : 'member';

    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      displayName,
      department: department || 'Layihələrin idarə olunması',
      role,
      createdAt: Date.now(),
    });

    const token = signToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    return NextResponse.json({
      user: {
        uid: newUser._id.toString(),
        email: newUser.email,
        displayName: newUser.displayName,
        department: newUser.department,
        role: newUser.role,
      },
      token,
      isDemo: false,
    });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Qeydiyyat zamanı xəta baş verdi.' },
      { status: 500 }
    );
  }
}
