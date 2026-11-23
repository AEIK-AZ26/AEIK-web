'use strict';

const MEMBERS = [
  { id: 'm1', name: 'Nərhiz Hacıllı', ts: 1 },
  { id: 'm2', name: 'Gülçin Mirzayeva', ts: 2 },
  { id: 'm3', name: 'Cavid Quluyev', ts: 3 },
  { id: 'm4', name: 'Nərgiz İsmayılova', ts: 4 },
  { id: 'm5', name: 'Elmir Qasımov', ts: 5 },
  { id: 'm6', name: 'Aysel Məmmədova', ts: 6 },
];

const PROJECTS = [
  { id: 'p1', name: 'Məqalə saatları', type: 'Dövri', stage: 'İcrada', members: 4, owner: 'Elmi Heyət', guest: '', note: 'Həftəlik elmi müzakirələr', ts: 1001 },
  { id: 'p2', name: 'Akademik yol', type: 'Dövri', stage: 'İcrada', members: 6, owner: 'Təhsil Şöbəsi', guest: '', note: 'Gənc tədqiqatçılara mentorluq', ts: 1002 },
  { id: 'p3', name: 'Elm məlumatxanası', type: 'Dövri', stage: 'İcrada', members: 5, owner: 'İnformasiya qrupu', guest: '', note: 'Dövri elmi bülleten', ts: 1003 },
  { id: 'p4', name: 'Bakı və Region Gənclərinin II Elmi Konfransı', type: 'Böyük', stage: 'Hazırlıq', members: 15, owner: 'Nərhiz Hacıllı', guest: 'Təhsil Nazirliyi nümayəndələri', note: 'Böyük miqyaslı tədbir', ts: 1004 },
  { id: 'p5', name: 'Camp', type: 'Böyük', stage: 'Planlaşma', members: 20, owner: 'Komanda', guest: '', note: 'Yay elmi düşərgəsi', ts: 1005 },
  { id: 'p6', name: 'Kimya Forumu', type: 'Böyük', stage: 'Hazırlıq', members: 12, owner: 'Gülçin Mirzayeva', guest: 'Elmlər Akademiyası alimləri', note: 'Kimya və biotexnologiya', ts: 1006 },
  { id: 'p7', name: 'DNT Günü', type: 'Böyük', stage: 'Planlaşma', members: 10, owner: 'Cavid Quluyev, Nərgiz İsmayılova', guest: 'Genetiklər', note: 'Beynəlxalq DNT günü münasibətilə', ts: 1007 },
];

const EVENTS = [
  { id: 'e1', pid: 'p1', date: '2026-03-27', time: '11:00', note: 'Əsas zal, açılış', ts: 101 },
  { id: 'e2', pid: 'p4', date: '2026-04-15', time: '14:30', note: 'Bakı Konqres Mərkəzi', ts: 102 },
];

const ITEMS = [
  { id: 'it1', sec: 'posts', title: 'Kimya Forumu Qeydiyyat Postu', status: 'Hazırlanır', meta: '', text: '', text2: '', date: '2026-03-01', plat: 'Instagram', proj: 'Kimya Forumu', who: 'SMM komandası', link: '', ptype: '', contact: '', next: '', val: '', area: '', ts: 1 },
  { id: 'it2', sec: 'partners', title: 'Bakı Dövlət Universiteti', status: 'Razılaşma', meta: '', text: '', text2: '', date: '2026-02-15', plat: '', proj: '', who: 'Nərhiz H.', link: '', ptype: 'Universitet', contact: 'Elm Şöbəsi', next: 'Memorandum imzalanması', val: '', area: '', ts: 2 },
  { id: 'it3', sec: 'tasks', title: 'DNT Günü üçün afişaların hazırlanması', status: 'Davam edir', meta: 'Dizayn şöbəsi', text: '3 fərqli vizual konsepsiya', text2: '', date: '', plat: '', proj: '', who: '', link: '', ptype: '', contact: '', next: '', val: '', area: '', ts: 3 },
  { id: 'it4', sec: 'meetings', title: 'İllik fəaliyyət planı iclası', status: '', meta: '15 Yanvar 2026', text: 'Böyük layihələrin büdcə bölgüsü müzakirə olundu.', text2: 'Kimya Forumunun tarixi təsdiqləndi.', date: '', plat: '', proj: '', who: '', link: '', ptype: '', contact: '', next: '', val: '', area: '', ts: 4 },
  { id: 'it5', sec: 'notes', title: 'Könüllü qəbulu meyarları', status: '', meta: '2026', text: 'Elmi maraq və komanda ilə iş bacarığı əsas meyardır.', text2: '', date: '', plat: '', proj: '', who: '', link: '', ptype: '', contact: '', next: '', val: '', area: '', ts: 5 },
];

async function seedCollection(db, name, docs, idField) {
  const collection = db.collection(name);
  const count = await collection.estimatedDocumentCount();
  if (count > 0) return false;
  try {
    await collection.insertMany(docs.map((doc) => ({ ...doc, [idField]: doc[idField] })));
    return true;
  } catch (error) {
    if (error && error.code === 11000) return false; // paralel seed — problem deyil
    throw error;
  }
}

/** Boş kolleksiyaları ilkin məlumatlarla doldurur (mövcud məlumatlara toxunmur). */
async function seedDatabase(db) {
  await seedCollection(db, 'members', MEMBERS, 'id');
  await seedCollection(db, 'projects', PROJECTS, 'id');
  await seedCollection(db, 'events', EVENTS, 'id');
  await seedCollection(db, 'items', ITEMS, 'id');
}

module.exports = seedDatabase;
module.exports.MEMBERS = MEMBERS;
module.exports.PROJECTS = PROJECTS;
module.exports.EVENTS = EVENTS;
module.exports.ITEMS = ITEMS;
