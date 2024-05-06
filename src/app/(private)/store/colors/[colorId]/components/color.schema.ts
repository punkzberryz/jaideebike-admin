import { z } from "zod";
export const colorSchema = z.object({
  name: z.string().min(2),
  hexValue: z.string().min(4).max(9).regex(/^#/, {
    message: "String must be a valid hex code",
  }),
  gradient: z.optional(z.string()),
});

export type ColorFormSchema = z.infer<typeof colorSchema>;
