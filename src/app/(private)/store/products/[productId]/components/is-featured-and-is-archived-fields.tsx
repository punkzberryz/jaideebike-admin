"use client";

import { UseFormReturn } from "react-hook-form";
import { ProductFormSchema } from "./product.schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface IsFeaturedAndIsArchivedFieldsProps {
  form: UseFormReturn<ProductFormSchema>;
}
const IsFeaturedAndIsArchivedFields = ({
  form,
}: IsFeaturedAndIsArchivedFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="isFeatured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Featured</FormLabel>
              <FormDescription>
                This product will appear on the home page.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="isArchived"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Archived</FormLabel>
              <FormDescription>
                This product will not appear anywhere in the store.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default IsFeaturedAndIsArchivedFields;
