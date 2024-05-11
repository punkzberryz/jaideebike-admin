import { z } from "zod";
export const productSchema = z.object({
  name: z.string().min(1),
  price: z.string().min(1),
  description: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  categoryId: z.number({ required_error: "Category is required" }),
  colorId: z.number({ required_error: "Color is required" }),
});

export type ProductFormSchema = z.infer<typeof productSchema>;
