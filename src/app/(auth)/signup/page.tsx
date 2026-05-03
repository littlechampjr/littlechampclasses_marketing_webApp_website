import { redirect } from "next/navigation";

/** Registration uses the same mobile OTP flow as login. */
export default function SignupPage() {
  redirect("/login");
}

