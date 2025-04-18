import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/pages/api/auth/auth";
import Navbar from "@/components/Navbar";

type EventType = {
  id: string;
  name: string;
  category: string;
  short_Description: string;
  image_Url: string;
  start_Date: string;
  address: string;
  price: number;
};


const FindEvents = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    start_Date: "",
    end_Date: "",
    city: "",
    state: "",
    minPrice: "",
    maxPrice: "",
  });

  const getUpdatedImageUrl = (url: string) => {
    return url.replace(
      "https://342b-110-226-17-132.ngrok-free.app",
      `${BACKEND_URL}`
    );
  };
 
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value.trim() !== "") {
          queryParams.append(key, value);
        }
      });

      const res = await axios.get(
        `${BACKEND_URL}/api/getevents-by-filter?${queryParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      setEvents(res.data.data || []);
      
    } catch (err: any) {
      console.error("Failed to load events:", err.response?.data || err.message);
      setError("Failed to load events. Please check filters or try again.");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };
  const resetFilter = () => {
    setFilters({
      name: "",
      category: "",
      start_Date: "",
      end_Date: "",
      city: "",
      state: "",
      minPrice: "",
      maxPrice: "",
    });
  };
  useEffect(() => {
    const allEmpty = Object.values(filters).every((val) => val === "");
    if (allEmpty) {
      fetchEvents();
    } 
  }, [filters]);
    


  if (isLoading)
    return <div className="text-center py-10">Loading events...</div>;
  

  return (
    <>
    <div className="w-full flex h-[64px] bg-gradient-to-r from-[#855FA7] via-[#EC248F] to-[#FCC280]">
        <Navbar/>
      </div>
    <div className="px-4 mt-8 pb-5 max-w-[1280px] mx-auto">
      
      {/* Filter Form */}
      <form onSubmit={handleFilterSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input name="name" value={filters.name} onChange={handleInputChange} placeholder="Event Name" className="p-2 border" />
        <input name="category" value={filters.category} onChange={handleInputChange} placeholder="Category" className="p-2 border" />
        <input type="date" name="start_Date" value={filters.start_Date} onChange={handleInputChange} className="p-2 border" />
        <input type="date" name="end_Date" value={filters.end_Date} onChange={handleInputChange} className="p-2 border" />
        <input name="city" value={filters.city} onChange={handleInputChange} placeholder="City" className="p-2 border" />
        <input name="state" value={filters.state} onChange={handleInputChange} placeholder="State" className="p-2 border" />
        <input name="minPrice" value={filters.minPrice} onChange={handleInputChange} placeholder="Min Price" className="p-2 border" />
        <input name="maxPrice" value={filters.maxPrice} onChange={handleInputChange} placeholder="Max Price" className="p-2 border" />
          <button
            type="submit"
            className="col-span-2 text-white p-2 rounded bg-[#855fa7]"
          >
            Apply Filters
          </button>
          <button
          type="button"
          onClick={resetFilter  }
          className="col-span-2 text-white p-2 rounded bg-[#855fa7]"
        >
          Reset Filters
        </button>


      </form>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-10">Loading events...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : events.length > 0 ? (
        <div className="mt-4 px-1 grid_custom gap-4 md:gap-5 cursor-pointer">
          {events.map((event: EventType) => (
            <div
              key={event.id}
              className="relative border border-[#e9ecef] pb-12 rounded-[5px] transition-transform duration-300 ease-in-out transform origin-bottom hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="rounded-t-[5px] h-[180px] overflow-hidden border border-[#e9ecef]">
                <Image
                  src={getUpdatedImageUrl(event.image_Url)}
                  width={280}
                  height={180}
                  alt="event"
                  className="w-full h-full object-cover rounded-t-[5px]"
                />
              </div>
              <div className="flex flex-col items-start px-5 gap-1.5 py-3">
                <h3 className="text-[14px] text-[#8C8C8C]">{event.category}</h3>
                <h2 className="text-[18px] font-[600] overflow-hidden line-clamp-2">
                  {event.name}
                </h2>
                <div className="flex items-center gap-2">
                  <Image src={"/subject.svg"} width={16} height={16} alt="event" />
                  <p className="text-[14px] text-[#212529] line-clamp-1">{event.short_Description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Image src={"/calendar.svg"} width={16} height={16} alt="event" />
                  <p className="text-[14px] text-[#212529] line-clamp-1">{formatDate(event.start_Date)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Image src={"/location.svg"} width={16} height={16} alt="event" />
                  <p className="text-[14px] text-[#212529] line-clamp-1">{event.address}</p>
                </div>
              </div>
              <div className="flex absolute bottom-0 w-full items-center justify-center py-3 border border-t-[#e9ecef] rounded-b-[5px]">
                <p className="text-[16px]">${event.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-10">No events available.</p>
      )}
    </div>
    </>
  );
};

export default FindEvents;
