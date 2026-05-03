import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a Little Champ Junior account with mobile OTP.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}

