import MaxWidthWrapper from "@/components/max-width-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { prismadb } from "@/lib/prismadb";
import { Plus } from "lucide-react";
import Link from "next/link";
const COLOR_LIMIT = 20;
const COLOR_PAGE_ID = 1;
const ColorsPage = async () => {
  const colors = await prismadb.color.findMany({
    take: COLOR_LIMIT,
    skip: (COLOR_PAGE_ID - 1) * COLOR_LIMIT,
  });

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
    </MaxWidthWrapper>
  );
};

export default ColorsPage;
