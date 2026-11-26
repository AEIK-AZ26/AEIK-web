import React from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";
import type { EventItem } from "@/data/brief";

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <Link
      href={`/tedbirler/${event.slug}`}
      className="group flex h-full flex-col rounded-[22px] border border-[#EAE7F7] bg-white p-5 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_28px_50px_-34px_rgba(32,26,63,0.5)]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-brand-600">{event.kind}</span>
        <span
          className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] ${
            event.registration
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {event.registration ? "Qeydiyyat açıqdır" : "Tezliklə"}
        </span>
      </div>

      <h3 className="mt-3 text-[17px] font-extrabold leading-[1.22] tracking-[-0.02em] text-ink">{event.title}</h3>
      <p className="mt-2.5 line-clamp-3 text-[12px] leading-[1.7] text-[#5A5270]">{event.text}</p>

      <ul className="mt-4 space-y-1.5 text-[11px] text-[#6E6788]">
        <li className="inline-flex items-center gap-1.5">
          <CalendarDays size={12} className="text-brand-600" /> {event.dateNote}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <MapPin size={12} className="text-brand-600" /> {event.place}
        </li>
        <li className="inline-flex items-start gap-1.5">
          <Users size={12} className="mt-0.5 shrink-0 text-brand-600" /> <span>{event.audience}</span>
        </li>
      </ul>

      <div className="mt-auto flex items-center justify-between border-t border-[#F3F1FA] pt-4">
        <span className="text-[11.5px] font-bold text-brand-600 group-hover:text-brand-700">Tədbir səhifəsi</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1EEFE] text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
          <ArrowUpRight size={14} strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}
