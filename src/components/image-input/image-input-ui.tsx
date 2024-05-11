"use client";

import { Loader2, PlusIcon, UploadCloud, XCircleIcon } from "lucide-react";
import { ImageInputAction, FileWithUrl, ImageState } from "./image-input-type";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageActionButtons } from "./image-action-buttons";

export const ImageInput = ({
  handleDrag,
  handleChange,
  handleDrop,
  maxFileSize,
}: {
  handleDrag: (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxFileSize: number;
}) => {
  return (
    <>
      <div
        className="absolute inset-0 cursor-pointer"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      ></div>
      <UploadCloud className="w-10 h-10 mb-3 text-gray-400 dark:text-gray-600" />
      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        up to 5 images, {(maxFileSize / 1000000).toFixed(0)}MB per file
      </p>
      <input
        multiple
        onChange={handleChange}
        accept="image/jpeg, image/jpg, image/png"
        id="dropzone-file"
        type="file"
        className="hidden"
      />
    </>
  );
};

export const ImageInputWithImageFiles = ({
  imageState: input,
  handleDrag,
  handleChange,
  handleDrop,
  imageDispatch,
}: {
  imageState: ImageState;
  handleDrag: (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageDispatch: React.Dispatch<ImageInputAction>;
}) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y dark:divide-slate-600">
              <thead className="bg-slate-200 dark:bg-slate-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    Preview
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300  uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300  uppercase tracking-wider"
                  ></th>
                </tr>
              </thead>
              <tbody className="relative divide-y divide-slate-400 dark:divide-slate-600">
                {input.map((file, index) => (
                  <ImageUploadDisplayItem
                    key={index}
                    file={file}
                    imageDispatch={imageDispatch}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
            <label
              htmlFor="dropzone-file-images-present"
              className="relative cursor-pointer group hover:border-gray-500 hover:bg-slate-200 hover:dark:bg-slate-800 transition flex justify-center py-4 border-t border-slate-400 dark:border-slate-600"
            >
              <PlusIcon className="w-12 h-12 stroke-1 group-hover:text-slate-600 group-hover:dark:text-slate-400 transition text-slate-500" />
              <input
                multiple
                onChange={handleChange}
                accept="image/jpeg, image/jpg, image/png"
                type="file"
                id="dropzone-file-images-present"
                className="relative z-20 hidden"
              />
              <div
                className="absolute inset-0"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageUploadDisplayItem = ({
  file: { name, isError, getUrl, isLoading },
  imageDispatch,
  index,
}: {
  file: FileWithUrl;
  imageDispatch: React.Dispatch<ImageInputAction>;
  index: number;
}) => {
  return (
    <tr>
      {/* PREVIEW */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
        <div className="relative flex h-12 w-20">
          {isError ? (
            <div className="flex w-full justify-center items-center">
              <XCircleIcon className="h-6 w-6 text-red-500" />
            </div>
          ) : (
            <Image
              style={{ objectFit: "contain" }}
              src={getUrl}
              fill
              alt={name}
              sizes="100px"
            />
          )}
        </div>
      </td>
      {/* NAME */}
      <td className="px-6 py-4 truncate whitespace-normal text-sm font-medium text-slate-600 dark:text-slate-400">
        <div className="max-w-20">
          <p
            className={cn("dark:text-slate-300", {
              "dark:text-red-500": isError,
            })}
          >
            {name}
          </p>
        </div>
      </td>
      {/* ACTION BUTTONS */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 ">
        {isLoading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <ImageActionButtons imageDispatch={imageDispatch} index={index} />
        )}
      </td>
    </tr>
  );
};
