"use client";

import { CloseOutlined, FileTextOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const LOAD_MS = 15_000;

type Props = {
  open: boolean;
  title: string;
  pdfUrl: string;
  onClose: () => void;
};

function PdfInlineBody({ pdfUrl, title }: { pdfUrl: string; title: string }) {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), LOAD_MS);
    return () => clearTimeout(t);
  }, [pdfUrl]);

  if (timedOut) {
    return (
      <div className="rounded-xl border border-border-soft bg-surface-subtle/50 p-8 text-center">
        <p className="text-foreground">
          Having trouble displaying this PDF inline. Open it in a new tab for the best experience.
        </p>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 font-bold text-primary-foreground"
        >
          Open in new tab
        </a>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-[min(72vh,820px)] w-full overflow-hidden rounded-xl",
        "bg-zinc-900/95 shadow-inner ring-1 ring-black/10 dark:ring-white/10",
      )}
    >
      <iframe title={title} src={pdfUrl} className="h-full w-full bg-zinc-950" />
    </div>
  );
}

export function PdfViewerModal({ open, pdfUrl, title, onClose }: Props) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={null}
      closable={false}
      width={980}
      centered
      destroyOnHidden
      rootClassName={cn(
        "[&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:rounded-[1.35rem]",
        "[&_.ant-modal-content]:border [&_.ant-modal-content]:border-orange-200/60",
        "[&_.ant-modal-content]:bg-card [&_.ant-modal-content]:p-0 [&_.ant-modal-content]:shadow-[0_24px_80px_-24px_rgba(0,0,0,0.35)]",
        "dark:[&_.ant-modal-content]:border-orange-900/40",
      )}
      classNames={{ body: "!p-0" }}
    >
      {open && pdfUrl ? (
        <div className="flex flex-col">
          <header
            className={cn(
              "flex items-center gap-4 border-b border-orange-100/80 px-5 py-4 sm:px-6 sm:py-5",
              "bg-gradient-to-br from-orange-50 via-amber-50/50 to-card",
              "dark:border-orange-900/30 dark:from-orange-950/40 dark:via-card dark:to-card",
            )}
          >
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                "bg-primary/12 text-primary ring-2 ring-primary/20",
              )}
            >
              <FileTextOutlined className="text-2xl" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-primary/90">
                Class material
              </p>
              <h2 className="font-display text-lg font-extrabold leading-tight tracking-tight text-foreground line-clamp-2 sm:text-xl">
                {title}
              </h2>
              <p className="mt-1 text-xs text-muted">View or download from the toolbar inside the preview</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close PDF viewer"
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-border-soft",
                "bg-card text-foreground shadow-sm transition",
                "hover:border-primary/35 hover:bg-surface-subtle hover:text-primary",
              )}
            >
              <CloseOutlined className="text-base" />
            </button>
          </header>

          <div className="bg-muted/40 p-3 sm:p-4 dark:bg-zinc-950/50">
            <PdfInlineBody key={pdfUrl} pdfUrl={pdfUrl} title={title} />
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
