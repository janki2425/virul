import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/pages/api/auth/auth';
import { fetchEvents, EventType } from "@/utils/fetchEvents";

type EventProps = {
  filters: {
    name: string;
    category: string;
    start_date: string;
    city: string;
  };
};

const Event = ({ filters }: EventProps) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const loadEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
  
      const data = await fetchEvents(filters);
      console.log(data);
      
      setEvents(data);
    } catch (err: any) {
      console.error("Failed to load events:", err.response?.data || err.message);
      setError("Failed to load events. Please check filters or try again.");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [filters]);
  

  if (isLoading) return <div className="text-center py-10">Loading events...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="px-4 mt-13 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-[600]">Upcoming Events</h2>
        <div className="flex items-center">
          <p className="text-[16px] font-[100] text-[#EC248F] cursor-pointer">View all</p>
          <Image src={'/view-more.svg'} width={30} height={30} alt="view all"/>
        </div>
      </div>
      <div className="mt-4 px-1 grid_custom gap-4 md:gap-5 cursor-pointer">
        {events.length > 0 ? (
          events.map((event: EventType, index) => (
            <div key={event.id} className="relative border border-[#e9ecef] pb-12 rounded-[5px] transition-transform duration-300 ease-in-out transform origin-bottom hover:-translate-y-2 hover:shadow-lg">
              <div className="rounded-t-[5px] h-[180px] overflow-hidden border border-[#e9ecef]">
                <Image
                  src={`${BACKEND_URL}/${event.image_url}`}
                  width={280}
                  height={180}
                  alt="event"
                  className="w-full h-full object-cover rounded-t-[5px]"
                />
              </div>
              <div className="flex flex-col items-start px-5 gap-1.5 py-3">
                <h3 className="text-[14px] text-[#8C8C8C]">{event.category}</h3>
                <h2 className="text-[18px] font-[600] overflow-hidden line-clamp-2">{event.name}</h2>
                <div className="flex items-center gap-2">
                  <Image src={'/subject.svg'} width={16} height={16} alt="event" />
                  <p className="text-[14px] text-[#212529] line-clamp-1">{event.short_description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Image src={'/calendar.svg'} width={16} height={16} alt="event" />
                  <p className="text-[14px] text-[#212529] line-clamp-1">{formatDate(event.start_date)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Image src={'/location.svg'} width={16} height={16} alt="event" />
                  <p className="text-[14px] text-[#212529]">{event.address}, {event.city}</p>
                </div>
              </div>
              <div className="flex absolute bottom-0 w-full items-center justify-center py-3 border border-t-[#e9ecef] rounded-b-[5px]">
                <p className="text-[16px]">${event.price}</p>
              </div>
            </div>
          ))
        ) : (
          !isLoading && <p className="text-center py-10">No events available.</p>
        )}
      </div>
    </div>
  );
};

export default Event;