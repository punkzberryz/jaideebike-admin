import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "./model";
import { PrismaClientErrorCode } from "../prismadb";

export const catchErrorHelper = (functionaName: string, err: unknown) => {
  if (err instanceof UnauthorizedError) {
    console.error(`[UNAUTH_ERROR ${functionaName}] ${err.message}`);
    throw err;
  }
  if (err instanceof BadRequestError) {
    console.error(`[BADREQ_ERROR ${functionaName}] ${err.message}`);
    throw err;
  }
  if (err instanceof InternalServerError) {
    console.error(`[INTERNAL_ERROR ${functionaName}] ${err.message}`);
    throw err;
  }
  if (err instanceof Error) {
    console.error(`[ERROR ${functionaName}] ${err.message}`);
    throw err;
  }
  console.error(`[ERROR ${functionaName}] ${err}`);
  throw new Error(`[ERROR ${functionaName}] ${err}`);
};

export const catchErrorForServerActionHelper = (err: unknown) => {
  const code = (err as any)?.code as string | undefined;
  if (code === PrismaClientErrorCode.UniqueConstraintViolation) {
    return {
      message: "Data already exists in the database",
      code: 400,
    };
  }

  if (err instanceof UnauthorizedError) {
    return {
      message: err.message,
      code: 401,
    };
    // throw err;
  }
  if (err instanceof BadRequestError) {
    return {
      message: err.message,
      code: 400,
    };
  }
  if (err instanceof InternalServerError) {
    return {
      message: err.message,
      code: 500,
    };
  }
  if (err instanceof Error) {
    return {
      message: err.message,
      code: 500,
    };
  }
  if (typeof err === "string") {
    return {
      message: err,
      code: 500,
    };
  }
  return {
    message: `Unknown error ${err}`,
    code: 500,
  };
};

export const catchErrorFromServerActionOnClientHelper = (err: {
  message: string;
  code: number;
}) => {
  if (err.code === 401) {
    throw new UnauthorizedError(err.message);
  }
  if (err.code === 400) {
    throw new BadRequestError(err.message);
  }
  if (err.code === 500) {
    throw new InternalServerError(err.message);
  }
  throw new Error(err.message);
};

export const responseErrorHelper = (statusCode: number, message?: string) => {
  if (statusCode === 401) {
    throw new UnauthorizedError(message);
  }
  if (statusCode === 400) {
    throw new BadRequestError(message);
  }
  throw new InternalServerError(message);
};
