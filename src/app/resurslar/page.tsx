import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText, Mail, Video } from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import { CONTACT, RESOURCES } from "@/data/brief";

export const metadata: Metadata = {
  title: "Bələdçilər və resurslar",
  description:
    "Elmi yazı bələdçisi, APA 7 sənədləşmə qaydaları, ədəbiyyat axtarışı və Elm Kafe video yazıları.",
  alternates: { canonical: "/resurslar" },
};

const icons = { Bələdçi: BookOpen, Şablon: FileText, Video: Video };

export default function ResourcesPage() {
  return (
    <PageShell>
      <PageHero
        back="Elmi imkanlar"
        backHref="/elmi-imkanlar"
        eyebrow="Bələdçilər və resurslar"
        title="Öyrənmək üçün başlanğıc nöqtəsi."
        text="Elmi yazı, mənbə göstərmə və ədəbiyyat axtarışı üzrə qısa bələdçilər. Materiallar mərhələli şəkildə yayımlanır."
      />

      <Section id="beledciler" eyebrow="Bələdçilər və şablonlar" title="Hansı materiallar var?">
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {RESOURCES.map((resource) => {
            const Icon = icons[resource.type as keyof typeof icons] || BookOpen;
            return (
              <article key={resource.title} className="flex h-full flex-col rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                    <Icon size={18} />
                  </span>
                  <span className="rounded-full border border-[#E4E0F2] bg-white px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.1em] text-brand-700">
                    {resource.type}
                  </span>
                </div>
                <h2 className="mt-4 text-[15.5px] font-extrabold leading-snug text-ink">{resource.title}</h2>
                <p className="mt-2 text-[12px] leading-[1.75] text-[#5E5776]">{resource.text}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#8A83A0]">
                  Yayım hazırlanır
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-[22px] border border-[#EAE7F7] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13.5px] font-bold text-ink">Materialı erkən əldə etmək istəyirsiniz?</p>
            <p className="mt-1 max-w-[560px] text-[12px] leading-relaxed text-[#5A5270]">
              Bələdçi faylları hazır olduqda e-poçtla göndərilir. Jurnal şablonu və müəllif bələdçisi artıq əlçatandır.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href={`mailto:${CONTACT.email}?subject=Resurs%20fayl%C4%B1%20sor%C4%9Fusu`}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[11.5px] font-bold text-white transition-colors hover:bg-[#2E2552]"
            >
              <Mail size={13} /> Fayl istə
            </a>
            <Link
              href="/jurnal"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#E4E0F2] px-4 text-[11.5px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
            >
              Jurnal şablonu <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </Section>

      <Section id="bloq" eyebrow="Bloq" title="Bloq və Elm Kafe yazıları." tone="tint">
        <p className="mt-3 max-w-[760px] text-[13px] leading-[1.8] text-[#5A5270]">
          Elm Kafe açıq müzakirələrinin qeydləri, tələbə təcrübələri və qısa elmi yazılar bu bölmədə toplanır. Yazılar
          hazırlandıqca dərc olunur; mövzu təklif edə və ya öz yazınızı göndərə bilərsiniz.
        </p>
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: "Elm Kafe qeydləri", text: "Keçmiş açıq müzakirələrin əsas fikirləri və video yazıları.", status: "Yayım hazırlanır" },
            { title: "Tələbə təcrübəsi", text: "Məqalə saatları, konfrans iştirakı və laboratoriya praktikası haqqında qeydlər.", status: "Yayım hazırlanır" },
            { title: "Öz yazını göndər", text: "Qısa elmi-maarifləndirici yazı və ya bələdçi təklifi ilə bizə müraciət edin.", status: "Açıqdır" },
          ].map((post) => (
            <article key={post.title} className="flex h-full flex-col rounded-[20px] border border-[#EAE7F7] bg-white p-5">
              <p className="text-[13px] font-extrabold leading-snug text-ink">{post.title}</p>
              <p className="mt-2 text-[12px] leading-[1.7] text-[#5E5776]">{post.text}</p>
              <p className="mt-auto pt-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8A83A0]">{post.status}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-3 rounded-[22px] border border-[#EAE7F7] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[620px] text-[12px] leading-relaxed text-[#5A5270]">
            Yazı və ya bələdçi təklifini {""}
            <a href={`mailto:${CONTACT.email}?subject=Bloq%20yaz%C4%B1s%C4%B1%20t%C9%99klifi`} className="font-bold text-brand-600 hover:text-brand-700">
              {CONTACT.email}
            </a>{" "}
            ünvanına göndərə bilərsiniz.
          </p>
          <a
            href={`mailto:${CONTACT.email}?subject=Bloq%20yaz%C4%B1s%C4%B1%20t%C9%99klifi`}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-[11.5px] font-bold text-white transition-colors hover:bg-[#2E2552]"
          >
            <Mail size={13} /> Yazı təklif et
          </a>
        </div>
      </Section>

      <PageCTA
        title="Mövzu təklifiniz var?"
        text="Bələdçi və ya bloq yazısı üçün mövzu təklif edə, özünüz material hazırlaya bilərsiniz."
        href="/elaqe"
        label="Təklif göndər"
      />
    </PageShell>
  );
}
