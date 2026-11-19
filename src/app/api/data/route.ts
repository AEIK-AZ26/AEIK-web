import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { 
  MemberModel, 
  AttendanceModel, 
  ProjectModel, 
  EventModel, 
  LinkModel, 
  ItemModel 
} from '@/models/CabinetData';
import { 
  INITIAL_MEMBERS, 
  INITIAL_PROJECTS 
} from '@/lib/store';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        connected: false,
        message: 'MongoDB konfiqurasiya edilməyib, daxili yaddaş istifadə olunur.',
      });
    }

    // 1. Fetch Members
    let membersDocs = await MemberModel.find({});
    if (membersDocs.length === 0) {
      // Seed default members if empty
      const initialList = Object.values(INITIAL_MEMBERS);
      await MemberModel.insertMany(initialList);
      membersDocs = await MemberModel.find({});
    }
    const members: Record<string, any> = {};
    membersDocs.forEach((m) => {
      members[m.id] = { id: m.id, name: m.name, ts: m.ts };
    });

    // 2. Fetch Projects
    let projectDocs = await ProjectModel.find({});
    if (projectDocs.length === 0) {
      // Seed default projects if empty
      const initialProjList = Object.values(INITIAL_PROJECTS);
      await ProjectModel.insertMany(initialProjList);
      projectDocs = await ProjectModel.find({});
    }
    const projects: Record<string, any> = {};
    projectDocs.forEach((p) => {
      projects[p.id] = {
        id: p.id,
        name: p.name,
        type: p.type,
        stage: p.stage,
        members: p.members,
        owner: p.owner,
        guest: p.guest,
        note: p.note,
        ts: p.ts,
      };
    });

    // 3. Fetch Attendance
    const attDocs = await AttendanceModel.find({});
    const att: Record<string, any> = {};
    attDocs.forEach((a) => {
      att[a.key] = { v: a.v, m: a.m, mo: a.mo };
    });

    // 4. Fetch Events
    let eventDocs = await EventModel.find({});
    if (eventDocs.length === 0 && projectDocs.length > 0) {
      const initialEvents = [
        { id: "e1", pid: projectDocs[0]?.id || "p1", date: "2026-03-27", time: "11:00", note: "Əsas zal, açılış", ts: 101 },
        { id: "e2", pid: projectDocs[3]?.id || "p4", date: "2026-04-15", time: "14:30", note: "Bakı Konqres Mərkəzi", ts: 102 }
      ];
      await EventModel.insertMany(initialEvents);
      eventDocs = await EventModel.find({});
    }
    const events: Record<string, any> = {};
    eventDocs.forEach((e) => {
      events[e.id] = { id: e.id, pid: e.pid, date: e.date, time: e.time, note: e.note, ts: e.ts };
    });

    // 5. Fetch Drive Links
    const linkDocs = await LinkModel.find({});
    const links: Record<string, any> = {};
    linkDocs.forEach((l) => {
      links[l.linkId] = { url: l.url };
    });

    // 6. Fetch Items
    let itemDocs = await ItemModel.find({});
    if (itemDocs.length === 0) {
      const initialItems = [
        { id: "it1", sec: "posts", title: "Kimya Forumu Qeydiyyat Postu", status: "Hazırlanır", plat: "Instagram", proj: "Kimya Forumu", who: "SMM komandası", date: "2026-03-01", ts: 1 },
        { id: "it2", sec: "partners", title: "Bakı Dövlət Universiteti", status: "Razılaşma", ptype: "Universitet", who: "Nərhiz H.", contact: "Elm Şöbəsi", date: "2026-02-15", next: "Memorandum imzalanması", ts: 2 },
        { id: "it3", sec: "tasks", title: "DNT Günü üçün afişaların hazırlanması", meta: "Dizayn şöbəsi", text: "3 fərqli vizual konsepsiya", status: "Davam edir", ts: 3 },
        { id: "it4", sec: "meetings", title: "İllik fəaliyyət planı iclası", meta: "15 Yanvar 2026", text: "Böyük layihələrin büdcə bölgüsü müzakirə olundu.", text2: "Kimya Forumunun tarixi təsdiqləndi.", ts: 4 },
        { id: "it5", sec: "notes", title: "Könüllü qəbulu meyarları", meta: "2026", text: "Elmi maraq və komanda ilə iş bacarığı əsas meyardır.", ts: 5 }
      ];
      await ItemModel.insertMany(initialItems);
      itemDocs = await ItemModel.find({});
    }
    const items: Record<string, any> = {};
    itemDocs.forEach((it) => {
      items[it.id] = it.toObject();
    });

    return NextResponse.json({
      connected: true,
      data: {
        members,
        att,
        projects,
        events,
        links,
        items,
      },
    });
  } catch (error: any) {
    console.error('Fetch Data API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Məlumatları gətirərkən xəta baş verdi.' },
      { status: 500 }
    );
  }
}
