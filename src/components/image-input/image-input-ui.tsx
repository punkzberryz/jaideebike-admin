"use client";

import {
  ArrowDown,
  ArrowUp,
  Loader2,
  MoreHorizontal,
  PlusIcon,
  Trash,
  UploadCloud,
  XCircleIcon,
} from "lucide-react";
import { ImageInputAction, FileWithUrl, ImageState } from "./image-input-type";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

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
              <thead className="bg-slate-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium dark:text-slate-300  uppercase tracking-wider"
                  >
                    Preview
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium dark:text-slate-300  uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium dark:text-slate-300  uppercase tracking-wider"
                  >
                    Size
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium dark:text-slate-300  uppercase tracking-wider"
                  ></th>
                </tr>
              </thead>
              <tbody className="relative divide-y dark:divide-slate-600">
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
              className="relative cursor-pointer group hover:border-gray-500 hover:dark:bg-slate-800 transition flex justify-center py-4 border-t border-slate-600"
            >
              <PlusIcon className="w-12 h-12 stroke-1 group-hover:fill-slate-400 transition fill-slate-500" />
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
  file: { name, isError, getUrl, size, isLoading },
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
      <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-slate-400">
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
            />
          )}
        </div>
      </td>
      {/* NAME */}
      <td className="px-6 py-4 truncate whitespace-normal text-sm font-medium dark:text-slate-400">
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
      {/* SIZE */}
      <td
        className={cn(
          "px-6 py-4 whitespace-nowrap text-sm dark:text-slate-400",
          {
            "dark:text-red-500": isError,
          }
        )}
      >
        {(size / 1000).toFixed(0)} KB
      </td>
      {/* ACTION BUTTONS */}
      <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-slate-400 ">
        {isLoading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <ImageActionButtons imageDispatch={imageDispatch} index={index} />
        )}
      </td>
    </tr>
  );
};

const ImageActionButtons = ({
  imageDispatch,
  index,
}: {
  imageDispatch: React.Dispatch<ImageInputAction>;
  index: number;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() =>
            imageDispatch({ type: "MOVE_ITEM_UP", payload: { index } })
          }
        >
          <ArrowUp className="mr-2 h-4 w-4" />
          Move up
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            imageDispatch({ type: "MOVE_ITEM_DOWN", payload: { index } })
          }
        >
          <ArrowDown className="mr-2 h-4 w-4" />
          Move Down
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            imageDispatch({
              type: "REMOVE_FILE_FROM_INPUT",
              payload: { index },
            })
          }
        >
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
