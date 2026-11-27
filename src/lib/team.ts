export type TeamStatus = 'published' | 'draft';

/** Komanda üzvü — `/komanda` səhifəsindəki "Layihələri idarə edən komanda" kartları. */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  project: string;
  text: string;
  image: string;
  email?: string;
  order: number;
  status: TeamStatus;
  ts: number;
}

export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: 'team-nerhiz',
    name: 'Nərhiz Hacıllı',
    role: 'Layihə rəhbəri',
    project: 'Bakı və region gənclərinin II Elmi Konfransı',
    image: '/assets/team/nerhiz-hacilli.jpg',
    text: 'Konfransın ümumi planını, tərəfdaşlarla əlaqəni və komandalar arasında koordinasiyanı idarə edir.',
    email: '',
    order: 1,
    status: 'published',
    ts: 1,
  },
  {
    id: 'team-gulcin',
    name: 'Gülçin Mirzayeva',
    role: 'Kimya Forumu üzrə rəhbər',
    project: 'Kimya Forumu',
    image: '/assets/team/gulcin-mirzayeva.jpg',
    text: 'Kimya və biotexnologiya istiqamətində forum proqramını, spikerləri və iştirakçı seçimini idarə edir.',
    email: '',
    order: 2,
    status: 'published',
    ts: 2,
  },
  {
    id: 'team-cavid',
    name: 'Cavid Quluyev',
    role: 'DNT Günü üzrə rəhbər',
    project: 'DNT Günü',
    image: '/assets/team/cavid-quluyev.jpg',
    text: 'Beynəlxalq DNT Günü çərçivəsində tədbir proqramını və genetika üzrə mütəxəssislərlə əlaqəni koordinasiya edir.',
    email: '',
    order: 3,
    status: 'published',
    ts: 3,
  },
  {
    id: 'team-nergiz',
    name: 'Nərgiz İsmayılova',
    role: 'DNT Günü üzrə koordinator',
    project: 'DNT Günü',
    image: '/assets/team/nergiz-ismayilova.jpg',
    text: 'Laboratoriya turları, könüllü komandası və iştirakçı qeydiyyatı prosesinə cavabdehdir.',
    email: '',
    order: 4,
    status: 'published',
    ts: 4,
  },
];
