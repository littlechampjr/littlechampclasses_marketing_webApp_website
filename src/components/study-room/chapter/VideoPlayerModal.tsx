"use client";

import { CloseOutlined, PlaySquareOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  title: string;
  videoUrl: string;
  onClose: () => void;
};

function VideoPlayerBody({ videoUrl }: { videoUrl: string }) {
  const [videoError, setVideoError] = useState(false);

  if (videoError) {
    return (
      <div className="rounded-xl bg-rose-50 p-6 text-center dark:bg-rose-950/40">
        <p className="font-medium text-foreground">This video could not be played in the browser.</p>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex text-sm font-bold text-primary underline-offset-2 hover:underline"
        >
          Open video in new tab
        </a>
      </div>
    );
  }

  return (
    <div className={cn("aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-black/20")}>
      <video
        controls
        playsInline
        preload="none"
        className="h-full w-full"
        src={videoUrl}
        onError={() => setVideoError(true)}
      />
    </div>
  );
}

export function VideoPlayerModal({ open, title, videoUrl, onClose }: Props) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={null}
      closable={false}
      width={920}
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
      {open && videoUrl ? (
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
              <PlaySquareOutlined className="text-2xl" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-primary/90">Lecture</p>
              <h2 className="font-display text-lg font-extrabold leading-tight tracking-tight text-foreground line-clamp-2 sm:text-xl">
                {title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close video"
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-border-soft",
                "bg-card text-foreground shadow-sm transition",
                "hover:border-primary/35 hover:bg-surface-subtle hover:text-primary",
              )}
            >
              <CloseOutlined className="text-base" />
            </button>
          </header>
          <div className="bg-zinc-950 p-3 sm:p-4">
            <VideoPlayerBody key={videoUrl} videoUrl={videoUrl} />
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
