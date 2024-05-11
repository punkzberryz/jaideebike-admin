import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { apiErrorResponse } from "@/app/api/helper";
import { validateRequest } from "@/lib/auth/auth";

export const DELETE = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const publicId = searchParams.get("publicId");
  console.log(publicId);
  if (!publicId) {
    return apiErrorResponse({
      message: "Public ID not found",
      statusCode: 400,
    });
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_NAME;
  if (!apiSecret || !apiKey || !cloudName) {
    return apiErrorResponse({
      message: "Cloudinary API credentials not found",
      statusCode: 500,
    });
  }

  const { session } = await validateRequest();
  if (!session) {
    return apiErrorResponse({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  try {
    // Delete image from cloudinary
    const resp = await deleteImageCloudinary(publicId);

    if (resp.result !== "ok") {
      if (resp.result === "not found") {
        return apiErrorResponse({
          message: "Bad request, image not found",
          statusCode: 400,
        });
      }

      return apiErrorResponse({
        message: "Error deleting image, result return not ok",
        statusCode: 500,
      });
    }

    return NextResponse.json({ message: "Image deleted" });
  } catch (err: any) {
    console.error("Error deleting image: ", err);
    return apiErrorResponse({ message: err, statusCode: 500 });
  }
};

const deleteImageCloudinary = (publicId: string) =>
  new Promise<{ result?: string }>((resolve, reject) => {
    cloudinary.uploader
      .destroy(publicId)
      .then((res) => resolve(res))
      .catch((err) => reject(err?.message));
  });
