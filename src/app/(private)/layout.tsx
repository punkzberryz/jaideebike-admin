import { PrivateNavbar } from "@/components/navbar/navbar";

const PrivateLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PrivateNavbar />
      {children}
    </>
  );
};
export default PrivateLayout;
