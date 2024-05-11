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
import { Input } from "@/components/ui/input";
interface PriceFieldProps {
  form: UseFormReturn<ProductFormSchema>;
}
const PriceField = ({ form }: PriceFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="price"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Price</FormLabel>
          <FormControl>
            <Input placeholder="Product price" {...field} type="number" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PriceField;
