import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Açar yalnız mühit dəyişənindən gəlir (.env.local / Vercel env). Kodda fallback yoxdur.
const JWT_SECRET = (process.env.JWT_SECRET || '').trim();

function requireJwtSecret(): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET mühit dəyişəni təyin edilməyib (.env.local faylını yoxlayın).');
  }
  return JWT_SECRET;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export function signToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, requireJwtSecret(), { expiresIn: '30d' });
}

export function verifyToken(token: string): { userId: string; email: string; role: 'owner' | 'admin' | 'member' } | null {
  if (!JWT_SECRET) return null;
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
