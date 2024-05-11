import MaxWidthWrapper from "@/components/max-width-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { metadataHelper } from "@/lib/metadata";
import { prismadb } from "@/lib/prismadb";
import { Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import Client from "./components/client";
import { ProductColumn } from "./components/column";
const PRODUCTS_LIMIT = 20;
const PRODUCTS_PAGE_ID = 1;
const ProductsPage = async () => {
  const products = await prismadb.product.findMany({
    take: PRODUCTS_LIMIT,
    skip: (PRODUCTS_PAGE_ID - 1) * PRODUCTS_LIMIT,
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <MaxWidthWrapper>
      <div className="flex items-center justify-between">
        <Heading
          title={`PRODUCTS (${products.length})`}
          description="Manage PRODUCTS for your products"
        />
        <Link href="/store/products/new" className={buttonVariants({})}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      <Separator />
      <Client data={formattedProducts} />
    </MaxWidthWrapper>
  );
};

export default ProductsPage;
export const dynamic = "force-dynamic";
export const metadata = metadataHelper({
  title: "PRODUCTS",
  description: "PRODUCTS page",
  keywords: ["PRODUCTS"],
});
