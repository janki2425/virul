import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/pages/api/auth/auth';

type EventType = {
  id: string;
  name: string;
  image_Url: string;
  start_Date: string;
  address: string;
  price: number;
};

const Event = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {

      try {
        setIsLoading(true);
        console.log('its loading');
        
        const res = await axios.get(`${BACKEND_URL}/api/getall-events`, {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        console.log(res.data);
        console.log(res.data.events);
        
        
        setEvents(res.data.events);
      } catch (err: any) {
        console.error('Failed to load events:', err.response?.data || err.message);
        setError('Failed to load events. Please check your authentication or try again later.');
        setEvents([]); // Fallback to empty array
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) return <div className="text-center py-10">Loading events...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="px-4 mt-13 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-[600]">Upcoming Events</h2>
        <div className="flex items-center">
          <p className="text-[16px] font-[100] text-[#EC248F]">View all</p>
          <Image src={'/view-more.svg'} width={30} height={30} alt="view all" className="" />
        </div>
      </div>
      <div className="mt-4 px-1 grid_custom gap-4 md:gap-5">
        {events.length > 0 ? (
          events.map((event: EventType, index) => (
            <div key={event.id} className="border border-[#e9ecef] rounded-[5px]">
              <div className="rounded-t-[5px] h-[180px] overflow-hidden border border-[#e9ecef]">
                <Image
                  src={event.image_Url || '/hero.jpg'}
                  width={280}
                  height={180}
                  alt="event"
                  className="w-full h-full object-cover rounded-t-[5px]"
                />
              </div>
              <div className="flex flex-col items-start px-5 gap-1.5 py-3">
                <h3 className="text-[14px] text-[#8C8C8C]">Race or Endurance Event</h3>
                <h2 className="text-[18px] font-[600] overflow-hidden line-clamp-2">{event.name}</h2>
                <div className="flex items-center gap-2">
                  <Image src={'/subject.svg'} width={16} height={16} alt="event" />
                  <p className="text-[14px] text-[#212529]">Music , Blues & Jazz</p>
                </div>
                <div className="flex items-center gap-2">
                  <Image src={'/calendar.svg'} width={16} height={16} alt="event" />
                  <p className="text-[14px] text-[#212529]">{event.start_Date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Image src={'/location.svg'} width={16} height={16} alt="event" />
                  <p className="text-[14px] text-[#212529]">{event.address}</p>
                </div>
              </div>
              <div className="flex items-center justify-center py-3 border border-t-[#e9ecef] rounded-b-[5px]">
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