import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { getUserFromRequest } from '@/lib/jwt';

// PUT /api/users/[id] - İstifadəçi məlumatlarını və ya rolunu yenilə
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const caller = getUserFromRequest(req);
    if (!caller) {
      return NextResponse.json({ error: 'Giriş edilməyib.' }, { status: 401 });
    }

    if (caller.role !== 'owner' && caller.role !== 'admin') {
      return NextResponse.json({ error: 'Bu əməliyyat üçün icazəniz yoxdur.' }, { status: 403 });
    }

    const { displayName, department, role } = await req.json();

    await connectToDatabase();
    const targetUser = await User.findById(params.id);
    if (!targetUser) {
      return NextResponse.json({ error: 'İstifadəçi tapılmadı.' }, { status: 404 });
    }

    // Role management enforcement:
    // SƏNƏD: "adminler user management ede bilecekler amma role management i sadece owner ede bilecek"
    if (role && role !== targetUser.role) {
      if (caller.role !== 'owner') {
        return NextResponse.json(
          { error: 'Rolu dəyişmək icazəniz yoxdur. Rol idarəetməsini (Role Management) yalnız Owner edə bilər.' },
          { status: 403 }
        );
      }
      // If target is the caller owner and trying to demote themselves:
      if (caller.userId === targetUser._id.toString() && role !== 'owner') {
        const ownerCount = await User.countDocuments({ role: 'owner' });
        if (ownerCount <= 1) {
          return NextResponse.json(
            { error: 'Sistemdə yeganə Owner sizsiniz. Əvvəlcə başqa bir istifadəçiyə Owner rolu verin.' },
            { status: 400 }
          );
        }
      }
      targetUser.role = role;
    }

    // If caller is admin, cannot edit owner
    if (caller.role === 'admin' && targetUser.role === 'owner') {
      return NextResponse.json({ error: 'Admin Owner hesabını redaktə edə bilməz.' }, { status: 403 });
    }

    if (displayName) targetUser.displayName = displayName.trim();
    if (department) targetUser.department = department.trim();

    await targetUser.save();

    return NextResponse.json({
      success: true,
      user: {
        _id: targetUser._id.toString(),
        email: targetUser.email,
        displayName: targetUser.displayName,
        department: targetUser.department,
        role: targetUser.role,
        createdAt: targetUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Update User Error:', error);
    return NextResponse.json({ error: error.message || 'Məlumatları yeniləmək uğursuz oldu.' }, { status: 500 });
  }
}

// DELETE /api/users/[id] - İstifadəçini sil
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const caller = getUserFromRequest(req);
    if (!caller) {
      return NextResponse.json({ error: 'Giriş edilməyib.' }, { status: 401 });
    }

    if (caller.role !== 'owner' && caller.role !== 'admin') {
      return NextResponse.json({ error: 'Bu əməliyyat üçün icazəniz yoxdur.' }, { status: 403 });
    }

    await connectToDatabase();
    const targetUser = await User.findById(params.id);
    if (!targetUser) {
      return NextResponse.json({ error: 'İstifadəçi tapılmadı.' }, { status: 404 });
    }

    // Özünü silmək olmaz
    if (caller.userId === targetUser._id.toString()) {
      return NextResponse.json({ error: 'Cari daxil olduğunuz hesabı silə bilməzsiniz.' }, { status: 400 });
    }

    // Admin cannot delete Owner or another Admin
    if (caller.role === 'admin' && (targetUser.role === 'owner' || targetUser.role === 'admin')) {
      return NextResponse.json({ error: 'Admin yalnız Member hesablarını silə bilər.' }, { status: 403 });
    }

    // If target is Owner, ensure there is at least one other Owner
    if (targetUser.role === 'owner') {
      const ownerCount = await User.countDocuments({ role: 'owner' });
      if (ownerCount <= 1) {
        return NextResponse.json({ error: 'Sistemdəki yeganə Owner silinə bilməz.' }, { status: 400 });
      }
    }

    await User.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, message: 'İstifadəçi uğurla silindi.' });
  } catch (error: any) {
    console.error('Delete User Error:', error);
    return NextResponse.json({ error: error.message || 'İstifadəçini silmək uğursuz oldu.' }, { status: 500 });
  }
}
