"use client";

import ImageUploadInput from "@/components/image-input/image-upload-input";
import {
  ImageInputAction,
  ImageState,
} from "@/components/image-input/image-input-type";
import { cloudinaryFolderName } from "@/lib/query/image/folder-name";
import { Label } from "@/components/ui/label";

interface ImageFieldProps {
  imageState: ImageState;
  imageDispatch: React.Dispatch<ImageInputAction>;
}
const ImageField = ({ imageDispatch, imageState }: ImageFieldProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <Label>Images</Label>
      <ImageUploadInput
        imageDispatch={imageDispatch}
        imageState={imageState}
        folder={cloudinaryFolderName.products}
      />
    </div>
  );
};

export default ImageField;
