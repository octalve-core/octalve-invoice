import { redirect } from "next/navigation";
/** Public entry route, using the existing Finzefy onboarding design. */
export default function HomePage() {
  redirect("/onboarding");
}
