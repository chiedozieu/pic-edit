"use client";

import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { BarLoader } from "react-spinners";
import { useStoreUser } from "@/hooks/use-store-user";
import { Authenticated, Unauthenticated } from "convex/react";
import { LayoutDashboard } from "lucide-react";

const Header = () => {
  const path = usePathname();
  const { isLoading } = useStoreUser();

  if (path.includes("/editor")) return null; // Hide header on editor page
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 text-nowrap">
      <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-full px-8 py-1 flex items-center justify-center gap-8">
        <Link href="/" className="mr-10 md:mr-20">
          <Image
            src="/logo2.png"
            alt="logo"
            width={96}
            height={24}
            className="min-w-24 object-cover"
          />
        </Link>
        {path === "/" && (
          <div className="hidden md:flex space-x-6 text-white">
            <Link
              href="#features"
              className="hover:underline transition-all duration-300 cursor-pointer underline-offset-4 decoration-2 decoration-sky-500"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="hover:underline transition-all duration-300 cursor-pointer underline-offset-4 decoration-2 decoration-sky-500"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="hover:underline transition-all duration-300 cursor-pointer underline-offset-4 decoration-2 decoration-sky-500"
            >
              Contact
            </Link>
          </div>
        )}
        <div className="flex items-center gap-3 ml-10 md:ml-20 text-white ">
          <Unauthenticated>
            <SignInButton>
              <Button variant="glass" className="hidden md:flex">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="primary" className="">
                Get Started
              </Button>
            </SignUpButton>
          </Unauthenticated>
          <Authenticated>
          <Link href="/dashboard">
            <Button variant="glass" className="sm:flex">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden md:flex">Dashboard</span>
            </Button>
          </Link>
            <UserButton appearance={{ elements: { avatarBox: "h-10 w-10" } }} />
          </Authenticated>
        </div>
        {isLoading && (
          <div className="fixed bottom-0 left-0 w-full flex justify-center z-40">
            <BarLoader color="#9f3ff2" width={"85%"} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
