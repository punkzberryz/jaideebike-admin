import { catchErrorForServerActionHelper } from "@/lib/error/catch-error-action-helper";

export type ServerActionError = {
  error?: ReturnType<typeof catchErrorForServerActionHelper>;
};
