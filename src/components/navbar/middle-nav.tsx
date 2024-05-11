import { cn } from "@/lib/utils";
import Link from "next/link";

const MiddleNavbar = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((link) => (
        <Link
          href={link.href}
          key={link.href}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export { MiddleNavbar };

interface linkProps {
  href: string;
  label: string;
}
const links: linkProps[] = [
  {
    href: "/",
    label: "Dashboard",
  },
  {
    href: "/store/products",
    label: "Products",
  },
  {
    href: "/store/categories",
    label: "Categories",
  },
  {
    href: "/store/colors",
    label: "Colors",
  },
];
