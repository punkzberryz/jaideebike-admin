"use client";
import { Color } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { ColorFormSchema, colorSchema } from "./color.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import {
  createColor,
  deleteColor,
  editColor,
} from "@/server-action/store/color";
import { AlertModal } from "@/components/modals/alert-model";
import { Heading } from "@/components/ui/heading";

interface ColorFormProps {
  initialData: Color | null;
}
const ColorForm = ({ initialData }: ColorFormProps) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit color" : "Create color";
  const description = initialData ? "Edit a color." : "Add a new color";
  const toastMessage = initialData ? "Color updated." : "Color created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ColorFormSchema>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      name: initialData?.name || "",
      gradient: initialData?.gradient || "",
      hexValue: initialData?.hexValue || "",
    },
  });

  const onSubmit = async (data: ColorFormSchema) => {
    setLoading(true);
    let colorId: number;
    try {
      if (initialData) {
        const { color, error } = await editColor(data, initialData.id);
        if (error || !color) {
          throw new Error(error?.message || "Failed to edit color");
        }
        colorId = color.id;
      } else {
        const { color, error } = await createColor(data);
        if (error || !color) {
          throw new Error(error?.message || "Failed to create color");
        }
        colorId = color.id;
      }
      if (!colorId) {
        throw new Error("Color id not found");
      }
      router.refresh();
      router.push(`/store/colors/${colorId}`);
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
      toast.error("Color not found.");
      return;
    }
    try {
      setLoading(true);
      //Delete action
      const { error } = await deleteColor(initialData.id);
      if (error) {
        throw new Error(error.message);
      }
      router.refresh();
      router.push("/store/colors");
      toast.success("Color deleted.");
    } catch (error) {
      toast.error("Make sure you removed all products using this color first.");
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
                      placeholder="Color name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hexValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Color value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gradient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gradient</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Color value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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

const onError = (error: FieldErrors<ColorFormSchema>) => {
  toast.error("Please fill in all required fields.");
};
export default ColorForm;
