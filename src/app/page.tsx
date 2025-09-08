import { Input } from "@/components/ui/input";
import { ChefHat } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-1 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] items-center">
        <div className="flex flex-col items-center gap-2">
          <ChefHat className="w-10 h-10" />
          <h1 className="text-4xl font-bold leading-none">platerly</h1>
        </div>
        <Input
          placeholder="Enter a recipe link"
          className="w-full max-w-md text-center"
        />
        
        <div className="mt-8">
          <Link 
            href="/admin/user" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Admin: Manage Users
          </Link>
        </div>
      </main>
    </div>
  );
}
