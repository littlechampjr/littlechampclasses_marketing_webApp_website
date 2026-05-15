"use client";

import { Modal } from "antd";
import Image from "next/image";
import { useState } from "react";
import { formatIndianMobileDisplay } from "@/lib/phoneDisplay";
import { site } from "@/lib/site-config";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V21c0 .55-.45 1-1 1C10.07 22 2 13.93 2 3c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

export function CounsellorCallWidget() {
  const [open, setOpen] = useState(false);
  const telHref = `tel:+91${site.counsellorPhoneNational10}`;
  const displayPhone = formatIndianMobileDisplay(site.counsellorPhoneNational10);

  return (
    <>
      <button
        type="button"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/35 ring-2 ring-background transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label="Talk to a counsellor"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <PhoneIcon className="h-7 w-7 -rotate-12" />
      </button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        centered
        destroyOnHidden
        width={420}
        title={null}
        aria-labelledby="counsellor-call-modal-title"
        classNames={{ body: "!p-0" }}
        rootClassName="[&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:p-0"
      >
        <div className="relative overflow-hidden bg-card text-foreground">
          <div
            className="pointer-events-none absolute -right-4 -top-4 h-32 w-40 rounded-bl-[2rem] bg-primary sm:h-36 sm:w-44"
            aria-hidden
          />
          <div className="relative space-y-5 p-6 sm:p-7">
            <div className="flex gap-4">
              <div className="min-w-0 flex-1 space-y-2 pr-2 pt-1">
                <h2
                  id="counsellor-call-modal-title"
                  className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl"
                >
                  {site.counsellorModalTitle}
                </h2>
                <p className="text-sm leading-relaxed text-muted sm:text-base">
                  {site.counsellorModalSubtitle}
                </p>
              </div>
              <div className="relative h-[104px] w-[104px] shrink-0 sm:h-[118px] sm:w-[118px]">
                <Image
                  src={site.counsellorSupportImageSrc}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-contain object-bottom"
                />
              </div>
            </div>

            <a
              href={telHref}
              className="flex min-h-[52px] items-center justify-center gap-3 rounded-xl border-2 border-primary bg-card px-4 py-3 font-bold text-primary shadow-sm transition hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <PhoneIcon className="h-6 w-6 shrink-0 -rotate-12" />
              <span className="tabular-nums">{displayPhone}</span>
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
}
