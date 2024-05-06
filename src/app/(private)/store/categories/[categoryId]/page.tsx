import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Heading } from "@/components/ui/heading";
import { metadataHelper } from "@/lib/metadata";
import { prismadb } from "@/lib/prismadb";
import CategoryForm from "./components/category-form";

const CategoryPage = async ({
  params,
}: {
  params: {
    categoryId: string;
  };
}) => {
  const category =
    params.categoryId === "new"
      ? null
      : await prismadb.category.findUnique({
          where: {
            id: parseInt(params.categoryId),
          },
        });

  return (
    <MaxWidthWrapper>
      <CategoryForm initialData={category} />
    </MaxWidthWrapper>
  );
};

export default CategoryPage;

export const metadata = metadataHelper({
  title: "Create or edit category",
  description: "Add or edit a category",
  keywords: ["category", "create", "new", "edit"],
});
