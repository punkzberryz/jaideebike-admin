"use client";
import { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CategoryFormSchema, categorySchema } from "./category.schema";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/modals/alert-model";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  createCategory,
  deleteCategory,
  editCategory,
} from "@/server-action/store/category";
interface CategoryFormProps {
  initialData: Category | null;
}
const CategoryForm = ({ initialData }: CategoryFormProps) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category." : "Add a new category";
  const toastMessage = initialData ? "Category updated." : "Category created.";
  const action = initialData ? "Save changes" : "Create";
  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });
  const onSubmit = async (data: CategoryFormSchema) => {
    setLoading(true);
    let categoryId: number;
    try {
      if (initialData) {
        const { category, error } = await editCategory(data, initialData.id);
        if (error || !category) {
          throw new Error(error?.message || "Failed to edit category");
        }
        categoryId = category.id;
      } else {
        const { category, error } = await createCategory(data);
        if (error || !category) {
          throw new Error(error?.message || "Failed to create category");
        }
        categoryId = category.id;
      }
      if (!categoryId) {
        throw new Error("category id not found");
      }
      router.refresh();
      router.push(`/store/categories/${categoryId}`);
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
      toast.error("Category not found.");
      return;
    }
    try {
      setLoading(true);
      //Delete action
      const { error } = await deleteCategory(initialData.id);
      if (error) {
        throw new Error(error.message);
      }
      router.refresh();
      router.push("/store/categories");
      toast.success("Category deleted.");
    } catch (error) {
      toast.error(
        "Make sure you removed all products using this category first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CategoryForm;
const onError = (error: FieldErrors<CategoryFormSchema>) => {
  toast.error("Please fill in all required fields.");
};
