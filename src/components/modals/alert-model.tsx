"use client";

import { useIsMounted } from "@/hooks/use-is-mounted";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { ClipLoader, ScaleLoader, SyncLoader } from "react-spinners";
import { LoadingIcon } from "../loading-icon";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
  description: string;
}

const AlertModal = ({
  isOpen,
  loading,
  onClose,
  onConfirm,
  title,
  description,
}: AlertModalProps) => {
  const isMounted = useIsMounted();
  if (!isMounted) return null;

  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button
          disabled={loading}
          variant="outline"
          onClick={onClose}
          className="w-24"
        >
          Cancel
        </Button>
        <Button
          disabled={loading}
          variant="destructive"
          onClick={onConfirm}
          className="w-24"
        >
          {loading ? <LoadingIcon /> : <span>Continue</span>}
        </Button>
      </div>
    </Modal>
  );
};

export { AlertModal };
