import MaxWidthWrapper from "@/components/max-width-wrapper";
import { metadataHelper } from "@/lib/utils";
import SignInToast from "./components/signin-toast";

export default function DashboardPage() {
  return (
    <MaxWidthWrapper>
      <h1>Admin dashboard</h1>

      <SignInToast />
    </MaxWidthWrapper>
  );
}

export const metadata = metadataHelper({
  title: "Dashboard",
  description: "Admin dashboard",
  keywords: ["admin", "dashboard"],
});
