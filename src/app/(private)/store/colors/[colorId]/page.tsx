import MaxWidthWrapper from "@/components/max-width-wrapper";
import { prismadb } from "@/lib/prismadb";
import ColorForm from "./components/color-form";
import { metadataHelper } from "@/lib/metadata";

//For new or edit color page

const ColorPage = async ({
  params,
}: {
  params: {
    colorId: string;
  };
}) => {
  const color =
    params.colorId === "new"
      ? null
      : await prismadb.color.findUnique({
          where: {
            id: parseInt(params.colorId),
          },
        });
  return (
    <MaxWidthWrapper>
      <ColorForm initialData={color} />
    </MaxWidthWrapper>
  );
};

export default ColorPage;

export const metadata = metadataHelper({
  title: "Color",
  description: "Color page",
  keywords: ["color", "color page"],
});
