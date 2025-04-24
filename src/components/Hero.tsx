import Image from "next/image";
import React, { useState } from "react";
import Event from "./Event";
import debounce from "lodash.debounce";

const HeroSection = () => {
  // Local state for input fields
  const [inputValues, setInputValues] = useState({
    query: "",
    start_date: "",
    city: "",
  });

  // State for applied filters
  const [filters, setFilters] = useState({
    query: "",
    start_date: "",
    city: "",
  });

  const debouncedSetFilters = React.useRef(
      debounce((name: string, value: string) => {
        setInputValues((prev) => ({ ...prev, [name]: value }));
      },200)
    ).current;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    debouncedSetFilters(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setFilters(inputValues);
    console.log("Filters applied:", inputValues);
  };

  return (
    <>
      <div
        className="relative w-full h-[350px] lg:h-[280px] flex justify-center bg-cover bg-center bg-no-repeat pt-[64px]"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70 z-10" />
        <div className="absolute top-[76px] lg:top-[86px] z-20 text-white px-4 w-full">
          <h1 className="text-[14px] lg:text-[32px] font-bold text-center">
            Let’s Make Live Happen
          </h1>
          <p className="text-[12px] lg:text-[16px] px-2 text-center mb-6">
            Shop Millions of live events and discover can’t-miss concerts, games,
            theater and more.
          </p>
          <form
            onSubmit={handleSubmit}
            className="w-full grid grid-cols-2 lg:grid-cols-4 gap-[1px] mx-auto bg-[#ced4da] rounded overflow-hidden lg:max-w-[940px] max-w-[1280px]"
          >
            <div className="relative w-full bg-white rounded-l border border-transparent">
              <input
                type="text"
                name="city"
                value={inputValues.city}
                onChange={handleInputChange}
                placeholder="City"
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
                type="date"
                placeholder="Date"
                name="start_date"
                value={inputValues.start_date}
                onChange={handleInputChange}
                className="text-black opacity-60 text-[16px] px-3 py-2 w-full"
              />
            </div>
            <div className="relative w-full col-span-2 bg-white sm:rounded lg:rounded-none lg:rounded-r border border-transparent">
              <input
                type="text"
                name="query"
                value={inputValues.query}
                onChange={handleInputChange}
                placeholder="Search by event's category"
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
                <button
                  type="submit"
                  className="p-2 bg-[#855fa7] flex items-center rounded-full text-white text-sm gap-2"
                >
                  <Image
                    src={"/right-arrow.svg"}
                    width={16}
                    height={16}
                    alt="arrow"
                    className="invert"
                  />
                </button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-1.5 lg:right-[5px] bg-white pr-0 pl-2 hidden lg:flex">
                <button
                  type="submit"
                  className="p-2 lg:py-[7px] bg-[#855fa7] cursor-pointer font-[600] tracking-[0.5px] lg:px-4 flex items-center rounded lg:rounded-[4px] text-white text-sm gap-2"
                >
                  Search
                  <Image
                    src={"/right-arrow.svg"}
                    width={16}
                    height={16}
                    alt="arrow"
                    className="invert"
                  />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="w-full z-20 mt-8">
        <Event filters={filters} />
      </div>
    </>
  );
};

export default HeroSection;