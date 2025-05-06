import Image from "next/image";
import React, { useEffect, useState,useRef } from "react";
import axiosInstance from "./api/axiosInstance";
import { BACKEND_URL } from "@/pages/api/auth/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomLoader from "@/components/CustomLoader";
import debounce from 'lodash.debounce';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { EventType } from "@/utils/types";

const FindEvents = () => {
  const router = useRouter();
  const { isBookmarked, toggleBookmark, isLoggedIn, error: authError } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inputValues, setInputValues] = useState({
    name: "",
    category: "",
    start_date: "",
    end_date: "",
    city: "",
    state: "",
    min_price: "",
    max_price: "",
  });
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    start_date: "",
    end_date: "",
    city: "",
    state: "",
    min_price: "",
    max_price: "",
  });

  const handleEventClick = (eventId: string) => {
    console.log("eventId:", eventId);
    router.push(`/events/${eventId}`);
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

      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", "8"); 

      const res = await axiosInstance.get(
        `api/events?${queryParams.toString()}`,
      );

      setEvents(res.data.data || []);
      
      setTotalPages(res.data.pagination.totalPages);

      
    } catch (err: any) {
      console.error("Failed to load events:", err.response?.data || err.message);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchEvents();
  }, [filters,currentPage]);

  const debouncedSetFilters = useRef(
    debounce((newFilters) => {
      setFilters(newFilters);
      setCurrentPage(1);
    },500)
  ).current;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputValues((prev)=>({...prev,[name]:value}));
    debouncedSetFilters({...inputValues,[name]:value});
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   debouncedSetFilters.cancel();
  //   setFilters(inputValues);
  //   setCurrentPage(1);
  //   fetchEvents();
  // };
  const resetFilter = () => {
    setInputValues({
      name: "",
      category: "",
      start_date: "",
      end_date: "",
      city: "",
      state: "",
      min_price: "",
      max_price: "",
    });
    setFilters({
      name: "",
      category: "",
      start_date: "",
      end_date: "",
      city: "",
      state: "",
      min_price: "",
      max_price: "",
    });
    setCurrentPage(1);
  };

  useEffect(()=>{
    return()=>{
      debouncedSetFilters.cancel();
    };
  },[debouncedSetFilters])


  return (
    <>
    <div className="w-full flex h-[64px] bg-gradient-to-r from-[#855FA7] via-[#EC248F] to-[#FCC280]">
        <Navbar/>
      </div>
    <div className="px-4 mt-8 pb-5 max-w-[1280px] mx-auto">
      
      {/* Filter Form */}
      <form
      //  onSubmit={handleSubmit} 
       className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input name="name" value={inputValues.name} onChange={handleInputChange} placeholder="Event Name" className="p-2 border" autoFocus={inputValues.name.length > 0}/>
        <input name="category" value={inputValues.category} onChange={handleInputChange} placeholder="Category" className="p-2 border" autoFocus={inputValues.category.length > 0}/>
        <input type="date" name="start_date" value={inputValues.start_date} onChange={handleInputChange} className="p-2 border" autoFocus={inputValues.start_date.length > 0}/>
        <input type="date" name="end_date" value={inputValues.end_date} onChange={handleInputChange} className="p-2 border" autoFocus={inputValues.end_date.length > 0}/>
        <input name="city" value={inputValues.city} onChange={handleInputChange} placeholder="City" className="p-2 border" autoFocus={inputValues.city.length > 0}/>
        <input name="state" value={inputValues.state} onChange={handleInputChange} placeholder="State" className="p-2 border" autoFocus={inputValues.state.length > 0}/>
        <input name="min_price" value={inputValues.min_price} onChange={handleInputChange} placeholder="Min Price" className="p-2 border" autoFocus={inputValues.min_price.length > 0}/>
        <input name="max_price" value={inputValues.max_price} onChange={handleInputChange} placeholder="Max Price" className="p-2 border" autoFocus={inputValues.max_price.length > 0}/>
          {/* <button
            type="submit"
            className="col-span-2 text-white p-2 rounded bg-[#855fa7]"
          >
            Apply Filters
          </button> */}
      </form>
      <button
          type="button"
          onClick={resetFilter}
          className="text-white py-2 px-8 flex mx-auto rounded bg-[#855fa7]"
        >
          Reset Filters
        </button>

      {/* Results */}
      {isLoading ? (
        <CustomLoader/>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : events.length > 0 ? (
        <div className="mt-4 px-1 grid_custom gap-4 md:gap-5 cursor-pointer">
          {events.map((event: EventType) => (
            <div
              key={event.id}
              onClick={() => handleEventClick(event.id)}
              className="relative border border-[#e9ecef] pb-12 rounded-[5px] transition-transform duration-300 ease-in-out transform origin-bottom hover:-translate-y-2 hover:shadow-lg"
            >
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
                  className=''
                  alt='bookmark'/>
                </button>
              </div>
              <div className="flex flex-col items-start px-5 gap-1.5 py-3">
                <h3 className="text-[14px] text-[#8C8C8C]">{event.category}</h3>
                <h2 className="text-[18px] font-[600] overflow-hidden line-clamp-2">
                  {event.name}
                </h2>
                <div className="flex items-center gap-2">
                  <Image src={"/subject.svg"} width={16} height={16} alt="event" />
                  <p className="text-[14px] text-[#212529] line-clamp-1">{event.short_description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Image src={"/calendar.svg"} width={16} height={16} alt="event" />
                  <p className="text-[14px] text-[#212529] line-clamp-1">{formatDate(event.start_date)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Image src={"/location.svg"} width={16} height={16} alt="event" />
                  <p className="text-[14px] text-[#212529]">{event.address}, {event.city}</p>
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

    {events.length > 0 && totalPages > 1 && (
      <div className="flex justify-center gap-2 mt-6 mb-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#455A64] text-white rounded disabled:opacity-50 cursor-pointer"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 cursor-pointer rounded ${currentPage === i + 1 ? "bg-[#7059b5] text-white" : "bg-gray-200"}`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#455A64] text-white cursor-pointer rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      )}    

      <Footer/>
    </>
  );
};

export default FindEvents;
