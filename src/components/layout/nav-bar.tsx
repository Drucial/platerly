import { ChefHat, Shield, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container space-x-4 flex justify-between items-center mx-auto">
        <div className="flex h-16 items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold">platerly</h1>
          </Link>
        </div>
        <nav className="flex items-center space-x-1">
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
    href: "/admin",
    label: "Admin",
    icon: Shield,
    sublinks: [
      {
        href: "/admin/user",
        label: "Users",
        icon: Users,
      },
    ],
  },
];
