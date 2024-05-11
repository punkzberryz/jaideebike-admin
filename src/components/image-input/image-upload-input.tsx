"use client";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { ImageInput, ImageInputWithImageFiles } from "./image-input-ui";
import { ImageInputAction, ImageState, namingFile } from "./image-input-type";
import toast from "react-hot-toast";
import { cloudinaryFolderName } from "@/lib/query/image/folder-name";
import {
  getCloudinaryUploadSignature,
  uploadImageCloudinary,
} from "@/lib/query/image/image";
import { useImageToBeDeletedStore } from "@/hooks/use-image-to-be-deleteted-store";

interface ImageUploadInputProps {
  imageState: ImageState;
  imageDispatch: React.Dispatch<ImageInputAction>;
  folder: cloudinaryFolderName;
}

const ImageUploadInput = ({
  imageState: input,
  imageDispatch,
  folder,
}: ImageUploadInputProps) => {
  const [dragActive, setDragActive] = useState(false);
  const { addUrl } = useImageToBeDeletedStore();

  const noInput = input.length === 0;
  const handleDrag = (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleUploadFiles = useCallback(
    (files: FileList, stateLength: number) => {
      const { validFiles, error: errorMessage } = validateAndReturnFiles(
        files,
        stateLength
      );
      if (!validFiles) {
        toast.error(errorMessage);
        return;
      }
      imageDispatch({
        type: "ADD_FILES_BEFORE_UPLOAD",
        payload: { files: validFiles },
      });
      validFiles.forEach((file, index) => {
        uploadImage(file, folder).then((result) => {
          //update file state after upload
          imageDispatch({
            type: "UPADTE_FILE_STATE_AFTER_UPLOAD",
            payload: {
              file: {
                getUrl: result.url ?? "",
                name: namingFile(file.name, index),
                isError: result.url === undefined,
                isLoading: false,
              },
            },
          });
          if (result.url) {
            addUrl(result.url);
          }
        });
      });
    },
    [folder, imageDispatch, addUrl]
  );
  // triggers when file is selected with click
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleUploadFiles(e.target.files, input.length);
    }
  };
  // triggers when file is dropped
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFiles(e.dataTransfer.files, input.length);
      e.dataTransfer.clearData();
    }
  };
  return (
    <div
      onDragEnter={handleDrag}
      className="flex h-full items-center w-full lg:w-2/3"
    >
      <label
        htmlFor="dropzone-file"
        className={cn(
          "group relative h-full w-full flex flex-col items-center justify-center aspect-video border-2 border-slate-300 border-dashed rounded-lg dark:border-gray-600 transition",
          { "dark:border-slate-400 dark:bg-slate-800": dragActive },
          { "h-fit aspect-auto": !noInput },
          { "items-start justify-start": !noInput },
          { "dark:hover:border-gray-500 dark:hover:bg-slate-800": noInput }
        )}
      >
        <div
          className={cn(
            "relative w-full h-full flex flex-col items-center justify-center",
            {
              "item-start": !noInput,
            }
          )}
        >
          {noInput ? (
            <ImageInput
              maxFileSize={MAX_FILE_SIZE}
              handleChange={handleChange}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
            />
          ) : (
            <ImageInputWithImageFiles
              imageState={input}
              handleChange={handleChange}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
              imageDispatch={imageDispatch}
            />
          )}
        </div>
      </label>
    </div>
  );
};

export default ImageUploadInput;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg"];
function validateFileTypeAndSize(file: File) {
  let valid = ALLOWED_FILE_TYPES.includes(file.type);
  valid = valid && file.size <= MAX_FILE_SIZE;
  return valid;
}

function validateAndReturnFiles(files: FileList, stateLength: number) {
  const fileArray = Array.from(files);
  // validate file type and size
  const validFiles = fileArray.filter((file) => validateFileTypeAndSize(file));
  if (fileArray.length !== validFiles.length) {
    return {
      error:
        "Invalid file type or size. Please upload only PNG or JPEG files and size within 5MB.",
    };
  }
  if (stateLength + validFiles.length > 5) {
    return { error: "You can only upload a maximum of 5 files at a time." };
  }
  return { validFiles };
}

const uploadImage = async (
  file: File,
  folder: cloudinaryFolderName
): Promise<{ url?: string }> => {
  //get presigned url
  try {
    const urlResp = await getCloudinaryUploadSignature({
      folder,
    });
    // //upload image
    const resp = await uploadImageCloudinary({
      image: file,
      signData: urlResp,
    });

    return resp;
  } catch (err) {
    return {};
  }
};
