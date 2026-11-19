import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'aeik_default_jwt_secret_change_in_env_2026';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export function signToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): { userId: string; email: string; role: 'owner' | 'admin' | 'member' } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: 'owner' | 'admin' | 'member' };
  } catch (err) {
    return null;
  }
}

export function getUserFromRequest(req: Request): { userId: string; email: string; role: 'owner' | 'admin' | 'member' } | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return verifyToken(token);
}
