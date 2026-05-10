"use client";

import type { PillTabItem } from "@/components/ui/PillTabBar";
import { PillTabBar } from "@/components/ui/PillTabBar";

export type ChapterTabKey = "lectures" | "classNotes" | "chapterPdf" | "dhaSol";

export const CHAPTER_TAB_ITEMS: PillTabItem<ChapterTabKey>[] = [
  { key: "lectures", label: "Lectures" },
  { key: "classNotes", label: "Class Notes", shortLabel: "Notes" },
  { key: "chapterPdf", label: "Chapter PDF", shortLabel: "PDF" },
  { key: "dhaSol", label: "DHA's Sol", shortLabel: "DHA" },
];

type Props = {
  activeKey: ChapterTabKey;
  onChange: (key: ChapterTabKey) => void;
  className?: string;
};

export function ChapterTabs({ activeKey, onChange, className }: Props) {
  return (
    <PillTabBar<ChapterTabKey>
      variant="underline"
      ariaLabel="Chapter materials"
      className={className}
      items={CHAPTER_TAB_ITEMS}
      activeKey={activeKey}
      onChange={onChange}
    />
  );
}
