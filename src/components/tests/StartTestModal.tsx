"use client";

import { Modal } from "antd";
import { BulbOutlined } from "@ant-design/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  testTitle?: string;
  loading?: boolean;
};

export function StartTestModal({ open, onCancel, onConfirm, testTitle, loading }: Props) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={480}
      title={null}
      wrapClassName="[&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:p-0 [&_.ant-modal-content]:overflow-hidden"
      closable
    >
      <div className="p-6 sm:p-8">
        <div
          className={cn(
            "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl",
            "bg-surface-subtle text-primary text-2xl",
          )}
        >
          <BulbOutlined />
        </div>
        {testTitle ? (
          <h2 className="text-center font-display text-lg font-bold text-foreground sm:text-xl">
            {testTitle}
          </h2>
        ) : null}
        <p className="mt-4 text-center text-sm leading-relaxed text-muted sm:text-base">
          Rank will not be provided since it&apos;s a practice test. However, detailed test analysis
          will be provided in the result.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" className="order-2 sm:order-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            className="order-1 sm:order-2"
            onClick={onConfirm}
            disabled={loading}
          >
            Ok, Start Test
          </Button>
        </div>
      </div>
    </Modal>
  );
}
