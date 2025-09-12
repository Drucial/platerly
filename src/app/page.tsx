import {
  ChefHat,
  ClipboardPenLine,
  ImagePlus,
  LinkIcon,
  LucideProps,
  PencilLine,
} from "lucide-react";
import Link from "next/link";
import IconBackground from "../components/layout/icon-background";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export default function Home() {
  return (
    <div className="relative font-sans grid grid-rows-1 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 items-center">
        <div className="flex flex-col items-center gap-2">
          <ChefHat className="w-12 h-12" />
          <h1 className="text-[2.5rem] font-bold leading-none -mt-1">
            platerly
          </h1>
        </div>
        <div className="flex">
          {actionButtons.map((button) => (
            <div key={button.label} className="px-1.5 group">
              <Button
                key={button.label}
                size="lg"
                variant="default"
                className="gap-0 cursor-pointer"
                asChild
              >
                <Link href={button.href ?? ""}>
                  <button.icon />
                  <span
                    className={cn(
                      "block w-0 opacity-0 ml-0 group-hover:w-auto group-hover:opacity-100 transition-all whitespace-nowrap overflow-hidden duration-600 group-hover:ml-2",
                      button.className
                    )}
                  >
                    {button.label}
                  </span>
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </main>
      <IconBackground />
    </div>
  );
}

type ActionButton = {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  className: string;
  href?: string;
};

const actionButtons: ActionButton[] = [
  {
    icon: PencilLine,
    label: "Write a Recipe",
    className: "group-hover:w-[10ch]",
    href: "/recipes/new",
  },
  {
    icon: ClipboardPenLine,
    label: "Paste a Recipe",
    className: "group-hover:w-[11ch]",
  },
  {
    icon: LinkIcon,
    label: "Connect a Link",
    className: "group-hover:w-[11ch]",
  },
  {
    icon: ImagePlus,
    label: "Upload a Photo",
    className: "group-hover:w-[11ch]",
  },
];
