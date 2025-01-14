import MaxWidthWrapper from "@/components/max-width-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { prismadb } from "@/lib/prismadb";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ColorColumn } from "./components/column";
import { format } from "date-fns";
import Client from "./components/client";
import { metadataHelper } from "@/lib/metadata";

const COLORS_LIMIT = 20;
const COLORS_PAGE_ID = 1;
const ColorsPage = async () => {
  const colors = await prismadb.color.findMany({
    take: COLORS_LIMIT,
    skip: (COLORS_PAGE_ID - 1) * COLORS_LIMIT,
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    value: item.hexValue,
  }));

  return (
    <MaxWidthWrapper>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${colors.length})`}
          description="Manage colors for your products"
        />
        <Link href="/store/colors/new" className={buttonVariants({})}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      <Separator />
      <Client data={formattedColors} />
    </MaxWidthWrapper>
  );
};

export default ColorsPage;
export const dynamic = "force-dynamic";
export const metadata = metadataHelper({
  title: "Manage Colors",
  description: "Manage colors for your products",
  keywords: ["colors", "color management"],
});
