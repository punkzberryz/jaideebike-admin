import MaxWidthWrapper from "@/components/max-width-wrapper";
import Client from "./components/client";
import { metadataHelper } from "@/lib/utils";

const MePage = () => {
  return (
    <MaxWidthWrapper>
      <h1>Me</h1>
      <p>Me page</p>
      <Client />
    </MaxWidthWrapper>
  );
};

export default MePage;

export const metadata = metadataHelper({
  title: "My Profile",
  description: "My profile page",
  keywords: ["profile", "me"],
});
