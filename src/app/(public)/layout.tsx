import { PublicNavbar } from "@/components/navbar/navbar";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PublicNavbar />
      {children}
    </>
  );
};
export default PublicLayout;
