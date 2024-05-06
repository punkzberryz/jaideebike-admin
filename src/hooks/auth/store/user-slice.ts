import { User } from "@prisma/client";
import { StateCreator } from "zustand";

// userSlice stores the user data
export type UserWithoutPassword = Omit<User, "hashedPassword">;
export type UserSlice = {
  user: UserWithoutPassword | null;
  addUser: (user: UserWithoutPassword | null) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
};

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set
) => ({
  user: null,
  addUser: (user) =>
    set((state) => {
      return { user };
    }),
  clearUser: () =>
    set((state) => {
      return { user: null };
    }),
  fetchUser: async () => {
    const response = await fetch("/api/auth/me", {
      cache: "no-store",
    });
    if (!response.ok) {
      return;
    }
    const { user } = await response.json();
    console.log("user from fetchUser on client success");
    set((state) => ({ user }));
  },
});
