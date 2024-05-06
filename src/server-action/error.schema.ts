import { catchErrorForServerActionHelper } from "@/lib/error";

export type ServerActionError = {
  error?: ReturnType<typeof catchErrorForServerActionHelper>;
};
