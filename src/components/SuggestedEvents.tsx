import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import CustomLoader from './CustomLoader';
import Image from 'next/image';
import { BACKEND_URL } from '@/pages/api/auth/auth';
import { useRouter } from 'next/router';

const SuggestedEvents = () => {
  const { suggestedEvents,isBookmarked, toggleBookmark, isPending,} = useAuth();
  const router = useRouter();
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEventClick = (eventId: string) => {
    console.log("eventId:", eventId);
    router.push(`/events/${eventId}`);
  };

  if (isPending) {
    return <CustomLoader/>
  }

  if (!suggestedEvents.length) {
    return <div className="p-4">No suggested events found. Try bookmarking some events!</div>;
  }

  return (
    <div className="p-4 mt-18">
      <h2 className="text-2xl font-bold mb-4">Suggested Events</h2>
      <div className="mt-4 px-1 grid_custom gap-4 md:gap-5 cursor-pointer">
        {suggestedEvents.map((event) => (
          <div 
          key={event.id} 
          onClick={() => handleEventClick(event.id)}
          className="relative border border-[#e9ecef] pb-12 rounded-[5px] transition-transform duration-300 ease-in-out transform origin-bottom hover:-translate-y-2 hover:shadow-lg">
                        <div className="relative rounded-t-[5px] h-[180px] overflow-hidden border border-[#e9ecef]">
                          <Image
                            src={`${BACKEND_URL}/${event.image_url}`}
                            width={280}
                            height={180}
                            alt="event"
                            priority
                            className="w-full h-full object-cover rounded-t-[5px]"
                          />
                          <button 
                          onClick={() => toggleBookmark(event.id)}
                          className='absolute right-2 top-2 p-2 rounded-full bg-[#876cbc]'>
                            <Image 
                            src={isBookmarked(event.id) ? '/book-mark-white.svg' : '/book-mark.svg'} 
                            width={20} 
                            height={20} 
                            className=""
                            alt='bookmark'/>
                          </button>
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
        ))}
      </div>
    </div>
  );
};

export default SuggestedEvents;