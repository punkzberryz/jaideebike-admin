"use client";

import { useAuthStore } from "@/hooks/auth/store/use-auth-store";

const Client = () => {
  const { user } = useAuthStore();
  return <div>{user ? <p>{user.displayName}</p> : null}</div>;
};

export default Client;
