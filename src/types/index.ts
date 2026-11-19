export type UserRole = 'owner' | 'admin' | 'member';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  department: string;
  role: UserRole;
  photoURL?: string;
  createdAt?: number;
}

export interface Member {
  id: string;
  name: string;
  ts: number;
}

export interface AttendanceRecord {
  v: '+' | '-' | '';
  m: string; // member id
  mo: number; // month 0-11
}

export interface DriveLinks {
  [dept_month: string]: {
    url: string;
  };
}

export interface Project {
  id: string;
  name: string;
  type: 'Dövri' | 'Böyük';
  stage: 'Planlaşma' | 'Hazırlıq' | 'İcrada' | 'Tamamlandı';
  members: number;
  owner: string;
  guest?: string;
  note?: string;
  ts: number;
}

export interface CalendarEvent {
  id: string;
  pid: string; // project id
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  note?: string;
  ts: number;
}

export interface PostItem {
  id: string;
  sec: 'posts';
  title: string;
  status: 'İdeya' | 'Hazırlanır' | 'Təsdiqdə' | 'Paylaşıldı';
  date?: string;
  plat?: 'Instagram' | 'Facebook' | 'LinkedIn' | 'Telegram' | 'X';
  proj?: string;
  who?: string;
  link?: string;
  text?: string;
  ts: number;
}

export interface PartnerItem {
  id: string;
  sec: 'partners';
  title: string;
  status: 'Əlaqə qurulub' | 'Danışıqlar' | 'Razılaşma' | 'Aktiv' | 'Dayandırılıb';
  ptype?: 'Universitet' | 'Dövlət qurumu' | 'QHT' | 'Şirkət / sponsor' | 'Media' | 'Digər';
  who?: string;
  contact?: string;
  date?: string;
  next?: string;
  link?: string;
  text?: string;
  ts: number;
}

export interface ResultItem {
  id: string;
  sec: 'results';
  title: string;
  status: 'Gözləyir' | 'Davam edir' | 'Uğurlu' | 'Uğursuz';
  area?: 'Qrant' | 'Sponsor' | 'Kommunikasiya' | 'Tərəfdaşlıq' | 'Sənədləşmə' | 'Tədbir' | 'Digər';
  who?: string;
  date?: string;
  val?: string;
  link?: string;
  text?: string;
  ts: number;
}

export interface MeetingItem {
  id: string;
  sec: 'meetings';
  title: string;
  meta: string; // Tarix
  text: string; // Gündəlik
  text2?: string; // Qərarlar
  ts: number;
}

export interface TaskItem {
  id: string;
  sec: 'tasks';
  title: string;
  meta: string; // Məsul şəxs
  text: string; // Təfərrüat
  status: 'Gözləyir' | 'Davam edir' | 'Tamam';
  ts: number;
}

export interface NoteItem {
  id: string;
  sec: 'notes';
  title: string;
  meta: string; // Tarix
  text: string; // Qeyd
  ts: number;
}

export type GenericItem = PostItem | PartnerItem | ResultItem | MeetingItem | TaskItem | NoteItem | any;
