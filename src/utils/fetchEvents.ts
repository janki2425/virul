import axiosInstance from "@/pages/api/axiosInstance";

export type FiltersType = {
  category:string;
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
  end_date: string;
  address: string;
  city:string;
  price: number;
  is_virtual: boolean,
  state: string,
  postal_code: string,
  contact_details: string,
  organization_name: string,
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
      `api/events?${queryParams.toString()}`
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
