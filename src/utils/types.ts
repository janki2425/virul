export interface UserType {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
}

export interface  ApiErrorResponse{
  error?: string;
  message?: string;
}

export interface BookmarkType {
    id: string;
    name: string;
    category: string;
    short_description: string;
    image_url: string;
    start_date: string;
    address: string;
    city: string;
    state?: string;
    postal_code?: string;
    contact_details?: string;
    organization_name?: string;
    price: number;
    created_at?: string;
    updated_at?: string | null;
}

export interface AuthContextType {
    user: UserType | null;
    isLoggedIn: boolean;
    isPending: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    bookmarkedEvents: BookmarkType[];
    toggleBookmark: (event_id: string) => Promise<void>;
    isBookmarked: (event_id: string) => boolean;
    suggestedEvents: BookmarkType[];
}

export interface JwtPayload {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
    exp?: number; 
  }


export type EventProps = {
    filters: {
      category:string;
      start_date: string;
      city: string;
    };
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
  
export interface CommentType {
    id: string;
    event_id: string;
    user_id: string;
    rating: string;
    comment: string;
    created_at: string;
    user?: {
      first_name: string;
      last_name: string;
    };
}

  