"use client";

import { Table } from "antd";
import type { ResultSectionRow } from "@/lib/api/testsTypes";
import { useMemo } from "react";

type Props = { rows: ResultSectionRow[] };

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

export function ResultSectionTable({ rows }: Props) {
  const cols = useMemo(
    () => [
      { title: "Section", dataIndex: "title", key: "title" },
      {
        title: "Score",
        key: "score",
        render: (_: unknown, r: ResultSectionRow) => `${r.score} / ${r.maxScore}`,
      },
      { title: "Correct", dataIndex: "correct", key: "c" },
      { title: "Incorrect", dataIndex: "incorrect", key: "i" },
      { title: "Skipped", dataIndex: "skipped", key: "s" },
      {
        title: "Accuracy",
        key: "acc",
        render: (_: unknown, r: ResultSectionRow) => `${r.accuracyPct.toFixed(1)}%`,
      },
      {
        title: "Time",
        key: "t",
        render: (_: unknown, r: ResultSectionRow) => formatDuration(r.timeTakenSec),
      },
    ],
    [],
  );

  if (rows.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-bold text-foreground">Section-wise performance</h3>
      <div className="mt-3 overflow-x-auto">
        <Table
          size="small"
          pagination={false}
          rowKey="sectionId"
          columns={cols}
          dataSource={rows}
        />
      </div>
    </div>
  );
}
