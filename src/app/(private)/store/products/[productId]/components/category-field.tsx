"use client";
import { UseFormReturn } from "react-hook-form";
import { ProductFormSchema } from "./product.schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Category } from "@prisma/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
interface CategoryFieldProps {
  form: UseFormReturn<ProductFormSchema>;
  categories: Category[];
}

const CategoryField = ({ form, categories }: CategoryFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="categoryId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select
            onValueChange={(value) => {
              const intVal = parseInt(value);
              if (!isNaN(intVal)) {
                field.onChange(intVal);
              }
            }}
            value={field.value?.toString()}
            defaultValue={field.value?.toString()}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  defaultValue={field.value}
                  placeholder="Select a category"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategoryField;
