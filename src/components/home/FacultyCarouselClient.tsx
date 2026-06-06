"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import type { PublicTeacher } from "@/lib/api/teachers";
import { FacultyModal } from "./FacultyModal";

type Props = {
  teachers: PublicTeacher[];
};

export function FacultyCarouselClient({ teachers }: Props) {
  const [open, setOpen] = useState<PublicTeacher | null>(null);
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (teachers.length === 0) return null;

  return (
    <>
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
          onSwiper={(s) => {
            swiperRef.current = s;
            setIsBeginning(s.isBeginning);
            setIsEnd(s.isEnd);
          }}
          onSlideChange={(s) => {
            setIsBeginning(s.isBeginning);
            setIsEnd(s.isEnd);
          }}
          className="!pb-2"
        >
          {teachers.map((t) => (
            <SwiperSlide key={t.id}>
              <FacultyCard teacher={t} onOpen={() => setOpen(t)} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
            className="grid h-11 w-11 place-items-center rounded-xl border border-foreground/10 bg-background text-foreground shadow-sm transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Arrow direction="left" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
            className="grid h-11 w-11 place-items-center rounded-xl border border-foreground/10 bg-background text-foreground shadow-sm transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Arrow direction="right" />
          </button>
        </div>
      </div>

      <FacultyModal teacher={open} onClose={() => setOpen(null)} />
    </>
  );
}

function FacultyCard({
  teacher,
  onOpen,
}: {
  teacher: PublicTeacher;
  onOpen: () => void;
}) {
  const canKnowMore = Boolean(teacher.modalTagline || teacher.highlights.length > 0);
  return (
    <div
      className="group flex h-[440px] flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-orange-50 to-orange-200 shadow-sm transition hover:shadow-md sm:h-[416px]"
    >
      {/* Fixed-height text block so all cards align regardless of bio length. */}
      <div className="flex h-[170px] shrink-0 flex-col px-5 pt-5 sm:px-6 sm:pt-6">
        <h3
          className="line-clamp-1 font-display text-xl font-bold tracking-tight text-foreground"
          title={teacher.name}
        >
          {teacher.name}
        </h3>
        {teacher.bioLine ? (
          <p
            className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground/80"
            title={teacher.bioLine}
          >
            {teacher.bioLine}
          </p>
        ) : null}
        <div className="mt-auto pt-2">
          {canKnowMore ? (
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex items-center gap-1 text-sm font-medium text-foreground/80 underline-offset-4 hover:underline"
            >
              Know More
              <span aria-hidden>↗</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Fixed-height image area — always reserved so cards stay uniform. */}
      <div className="flex flex-1 items-end justify-center overflow-hidden">
        {teacher.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={teacher.imageUrl}
            alt={teacher.name}
            className="object-contain h-[240px] transition group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) :
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={"/avatartest.png"}
            alt={"teacher placeholder"}
            className="object-contain h-[240px] transition group-hover:scale-[1.02]"
            loading="lazy"
          />}
      </div>
    </div>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  const d =
    direction === "left"
      ? "M15 18l-6-6 6-6"
      : "M9 6l6 6-6 6";
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
