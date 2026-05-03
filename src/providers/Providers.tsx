"use client";

import { StyleProvider } from "@ant-design/cssinjs";
import { App as AntApp, ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { BookDemoUrlSync } from "@/components/book-demo/BookDemoUrlSync";
import { AuthProvider } from "./AuthProvider";
import { BookDemoFlowProvider } from "./BookDemoFlowProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StyleProvider layer>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#f97316",
            borderRadiusLG: 16,
            fontFamily: "inherit",
          },
        }}
      >
        <AntApp>
          <BookDemoFlowProvider>
            <Suspense fallback={null}>
              <BookDemoUrlSync />
            </Suspense>
            <AuthProvider>{children}</AuthProvider>
          </BookDemoFlowProvider>
        </AntApp>
      </ConfigProvider>
    </StyleProvider>
  );
}
