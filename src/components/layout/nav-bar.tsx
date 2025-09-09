"use client";

import {
  Book,
  CalendarDays,
  ChefHat,
  ChefHat as Cuisine,
  Image,
  MapPin,
  Shield,
  ShoppingBasket,
  ShoppingCart,
  Store,
  Tag,
  Users,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { ModeToggle } from "../ui/theme-toggle";

export default function NavBar() {
  // Once rendered set a css variable for teh height of the nav bar
  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${navbar.clientHeight}px`
      );
    }
    document.documentElement.style.setProperty("--navbar-height", "4rem");
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b">
      <div className="container space-x-4 flex justify-between items-center mx-auto">
        <div className="flex h-16 items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold">platerly</h1>
          </Link>
        </div>
        <nav className="flex items-center space-x-1 h-8">
          {links.map((link) => {
            if (link.sublinks) {
              return (
                <DropdownMenu key={link.href}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" key={link.href}>
                      <Link href={link.href}>
                        <span className="sr-only">{link.label}</span>
                        <link.icon className="w-5 h-5" />
                      </Link>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="end">
                    {link.sublinks.map((sublink) => (
                      <DropdownMenuItem key={sublink.href} asChild>
                        <Link href={sublink.href}>
                          <sublink.icon className="w-5 h-5" />
                          <span>{sublink.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
            return (
              <Button variant="ghost" size="icon" key={link.href}>
                <Link href={link.href}>
                  <span className="sr-only">{link.label}</span>
                  <link.icon className="w-5 h-5" />
                </Link>
              </Button>
            );
          })}
          <Separator orientation="vertical" />
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}

const links = [
  {
    href: "/",
    label: "Home",
    icon: ChefHat,
  },
  {
    href: "/recipes",
    label: "Recipes",
    icon: Book,
  },
  {
    href: "/pantry",
    label: "Pantry",
    icon: Store,
  },
  {
    href: "/meal-plan",
    label: "Meal Plan",
    icon: CalendarDays,
  },
  {
    href: "/grocery-list",
    label: "Grocery List",
    icon: ShoppingCart,
  },
  {
    href: "/admin",
    label: "Admin",
    icon: Shield,
    sublinks: [
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
    ],
  },
];
