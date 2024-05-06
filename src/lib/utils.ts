import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MetadataHelperInput extends Metadata {
  title: string;
}

export function metadataHelper({
  title,
  description,
  keywords,
}: MetadataHelperInput): Metadata {
  return {
    title: `${title} | ใจดีจักรยาน Admin`,
    description: description ?? "ใจดีจักรยาน Admin",
    keywords,
  };
}
