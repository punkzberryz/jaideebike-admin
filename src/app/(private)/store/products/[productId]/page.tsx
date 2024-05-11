import MaxWidthWrapper from "@/components/max-width-wrapper";
import { metadataHelper } from "@/lib/metadata";
import { prismadb } from "@/lib/prismadb";
import ProductForm from "./components/product-form";
import { Category, Color, Image, Product } from "@prisma/client";
const DEFAULT_LIMIT = 100;
type ProductAndImage = Product & {
  images: Image[];
};
const ProductPage = async ({
  params,
}: {
  params: {
    productId: string;
  };
}) => {
  let product: ProductAndImage | null = null;
  let categories: Category[] = [];
  let colors: Color[] = [];
  try {
    const categoriesPromise = prismadb.category.findMany({
      take: DEFAULT_LIMIT,
    });
    const colorsPromise = prismadb.color.findMany({
      take: DEFAULT_LIMIT,
    });
    const productPromise =
      params.productId === "new"
        ? null
        : prismadb.product.findUnique({
            where: {
              id: params.productId,
            },
            include: {
              images: true,
            },
          });
    const [productResp, categoriesResp, colorsResp] = await Promise.all([
      productPromise,
      categoriesPromise,
      colorsPromise,
    ]);
    product = productResp;
    categories = categoriesResp;
    colors = colorsResp;
  } catch (err) {
    throw new Error("Failed to fetch data");
  }

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
