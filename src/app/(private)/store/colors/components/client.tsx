"use client";

import { DataTable } from "@/components/table/data-table";
import { ColorColumn, columns } from "./column";
import { AlertModal } from "@/components/modals/alert-model";
import { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
interface ClientProps {
  data: ColorColumn[];
}
const Client = ({ data }: ClientProps) => {
  const [loading, setLoading] = useState(false);
  const { isOpen, onClose, onConfirm } = useModal();
  const router = useRouter();
  const onConfirmDelete = () => {
    setLoading(true);
    onConfirm().then(() => {
      router.refresh();
    });
  };
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
