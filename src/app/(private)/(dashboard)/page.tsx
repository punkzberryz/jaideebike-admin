import MaxWidthWrapper from "@/components/max-width-wrapper";
import SignInToast from "./components/signin-toast";
import { metadataHelper } from "@/lib/metadata";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <MaxWidthWrapper>
      <h1>Admin dashboard</h1>
      <Suspense>
        <SignInToast />
      </Suspense>
    </MaxWidthWrapper>
  );
}

export const metadata = metadataHelper({
  title: "Dashboard",
  description: "Admin dashboard",
  keywords: ["admin", "dashboard"],
});
