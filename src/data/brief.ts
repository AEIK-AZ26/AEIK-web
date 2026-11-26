// Sayt brifinə (AEİK.az · yekun versiya) uyğun məzmun mənbəyi.
// Struktur məlumat (tədbirlər, jurnal, tərəfdaşlar) burada saxlanılır;
// xəbər/elan/layihə məzmunu menecer panelindən idarə olunur.

export const CONTACT = {
  email: "info@aeik.az",
  journalEmail: "jurnal@aeik.az",
  phone: "+994 70 399 25 54",
  phoneHref: "tel:+994703992554",
  instagram: "https://www.instagram.com/aeikvolunteer/",
  linkedin:
    "https://www.linkedin.com/company/az%C9%99rbaycan-elm-v%C9%99-i%CC%87nnovasiya-k%C3%B6n%C3%BCll%C3%BCl%C9%99ri/",
  participants: "10 000+",
  status:
    '"Bir Könüllü" Tələbələrin Əməkdaşlığı İctimai Birliyinin Elm və İnnovasiya proqramının tərkib layihəsi',
};

export const SITE = {
  url: "https://aeik.az",
  title: "Azərbaycan Elm və İnnovasiya Könüllüləri (AEİK)",
  description:
    "Gənc tədqiqatçılar, tələbələr və innovatorlar üçün elmi tədbirlər, AEİK Jurnalı, elmi imkanlar və tərəfdaşlıq imkanları.",
  motto: "Araşdırırıq. Yaradırıq. Dəyişirik.",
};

export interface NavChild {
  label: string;
  href: string;
  desc?: string;
}

export interface NavItem {
  label: string;
  href: string;
  match?: string[];
  children?: NavChild[];
}

/** Yeni menyu — 7 bölmə (brifin sayt xəritəsi). */
export const NAV: NavItem[] = [
  {
    label: "Haqqımızda",
    href: "/haqqimizda",
    children: [
      { label: "Missiya və status", href: "/haqqimizda#missiya", desc: "AEİK kimdir və nə edir" },
      { label: "Komanda", href: "/haqqimizda#komanda", desc: "Komanda strukturu və profil formatı" },
      { label: "10 000+ iştirakçı", href: "/haqqimizda#gosterici", desc: "Fəaliyyətin göstəriciləri" },
      { label: "Hesabatlar", href: "/haqqimizda#hesabatlar", desc: "İllik fəaliyyət hesabatları" },
      { label: "Könüllü / mentor ol", href: "/muraciet", desc: "Komandaya qoşul" },
    ],
  },
  {
    label: "Tədbirlər",
    href: "/tedbirler",
    children: [
      { label: "Tədbir təqvimi", href: "/tedbirler#teqvim", desc: "Bütün tədbirlər və tarixlər" },
      { label: "Onlayn qeydiyyat", href: "/tedbirler#qeydiyyat", desc: "Tədbirə qeydiyyat qaydası" },
      { label: "Tezis göndər", href: "/tedbirler/tezis", desc: "Konfrans və forumlar üçün" },
      { label: "Arxiv və qalereya", href: "/tedbirler/arxiv", desc: "Keçmiş tədbirlər" },
    ],
  },
  {
    label: "Layihələr",
    href: "/layiheler",
    children: [
      { label: "Beynəlxalq Elmi Forum", href: "/tedbirler/beynelxalq-elmi-forum" },
      { label: "İnnovasiya Akseleratoru", href: "/tedbirler/innovasiya-startap-akseleratoru" },
      { label: "BioPhysChem Camp", href: "/tedbirler/biophyschem-science-camp-hackathon" },
      { label: "Science 1.0", href: "/tedbirler/science-1-0-genc-tedqiqatcilar-festivali" },
      { label: "Forum və konfranslar", href: "/layiheler" },
    ],
  },
  {
    label: "AEİK Jurnalı",
    href: "/jurnal",
    children: [
      { label: "Jurnal haqqında", href: "/jurnal#haqqinda" },
      { label: "İcmal göndər", href: "/jurnal#icmal" },
      { label: "Rəyçi ol", href: "/jurnal#reyci" },
      { label: "Şablon və bələdçi", href: "/jurnal#sablon" },
      { label: "Nəşr təqvimi · Zenodo", href: "/jurnal#teqvim" },
    ],
  },
  {
    label: "Elmi imkanlar",
    href: "/elmi-imkanlar",
    children: [
      { label: "Laboratoriya xəritəsi", href: "/elmi-imkanlar#xerite" },
      { label: "Bələdçilər və şablonlar", href: "/resurslar#beledciler" },
      { label: "Akademik karyera", href: "/elmi-imkanlar#karyera" },
      { label: "Bloq", href: "/resurslar#bloq" },
    ],
  },
  {
    label: "Tərəfdaşlar",
    href: "/terefdaslar",
    children: [
      { label: "Loqo divarı", href: "/terefdaslar#logolar" },
      { label: "Niyə AEİK-ə dəstək", href: "/terefdaslar#niye" },
      { label: "Əməkdaşlıq formatları", href: "/terefdaslar#formatlar" },
      { label: "Sorğu forması", href: "/terefdaslar#sorgu" },
    ],
  },
  {
    label: "Xəbər və elanlar",
    href: "/xeberler",
    match: ["/xeberler", "/elanlar", "/media"],
    children: [
      { label: "Xəbərlər", href: "/xeberler" },
      { label: "Elanlar", href: "/elanlar", desc: "Status nişanı ilə" },
      { label: "Media haqqında", href: "/media" },
      { label: "Fəaliyyət planı", href: "/#fealiyyet" },
    ],
  },
];

export const ABOUT = {
  intro:
    "Azərbaycan Elm və İnnovasiya Könüllüləri (AEİK) gənc tədqiqatçıları, tələbələri və innovatorları bir araya gətirən könüllü təşəbbüsdür. Missiyamız gəncləri elmə yaxınlaşdırmaq və elmi cəmiyyət üçün əlçatan etməkdir.",
  paragraphs: [
    "AEİK bakalavr, magistr və doktorantura tələbələrinə elmi bilik, mentorluq və əməkdaşlıq imkanı verir. Məqsədimiz ideyanı araşdırmadan real layihəyə çatdırmaqdır: elmi icmal yazmaqdan konfrans məruzəsinə, laboratoriya praktikasından startap pitch-inə qədər.",
    "AEİK \"Bir Könüllü\" Tələbələrin Əməkdaşlığı İctimai Birliyinin Elm və İnnovasiya proqramının tərkib layihəsidir. Bu günədək fəaliyyətlərimizə 10 000-dən çox iştirakçı qoşulub. Bir çox universitet, özəl və dövlət qurumları ilə əməkdaşlıq edirik.",
  ],
  what: [
    {
      title: "Müntəzəm formatlar",
      text: "Məqalə saatları, Akademik Yol karyera görüşləri, Elm Kafe açıq müzakirələri və İnnovasiya Emalatxanası.",
    },
    {
      title: "Böyük tədbirlər",
      text: "Forumlar, elmi konfranslar, master-klaslar, science camp və hackathonlar.",
    },
    {
      title: "AEİK Jurnalı",
      text: "Tələbələrin elmi icmalları üçün pulsuz, DOI-li nəşr platforması.",
    },
  ],
  values: ["Elmi dürüstlük", "Əlçatanlıq", "Əməkdaşlıq", "Könüllülük"],
};

export type EventStatus = "open" | "soon" | "closed";

export interface EventItem {
  slug: string;
  title: string;
  kind: string;
  date?: string;
  dateNote: string;
  place: string;
  audience: string;
  format: string;
  text: string;
  body: string[];
  status: EventStatus;
  thesis?: boolean;
  registration?: boolean;
  image?: string;
}

/** Brifin 6.1 bölməsindəki layihə/tədbir kartları. */
export const EVENTS: EventItem[] = [
  {
    slug: "science-1-0-genc-tedqiqatcilar-festivali",
    title: "Science 1.0 — Gənc Tədqiqatçılar Festivalı",
    kind: "Festival + simpozium",
    dateNote: "Tarix tezliklə elan olunacaq",
    place: "Bakı",
    audience: "Bakalavr, magistr, doktorantlar, gənc tədqiqatçılar",
    format: "3 günlük festival + simpozium",
    text: "Gənc tədqiqatçıları bir araya gətirən elm festivalı: məruzə və poster sessiyaları, “Elmim, Arzum” 3 dəqiqəlik pitch, qrant yazımı və akademik yazı seminarları, dəyirmi masa.",
    body: [
      "Science 1.0 gənc tədqiqatçıların işini geniş auditoriyaya çıxarmaq üçün qurulmuş üç günlük festivaldır. Proqram məruzə və poster sessiyalarını, “Elmim, Arzum” formatında 3 dəqiqəlik pitch-ləri və dəyirmi masaları birləşdirir.",
      "Festival çərçivəsində qrant yazımı və akademik yazı üzrə praktiki seminarlar keçirilir. İştirakçılar öz sahələrindən mentorlarla tanış olur, digər universitetlərdən komandalarla əməkdaşlıq qurur.",
      "Tarix və məkan təsdiqləndikdən sonra qeydiyyat bu səhifədə açılacaq.",
    ],
    status: "soon",
    registration: false,
    image: "/assets/pages/project-forum.jpg",
  },
  {
    slug: "biophyschem-science-camp-hackathon",
    title: "BioPhysChem Science Camp & Hackathon",
    kind: "Camp + hackathon",
    dateNote: "Tarix tezliklə elan olunacaq",
    place: "Bakı",
    audience: "Təbiət elmləri tələbələri, 5–6 nəfərlik komandalar",
    format: "4 gün: camp + hackathon",
    text: "Biologiya, fizika və kimyanı birləşdirən intensiv proqram: 3 gün təlim, mini-laboratoriyalar və mentorluq, sonra 24 saatlıq hackathon və jüri qarşısında təqdimat.",
    body: [
      "BioPhysChem Science Camp üç fənni — biologiya, fizika və kimyanı — bir proqramda birləşdirir. İlk üç gün təlimlər, mini-laboratoriya işləri və mentorluq sessiyaları keçirilir.",
      "Dördüncü gün 24 saatlıq hackathon təşkil olunur: komandalar real elmi-texnoloji məsələ üzərində işləyir və nəticəni jüri qarşısında təqdim edir.",
      "Komandalar 5–6 nəfərdən ibarət olmalıdır. Qeydiyyat tarixləri təsdiqləndikdən sonra açılır.",
    ],
    status: "soon",
    registration: false,
    image: "/assets/pages/about-lab.jpg",
  },
  {
    slug: "beynelxalq-elmi-forum",
    title: "Beynəlxalq Elmi Forum",
    kind: "Forum · tezis qəbulu",
    date: "2027-01-20",
    dateNote: "Yanvar 2027 (fəaliyyət planına əsasən)",
    place: "Bakı",
    audience: "Gənc tədqiqatçılar, tələbələr",
    format: "Forum, tezis qəbulu",
    text: "Gənc tədqiqatçıların tezislərlə iştirak etdiyi beynəlxalq elmi forum: məruzələr, poster sessiyaları və tematik panellər.",
    body: [
      "Beynəlxalq Elmi Forum yerli və xarici gənc tədqiqatçıları bir platformada birləşdirir. Proqram məruzələr, poster sessiyaları və tematik panellərdən ibarətdir.",
      "İştirak tezis əsasında olur; qəbul edilən tezislər proqram kitabçasında dərc olunur. Ən yaxşı işlər mükafatlandırılır.",
      "Fəaliyyət planına əsasən forum yanvar 2027-də keçirilir. Dəqiq tarix və tezis qəbulunun son tarixi ayrıca elan olunacaq.",
    ],
    status: "soon",
    thesis: true,
    registration: true,
    image: "/assets/pages/project-forum.jpg",
  },
  {
    slug: "innovasiya-startap-akseleratoru",
    title: "İnnovasiya və Startap Akseleratoru",
    kind: "Akselerator · mentorluq",
    dateNote: "Oktyabr 2026 – Fevral 2027",
    place: "Onlayn + Bakı",
    audience: "İdeyası olan tələbə komandaları",
    format: "Akselerator, mentorluq, Demo Day",
    text: "İdeyası olan tələbə komandaları üçün mentorluq proqramı və Demo Day: biznes modeli, məhsul inkişafı və təqdimat bacarıqları.",
    body: [
      "Akselerator tələbə komandalarını ideyadan işlək məhsula aparan dörd aylıq proqramdır. Komandalara biznes modeli, məhsul inkişafı, bazar araşdırması və təqdimat bacarıqları üzrə mentorlar təyin olunur.",
      "Proqram mərhələli görüşlər və yekun Demo Day ilə tamamlanır; Demo Day-də investorlar və şirkətlər qarşısında təqdimatlar keçirilir.",
      "Fəaliyyət planına əsasən mentorluq oktyabr 2026 – yanvar 2027, Demo Day fevral 2027-də nəzərdə tutulur.",
    ],
    status: "soon",
    registration: true,
    image: "/assets/pages/project-startup.jpg",
  },
  {
    slug: "azerbaycan-telebelerinin-elm-innovasiya-forumu",
    title: "Azərbaycan Tələbələrinin Elm və İnnovasiya Forumu",
    kind: "Forum",
    dateNote: "Tarix tezliklə elan olunacaq",
    place: "Bakı",
    audience: "Bütün ixtisaslardan tələbələr",
    format: "Forum, panellər, təqdimatlar",
    text: "Tələbə tədqiqatlarının və innovativ ideyalarının təqdim olunduğu, universitet və şirkətlərlə görüş imkanı verən forum.",
    body: [
      "Forum tələbələrin tədqiqatlarını və innovativ ideyalarını universitet və şirkət nümayəndələrinə təqdim etməsi üçün platformadır.",
      "Proqram panellər, təqdimatlar və networking sessiyalarından ibarətdir.",
    ],
    status: "soon",
    registration: false,
  },
  {
    slug: "elmin-kimyasi-forumu",
    title: "Elmin Kimyası Forumu",
    kind: "Forum",
    dateNote: "Tarix tezliklə elan olunacaq",
    place: "Bakı",
    audience: "Kimya və yaxın sahələrin tələbələri",
    format: "Forum, məruzələr, stendlər",
    text: "Kimya və tətbiqi kimya sahəsində tədqiqat, laboratoriya və karyera imkanlarına həsr olunmuş forum.",
    body: [
      "Forum kimya və tətbiqi kimya sahəsində tədqiqat imkanlarını, laboratoriya təcrübəsini və karyera yollarını müzakirə edir.",
      "Proqram məruzələr, stend sessiyaları və sənaye nümayəndələri ilə görüşləri əhatə edir.",
    ],
    status: "soon",
    registration: false,
  },
  {
    slug: "dnt-gunu",
    title: "DNT Günü",
    kind: "Elmi-maarifləndirici tədbir",
    dateNote: "Tarix tezliklə elan olunacaq",
    place: "Bakı",
    audience: "Tələbələr, gənclər, maraqlı ictimaiyyət",
    format: "Elmi tədbir, məruzələr",
    text: "DNT-nin kəşfini və genetikanın bu günkü imkanlarını tanıdan elmi-maarifləndirici tədbir.",
    body: [
      "DNT Günü genetikanın tarixi və müasir imkanları haqqında geniş auditoriya üçün açıq tədbirdir.",
      "Proqram məruzələr, qısa təqdimatlar və sual-cavab sessiyasından ibarətdir.",
    ],
    status: "soon",
    registration: false,
  },
  {
    slug: "genetik-oxu-yazma-master-klasi",
    title: "Genetik oxu-yazma master-klası",
    kind: "Master-klas",
    dateNote: "Tarix tezliklə elan olunacaq",
    place: "Bakı",
    audience: "Gənclər, tələbələr, mütəxəssislər",
    format: "Master-klas",
    text: "Genetik məlumatların oxunması və şərh edilməsi üzrə praktiki məşğələ.",
    body: [
      "Master-klas genetik məlumatların oxunması, şərh edilməsi və praktik tətbiqi üzrə məşğələləri əhatə edir.",
      "İştirak üçün ilkin biologiya bilikləri tövsiyə olunur; iştirakçı sayı məhduddur.",
    ],
    status: "soon",
    registration: false,
  },
  {
    slug: "elmi-yazi-ve-teqdimat-bacariqlari-master-klasi",
    title: "Elmi yazı və təqdimat bacarıqları master-klası",
    kind: "Master-klas",
    dateNote: "Tarix tezliklə elan olunacaq",
    place: "Onlayn",
    audience: "Tələbələr və gənc tədqiqatçılar",
    format: "Master-klas",
    text: "Elmi mətn, icmal və təqdimat hazırlamaq üzrə praktiki məşğələ.",
    body: [
      "Məşğələ elmi mətnin strukturu, mənbələrlə iş, icmal yazısı və təqdimat hazırlığını praktiki tapşırıqlarla əhatə edir.",
      "İştirakçılar öz abstracts və slaydları üzərində işləyərək rəy alır.",
    ],
    status: "soon",
    registration: false,
  },
  {
    slug: "baki-ve-region-genclerinin-ii-elmi-konfransi",
    title: "Bakı və Region Gənclərinin II Elmi Konfransı",
    kind: "Konfrans · tezis qəbulu",
    dateNote: "Tarix tezliklə elan olunacaq",
    place: "Bakı",
    audience: "Gənc tədqiqatçılar, tələbələr",
    format: "Konfrans, tezis qəbulu",
    text: "Bakı və regionlardan gənc tədqiqatçıların tezislərlə çıxış etdiyi elmi konfrans.",
    body: [
      "Konfrans Bakı və regionlardan olan gənc tədqiqatçıları bir araya gətirir; iştirak tezis əsasında olur.",
      "Qəbul edilən tezislər proqram kitabçasında dərc olunur. Tarix və son müraciət tarixi ayrıca elan ediləcək.",
    ],
    status: "soon",
    thesis: true,
    registration: false,
  },
  {
    slug: "multidisiplinar-konfrans",
    title: "Multidisiplinar konfrans",
    kind: "Konfrans",
    dateNote: "Tarix tezliklə elan olunacaq",
    place: "Bakı",
    audience: "Bütün sahələrdən gənc tədqiqatçılar",
    format: "Konfrans",
    text: "Müxtəlif elm sahələrini bir platformada birləşdirən konfrans.",
    body: [
      "Multidisiplinar konfrans müxtəlif sahələrdən gənc tədqiqatçıların bir-birinin işi ilə tanış olması və sahələrarası əməkdaşlıq qurması üçün nəzərdə tutulur.",
      "Proqram məruzələr və panellərdən ibarətdir.",
    ],
    status: "soon",
    registration: false,
  },
];

export const JOURNAL = {
  intro:
    "AEİK Jurnalı tələbələrin elmi-akademik yazı bacarıqlarını inkişaf etdirmək və onların işlərini dərc etmək üçün yaradılıb. Jurnal kimya, fizika və biologiya istiqamətləri üzrə yalnız elmi icmal (review) xarakterli yazılar qəbul edir; orijinal tədqiqat məqalələri qəbul olunmur. Nəşr pulsuzdur və hər icmal Zenodo-da DOI ilə yayımlanır.",
  process: [
    "Hazır şablonu və müəllif bələdçisini yükləyin.",
    "İcmalınızı şablona uyğun hazırlayın və göndərin.",
    "Yazı sahə redaktoru tərəfindən yoxlanılır, lazım olduqda müəllifə e-poçtla düzəliş qeydləri göndərilir.",
    "Yekun təsdiqi baş redaktor verir və icmal DOI ilə nəşr olunur.",
  ],
  links: {
    template:
      "https://drive.google.com/drive/folders/1ALS8AJhGk0bakibsWSkebrO9fZL0VIy3?usp=drive_link",
    zenodo:
      "https://zenodo.org/communities/asiv2025/records?q=&l=list&p=1&s=10&sort=newest",
    plan: "https://docs.google.com/document/d/1WDxw5NFgbm4eMcTpXcGOa5GdG1oLpVQX/edit?usp=sharing&ouid=116564435530102615714&rtpof=true&sd=true",
  },
  calendar: [
    { issue: "I buraxılış", submission: "Mövcud icmallar (qəbul bağlanıb)", publish: "25 dekabr 2026" },
    { issue: "II buraxılış", submission: "20 dekabr 2026 – 5 yanvar 2027", publish: "5–10 mart 2027" },
    { issue: "III buraxılış", submission: "5–20 mart 2027", publish: "20 may 2027" },
  ],
  note: "Mayın ikinci yarısından sentyabra qədər yeni qəbul olmur.",
};

export const PARTNER_VALUE = [
  {
    title: "Böyük auditoriya",
    text: "Azərbaycanda təxminən 2,3 milyon 14–29 yaşlı gənc yaşayır. 2025–2026-cı tədris ilində ali təhsilə 75 min tələbə qəbul olunub, son 10 ildə qəbul 40%-dən çox artıb. AEİK bu auditoriyanın elmə maraqlı hissəsi ilə birbaşa işləyir və artıq 10 000-dən çox iştirakçıya çatıb.",
  },
  {
    title: "Elm və innovasiyada real boşluq",
    text: "Elmi tədqiqat xərcləri ÜDM-in təxminən 0,21%-dir (2024). Qlobal İnnovasiya İndeksi 2024-də Azərbaycan 133 iqtisadiyyat arasında 95-ci yerdədir; “bilik və texnologiya nəticələri” 103-cüdür.",
    sources: [
      { label: "TheGlobalEconomy", href: "https://www.theglobaleconomy.com/Azerbaijan/Research_and_development/" },
      { label: "WIPO GII 2024", href: "https://www.wipo.int/edocs/gii-ranking/2024/az.pdf" },
    ],
  },
  {
    title: "Universitet–sənaye əməkdaşlığı güclü tərəfdir",
    text: "Eyni indeksdə bu göstərici 30-cu yerdədir. AEİK bu körpünü tələbə səviyyəsində qurur.",
    sources: [{ label: "WIPO GII 2024", href: "https://www.wipo.int/edocs/gii-ranking/2024/az.pdf" }],
  },
];

export const PARTNER_BENEFITS = [
  {
    title: "İstedadla erkən çıxış",
    text: "Gələcək mütəxəssisləri universitet illərində tanımaq (iştirakçının razılığı ilə).",
  },
  {
    title: "Öz probleminizin həlli",
    text: "Şirkətin real məsələsi üzərində tələbə komandaları işləyir.",
  },
  {
    title: "Ölçülə bilən KŞM hekayəsi",
    text: "Tədbirdən sonra hesabat, foto, video və statistika.",
  },
  {
    title: "Brend görünürlüyü",
    text: "Afişa, banner, sertifikat, sosial media, saytın tərəfdaşlar divarı.",
  },
  {
    title: "Ekspert rolu",
    text: "Şirkət mütəxəssisləri mentor, spiker və ya münsif kimi iştirak edir.",
  },
];

export const PARTNER_FORMATS = [
  {
    title: "Tədbir tərəfdaşlığı",
    text: "Forum, konfrans və festivalların keçirilməsinə dəstək; səhnə, stend və materiallarda brendin təqdimatı.",
  },
  {
    title: "Təhsil proqramı",
    text: "Master-klas, seminar və ya akselerator modulunun birlikdə hazırlanması.",
  },
  {
    title: "Tələbə məsələsi / case",
    text: "Şirkətin real məsələsi üzrə tələbə komandalarının işləməsi və nəticələrin təqdimatı.",
  },
  {
    title: "Mentorluq və ekspertiza",
    text: "Mütəxəssislərin mentor, spiker, rəyçi və ya münsif kimi cəlb olunması.",
  },
];

export const TEAM_FORMAT = {
  photo: "Kvadrat (1:1), ən azı 800×800 px, JPG; üz mərkəzdə, sadə açıq fon. Fayl adı: ad-soyad.jpg.",
  bio: "3-cü şəxsdə, 40–60 söz, Azərbaycan dilində.",
  links: "LinkedIn (məcburi), ORCID / Google Scholar (elmi rollar üçün).",
  consent: "“Foto və məlumatlarımın aeik.az-da dərc edilməsinə razıyam.”",
  example:
    "[Ad Soyad] — Tədbirlər üzrə koordinator. Biologiya ixtisası üzrə 3-cü kurs tələbəsi, [Universitet]. Elm Kafe və Məqalə saatlarının planlaşdırılmasını, spikerlərlə əlaqəni və iştirakçı qeydiyyatını idarə edir.",
};

export const RESOURCES = [
  {
    title: "Elmi yazı bələdçisi",
    text: "Məqalə və icmalın strukturu, tezis yazımı, mənbələrin düzgün göstərilməsi.",
    type: "Bələdçi",
  },
  {
    title: "APA 7 sənədləşmə qaydaları",
    text: "Mənbə siyahısı, sitat formaları və tez-tez edilən səhvlər üzrə qısa məlumat.",
    type: "Şablon",
  },
  {
    title: "Ədəbiyyat axtarışı",
    text: "Google Scholar, Scopus və açıq bazalarda sistemli axtarış üsulları.",
    type: "Bələdçi",
  },
  {
    title: "Elm Kafe video yazıları",
    text: "Keçmiş açıq müzakirələrin qeydləri — Elm Kafe formatında sadə dildə elm.",
    type: "Video",
  },
];

export const OPPORTUNITIES = [
  {
    title: "Laboratoriya və müəssisələr xəritəsi",
    text: "Azərbaycanda elmi tədqiqat aparmaq üçün laboratoriya, mərkəz və müəssisələrin xəritədə toplusu.",
    status: "Hazırlanır",
  },
  {
    title: "Akademik karyera",
    text: "Magistratura və doktoranturaya müraciət, təqaüdlər, beynəlxalq proqramlar və mentorluq imkanları.",
    status: "Hazırlanır",
  },
  {
    title: "Beynəlxalq təqaüdlər",
    text: "Erasmus+, DAAD, Fulbright və digər proqramlar üzrə qısa bələdçi.",
    status: "Planlaşdırılır",
  },
  {
    title: "Mentor görüşləri",
    text: "Tələbə özünə uyğun mentoru seçir və görüş vaxtını onlayn təyin edir.",
    status: "Planlaşdırılır",
  },
];

/** Sertifikat yoxlama üçün nümunə qeydlər (demo). Real qeydlər MongoDB-də saxlanılır. */
export const DEMO_CERTIFICATES = [
  {
    code: "AEIK-2026-0001",
    name: "Nümunə İştirakçı",
    event: "Elm Kafe: ilk açıq müzakirə",
    date: "2026-08-22",
    role: "İştirakçı",
    status: "valid" as const,
    demo: true,
  },
  {
    code: "AEIK-2026-0002",
    name: "Nümunə Könüllü",
    event: "Məqalə saatları — payız sessiyası",
    date: "2026-09-18",
    role: "Könüllü",
    status: "valid" as const,
    demo: true,
  },
];

export const MEDIA_INFO = {
  about:
    "AEİK-in fəaliyyəti, tədbirləri və AEİK Jurnalı haqqında məlumat üçün media nümayəndələri info@aeik.az ünvanına müraciət edə bilər. Müsahibə, foto və video sorğuları 2 iş günü ərzində cavablandırılır.",
  facts: [
    { label: "Təsis olunub", value: "Elm və İnnovasiya proqramı" },
    { label: "İştirakçı", value: "10 000+" },
    { label: "Əsas istiqamətlər", value: "Elm, innovasiya, könüllülük" },
    { label: "Jurnal", value: "DOI-li, pulsuz nəşr" },
  ],
};
