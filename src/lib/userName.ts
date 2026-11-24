/** "Şaiq Məmmədov" → "Şaiq M." — header-də yer qənaəti üçün. */
export function shortName(displayName?: string): string {
  const clean = String(displayName || '')
    .replace(/\([^)]*\)/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
  if (!clean) return 'İstifadəçi';

  const parts = clean.split(' ');
  if (parts.length === 1) return parts[0];

  const last = parts[parts.length - 1];
  return `${parts[0]} ${last.charAt(0).toLocaleUpperCase('az')}.`;
}

/** Avatar dairəsi üçün baş hərf. */
export function initial(displayName?: string): string {
  const clean = String(displayName || '').trim();
  return clean ? clean.charAt(0).toLocaleUpperCase('az') : 'U';
}
