"use client";

import { useRouter } from "next/navigation";
import { ColorColumn } from "./column";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { deleteColor } from "@/server-action/store/color";
import { delay } from "@/lib/utils";

interface CellActionProps {
  data: ColorColumn;
}

export const CellAction = ({ data }: CellActionProps) => {
  const { setIsOpen, setOnConfirm } = useModal();
  const router = useRouter();

  const onCopy = (id: number) => {
    navigator.clipboard.writeText(id.toString());
    toast.success("Color ID copied to clipboard.");
  };

  const onDeleteActionClick = () => {
    setIsOpen(true);
    setOnConfirm(async () => {
      const { error } = await deleteColor(data.id);
      if (error) {
        toast.error(error.message);
        return;
      }
      setIsOpen(false);
      toast.success(`Color ${data.name} deleted successfully.`);
    });
  };
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
        <DropdownMenuItem onClick={() => onCopy(data.id)}>
          <Copy className="mr-2 h-4 w-4" /> Copy Id
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/store/colors/${data.id}`)}
        >
          <Edit className="mr-2 h-4 w-4" /> Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDeleteActionClick}>
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
