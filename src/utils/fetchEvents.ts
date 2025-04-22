import axios from "axios";
import { BACKEND_URL } from "@/pages/api/auth/auth";

export type FiltersType = {
  name: string;
  category: string;
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

export const fetchEvents = async (filters: FiltersType): Promise<EventType[]> => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value.trim() !== "") {
      queryParams.append(key, value);
    }
  });

  const res = await axios.get(
    `${BACKEND_URL}/api/getall-events?${queryParams.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    }
  );

  return res.data.data || [];
};
