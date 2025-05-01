import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '@/pages/api/axiosInstance';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {jwtDecode} from 'jwt-decode'

// Define types
interface UserType {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

interface BookmarkType {
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

interface AuthContextType {
  user: UserType | null;
  isLoggedIn: boolean;
  isPending: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  bookmarkedEvents: BookmarkType[];
  toggleBookmark: (eventId: string) => Promise<void>;
  isBookmarked: (eventId: string) => boolean;
}

interface JwtPayload {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  exp?: number; 
}


// Create default context state
const defaultContextValue: AuthContextType = {
  user: null,
  isLoggedIn: false,
  isPending: false,
  error: null,
  login: async () => {},
  logout: () => {},
  clearError: () => {},
  bookmarkedEvents: [],
  toggleBookmark: async () => {},
  isBookmarked: () => false,
};



// Create the context
const AuthContext = createContext<AuthContextType>(defaultContextValue);

//fetch user data function for useQuery
const fetchUserData = async(): Promise<UserType>=>{
  const token = localStorage.getItem('token');
  if(!token){
    throw new Error('No token found');
  }
  const response = await axiosInstance.get('/api/user');

  const userData: UserType = response.data.user;
  if (!userData.id || !userData.first_name || !userData.last_name) {
    throw new Error('Invalid user data');
  }
  localStorage.setItem('userId', userData.id);
  return userData;
}

//login function for useMutation
const loginUser = async({email,password}:{email:string;password:string})=>{
  const response=await axiosInstance.post('/api/login',{email,password});
  const { token } = response.data;
  if (!token) {
    throw new Error(response.data.error || 'Login failed');
  }
  const decodedToken = jwtDecode<JwtPayload>(token);


  const user: UserType = {
    id: decodedToken.id,
    first_name: decodedToken.first_name,
    last_name: decodedToken.last_name,
    email: decodedToken.email,
  };


  return { token, user };
}

const fetchBookmarkedEvents = async (): Promise<BookmarkType[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('No user ID found');
  }
  try {
    const response = await axiosInstance.get(`/api/getbookmarkevents?userId=${userId}`);
    // console.log('Bookmark API response:', response.data);
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    } else if (data.bookmarkedEvents && Array.isArray(data.bookmarkedEvents)) {
      return data.bookmarkedEvents;
    } else {
      console.warn('Unexpected bookmark data structure:', data);
      return [];
    }
  } catch (err) {
    console.error('Error fetching bookmarked events:', err);
    throw err;
  }
};

const toggleBookmarkMutationFn = async ({ eventId, userId, isBookmarked }: { eventId: string;userId:string; isBookmarked: boolean }) => {
  if (isBookmarked) {
    await axiosInstance.delete(`/api/deletebookmarkevent?userId=${userId}&eventId=${eventId}`);
    return { userId,eventId, action: 'removed' };
  } else {
    try {
      const response = await axiosInstance.post('/api/bookmark-events', { eventId, userId });
      return { eventId, userId, action: 'added', bookmark: response.data };
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      if (error.response?.data?.message?.includes('already bookmarked')) {
        await axiosInstance.delete(`/api/deletebookmarkevent?userId=${userId}&eventId=${eventId}`);
        return { userId, eventId, action: 'removed' };
      }
      throw err;
    }
  }
};

// Create provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');


  const { data:userData, isPending: isUserPending, error: queryError, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    enabled: hasToken,
    retry: false,
  });

  const { data: bookmarkedEventsData, isPending: isBookmarksPending, error: bookmarkError } = useQuery<BookmarkType[]>({
    queryKey: ['bookmarkedEvents'],
    queryFn: fetchBookmarkedEvents,
    enabled: hasToken && !!userData,
    retry: false,
    initialData:[],
  });

  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<BookmarkType[]>([]);
  const isLoggedIn = !!user;

  const loginMutation = useMutation({
    mutationFn:loginUser,
    onSuccess:async({token,user})=>{
      // console.log('Login successful:', { token, user });
      setError(null);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      setUser(user); 
      queryClient.setQueryData(['user'], user);
      await router.push('/');
    },
    onError:(err:AxiosError<ApiErrorResponse>)=>{
      // console.error('Login error details:', err.response?.data, err.message); 
      const responseData = err.response?.data;
      const errorMessage = responseData?.message || responseData?.error || err.message;
      setError(errorMessage || 'Login failed');
    },
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: toggleBookmarkMutationFn,
    onMutate: async ({ eventId, isBookmarked }) => {
      await queryClient.cancelQueries({ queryKey: ['bookmarkedEvents'] });
      const previousBookmarks = queryClient.getQueryData<BookmarkType[]>(['bookmarkedEvents']);
      queryClient.setQueryData(['bookmarkedEvents'], (old: BookmarkType[] | undefined) => {
        const currentBookmarks = Array.isArray(old) ? old : [];
        if (isBookmarked) {
          return currentBookmarks.filter((bookmark) => bookmark.id !== eventId);
        } else {
          return [...currentBookmarks, { id: eventId, name: 'Loading...', category: '', short_description: '', image_url: '', start_date: '', address: '', city: '', price: 0 }];
        }
      });
      return { previousBookmarks };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['bookmarkedEvents'], context?.previousBookmarks);
      const responseData = (err as AxiosError<ApiErrorResponse>).response?.data;
      const errorMessage = responseData?.message || responseData?.error || err.message;
      console.error('Toggle bookmark error:', errorMessage);
      setError(errorMessage || 'Failed to toggle bookmark');
    },
    onSuccess: async(data, variables) => {
      if (data.action === 'added' && data.bookmark) {
        queryClient.setQueryData(['bookmarkedEvents'], (old: BookmarkType[] | undefined) =>{
        const currentBookmarks = Array.isArray(old) ? old : [];
        return currentBookmarks.map((b) => (b.id === data.eventId ? data.bookmark : b));
        });
        setBookmarkedEvents((prev) =>
          prev.map((b) => (b.id === data.eventId ? data.bookmark : b))
        );
      }
      else if (data.action === 'removed') {
        const updatedBookmarks = await fetchBookmarkedEvents().catch((err) => {
          console.error('Error refetching bookmarks:', err);
          return [];
        });
        queryClient.setQueryData(['bookmarkedEvents'], updatedBookmarks);
        setBookmarkedEvents(updatedBookmarks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedEvents'] });
    },
  });
  
  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  useEffect(() => {
    if (bookmarkedEventsData && Array.isArray(bookmarkedEventsData)) {
      setBookmarkedEvents(bookmarkedEventsData);
    } else {
      setBookmarkedEvents([]);
    }
  }, [bookmarkedEventsData]);

  useEffect(() => {
    if (isError && queryError) {
      const responseData = (queryError as AxiosError<ApiErrorResponse>).response?.data;
      const errorMessage = responseData?.message || responseData?.error || queryError.message;

      if (queryError.message === 'No token found' || responseData?.error === 'Invalid token') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setError('Session expired. Please log in again.');
        router.push('/auth/Login');
      } else {
        setError(`Authentication error: ${errorMessage}`);
      }
    }
  }, [isError, queryError, router]);
  

  useEffect(() => {
    if (!hasToken) {
      queryClient.setQueryData(['user'], null);
      queryClient.setQueryData(['bookmarkedEvents'], null);
      setBookmarkedEvents([]);
    }
  }, [hasToken, queryClient]);

  // Login function
  const login = async (email: string, password: string) => {
    setError(null);
    await loginMutation.mutateAsync({ email, password });
  };

    
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    setUser(null);
    setError(null);

    queryClient.setQueryData(['user'], null);
    queryClient.removeQueries({ queryKey: ['user'] });
    queryClient.setQueryData(['bookmarkedEvents'], []);
    queryClient.removeQueries({ queryKey: ['bookmarkedEvents'] });
      
    router.push('/').then(() => {
      // queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarkedEvents'] });
    });
    
  };

    // Clear error
    const clearError = () => {
      setError(null);
    };

    const toggleBookmark = async (eventId: string) => {
      if (!isLoggedIn) {
        setError('Please log in to bookmark events');
        router.push('/auth/Login');
        return;
      }
      if (!user || !user.id) {
        setError('User ID not found');
        return;
      }
      setError(null);
      const isCurrentlyBookmarked = isBookmarked(eventId);
      // console.log(`Toggling bookmark for event ${eventId}, currently bookmarked: ${isCurrentlyBookmarked}`);
      await toggleBookmarkMutation.mutateAsync({ eventId,userId:user.id, isBookmarked: isCurrentlyBookmarked });
    };

    // Check if event is bookmarked
    const isBookmarked = (eventId: string) => {
      const result = Array.isArray(bookmarkedEvents) ? bookmarkedEvents.some((bookmark) => bookmark.id === eventId) : false;
      return result;
    };

  const value: AuthContextType = {
    user,
    isLoggedIn,
    isPending:isUserPending || loginMutation.isPending || isBookmarksPending,
    error: error || (queryError?.message || null),
    login,
    logout,
    clearError,
    bookmarkedEvents,
    toggleBookmark,
    isBookmarked,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};