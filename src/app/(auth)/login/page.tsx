import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthSplitShell } from "@/components/auth/AuthSplitShell";
import { PhoneAuthFlow } from "@/components/auth/PhoneAuthFlow";

export const metadata: Metadata = {
  title: "Log in",
  description: "Access your Little Champ Junior account with mobile OTP.",
};

export default function LoginPage() {
  return (
    <AuthSplitShell>
      <Suspense fallback={null}>
        <PhoneAuthFlow />
      </Suspense>
    </AuthSplitShell>
  );
}

