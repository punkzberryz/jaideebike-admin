import MaxWidthWrapper from "@/components/max-width-wrapper";
import { metadataHelper } from "@/lib/metadata";
import { prismadb } from "@/lib/prismadb";
import ProductForm from "./components/product-form";

const ProductPage = async ({
  params,
}: {
  params: {
    productId: string;
  };
}) => {
  const product =
    params.productId === "new"
      ? null
      : await prismadb.product.findUnique({
          where: {
            id: params.productId,
          },
          include: {
            images: true,
          },
        });
  const categories = await prismadb.category.findMany();
  const colors = await prismadb.color.findMany();
  return (
    <MaxWidthWrapper>
      <ProductForm
        initialData={product}
        categories={categories}
        colors={colors}
      />
    </MaxWidthWrapper>
  );
};

export default ProductPage;
export const dynamic = "force-dynamic";
export const metadata = metadataHelper({
  title: "Create or edit product",
  description: "Add or edit a product",
  keywords: ["product", "create", "new", "edit"],
});
