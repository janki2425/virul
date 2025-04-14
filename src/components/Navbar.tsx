// import Image from 'next/image';
// import Link from 'next/link';
// import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import React from 'react';

// const Navbar = () => {
//   return (
//     <header className="fixed top-0 left-0 w-full h-[64px] z-50 bg-transparent text-white px-4 flex items-center justify-between">
//       <div className="lg:hidden">
//         <Sheet>
//           <SheetTrigger asChild>
//             <Button variant="ghost" size="icon" className="flex flex-col gap-[4px] p-2">
//               <span className="w-[18px] h-[2px] bg-white rounded-sm"></span>
//               <span className="w-[18px] h-[2px] bg-white rounded-sm"></span>
//               <span className="w-[18px] h-[2px] bg-white rounded-sm"></span>
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className='px-0 pl-3'>
//             <div className='pt-2 pb-7.5'>
//               <Link href={"/"}>
//                 <Image src={"/virul-logo.svg"} width={70} height={70} alt="virul" />
//               </Link>
//             </div>
//             <hr className='bg-black w-auto mx-2'/>
//             <nav className="flex flex-col space-y-6 mt-3 ml-3">
//               <Link href="/about" className='text-[14px] font-[600]'>Find Events</Link>
//               <Link href="/" className='text-[14px] font-[600]'>Help</Link>
//             </nav>
//           </SheetContent>
//         </Sheet>
//       </div>

//       <Link href={"/"}>
//         <Image src={"/virul-logo-white.svg"} width={45} height={45} alt="virul" />
//       </Link>

//       <Link href={"/"} className="text-white font-[400] text-[16px]">Log in</Link>
//     </header>
//   );
// };

// export default Navbar;


"use client"

import Image from "next/image"
import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import React from "react"

const Navbar = () => {
  return (
    <div className="w-full max-w-[1280px] mx-auto">
      <header className="fixed top-0 max-w-[1280px] w-full h-[64px] z-[60] bg-transparent text-white px-4 xl:px-0 flex items-center justify-between">
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="flex flex-col gap-[4px] p-2 justify-start items-start">
              <span className="w-[18px] h-[2px] bg-white rounded-sm"></span>
              <span className="w-[18px] h-[2px] bg-white rounded-sm"></span>
              <span className="w-[18px] h-[2px] bg-white rounded-sm"></span>
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
              <Link href="/about" className="text-[14px] font-[600]">
                Find Events
              </Link>
              <Link href="/" className="text-[14px] font-[600]">
                Help
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <Link href="/"> 
        <Image src="/virul-logo-white.svg" width={45} height={45} alt="virul" className="lg:w-[100px] lg:h-[100px]"/>
      </Link>

      <Link href="/" className="text-white font-[400] text-[16px] lg:hidden">
            Log in
      </Link>

      <div className="items-center gap-6 hidden lg:flex">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-white font-[400] text-[16px]">
            Find Events
          </Link>
          <Link href="/" className="text-white font-[400] text-[16px]">
            Help
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white font-[400] text-[14px] px-5 py-2 bg-[#855fa7] rounded-[4px]">
            Log In
          </Link>
          <Link href="/" className="text-white font-[400] text-[14px] px-5 py-2 bg-[#855fa7] rounded-[4px]">
            Sign up
          </Link>
        </div>
      </div>

    </header>
    </div>
  )
}

export default Navbar