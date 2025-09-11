import {
  Book,
  ChefHat as Cuisine,
  Image,
  MapPin,
  ShoppingBasket,
  Tag,
  Users,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../components/ui/button";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-[calc(100svh-var(--navbar-height))] mt-[var(--navbar-height)] grid grid-cols-[auto_1fr] container mx-auto py-6 gap-6">
      <nav className="p-4 rounded-lg border h-full shadow">
        <ul>
          {links.map((link) => (
            <li key={link.label}>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="h-full overflow-hidden">{children}</div>
    </div>
  );
}

const links = [
  {
    href: "/admin/user",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin/recipe",
    label: "Recipes",
    icon: Book,
  },
  {
    href: "/admin/cuisine-type",
    label: "Cuisine Types",
    icon: Cuisine,
  },
  {
    href: "/admin/tag",
    label: "Tags",
    icon: Tag,
  },
  {
    href: "/admin/image",
    label: "Images",
    icon: Image,
  },
  {
    href: "/admin/ingredient",
    label: "Ingredients",
    icon: ShoppingBasket,
  },
  {
    href: "/admin/ingredient-location",
    label: "Ingredient Locations",
    icon: MapPin,
  },
  {
    href: "/admin/ingredient-type",
    label: "Ingredient Types",
    icon: Utensils,
  },
];
