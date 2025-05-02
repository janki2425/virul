import React, { useState, useEffect } from "react";
import { EventType } from "@/utils/fetchEvents";
import { useRouter } from "next/router";
import { BACKEND_URL } from "@/pages/api/auth/auth";
import CustomLoader from "@/components/CustomLoader";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import axiosInstance from "../api/axiosInstance";

const EventDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isBookmarked, toggleBookmark } = useAuth();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        console.log("eventId:", id);
        const response = await axiosInstance.get<{ event: EventType }>(`/api/events?id=${id}`);
        if (!response) {
            throw new Error('Failed to fetch event');
          }
          setEvent(response.data.event);
        console.log(event);
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (isLoading) return <CustomLoader />;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!event) return <div className="text-center py-10">Event not found</div>;

  return (
    <>
      <div className="w-full flex h-[64px] bg-gradient-to-r from-[#855FA7] via-[#EC248F] to-[#FCC280]">
        <Navbar/>
      </div>
      <div className="min-h-screen px-4 py-10">
        <div className="max-w-[1280px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Event Image */}
          <div className="relative h-96 lg:h-[500px] xl:h-[700px]  w-full">
            <Image
              src={`${BACKEND_URL}/${event.image_url}`}
              alt={event.name}
              fill
              className="w-full h-full object-cover rounded-t-[5px]"
              priority
            />
            
          </div>

          

          {/* Event Details */}
          <div className="p-8 relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <span className="text-sm text-[#EC248F] font-semibold uppercase tracking-wider">{event.category}</span>
              <button 
                onClick={() => toggleBookmark(event.id)}
                className='absolute right-2 top-6 p-2 rounded-full'>
                  <Image 
                  src={isBookmarked(event.id) ? '/book-mark-white.svg' : '/book-mark.svg'} 
                  width={20} 
                  height={20} 
                  className='md:w-[24px] md:h-[24px] invert'
                  alt='bookmark'/>
                </button>
            </div>
            <h1 className="text-3xl font-bold mt-2 mb-4 text-[#855fa7]">{event.name}</h1>

            <p className="text-gray-700 text-lg my-6">{event.short_description}</p>
            <div className="grid grid-cols-1 md:flex-col gap-6 mb-6">
              <div className="flex items-center gap-3">
                <Image src="/location.svg" width={24} height={24} alt="location" />
                <div className="text-gray-600">{event.address}, {event.city}</div>
              </div>
              <div className="flex items-center gap-3">
                <Image src="/calendar.svg" width={24} height={24} alt="date" />
                <div className="text-gray-600">
                    {event.start_date === event.end_date
                      ? formatDate(event.start_date)
                      : `${formatDate(event.start_date)} - ${formatDate(event.end_date)}`}
                  </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-8">
              <div className="text-2xl font-bold text-[#EC248F]">${event.price}</div>
              <button className="bg-[#855fa7] hover:bg-[#6d479c] text-white px-8 py-3 rounded-lg font-semibold shadow transition">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventDetails; 