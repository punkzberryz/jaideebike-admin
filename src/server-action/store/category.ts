"use server";

import { CategoryFormSchema } from "@/app/(private)/store/categories/[categoryId]/components/category.schema";
import { Category } from "@prisma/client";
import { ServerActionError } from "../error.schema";
import {
  BadRequestError,
  catchErrorForServerActionHelper,
  UnauthorizedError,
} from "@/lib/error";
import { prismadb } from "@/lib/prismadb";
import { validateRequest } from "@/lib/auth/auth";

export const createCategory = async (
  data: CategoryFormSchema
): Promise<{ category?: Category } & ServerActionError> => {
  try {
    const { user } = await validateRequest();
    if (user?.role !== "ADMIN") {
      throw new UnauthorizedError("Not an admin");
    }
    // Create category
    const category = await prismadb.category.create({
      data,
    });
    return { category };
  } catch (err) {
    const error = catchErrorForServerActionHelper(err);
    return {
      error,
    };
  }
};

export const editCategory = async (
  data: CategoryFormSchema,
  categoryId: number
): Promise<{ category?: Category } & ServerActionError> => {
  try {
    const { user } = await validateRequest();
    if (user?.role !== "ADMIN") {
      throw new UnauthorizedError("Not an admin");
    }
    // Edit Category
    const category = await prismadb.category.update({
      where: {
        id: categoryId,
      },
      data,
    });
    return { category };
  } catch (err) {
    const error = catchErrorForServerActionHelper(err);
    return {
      error,
    };
  }
};

export const deleteCategory = async (
  categoryId: number
): Promise<{} & ServerActionError> => {
  try {
    const { user } = await validateRequest();
    if (user?.role !== "ADMIN") {
      throw new UnauthorizedError("Not an admin");
    }

    // Check if category exists
    const category = await prismadb.category.findFirst({
      where: {
        id: categoryId,
      },
    });
    if (!category) {
      throw new BadRequestError("category not found");
    }
    // Delete category
    await prismadb.category.delete({
      where: {
        id: categoryId,
      },
    });
    return {};
  } catch (err) {
    const error = catchErrorForServerActionHelper(err);
    return {
      error,
    };
  }
};
