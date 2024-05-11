"use server";

import { ProductFormSchema } from "@/app/(private)/store/products/[productId]/components/product.schema";
import { validateRequest } from "@/lib/auth/auth";
import { BadRequestError, UnauthorizedError } from "@/lib/error/model";
import { prismadb } from "@/lib/prismadb";
import { Product } from "@prisma/client";
import { ServerActionError } from "../error.schema";
import { catchErrorForServerActionHelper } from "@/lib/error/catch-error-action-helper";

export const createProduct = async (
  data: ProductFormSchema
): Promise<{ product?: Product } & ServerActionError> => {
  try {
    const { user } = await validateRequest();
    if (user?.role !== "ADMIN") {
      throw new UnauthorizedError("Not an admin");
    }
    // Create product
    const product = await prismadb.product.create({
      data: {
        ...data,
        images: {
          createMany: {
            data: [...data.images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return { product };
  } catch (err) {
    const error = catchErrorForServerActionHelper(err);
    return {
      error,
    };
  }
};

export const editProduct = async (
  data: ProductFormSchema,
  productId: string
): Promise<{ product?: Product } & ServerActionError> => {
  try {
    const { user } = await validateRequest();
    if (user?.role !== "ADMIN") {
      throw new UnauthorizedError("Not an admin");
    }
    // edit product
    //we first update product with empty images
    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        ...data,
        images: {
          deleteMany: {},
        },
      },
    });
    //then we add the new images
    //TODO: consider doing transaction
    const product = await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: [...data.images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return { product };
  } catch (err) {
    const error = catchErrorForServerActionHelper(err);
    return {
      error,
    };
  }
};

export const deleteProduct = async (
  productId: string
): Promise<{} & ServerActionError> => {
  try {
    const { user } = await validateRequest();
    if (user?.role !== "ADMIN") {
      throw new UnauthorizedError("Not an admin");
    }
    // delete product
    const product = await prismadb.product.findFirst({
      where: {
        id: productId,
      },
    });
    if (!product) {
      throw new BadRequestError("product not found");
    }
    await prismadb.product.delete({
      where: {
        id: productId,
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
