import { z } from "zod";
export const categorySchema = z.object({
  name: z.string().min(1),
});

export type CategoryFormSchema = z.infer<typeof categorySchema>;
