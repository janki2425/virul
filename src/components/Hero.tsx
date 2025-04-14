import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <div
      className="relative w-full h-[350px] lg:h-[280px] flex justify-center bg-cover bg-center bg-no-repeat pt-[64px]"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10" />

      {/* Content */}
      <div className="absolute top-[76px] lg:top-[86px] z-20 text-white px-4 w-full">
        <h1 className="text-[14px] lg:text-[32px] font-bold text-center">
          Let’s Make Live Happen
        </h1>
        <p className="text-[12px] lg:text-[16px] px-2 text-center mb-6">
          Shop Millions of live events and discover can’t-miss concerts, games,
          theater and more.
        </p>

        {/* Input Fields */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-[1px] mx-auto bg-[#ced4da] rounded overflow-hidden lg:max-w-[940px] max-w-[1280px]">
          <div className="relative w-full bg-white rounded-l border border-transparent">
            <input
              type="text"
              placeholder="City or zip code"
              className="text-black opacity-60 text-[16px] px-3 py-2 rounded-l w-full"
            />
            <div className="absolute w-[36px] top-3 right-0 bg-white">
              <Image
                src={"/location.svg"}
                width={16}
                height={16}
                alt="search"
                className="mx-auto"
              />
            </div>
          </div>
          <div className="relative w-full bg-white rounded-r lg:rounded-none border border-transparent">
            <input
              type="text"
              placeholder="Date"
              className="text-black opacity-60 text-[16px] px-3 py-2 w-full"
            />
            <Image
              src={"/date.svg"}
              width={20}
              height={20}
              alt="date"
              className="absolute top-3 right-[7px]"
            />
          </div>
          <div className="relative w-full col-span-2 bg-white sm:rounded lg:rounded-none lg:rounded-r border border-transparent">
            <input
              type="text"
              placeholder="Search by events & organizers"
              className="indent-7 text-black opacity-60 text-[16px] px-3 py-2 w-full"
            />
            <Image
              src={"/search.svg"}
              width={16}
              height={16}
              alt="search"
              className="absolute top-3 left-3 opacity-40"
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-1.5 bg-white pr-0 pl-2 lg:hidden">
              <div className="p-2 bg-[#855fa7] flex items-center rounded-full text-white text-sm gap-2">
                <Image
                  src={"/right-arrow.svg"}
                  width={16}
                  height={16}
                  alt="arrow"
                  className="invert"
                />
              </div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-1.5 lg:right-[5px] bg-white pr-0 pl-2 hidden lg:flex">
              <div className="p-2 lg:py-[7px] bg-[#855fa7] font-[600] tracking-[0.5px] lg:px-4 flex items-center rounded lg:rounded-[4px] text-white text-sm gap-2">
                Search
                <Image
                  src={"/right-arrow.svg"}
                  width={16}
                  height={16}
                  alt="arrow"
                  className="invert"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
