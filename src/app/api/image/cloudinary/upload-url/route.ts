import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { apiErrorResponse } from "@/app/api/helper";
import { validateRequest } from "@/lib/auth/auth";
import { UploadCloudinaryUrlResponse } from "./response";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const publicId = searchParams.get("publicId");
  const folder = searchParams.get("folder");
  if (!folder) {
    return apiErrorResponse({
      message: "Folder not found",
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

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
    });
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        public_id: publicId,
      },
      apiSecret
    );
    const data: UploadCloudinaryUrlResponse = {
      signature,
      timestamp,
      apiKey,
      folder,
      publicId,
    };

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Error getting image upload url: ", err.message);
    return apiErrorResponse({ message: err.message, statusCode: 500 });
  }
};
