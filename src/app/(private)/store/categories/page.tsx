import MaxWidthWrapper from "@/components/max-width-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { metadataHelper } from "@/lib/metadata";
import { prismadb } from "@/lib/prismadb";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CategoryColumn } from "./components/column";
import { format } from "date-fns";
import Client from "./components/client";
const CATEGORIES_LIMIT = 20;
const CATEGORIES_PAGE_ID = 1;
const CategoriesPage = async () => {
  const categories = await prismadb.category.findMany({
    take: CATEGORIES_LIMIT,
    skip: (CATEGORIES_PAGE_ID - 1) * CATEGORIES_LIMIT,
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <MaxWidthWrapper>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${categories.length})`}
          description="Manage categories for your products"
        />
        <Link href="/store/categories/new" className={buttonVariants({})}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      <Separator />
      <Client data={formattedCategories} />
    </MaxWidthWrapper>
  );
};

export default CategoriesPage;
export const metadata = metadataHelper({
  title: "Categories",
  description: "Categories page",
  keywords: ["categories"],
});
