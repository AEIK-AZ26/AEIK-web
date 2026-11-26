import type { Metadata } from "next";
import { Lock, Mail } from "lucide-react";
import { PageHero, PageShell, Section } from "@/components/PageShell";
import { CONTACT } from "@/data/brief";

export const metadata: Metadata = {
  title: "Məxfilik siyasəti",
  description: "AEİK-in fərdi məlumatların işlənməsi və məxfilik siyasəti.",
  alternates: { canonical: "/mexfilik" },
};

const SECTIONS = [
  {
    title: "Hansı məlumatları toplayırıq",
    items: [
      "Müraciət, tədbir qeydiyyatı və təzis formalarında göstərdiyiniz ad, e-poçt, telefon, təhsil və təşkilat məlumatları.",
      "Tərəfdaşlıq sorğularında təqdim edilən əlaqə şəxsinin və təşkilatın məlumatları.",
      "Sertifikat yoxlaması üçün yalnız sertifikat kodu; bu zaman şəxsi məlumat soruşulmur.",
    ],
  },
  {
    title: "Məlumatlardan nə üçün istifadə edirik",
    items: [
      "Müraciətinizi qiymətləndirmək və sizinlə əlaqə saxlamaq.",
      "Tədbir qeydiyyatını idarə etmək, iştirak təsdiqi və proqram dəyişiklikləri barədə məlumat vermək.",
      "Jurnal müraciətlərində rəy prosesini aparmaq.",
      "Fəaliyyətin ümumiləşdirilmiş statistikasını hazırlamaq (şəxsi məlumat göstərilmədən).",
    ],
  },
  {
    title: "Razılıq və foto/video",
    items: [
      "Formlarda razılıq checkbox-u olmadan müraciət qəbul edilmir.",
      "Tədbirlərdə çəkilən foto və videolar üçün iştirakçıların əvvəlcədən razılığı alınır.",
      "Komanda profilləri yalnız “Foto və məlumatlarımın aeik.az-da dərc edilməsinə razıyam” təsdiqindən sonra dərc olunur.",
      "İştirakçı məlumatları tərəfdaşlara yalnız iştirakçının açıq razılığı ilə ötürülür.",
    ],
  },
  {
    title: "Saxlama və təhlükəsizlik",
    items: [
      "Məlumatlar AEİK-in idarə etdiyi verilənlər bazasında saxlanılır; giriş yalnız səlahiyyətli komanda üzvlərindədir.",
      "Admin panelləri public interfeysdə göstərilmir və giriş məhdudlaşdırılıb.",
      "Müraciət məlumatları məqsəd üçün lazım olan müddətdən artıq saxlanılmır.",
    ],
  },
  {
    title: "Sizin hüquqlarınız",
    items: [
      "Məlumatlarınıza çıxış, düzəliş və silinmə tələb etmək.",
      "Razılığı geri götürmək və bundan sonrakı emalı dayandırmaq.",
      "Sertifikat və ya tədbir iştirakı ilə bağlı məlumat üçün bizə müraciət etmək.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Məxfilik"
        title="Məlumatlarınız sizin nəzarətinizdədir."
        text="AEİK fərdi məlumatları yalnız müraciətinizin icrası üçün toplayır və razılığınız olmadan üçüncü tərəflərlə paylaşmır."
      />

      <Section>
        <div className="mx-auto max-w-[820px]">
          <div className="space-y-7">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-ink">{section.title}</h2>
                <ul className="mt-3 space-y-2.5">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-[1.8] text-[#4E4768]">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-9 flex items-start gap-3 rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600">
              <Lock size={17} />
            </span>
            <div>
              <p className="text-[13px] font-bold text-ink">Məxfiliklə bağlı sual</p>
              <p className="mt-1 text-[12px] leading-relaxed text-[#5A5270]">
                Məlumatlarınızın işlənməsi ilə bağlı istənilən sual üçün{" "}
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-1 font-bold text-brand-600 hover:text-brand-700">
                  <Mail size={12} /> {CONTACT.email}
                </a>{" "}
                ünvanına yazın. Müraciətiniz 5 iş günü ərzində cavablandırılır.
              </p>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-[#8A83A0]">Son yenilənmə: noyabr 2026</p>
        </div>
      </Section>
    </PageShell>
  );
}
