import { SiteItem } from '@/lib/siteContent';
import { ApplicationFormConfig, DEFAULT_APPLICATION_FORM, normalizeFormConfig } from '@/lib/applicationForm';

export interface SaveResult {
  ok: boolean;
  offline?: boolean;
  error?: string;
  data?: SiteItem;
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

export async function loadContent(): Promise<{ items: SiteItem[]; connected: boolean }> {
  const res = await fetch('/api/content?all=1', { headers: headers(false), cache: 'no-store' });
  if (!res.ok) {
    const message = (await res.json().catch(() => null))?.error || 'Məzmun yüklənmədi.';
    const error = new Error(message) as Error & { status?: number };
    error.status = res.status;
    throw error;
  }
  const json = await res.json();
  return {
    items: Array.isArray(json.data) ? json.data : [],
    connected: Boolean(json.connected),
  };
}

export async function saveContent(item: Partial<SiteItem>): Promise<SaveResult> {
  const isNew = !item.id;
  try {
    const res = await fetch(isNew ? '/api/content' : `/api/content/${encodeURIComponent(item.id as string)}`, {
      method: isNew ? 'POST' : 'PATCH',
      headers: headers(),
      body: JSON.stringify(item),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, offline: res.status === 503, error: json?.error || 'Yadda saxlamaq alınmadı.' };
    }
    return { ok: true, data: json.data };
  } catch (error: any) {
    return { ok: false, offline: true, error: error?.message || 'Şəbəkə xətası.' };
  }
}

export async function deleteContent(id: string): Promise<SaveResult> {
  try {
    const res = await fetch(`/api/content/${encodeURIComponent(id)}`, {
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

export interface ApplicationRecord {
  id: string;
  values: Record<string, string>;
  ts: number;
}

export async function loadApplicationForm(): Promise<{ config: ApplicationFormConfig; connected: boolean }> {
  const res = await fetch('/api/form', { cache: 'no-store' });
  if (!res.ok) throw new Error('Form yüklənmədi.');
  const json = await res.json().catch(() => null);
  return {
    config: normalizeFormConfig(json?.data || DEFAULT_APPLICATION_FORM),
    connected: Boolean(json?.connected),
  };
}

export async function saveApplicationForm(config: ApplicationFormConfig): Promise<SaveResult & { config?: ApplicationFormConfig }> {
  try {
    const res = await fetch('/api/form', {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(config),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, offline: res.status === 503, error: json?.error || 'Form yadda saxlanmadı.' };
    }
    return { ok: true, config: normalizeFormConfig(json?.data || config) };
  } catch (error: any) {
    return { ok: false, offline: true, error: error?.message || 'Şəbəkə xətası.' };
  }
}

export async function submitApplication(values: Record<string, string>): Promise<{ ok: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: json?.error || 'Müraciət göndərilmədi.' };
    return { ok: true, message: json?.message || 'Müraciətiniz qeydə alındı.' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'Şəbəkə xətası.' };
  }
}

export async function loadApplications(): Promise<ApplicationRecord[]> {
  const res = await fetch('/api/applications', { headers: headers(false), cache: 'no-store' });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || 'Müraciətlər yüklənmədi.');
  }
  const json = await res.json().catch(() => null);
  return Array.isArray(json?.data) ? json.data : [];
}

export async function deleteApplication(id: string): Promise<SaveResult> {
  try {
    const res = await fetch(`/api/applications/${encodeURIComponent(id)}`, {
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

export async function uploadImage(file: File): Promise<{ ok: boolean; url?: string; error?: string }> {
  const body = new FormData();
  body.append('image', file);
  body.append('name', file.name.replace(/\.[^.]+$/, ''));

  try {
    const res = await fetch('/api/upload', { method: 'POST', headers: headers(false), body });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.url) {
      return { ok: false, error: json?.error || 'Şəkil yüklənmədi.' };
    }
    return { ok: true, url: json.url };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'Şəkil yüklənərkən şəbəkə xətası.' };
  }
}
