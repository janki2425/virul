import Image from 'next/image';
import Link from 'next/link';
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import React from 'react';

const Navbar = () => {
  return (
    <div
      className="relative w-full h-[350px] bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
    <div className="absolute inset-0 bg-black/70"></div>
      <header className="absolute top-0 left-0 w-full h-[64px] flex items-center justify-between px-4 text-white">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="flex flex-col gap-[4px] p-2">
                <span className="w-[18px] h-[2px] bg-white rounded-sm"></span>
                <span className="w-[18px] h-[2px] bg-white rounded-sm"></span>
                <span className="w-[18px] h-[2px] bg-white rounded-sm"></span>
            </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className='pt-3 pb-6'>
                <Link href={"/"}>
                    <Image src={"/virul-logo.svg"} width={70} height={70} alt="virul" />
                </Link>
              </div>
              <hr className='bg-black w-full opacity-40'/>
              <nav className="flex flex-col space-y-6 mt-4">
                <Link href="/about" className='text-[14px]'>Find Events</Link>
                <Link href="/" className='text-[14px]'>Help</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <Link href={"/"}>
          <Image src={"/virul-logo-white.svg"} width={45} height={45} alt="virul" />
        </Link>

        <Link href={"/"} className="text-white font-[400]text-[16px]">Log in</Link>
      </header>
      <div className='absolute top-18 text-center px-4 space-y-[2px]'>
        <h2 className='text-[14px] font-[600] text-white'>Let's Make Live Happen</h2>
        <p className='text-[12px] font-[300] text-white'>Shop Millions of live events and discover can't-miss concerts, games, theater and more.</p>
      </div>
      <div className='absolute w-full top-40 text-center'>
            <input 
            type="text" 
            className='bg-white w-2/5 py-2 border-[1px] border-[#ced4da]'
            />
            <input 
            type="text" 
            className='bg-white w-2/5 py-2 border-[1px] border-[#ced4da]'
            />
            <input 
            type="text" 
            className='bg-white w-4/5 py-2 border-[1px] border-[#ced4da]'
            />
      </div>
    </div>
  );
};

export default Navbar;
