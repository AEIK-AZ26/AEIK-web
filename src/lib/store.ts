import { 
  Member, 
  AttendanceRecord, 
  Project, 
  CalendarEvent, 
  DriveLinks, 
  GenericItem 
} from '@/types';

export const ROOT_DRIVE = "https://drive.google.com/drive/folders/13ZpdRgBkE0LNFTHKRXB43LNSjVOkMsYr?usp=sharing";
export const MON = ["Yan", "Fev", "Mar", "Apr", "May", "İyn", "İyl", "Avq", "Sen", "Okt", "Noy", "Dek"];
export const DEPTS = [
  ["pm", "Layihələrin idarə olunması"],
  ["smm", "SMM və dizayn"],
  ["jl", "Jurnal və layihələr"]
];

export const INITIAL_PROJECTS: Record<string, Project> = {
  p1: { id: "p1", name: "Məqalə saatları", type: "Dövri", stage: "İcrada", members: 4, owner: "Elmi Heyət", guest: "", note: "Həftəlik elmi müzakirələr", ts: 1001 },
  p2: { id: "p2", name: "Akademik yol", type: "Dövri", stage: "İcrada", members: 6, owner: "Təhsil Şöbəsi", guest: "", note: "Gənc tədqiqatçılara mentorluq", ts: 1002 },
  p3: { id: "p3", name: "Elm məlumatxanası", type: "Dövri", stage: "İcrada", members: 5, owner: "İnformasiya qrupu", guest: "", note: "Dövri elmi bülleten", ts: 1003 },
  p4: { id: "p4", name: "Bakı və Region Gənclərinin II Elmi Konfransı", type: "Böyük", stage: "Hazırlıq", members: 15, owner: "Nərhiz Hacıllı", guest: "Təhsil Nazirliyi nümayəndələri", note: "Böyük miqyaslı tədbir", ts: 1004 },
  p5: { id: "p5", name: "Camp", type: "Böyük", stage: "Planlaşma", members: 20, owner: "Komanda", guest: "", note: "Yay elmi düşərgəsi", ts: 1005 },
  p6: { id: "p6", name: "Kimya Forumu", type: "Böyük", stage: "Hazırlıq", members: 12, owner: "Gülçin Mirzayeva", guest: "Elmlər Akademiyası alimləri", note: "Kimya və biotexnologiya", ts: 1006 },
  p7: { id: "p7", name: "DNT Günü", type: "Böyük", stage: "Planlaşma", members: 10, owner: "Cavid Quluyev, Nərgiz İsmayılova", guest: "Genetiklər", note: "Beynəlxalq DNT günü münasibətilə", ts: 1007 },
};

export const INITIAL_MEMBERS: Record<string, Member> = {
  m1: { id: "m1", name: "Nərhiz Hacıllı", ts: 1 },
  m2: { id: "m2", name: "Gülçin Mirzayeva", ts: 2 },
  m3: { id: "m3", name: "Cavid Quluyev", ts: 3 },
  m4: { id: "m4", name: "Nərgiz İsmayılova", ts: 4 },
  m5: { id: "m5", name: "Elmir Qasımov", ts: 5 },
  m6: { id: "m6", name: "Aysel Məmmədova", ts: 6 }
};

export interface AppState {
  members: Record<string, Member>;
  att: Record<string, AttendanceRecord>;
  links: DriveLinks;
  projects: Record<string, Project>;
  events: Record<string, CalendarEvent>;
  items: Record<string, GenericItem>;
}

const STORAGE_KEY = "aeik_state_v1";

export function loadInitialState(): AppState {
  if (typeof window === "undefined") {
    return {
      members: INITIAL_MEMBERS,
      att: {},
      links: {},
      projects: INITIAL_PROJECTS,
      events: {},
      items: {}
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Local storage parse error", e);
    }
  }

  const def: AppState = {
    members: INITIAL_MEMBERS,
    att: {
      "m1_0": { v: "+", m: "m1", mo: 0 },
      "m1_1": { v: "+", m: "m1", mo: 1 },
      "m2_0": { v: "+", m: "m2", mo: 0 },
      "m2_1": { v: "-", m: "m2", mo: 1 },
      "m3_0": { v: "+", m: "m3", mo: 0 },
    },
    links: {},
    projects: INITIAL_PROJECTS,
    events: {
      e1: { id: "e1", pid: "p4", date: "2026-03-27", time: "11:00", note: "Əsas zal, açılış", ts: 101 },
      e2: { id: "e2", pid: "p6", date: "2026-04-15", time: "14:30", note: "Bakı Konqres Mərkəzi", ts: 102 }
    },
    items: {
      it1: { id: "it1", sec: "posts", title: "Kimya Forumu Qeydiyyat Postu", status: "Hazırlanır", plat: "Instagram", proj: "Kimya Forumu", who: "SMM komandası", date: "2026-03-01", ts: 1 },
      it2: { id: "it2", sec: "partners", title: "Bakı Dövlət Universiteti", status: "Razılaşma", ptype: "Universitet", who: "Nərhiz H.", contact: "Elm Şöbəsi", date: "2026-02-15", next: "Memorandum imzalanması", ts: 2 },
      it3: { id: "it3", sec: "tasks", title: "DNT Günü üçün afişaların hazırlanması", meta: "Dizayn şöbəsi", text: "3 fərqli vizual konsepsiya", status: "Davam edir", ts: 3 },
      it4: { id: "it4", sec: "meetings", title: "İllik fəaliyyət planı iclası", meta: "15 Yanvar 2026", text: "Böyük layihələrin büdcə bölgüsü müzakirə olundu.", text2: "Kimya Forumunun tarixi təsdiqləndi.", ts: 4 },
      it5: { id: "it5", sec: "notes", title: "Könüllü qəbulu meyarları", meta: "2026", text: "Elmi maraq və komanda ilə iş bacarığı əsas meyardır.", ts: 5 }
    }
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(def));
  return def;
}

export function saveLocalState(state: AppState) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

// Fetch live data from MongoDB
export async function fetchRemoteState(): Promise<{ connected: boolean; data?: AppState }> {
  try {
    const res = await fetch('/api/data', { cache: 'no-store' });
    if (!res.ok) return { connected: false };
    const json = await res.json();
    if (json.connected && json.data) {
      saveLocalState(json.data);
      return { connected: true, data: json.data };
    }
    return { connected: false };
  } catch (err) {
    console.error("Fetch remote state error:", err);
    return { connected: false };
  }
}

// Sync single mutation with MongoDB backend
export async function syncToBackend(entity: string, action: 'save' | 'delete', id: string, data?: any) {
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity, action, id, data })
    });
  } catch (err) {
    console.error("Backend sync error:", err);
  }
}
