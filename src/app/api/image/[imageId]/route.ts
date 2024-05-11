import { validateRequest } from "@/lib/auth/auth";
import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse, catchRouteErrorHelper } from "../../helper";
import { prismadb } from "@/lib/prismadb";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    const { session } = await validateRequest();
    if (!session) {
      return apiErrorResponse({
        message: "Unauthorized",
        statusCode: 401,
      });
    }

    // Delete image from database
    await prismadb.image.delete({
      where: {
        id: params.imageId,
      },
    });
    return NextResponse.json({ message: "Image deleted" });
  } catch (err) {
    return catchRouteErrorHelper(err, "/api/image/[imageId] DELETE");
  }
}
