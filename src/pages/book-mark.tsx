import React ,{useState,useEffect} from "react";
import Image from "next/image";
import { BACKEND_URL } from "./api/auth/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import Login from "./auth/Login";

type EventType = {
    id: string;
    name: string;
    category: string;
    short_description: string;
    image_url: string;
    start_date: string;
    address: string;
    city:string;
    price: number;
    isBookmarked?: boolean;
};

const Bookmark = () => {
    const { bookmarkedEvents, isLoggedIn, isPending, error, toggleBookmark } = useAuth();

    if (!isLoggedIn) {
        return (
          <>
            <Login/>
          </>
        );
      }
   
  return (
    <>
    <div className="w-full flex h-[64px] bg-gradient-to-r from-[#855FA7] via-[#EC248F] to-[#FCC280]">
        <Navbar />
      </div>
      <div className="mt-4 px-1 grid_custom gap-4 md:gap-5 cursor-pointer">
        {isPending ? (
          <p className="text-center py-10">Loading bookmarks...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">{error}</p>
        ) : bookmarkedEvents && bookmarkedEvents.length > 0 ? (
          bookmarkedEvents.map((bookmarkedEvent: EventType) => (
            <div
              key={bookmarkedEvent.id}
              className="relative border border-[#e9ecef] pb-12 rounded-[5px] transition-transform duration-300 ease-in-out transform origin-bottom hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="relative rounded-t-[5px] h-[180px] overflow-hidden border border-[#e9ecef]">
                <Image
                  src={`${BACKEND_URL}/${bookmarkedEvent.image_url}`}
                  width={280}
                  height={180}
                  alt="event"
                  priority
                  className="w-full h-full object-cover rounded-t-[5px]"
                />
                <button
                  onClick={() => toggleBookmark(bookmarkedEvent.id)}
                  className="absolute right-2 top-2 p-2 rounded-full bg-[#876cbc]"
                >
                  <Image src={'/book-mark-white.svg'} width={20} height={20} className="" alt="bookmark" />
                </button>
              </div>
              <div className="flex flex-col items-start px-5 gap-1.5 py-3">
                <h3 className="text-[14px] text-[#8C8C8C]">{bookmarkedEvent.category}</h3>
                <h2 className="text-[18px] font-[600] overflow-hidden line-clamp-2">{bookmarkedEvent.name}</h2>
                <div className="flex items-center gap-2">
                  <Image src={'/subject.svg'} width={16} height={16} alt="event" />
                  <p className="text-[14px] text-[#212529] line-clamp-1">{bookmarkedEvent.short_description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Image src={'/calendar.svg'} width={16} height={16} alt="event" />
                  <p className="text-[14px] text-[#212529] line-clamp-1">{bookmarkedEvent.start_date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Image src={'/location.svg'} width={16} height={16} alt="event" />
                  <p className="text-[14px] text-[#212529]">
                    {bookmarkedEvent.address}, {bookmarkedEvent.city}
                  </p>
                </div>
              </div>
              <div className="flex absolute bottom-0 w-full items-center justify-center py-3 border border-t-[#e9ecef] rounded-b-[5px]">
                <p className="text-[16px]">${bookmarkedEvent.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-10">No events bookmarked.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Bookmark;
