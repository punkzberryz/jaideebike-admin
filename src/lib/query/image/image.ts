// import { UploadCloudinaryUrlResponse } from "@/app/api/image/cloudinary/upload-url/response";
import { UploadCloudinaryUrlResponse } from "@/app/api/image/cloudinary/upload-url/response";
import { catchErrorHelper } from "../../error/catch-error-helper";
import { cloudinaryFolderName } from "./folder-name";

export const getCloudinaryUploadSignature = async ({
  publicId,
  folder,
}: {
  publicId?: string;
  // folder: cloudinaryFolderName;
  folder: string;
}) => {
  try {
    const response = await fetch(
      "/api/image/cloudinary/upload-url?" +
        new URLSearchParams({
          publicId: publicId ?? "",
          folder:
            process.env.NODE_ENV === "development" ? `dev-${folder}` : folder,
        })
    );
    if (!response.ok) {
      console.log(response.status);
      console.log(response.statusText);
      throw new Error(
        `Error getting image upload url: ${response.status} ${response.statusText}`
      );
    }
    const data: UploadCloudinaryUrlResponse = await response.json();
    return data;
  } catch (err) {
    return catchErrorHelper("getCloudinaryUploadSignature", err);
  }
};

export const uploadImageCloudinary = async ({
  image,
  signData,
}: {
  image: File;
  signData: UploadCloudinaryUrlResponse;
}) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("api_key", signData.apiKey);
  formData.append("timestamp", signData.timestamp.toString());
  formData.append("folder", signData.folder);
  formData.append("signature", signData.signature);
  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dwrriqdbj/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      console.log(response.status);
      console.log(response.statusText);
      const data = await response.json();
      console.log(data);
      throw new Error("Error uploading image: ", data);
    }
    const data: CloudinaryUploadResponse = await response.json();
    return { url: data.secure_url };
  } catch (err) {
    return catchErrorHelper("Error uploading image", err);
  }
};

export const deleteImageCloudinary = async ({
  publicId,
}: {
  publicId: string;
}) => {
  const resp = await fetch(
    "/api/image/cloudinary/image?" +
      new URLSearchParams({
        publicId,
      }),
    {
      method: "DELETE",
    }
  );

  if (!resp.ok) {
    console.log(resp.status);
    console.log(resp.statusText);
    console.log(await resp.json());
    return;
  }
  return;
};

export const getCloudinaryPublicId = ({
  url,
  folder,
}: {
  url: string;
  folder: cloudinaryFolderName;
}) => {
  const folderProd =
    process.env.NODE_ENV === "development" ? `dev-${folder}` : folder;

  const urlArray = url.split(folderProd + "/");
  if (urlArray.length <= 1) {
    return null;
  }
  const [_, imgNameWithJpeg] = urlArray;
  const nameAndJpeg = imgNameWithJpeg.split(".");
  if (nameAndJpeg.length <= 1) {
    return null;
  }
  //what if image name is xxasd.adsasc.asdasd.jpg ?? we would get [xxxasd, adsasc, asdasd, jpg]
  const imgName = nameAndJpeg.slice(0, nameAndJpeg.length - 1).join(".");
  return folderProd + "/" + imgName;
};

type CloudinaryUploadResponse = {
  public_id: string;
  version: number;
  version_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  // tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  original_filename: string;
  original_extension: string;
};
