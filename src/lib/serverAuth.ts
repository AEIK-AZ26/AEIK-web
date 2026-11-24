import { getUserFromRequest } from '@/lib/jwt';

export function getServerUser(req: Request) {
  return getUserFromRequest(req);
}
