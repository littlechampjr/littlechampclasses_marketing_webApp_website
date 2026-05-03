"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthSplitShell } from "@/components/auth/AuthSplitShell";
import { OnboardingForm } from "@/components/auth/OnboardingForm";
import { useAuth } from "@/providers/AuthProvider";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading, token } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!token || !user) {
      router.replace("/login");
      return;
    }
    if (user.profileComplete) {
      router.replace("/dashboard");
    }
  }, [user, loading, token, router]);

  if (loading || !user || user.profileComplete) {
    return (
      <AuthSplitShell>
        <p className="text-center text-muted">Loading…</p>
      </AuthSplitShell>
    );
  }

  return (
    <AuthSplitShell>
      <OnboardingForm />
    </AuthSplitShell>
  );
}

