"use server";

import { ColorFormSchema } from "@/app/(private)/store/colors/[colorId]/components/color.schema";
import { validateRequest } from "@/lib/auth/auth";
import {
  BadRequestError,
  catchErrorForServerActionHelper,
  UnauthorizedError,
} from "@/lib/error";
import { prismadb } from "@/lib/prismadb";
import { ServerActionError } from "../error.schema";
import { Color } from "@prisma/client";

export const createColor = async (
  data: ColorFormSchema
): Promise<{ color?: Color } & ServerActionError> => {
  try {
    const { user } = await validateRequest();
    if (user?.role !== "ADMIN") {
      throw new UnauthorizedError("Not an admin");
    }
    // Create color
    const color = await prismadb.color.create({
      data,
    });
    return { color };
  } catch (err) {
    const error = catchErrorForServerActionHelper(err);
    return {
      error,
    };
  }
};

export const editColor = async (
  data: ColorFormSchema,
  colorId: number
): Promise<{ color?: Color } & ServerActionError> => {
  try {
    const { user } = await validateRequest();
    if (user?.role !== "ADMIN") {
      throw new UnauthorizedError("Not an admin");
    }
    // Edit color
    const color = await prismadb.color.update({
      where: {
        id: colorId,
      },
      data,
    });
    return { color };
  } catch (err) {
    const error = catchErrorForServerActionHelper(err);
    return {
      error,
    };
  }
};

export const deleteColor = async (colorId: number) => {
  try {
    const { user } = await validateRequest();
    if (user?.role !== "ADMIN") {
      throw new UnauthorizedError("Not an admin");
    }

    // Check if color exists
    const color = await prismadb.color.findFirst({
      where: {
        id: colorId,
      },
    });
    if (!color) {
      throw new BadRequestError("color not found");
    }
    // Delete color
    await prismadb.color.delete({
      where: {
        id: colorId,
      },
    });
  } catch (err) {
    const error = catchErrorForServerActionHelper(err);
    return {
      error,
    };
  }
};
