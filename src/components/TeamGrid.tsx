import React from "react";
import { Mail } from "lucide-react";
import { CONTACT } from "@/data/brief";
import { TeamMember } from "@/lib/team";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function TeamGrid({ members }: { members: TeamMember[] }) {
  if (!members.length) {
    return (
      <p className="rounded-[22px] border border-dashed border-[#DCD7EF] bg-white/60 px-5 py-10 text-center text-[12.5px] font-semibold text-[#6E6788]">
        Komanda məlumatı tezliklə əlavə olunacaq.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((leader) => (
        <article
          key={leader.id}
          className="group flex flex-col overflow-hidden rounded-[22px] border border-[#EAE7F7] bg-white transition-shadow hover:premium-shadow-soft"
        >
          <div className="relative aspect-square w-full overflow-hidden bg-[#F4F2FC]">
            {leader.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={leader.image}
                alt={leader.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[34px] font-extrabold tracking-[-0.02em] text-brand-600/60">
                {initials(leader.name)}
              </span>
            )}
            {leader.role && (
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.1em] text-brand-700 backdrop-blur">
                {leader.role}
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col p-4">
            <p className="text-[13.5px] font-extrabold tracking-[-0.01em] text-ink">{leader.name}</p>
            {leader.project && (
              <p className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-brand-600">
                {leader.project}
              </p>
            )}
            {leader.text && (
              <p className="mt-2 flex-1 text-[11.5px] leading-[1.75] text-[#5E5776]">{leader.text}</p>
            )}
            <a
              href={`mailto:${leader.email || CONTACT.email}?subject=${encodeURIComponent(
                `${leader.name}${leader.project ? ` — ${leader.project}` : ""}`
              )}`}
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-600 hover:text-brand-700"
            >
              <Mail size={12} /> Əlaqə saxla
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
