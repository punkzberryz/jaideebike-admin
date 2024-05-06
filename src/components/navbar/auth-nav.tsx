"use client";
import { useAuthStore } from "@/hooks/auth/store/use-auth-store";
import { UserWithoutPassword } from "@/hooks/auth/store/user-slice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { signOut } from "@/server-action/auth/auth";
import toast from "react-hot-toast";

const AuthNav = () => {
  const { fetchUser, user } = useAuthStore();
  useEffect(() => {
    console.log("fetching user useEffect");
    fetchUser();
  }, [fetchUser]);
  return <div>{user ? <AuthNavDropdown user={user} /> : null}</div>;
};
const AuthNavDropdown = ({ user }: { user: UserWithoutPassword }) => {
  const router = useRouter();
  const { clearUser } = useAuthStore();
  const handleSignOut = () => {
    signOut()
      .then(() => {
        clearUser();
        router.push("/auth/signin");
        router.refresh();
        toast.success("Sign out successfully");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to sign out");
      });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{user.displayName}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/me">Me</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default AuthNav;
