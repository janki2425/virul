"use client";

import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import React, { useState,useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, isLoggedIn, isPending, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowDropdown(false);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
  };

  return (
    <div className="w-full max-w-[1320px] mx-auto">
      <header className="absolute top-0 max-w-[1320px] w-full h-[64px] z-[60] bg-transparent text-white px-4 flex items-center justify-between">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="flex flex-col gap-[4px] p-2 justify-start items-start rounded-full bg-transparent hover:bg-gray-600">
                <span className="w-[18px] h-[2px] bg-white mx-auto mt-1 rounded-sm"></span>
                <span className="w-[18px] h-[2px] bg-white mx-auto rounded-sm"></span>
                <span className="w-[18px] h-[2px] bg-white mx-auto rounded-sm"></span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="px-0 pl-3">
              <div className="pt-2 pb-[30px]">
                <Link href="/">
                  <Image src="/virul-logo.svg" width={70} height={70} alt="virul"/>
                </Link>
              </div>
              <hr className="bg-black w-auto mx-2 opacity-40" />
              <nav className="flex flex-col space-y-6 mt-3 ml-3">
                <Link href={'/find-events'} className="text-[14px] font-[600]">
                  Find Events
                </Link>
                <Link href={'/book-mark'} className="text-[14px] font-[600]">
                  Bookmark Events
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/"> 
          <Image src="/virul-logo-white.svg" width={45} height={45} alt="virul" className="lg:w-[100px] lg:h-[100px]" />
        </Link>
      
        <div className="lg:hidden">
          {isPending ? (
            
            <span className="w-6 h-6"></span>
          ) : isLoggedIn ? (
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-white font-[400] text-[16px] cursor-pointer"
            >
              {(user?.first_name?.[0]?.toUpperCase() ?? '') + (user?.last_name?.[0]?.toUpperCase())}
            </button>
          ) : (
            <Link href={'/auth/Login'} className="text-white font-[400] text-[16px]">
              Log in
            </Link>
          )}
          {showDropdown && isLoggedIn && (
            <div className="absolute right-0 bg-white text-black p-2 rounded-md mt-2 z-50">
              <button onClick={handleLogout} className="block text-sm px-4 py-2">Log out</button>
            </div>
          )}
        </div>

        <div className="items-center gap-6 hidden lg:flex">
          <div className="flex items-center gap-6">
            <Link href={'/find-events'} className="text-white font-[400] text-[16px]">Find Events</Link>
            <Link href={'/book-mark'} className="text-white font-[400] text-[16px]">Bookmark Events</Link>
          </div>
          <div className="flex items-center gap-3">
            {isPending ? (
              // Show a subtle loading indicator or nothing while checking auth
              <span className="w-6 h-6"></span>
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-white font-[400] text-[16px] cursor-pointer"
                >
                  {/* {user?.first_name[0].toUpperCase()}{user?.last_name[0].toUpperCase()} */}
                  {user?.first_name?.[0].toUpperCase()}{user?.last_name?.[0].toUpperCase()}
                </button>
                {showDropdown && (
                  <div className="absolute bg-white text-black w-[100px] p-2 rounded-md mt-2 right-0 cursor-pointer">
                    <button onClick={handleLogout} className="block text-sm font-[600] px-4 py-2 mx-auto">Log out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href={'/auth/Login'} className="text-white font-[400] text-[14px] px-5 py-2 bg-[#855fa7] rounded-[4px]">
                  Log In
                </Link>
                <Link href={'/auth/Signup'} className="text-white font-[400] text-[14px] px-5 py-2 bg-[#855fa7] rounded-[4px]">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;