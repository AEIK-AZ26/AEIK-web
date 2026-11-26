// Statik məzmun mənbəyi — bütün mətnlər tək yerdən idarə olunur.
// Backend (MongoDB Web API) hazır olduqda bu fayl API cavabı ilə əvəz olunacaq.

export const NAV_LINKS = [
  { label: "Ana səhifə", href: "/" },
  { label: "Haqqımızda", href: "#haqqimizda" },
  { label: "Layihələr", href: "#layiheler" },
  { label: "Fəaliyyət planı", href: "#fealiyyet" },
  { label: "Əlaqə", href: "#elaqe" },
];

export const HERO = {
  badge: "Elm və İnnovasiya Proqramı",
  title: ["Gələcəyi elmlə", "birlikdə quraq."],
  text: "Tədqiqatdan yeni ideyalara, ideyadan real layihəyə. Gənc tədqiqatçılar və innovatorlar üçün bilik, mentorluq və əməkdaşlıq imkanları.",
  primary: { label: "Tədbirləri kəşf et", href: "/tedbirler" },
  secondary: { label: "Fəaliyyət planı", href: "#fealiyyet" },
  period: "İyul 2026 — Mart 2027",
  motto: "Araşdırırıq. Yaradırıq. Dəyişirik.",
  scroll: "Proqramı kəşf et",
  cardBadge: ["2026 — 2027", "Yeni üfüqlər"],
  cardCaption: {
    eyebrow: "Birlikdə daha irəli",
    title: "Sənin ideyan. Bizim dəstəyimiz.",
  },
};

export const STATS = [
  { value: "4", label: "Böyük layihə" },
  { value: "4", label: "Davamlı fəaliyyət" },
  { value: "9 ay", label: "İyul 2026 – Mart 2027" },
];

export const ABOUT = {
  label: "Proqram haqqında",
  title: ["Bilikdə başlayan,", "birlikdə böyüyən gələcək."],
  text: "Azərbaycan Elm və İnnovasiya Könüllülərinin proqramı gənc tədqiqatçıları və innovatorları bir araya gətirir. Elmi əməkdaşlığı gücləndirir, ideyaların real layihələrə çevrilməsinə dəstək verir.",
  points: [
    "Elmi əməkdaşlıq və beynəlxalq əlaqələr",
    "Praktiki bilik və mentorluq imkanları",
    "İdeyadan layihəyə institusional dəstək",
  ],
  badge: {
    title: "Elm və İnnovasiya",
    text: "ideyaları birləşdirən program",
  },
};

export const PROJECTS = {
  label: "Böyük layihələr",
  title: "İdeyalar böyüyür. Üfüqlər genişlənir.",
  text: "Elmi əlaqələrdən startap ekosisteminə — uzunmüddətli təsir üçün birlikdə.",
  items: [
    {
      id: "forum",
      pill: "Yeni layihə təklifi",
      image: "/assets/pages/project-forum.jpg",
      eyebrow: "Beynəlxalq elmi əməkdaşlıq",
      title: "Gənc Alimlərin Beynəlxalq Elmi Forumu",
      text: "Yerli və xarici gənc tədqiqatçılar üçün mühazirələr, poster sessiyaları və tematik panellər.",
      meta: "Əsas tədbir: Yanvar 2027",
      note: "Hazırlıq: İyul–Dekabr 2026 · Qiymətləndirmə: Fevral 2027",
      link: "Proqramla tanış ol",
    },
    {
      id: "startup",
      pill: "Yeni layihə təklifi",
      image: "/assets/pages/project-startup.jpg",
      eyebrow: "İdeyadan real layihəyə",
      title: "İnnovasiya və Startap Akseleratoru",
      text: "Tələbə komandaları üçün 4 aylıq mentorluq: biznes modeli, məhsul inkişafı və təqdimat bacarıqları.",
      meta: "Mentorluq: Oktyabr 2026 – Yanvar 2027",
      note: "Hazırlıq: Avq–Sen 2026 · Demo Day: Fevral 2027",
      link: "Proqramla tanış ol",
    },
    {
      id: "conference",
      pending: true,
      eyebrow: "Təfərrüatlar gözlənilir",
      title: "Bakı və Region Gənclərinin II Elmi Konfransı",
      text: "Tarix və layihə məzmunu dəqiqləşdirilir. Məlumat təsdiqləndikdən sonra əlavə olunacaq.",
    },
    {
      id: "emmoviss",
      pending: true,
      eyebrow: "Təfərrüatlar gözlənilir",
      title: "EMMOVISS 2026",
      text: "Tarix və layihə məzmunu dəqiqləşdirilir. Məlumat təsdiqləndikdən sonra əlavə olunacaq.",
    },
  ],
  footnote:
    "Qeyd: Elmi Forum və Akselerator fəaliyyət planında yeni layihə təklifləri kimi təqdim olunur.",
};

export const OUTCOMES = {
  label: "Gözlənilən nəticələr",
  title: "Qarşımıza qoyduğumuz hədəflər.",
  text: "Fəaliyyət planı üzrə nəzərdə tutulan nəticələr — əldə edilmiş göstəricilər deyil.",
  items: [
    { value: "100+", label: "Forum üçün tezis / məqalə qəbulu" },
    { value: "8–10", label: "Akseleratoru tamamlayan komanda" },
    { value: "4 ay", label: "Startaplar üçün mentorluq" },
    { value: "9 ay", label: "Davamlı fəaliyyət dövrü" },
  ],
};

export const ACTIVITIES = {
  label: "Davamlı fəaliyyətlər",
  title: "Hər görüş yeni bir başlanğıcdır.",
  text: "Kiçik addımlar, davamlı inkişaf. Bilik və təcrübə paylaşımı üçün dörd format.",
  items: [
    {
      no: "01",
      group: "A qrupu",
      title: "Məqalə Saatları",
      text: "Elmi məqalə yazmaq, oxumaq və rəy vermək üzrə praktiki dərs və seminarlar.",
      audience: "Bakalavr, magistr və doktorantlar",
    },
    {
      no: "02",
      group: "A qrupu",
      title: "Akademik Yol",
      text: "Elmi karyera haqqında açıq müzakirələr, panellər və elm adamları ilə görüşlər.",
      audience: "Elmi karyeraya maraqlı gənclər",
    },
    {
      no: "03",
      group: "B qrupu / Yeni",
      title: "Elm Kafe",
      text: "Gənc tədqiqatçının elmi işini sadə dildə təqdim etdiyi qeyri-rəsmi açıq müzakirə.",
      audience: "Tələbələr və gənc tədqiqatçılar",
    },
    {
      no: "04",
      group: "B qrupu / Yeni",
      title: "İnnovasiya Emalatxanası",
      text: "Dizayn təfəkkürü, layihə və qrant yazısı, təqdimat bacarıqları üzrə praktiki iş.",
      audience: "İdeyası olan gənc komandalar",
    },
  ],
};

export const ROTATION = {
  label: "Aylıq rotasiya",
  groups: [
    { name: "A qrupu", schedule: "Cüt aylar", months: "Avqust, Oktyabr, Dekabr 2026 · Fevral 2027" },
    { name: "B qrupu", schedule: "Tək aylar", months: "Sentyabr, Noyabr 2026 · Yanvar, Mart 2027" },
  ],
};

export const ROADMAP = {
  label: "Fəaliyyət planı",
  title: "9 ay. Ortaq məqsəd. Aydın yol xəritəsi.",
  text: "İyul 2026 – Mart 2027 üçün planlaşdırılmış mərhələlər və növbəti fəaliyyətlər.",
  months: [
    {
      month: "İyul",
      year: "2026",
      title: "Hazırlıq və komanda",
      text: "Planın təsdiqi, məsul şəxslərin təyini və büdcə çərçivəsinin müəyyənləşdirilməsi.",
      tag: "Hazırlıq ayı",
    },
    {
      month: "Avqust",
      year: "2026",
      title: "İlk sessiyalar, ilk ideyalar",
      text: "Akseleratora müraciətlərin qəbulu və kiçik layihələrin ilk sessiyaları.",
      tag: "A qrupu · Məqalə Saatları + Akademik Yol",
    },
    {
      month: "Sentyabr",
      year: "2026",
      title: "Seçim və tərəfdaşlıq",
      text: "Akselerator komandaları və mentorların seçimi; Forum komitəsi və CFP hazırlığı.",
      tag: "B qrupu · Elm Kafe + Emalatxana",
    },
    {
      month: "Oktyabr",
      year: "2026",
      title: "Mentorluq başlayır",
      text: "Akselerator sessiyaları və seminarlar; Elmi Forum üçün məqalə çağırışı (CFP).",
      tag: "A qrupu · Məqalə Saatları + Akademik Yol",
    },
    {
      month: "Noyabr",
      year: "2026",
      title: "İnkişaf və elmi qəbul",
      text: "Akselerator davam edir; Forum üçün tezis və məqalələrin qəbulu aparılır.",
      tag: "B qrupu · Elm Kafe + Emalatxana",
    },
    {
      month: "Dekabr",
      year: "2026",
      title: "Ekspertiza və hesabat",
      text: "Forum işlərinin elmi ekspertizası, mentorluq və ilin qısa fəaliyyət hesabatı.",
      tag: "A qrupu · Məqalə Saatları + Akademik Yol",
    },
    {
      month: "Yanvar",
      year: "2027",
      title: "Beynəlxalq Elmi Forum",
      text: "Məruzələr, poster sessiyaları və ən yaxşı iş mükafatı; Akseleratorun final hazırlığı.",
      tag: "B qrupu · Elm Kafe + Emalatxana",
    },
    {
      month: "Fevral",
      year: "2027",
      title: "Demo Day və final təqdimatları",
      text: "Demo Day: investor və şirkətlər qarşısında təqdimatlar; Forumun qiymətləndirilməsi.",
      tag: "A qrupu · Məqalə Saatları + Akademik Yol",
    },
    {
      month: "Mart",
      year: "2027",
      title: "Nəticələrdən yeni hədəflərə",
      text: "Yekun qiymətləndirmə, illik hesabat və 2027–2028 dövrü üçün tövsiyələr.",
      tag: "B qrupu · Elm Kafe + Emalatxana",
    },
  ],
  notes: [
    "Qeyd: Konfrans və EMMOVISS 2026-nın tarixləri təsdiqləndikdən sonra təqvim yenilənəcək.",
    "Koordinatorların aylıq təyini və tədbir tarixlərinin uzlaşdırılması davamlı icra üçün tövsiyə olunur.",
  ],
};

export const CTA = {
  label: "Növbəti addımı birlikdə ataq",
  title: "Sənin ideyan gələcəyi dəyişə bilər.",
  text: "Araşdır, öyrən və elmi ideyanı böyütmək üçün yeni imkanları kəşf et.",
  button: "Layihələri kəşf et",
};

export const FOOTER = {
  tagline: "Elmin gücü ilə daha yaxşı sabah.",
  discoverTitle: "Kəşf edin",
  discover: [
    { label: "Proqram haqqında", href: "#haqqimizda" },
    { label: "Elanlar", href: "#elanlar" },
    { label: "Xəbərlər", href: "#xeberler" },
    { label: "Böyük layihələr", href: "#layiheler" },
    { label: "Fəaliyyət planı", href: "#fealiyyet" },
    { label: "Üzvlük proqramı", href: "#uzvluk" },
  ],
  periodTitle: "Proqram dövrü",
  period: "İyul 2026 – Mart 2027",
  periodLink: "Fəaliyyət planı",
  periodText: "Elm. Əməkdaşlıq. İnnovasiya.",
  copyright: "© 2026 Azərbaycan Elm və İnnovasiya Könüllüləri",
  note: "Elm və İnnovasiya Proqramı",
};
