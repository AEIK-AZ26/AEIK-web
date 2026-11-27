import { TeamMember } from '@/lib/team';

export interface TeamSaveResult {
  ok: boolean;
  offline?: boolean;
  error?: string;
  data?: TeamMember;
}

function token() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('aeik_token') || '';
}

function headers(json = true): Record<string, string> {
  const result: Record<string, string> = {};
  if (json) result['Content-Type'] = 'application/json';
  const t = token();
  if (t) result.Authorization = `Bearer ${t}`;
  return result;
}

export async function loadTeam(): Promise<{ members: TeamMember[]; connected: boolean }> {
  const res = await fetch('/api/team?all=1', { headers: headers(false), cache: 'no-store' });
  if (!res.ok) {
    const message = (await res.json().catch(() => null))?.error || 'Komanda yüklənmədi.';
    const error = new Error(message) as Error & { status?: number };
    error.status = res.status;
    throw error;
  }
  const json = await res.json().catch(() => null);
  return {
    members: Array.isArray(json?.data) ? json.data : [],
    connected: Boolean(json?.connected),
  };
}

export async function saveTeamMember(member: Partial<TeamMember>): Promise<TeamSaveResult> {
  const isNew = !member.id;
  try {
    const res = await fetch(isNew ? '/api/team' : `/api/team/${encodeURIComponent(member.id as string)}`, {
      method: isNew ? 'POST' : 'PATCH',
      headers: headers(),
      body: JSON.stringify(member),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, offline: res.status === 503, error: json?.error || 'Yadda saxlamaq alınmadı.' };
    }
    return { ok: true, data: json?.data };
  } catch (error: any) {
    return { ok: false, offline: true, error: error?.message || 'Şəbəkə xətası.' };
  }
}

export async function deleteTeamMember(id: string): Promise<TeamSaveResult> {
  try {
    const res = await fetch(`/api/team/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: headers(false),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => null);
      return { ok: false, offline: res.status === 503, error: json?.error || 'Silmək alınmadı.' };
    }
    return { ok: true };
  } catch (error: any) {
    return { ok: false, offline: true, error: error?.message || 'Şəbəkə xətası.' };
  }
}
