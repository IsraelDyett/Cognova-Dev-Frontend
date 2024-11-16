import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { siteConfig } from "@/lib/site";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur px-6 lg:px-8">
      <div className="container mx-auto flex flex-col sm:flex-row h-fit py-2 items-start sm:items-center justify-between max-w-7xl lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Image alt="Logo" src={"/images/logo.png"} width={926} height={922} className="h-8 w-8" />
          <span className="font-bold text-2xl font-sans">{siteConfig.applicationName}</span>
        </Link>
        <nav className="flex items-center space-x-4 w-full pt-2 sm:pt-0 sm:w-fit ">
          <Button className="grow sm:grow-0" variant="outline" asChild>
            <Link href="https://app.cognova.io/auth/sign-up">Sign Up</Link>
          </Button>
          <Button className="grow sm:grow-0" asChild>
            <Link href="https://app.cognova.io/auth/sign-up">Create a Free Bot</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
