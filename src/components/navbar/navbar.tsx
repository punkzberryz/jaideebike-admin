import Image from "next/image";
import ThemeToggleButton from "../providers/theme-toggle-button";
import Link from "next/link";
import AuthNav from "./auth-nav";
import { buttonVariants } from "../ui/button";

const PublicNavbar = () => {
  return (
    <Navbar>
      <Link
        href="/auth/signin"
        className={buttonVariants({
          variant: "ghost",
        })}
      >
        Sign In
      </Link>
    </Navbar>
  );
};

const PrivateNavbar = () => {
  return (
    <Navbar>
      <AuthNav />
    </Navbar>
  );
};

const Navbar = async ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {/* Logo */}
        <div className="bg-white rounded-full">
          <Link href="/">
            <StoreLogo />
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggleButton />
          {children}
        </div>
      </div>
    </div>
  );
};

const StoreLogo = () => {
  return <Image src="/img/icon.webp" alt="logo" width={40} height={40} />;
};

export { PublicNavbar, PrivateNavbar };
