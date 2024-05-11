"use client";

import { DataTable } from "@/components/table/data-table";
import { columns, ProductColumn } from "./column";
import { AlertModal } from "@/components/modals/alert-model";
import { useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import {
  deleteImageCloudinary,
  getCloudinaryPublicId,
} from "@/lib/query/image/image";
import { cloudinaryFolderName } from "@/lib/query/image/folder-name";
import { useImageToBeDeletedStore } from "@/hooks/use-image-to-be-deleteted-store";
interface ClientProps {
  data: ProductColumn[];
}
const Client = ({ data }: ClientProps) => {
  const [loading, setLoading] = useState(false);
  const { isOpen, onClose, onConfirm } = useModal();
  const { removeUrl, urls } = useImageToBeDeletedStore();
  const router = useRouter();
  const onConfirmDelete = () => {
    setLoading(true);
    onConfirm().then(() => {
      router.refresh();
    });
  };

  //delte images from upload store
  useEffect(() => {
    if (urls.length === 0) return;
    urls.forEach((url) => {
      const publicId = getCloudinaryPublicId({
        url,
        folder: cloudinaryFolderName.products,
      });
      if (publicId) {
        deleteImageCloudinary({ publicId })
          .then(() => removeUrl(url))
          .catch(console.error);
      } else {
        removeUrl(url);
      }
    });
  }, [urls, removeUrl]);

  return (
    <div>
      <AlertModal
        title="Delete Color"
        description="Are you sure you want to delete this color?"
        loading={loading}
        onConfirm={onConfirmDelete}
        isOpen={isOpen}
        onClose={onClose}
      />
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};

export default Client;
