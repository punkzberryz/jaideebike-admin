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
import { Color } from "@prisma/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
interface ColorFieldProps {
  form: UseFormReturn<ProductFormSchema>;
  colors: Color[];
}

const ColorField = ({ form, colors }: ColorFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="colorId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Color</FormLabel>
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
                  placeholder="Select a color"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {colors.map((color) => (
                <SelectItem key={color.id} value={color.id.toString()}>
                  {color.name}
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

export default ColorField;
