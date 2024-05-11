import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse, catchRouteErrorHelper } from "../helper";
import queryString from "query-string";
import { validateRequest } from "@/lib/auth/auth";
import { prismadb } from "@/lib/prismadb";

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const params = queryString.parse(searchParams.toString());
  const { ids } = params;

  //   const ids = searchParams.get("ids") as string | string[] | null;
  if (!ids) {
    return apiErrorResponse({
      message: "Ids not found",
      statusCode: 400,
    });
  }

  if (!Array.isArray(ids)) {
    return apiErrorResponse({
      message: "Ids must be an array",
      statusCode: 400,
    });
  }

  try {
    const { session } = await validateRequest();
    if (!session) {
      return apiErrorResponse({
        message: "Unauthorized",
        statusCode: 401,
      });
    }

    const imageId: string[] = [];
    ids.forEach((id) => {
      if (id) imageId.push(id);
    });

    await prismadb.image.deleteMany({
      where: {
        id: {
          in: imageId,
        },
      },
    });
    return NextResponse.json({ message: "Images deleted" });
  } catch (err) {
    return catchRouteErrorHelper(err, "/api/image DELETE");
  }
}
