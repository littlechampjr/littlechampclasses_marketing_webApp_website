"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";

type VideoEngagementBarProps = {
  channelName?: string;
  className?: string;
};

export function VideoEngagementBar({
  channelName = "Little Champ Junior",
  className,
}: VideoEngagementBarProps) {
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const onLike = useCallback(() => {
    setLiked((v) => !v);
  }, []);

  const onSubscribe = useCallback(() => {
    setSubscribed(true);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-white/10 bg-zinc-950 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onLike}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold transition",
            liked
              ? "bg-white/10 text-amber-300"
              : "bg-white/5 text-zinc-200 hover:bg-white/10",
          )}
        >
          <span aria-hidden>{liked ? "👍" : "👍🏻"}</span>
          {liked ? "Liked" : "Like"}
        </button>
        <button
          type="button"
          onClick={onSubscribe}
          disabled={subscribed}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-bold transition",
            subscribed
              ? "cursor-default bg-zinc-700 text-zinc-300"
              : "bg-red-600 text-white hover:bg-red-500",
          )}
        >
          {subscribed ? "Subscribed ✓" : "Subscribe"}
        </button>
      </div>
      <p className="text-sm leading-snug text-zinc-400">
        <span className="font-semibold text-zinc-200">Subscribe for more videos</span>
        {" · "}
        New lessons from <span className="text-white">{channelName}</span> drop every week (demo UI).
      </p>
    </div>
  );
}
