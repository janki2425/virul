import axiosInstance from "@/pages/api/axiosInstance";
import { BACKEND_URL } from "@/pages/api/auth/auth";

export type FiltersType = {
  query:string;
  start_date: string;
  city: string;
};

export type EventType = {
  id: string;
  name: string;
  category: string;
  short_description: string;
  image_url: string;
  start_date: string;
  address: string;
  city:string;
  price: number;
};

export const fetchEvents = async (filters: FiltersType,page: number): Promise<{ data: EventType[]; totalPages: number }> => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value.trim() !== "") {
      queryParams.append(key, value);
    }
  });

  queryParams.append("page", page.toString());
  queryParams.append("limit", "8");
  
  try{
    const res = await axiosInstance.get(
      `${BACKEND_URL}/api/getall-events?${queryParams.toString()}`
      ); 
    return {
      data: res.data.data || [],
      totalPages: res.data.pagination.totalPages || 1,
    };
  }catch (error: any) {
    console.error("Failed to fetch events:", error.response?.data || error.message);
    return { data: [], totalPages: 1 };
  }
};
