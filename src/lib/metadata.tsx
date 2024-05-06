import { Metadata } from "next";

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
