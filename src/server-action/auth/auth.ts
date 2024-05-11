"use server";

import { clearSession, validateRequest } from "@/lib/auth/auth";
import { catchErrorForServerActionHelper } from "@/lib/error/catch-error-action-helper";
import { ServerActionError } from "../error.schema";

export const signOut = async (): Promise<{} & ServerActionError> => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      return {
        error: { message: "Session not found", code: 401 },
      };
    }
    await clearSession(session.id);
    return {};
  } catch (err) {
    const error = catchErrorForServerActionHelper(err);
    return {
      error,
    };
  }
};
