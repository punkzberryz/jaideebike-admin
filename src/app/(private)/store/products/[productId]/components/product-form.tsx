"use client";
import { Category, Color, Image, Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/modals/alert-model";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  createProduct,
  deleteProduct,
  editProduct,
} from "@/server-action/store/product";
import { ProductFormSchema, productSchema } from "./product.schema";
import NameField from "./name-field";
import PriceField from "./price-field";
import CategoryField from "./category-field";
import ColorField from "./color-field";
import IsFeaturedAndIsArchivedFields from "./is-featured-and-is-archived-fields";
import ImageField from "./image-field";
import { useImageUploadReducer } from "@/components/image-input/use-image-upload-reducer";
import DescriptionField from "./description-field";
import queryString from "query-string";
import { useImageUploadStore } from "@/hooks/use-image-upload-store";

interface ProductFormProps {
  initialData: (Product & { images: Image[] }) | null;
  categories: Category[];
  colors: Color[];
}
const ProductForm = ({ initialData, categories, colors }: ProductFormProps) => {
  const router = useRouter();
  const { addUrl, removeUrl } = useImageUploadStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [imageFiles, imageDispatch] = useImageUploadReducer();

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData ? "Edit a Product." : "Add a new Product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";
  const form = useForm<ProductFormSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || "",
      description: initialData?.description || "",
      isArchived: initialData?.isArchived || false,
      isFeatured: initialData?.isFeatured || false,
      images: initialData?.images || [],
      categoryId: initialData?.categoryId,
      colorId: initialData?.colorId,
    },
  });
  const onSubmit = async (data: ProductFormSchema) => {
    setLoading(true);
    let productId: string;
    //check if image is still uploading
    const imageStatus = imageFiles.reduce(
      (acc, file) => {
        const isLoading = file.isLoading || acc.isLoading;
        const isError = file.isError || acc.isError;
        return { isLoading, isError };
      },
      {
        isLoading: false,
        isError: false,
      }
    );

    if (imageStatus.isLoading) {
      toast.error("Please wait for the image to finish uploading.");
      setLoading(false);
      return;
    }
    if (imageStatus.isError) {
      toast.error("Please re-upload or remove the error image.");
      setLoading(false);
      return;
    }
    try {
      if (initialData) {
        const images = imageFiles.map((file) => ({ url: file.getUrl }));
        const { product, error } = await editProduct(
          { ...data, images },
          initialData.id
        );

        if (error || !product) {
          throw new Error(error?.message || "Failed to edit Product");
        }
        productId = product.id;

        //delete image that are not in the form
        const toBeDeletedImage = initialData.images.filter(
          (image) => !imageFiles.find((file) => file.name === image.id)
        );

        if (toBeDeletedImage.length > 0) {
          console.log("Images to be deleted", toBeDeletedImage);
          const url = queryString.stringifyUrl({
            url: "/api/image",
            query: { ids: toBeDeletedImage.map((image) => image.id) },
          });
          //we dont need to wait for the response
          fetch(url, {
            method: "DELETE",
          })
            .then((resp) => {
              if (!resp.ok) {
                console.error(
                  "Failed to delete image in database, response not ok"
                );
                resp.json().then(console.error);
                return;
              }
              console.log("Image deleted in database");
              //add to be deleted image to store
              toBeDeletedImage.forEach((image) => {
                console.log("Image deleted in store", image.url);
                addUrl(image.url);
              });
            })
            .catch(console.error);
        }
      } else {
        //create product
        const images = imageFiles.map((file) => ({ url: file.getUrl }));
        const { product, error } = await createProduct({ ...data, images });
        if (error || !product) {
          throw new Error(error?.message || "Failed to create Product");
        }
        productId = product.id;
      }
      if (!productId) {
        throw new Error("Product id not found");
      }
      //remove image that has been uploaded from the uploadStore
      imageFiles.forEach((file) => {
        removeUrl(file.getUrl);
      });

      router.refresh();
      router.push(`/store/products/${productId}`);
      toast.success(toastMessage);
    } catch (error) {
      console.error(error);
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!initialData) {
      toast.error("Product not found.");
      return;
    }
    try {
      setLoading(true);
      //Delete action
      const { error } = await deleteProduct(initialData.id);
      if (error) {
        throw new Error(error.message);
      }
      router.refresh();
      router.push("/store/products");
      toast.success("Product deleted.");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    const initState = initialData?.images.map((image) => ({
      getUrl: image.url,
      name: image.id,
      size: 0,
      isError: false,
      isLoading: false,
    }));
    if (initState) {
      imageDispatch({ type: "SET_FILES", payload: { files: initState } });
    }
  }, [imageDispatch, initialData?.images]);

  return (
    <>
      <AlertModal
        title={`Delete ${initialData?.name}`}
        description={`Are you sure you want to delete ${initialData?.name}?`}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData ? (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <NameField form={form} />
            <PriceField form={form} />
            <CategoryField form={form} categories={categories} />
            <ColorField form={form} colors={colors} />
            <IsFeaturedAndIsArchivedFields form={form} />
          </div>
          <DescriptionField form={form} />
          <ImageField imageState={imageFiles} imageDispatch={imageDispatch} />
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;
const onError = (error: FieldErrors<ProductFormSchema>) => {
  console.log(error);
  toast.error("Please fill in all required fields.");
};
